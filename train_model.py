"""
Belgian Property Price Model Trainer
=====================================
Trains a neural network on your Excel dataset and exports:
  - public/models/belgium-price/model.json  (TF.js graph model)
  - public/models/belgium-price/group1-shard1of1.bin
  - public/models/belgium-price/vocab.json  (string → integer mappings)

Usage:
  python train_model.py --file your_data.xlsx

Requirements:
  pip install tensorflow tensorflowjs pandas openpyxl scikit-learn
"""

import argparse
import json
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

# ---------------------------------------------------------------------------
# Configuration — adjust column names if yours differ
# ---------------------------------------------------------------------------
TARGET_COL   = "price"
NUM_FEATURES = ["living_area", "surface_of_the_plot", "bedrooms", "toilets", "construction_year"]
BOOL_FEATURES = []  # derived below from garden_surface, covered_parking_spaces
CAT_FEATURES = ["city", "postal", "energy_class"]  # will be label-encoded

OUTPUT_DIR = os.path.join("public", "models", "belgium-price")
MODEL_KERAS_PATH = os.path.join(OUTPUT_DIR, "model.keras")
MODEL_H5_PATH    = os.path.join(OUTPUT_DIR, "model.h5")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def build_vocab(series: pd.Series) -> dict:
    """Map each unique non-null value to a 1-based integer (0 = unknown)."""
    unique_vals = sorted(series.dropna().astype(str).str.lower().unique())
    return {v: i + 1 for i, v in enumerate(unique_vals)}


def encode_series(series: pd.Series, vocab: dict) -> pd.Series:
    return series.astype(str).str.lower().map(vocab).fillna(0).astype(float)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main(excel_path: str):
    print(f"Loading data from: {excel_path}")
    df = pd.read_excel(excel_path)
    print(f"  Rows: {len(df):,}  |  Columns: {df.shape[1]}")

    # ── Derive boolean features ──────────────────────────────────────────────
    df["has_garden"]  = (df.get("garden_surface", 0).fillna(0) > 0).astype(float)
    df["has_garage"]  = (df.get("covered_parking_spaces", 0).fillna(0) > 0).astype(float)
    # terrace: not a direct column — approximate from outdoor_parking_spaces presence
    # If your dataset has a terrace column, replace this line
    df["has_terrace"] = 0.0

    bool_cols = ["has_garden", "has_garage", "has_terrace"]

    # ── Drop rows with missing target or living_area ─────────────────────────
    df = df.dropna(subset=[TARGET_COL, "living_area"])
    df = df[df[TARGET_COL] > 10_000]  # remove obvious bad rows

    # ── Fill numeric NAs ─────────────────────────────────────────────────────
    for col in NUM_FEATURES:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(df[col].median() if col in df else 0)
        else:
            print(f"  WARNING: column '{col}' not found — using 0")
            df[col] = 0.0

    # ── Build vocabularies ───────────────────────────────────────────────────
    vocabs = {}
    for col in CAT_FEATURES:
        if col in df.columns:
            vocabs[col] = build_vocab(df[col])
        else:
            print(f"  WARNING: categorical column '{col}' not found — using 0")
            vocabs[col] = {}

    vocab_map = {
        "municipality": vocabs["city"],
        "postal_code":  vocabs["postal"],
        "energy_label": vocabs["energy_class"],
    }

    # ── Encode categoricals ──────────────────────────────────────────────────
    for col in CAT_FEATURES:
        df[f"{col}_enc"] = encode_series(df.get(col, pd.Series([""] * len(df))), vocabs[col])

    # ── Assemble feature matrix ───────────────────────────────────────────────
    feature_cols = (
        [c for c in NUM_FEATURES if c in df.columns]
        + bool_cols
        + [f"{c}_enc" for c in CAT_FEATURES]
    )
    X = df[feature_cols].values.astype(np.float32)
    y = np.log(df[TARGET_COL].values.astype(np.float32))  # predict log(price)

    print(f"  Features: {len(feature_cols)} | Samples after cleaning: {len(X):,}")

    # ── Train / val / test split ─────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    X_train, X_val, y_train, y_val   = train_test_split(X_train, y_train, test_size=0.15 / 0.85, random_state=42)

    # ── Normalise ────────────────────────────────────────────────────────────
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_val   = scaler.transform(X_val)
    X_test  = scaler.transform(X_test)

    # Save scaler stats so the frontend can normalise too
    scaler_stats = {
        "mean":  scaler.mean_.tolist(),
        "scale": scaler.scale_.tolist(),
        "feature_order": feature_cols,
    }

    # ── Build model ──────────────────────────────────────────────────────────
    n_features = X_train.shape[1]
    inputs = tf.keras.Input(shape=(n_features,), name="features")
    x = tf.keras.layers.Dense(128, activation="relu")(inputs)
    x = tf.keras.layers.Dropout(0.2)(x)
    x = tf.keras.layers.Dense(64, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    x = tf.keras.layers.Dense(32, activation="relu")(x)
    output = tf.keras.layers.Dense(1, name="log_price")(x)

    model = tf.keras.Model(inputs=inputs, outputs=output)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="mse",
        metrics=["mae"],
    )
    model.summary()

    # ── Train ────────────────────────────────────────────────────────────────
    early_stop = tf.keras.callbacks.EarlyStopping(
        monitor="val_loss", patience=15, restore_best_weights=True
    )
    reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss", factor=0.5, patience=7, min_lr=1e-6
    )

    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=200,
        batch_size=64,
        callbacks=[early_stop, reduce_lr],
        verbose=1,
    )

    # ── Evaluate ─────────────────────────────────────────────────────────────
    test_loss, test_mae = model.evaluate(X_test, y_test, verbose=0)
    y_pred = model.predict(X_test, verbose=0).flatten()
    ss_res = np.sum((y_test - y_pred) ** 2)
    ss_tot = np.sum((y_test - np.mean(y_test)) ** 2)
    r2 = 1 - ss_res / ss_tot

    # Convert log-scale MAE back to euros (approximate)
    prices_true = np.exp(y_test)
    prices_pred = np.exp(y_pred)
    mae_eur = np.mean(np.abs(prices_true - prices_pred))
    mape    = np.mean(np.abs((prices_true - prices_pred) / prices_true)) * 100

    print("\n── Test Results ──────────────────────────")
    print(f"  R²   : {r2:.4f}")
    print(f"  MAE  : €{mae_eur:,.0f}")
    print(f"  MAPE : {mape:.1f}%")
    print("──────────────────────────────────────────\n")

    # ── Export ───────────────────────────────────────────────────────────────
    print("──────────────────────────────────────────\n")

    # ── Export model artifacts only (no TF.js conversion here) ──────────────
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    MODEL_KERAS_PATH = os.path.join(OUTPUT_DIR, "model.keras")
    MODEL_H5_PATH    = os.path.join(OUTPUT_DIR, "model.h5")

    model.save(MODEL_KERAS_PATH)
    model.save(MODEL_H5_PATH)

    print(f"Keras model saved to: {MODEL_KERAS_PATH}")
    print(f"H5 model saved to: {MODEL_H5_PATH}")

    vocab_out = {
        "vocab": vocab_map,
        "scaler": scaler_stats,
        "metrics": {
            "r2": round(float(r2), 4),
            "mae": round(float(mae_eur), 0),
            "mape": round(float(mape), 2),
        },
    }

    vocab_path = os.path.join(OUTPUT_DIR, "vocab.json")
    with open(vocab_path, "w") as f:
        json.dump(vocab_out, f, indent=2)

    print(f"Vocab + scaler saved to: {vocab_path}")
    print("\nDone! Training finished.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True, help="Path to your Excel dataset (.xlsx)")
    args = parser.parse_args()
    main(args.file)
