import * as tf from "@tensorflow/tfjs";

let model: tf.LayersModel | null = null;
let vocabData: {
  vocab: Record<string, Record<string, number>>;
  scaler: { mean: number[]; scale: number[]; feature_order: string[] };
} | null = null;

async function loadVocab() {
  if (!vocabData) {
    const res = await fetch("/models/belgium-price/vocab.json");
    vocabData = await res.json();
  }
  return vocabData!;
}

function buildModel(): tf.LayersModel {
  // Recreate the exact architecture from train_model.py:
  // Input(11) → Dense(128,relu) → Dropout(0.2) → Dense(64,relu) → Dropout(0.2) → Dense(32,relu) → Dense(1)
  const input = tf.input({ shape: [11], name: "features" });
  let x = tf.layers
    .dense({ units: 128, activation: "relu", name: "dense" })
    .apply(input) as tf.SymbolicTensor;
  x = tf.layers
    .dropout({ rate: 0.2, name: "dropout" })
    .apply(x) as tf.SymbolicTensor;
  x = tf.layers
    .dense({ units: 64, activation: "relu", name: "dense_1" })
    .apply(x) as tf.SymbolicTensor;
  x = tf.layers
    .dropout({ rate: 0.2, name: "dropout_1" })
    .apply(x) as tf.SymbolicTensor;
  x = tf.layers
    .dense({ units: 32, activation: "relu", name: "dense_2" })
    .apply(x) as tf.SymbolicTensor;
  const output = tf.layers
    .dense({ units: 1, name: "log_price" })
    .apply(x) as tf.SymbolicTensor;
  return tf.model({ inputs: input, outputs: output });
}

async function loadWeightsFromBin(m: tf.LayersModel) {
  // Load the raw weight binary and assign to layers by name
  const res = await fetch("/models/belgium-price/tfjs/group1-shard1of1.bin");
  const buffer = await res.arrayBuffer();
  const allWeights = new Float32Array(buffer);

  // Weight layout from model.json weightsManifest (sequential in the .bin):
  // dense/kernel [11,128], dense/bias [128],
  // dense_1/kernel [128,64], dense_1/bias [64],
  // dense_2/kernel [64,32], dense_2/bias [32],
  // log_price/kernel [32,1], log_price/bias [1]
  const specs: { name: string; shape: number[] }[] = [
    { name: "dense", shape: [11, 128] },
    { name: "dense", shape: [128] },
    { name: "dense_1", shape: [128, 64] },
    { name: "dense_1", shape: [64] },
    { name: "dense_2", shape: [64, 32] },
    { name: "dense_2", shape: [32] },
    { name: "log_price", shape: [32, 1] },
    { name: "log_price", shape: [1] },
  ];

  let offset = 0;
  const layerWeights: Record<string, tf.Tensor[]> = {};

  for (const spec of specs) {
    const size = spec.shape.reduce((a, b) => a * b, 1);
    const data = allWeights.slice(offset, offset + size);
    offset += size;

    if (!layerWeights[spec.name]) layerWeights[spec.name] = [];
    layerWeights[spec.name].push(tf.tensor(Array.from(data), spec.shape));
  }

  for (const layer of m.layers) {
    if (layerWeights[layer.name]) {
      layer.setWeights(layerWeights[layer.name]);
    }
  }
}

export async function loadBelgiumPriceModel() {
  if (!model) {
    try {
      model = buildModel();
      await loadWeightsFromBin(model);
      await loadVocab();
      console.log("TensorFlow.js model loaded successfully");
    } catch (error) {
      console.warn(
        "Failed to load TensorFlow model, using formula-based estimator",
        error,
      );
      model = null;
    }
  }
  return model;
}

export async function predictBelgiumPrice(input: {
  property_type: string;
  postal_code: string;
  municipality: string;
  living_area_m2: number;
  lot_area_m2: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  energy_label: string;
  has_garden: boolean;
  has_terrace: boolean;
  has_garage: boolean;
}) {
  const m = await loadBelgiumPriceModel();

  // Try to use the real neural network model
  if (m && vocabData) {
    try {
      const { vocab, scaler } = vocabData;

      // Look up categorical encodings from vocab
      const cityEnc =
        vocab.municipality?.[input.municipality.toLowerCase()] ?? 0;
      const postalEnc =
        vocab.postal_code?.[String(input.postal_code).toLowerCase()] ?? 0;
      const energyEnc =
        vocab.energy_label?.[(input.energy_label || "c").toLowerCase()] ?? 0;

      // Build raw feature vector in the same order as training
      // feature_order: living_area, surface_of_the_plot, bedrooms, toilets, construction_year,
      //                has_garden, has_garage, has_terrace, city_enc, postal_enc, energy_class_enc
      const raw = [
        input.living_area_m2,
        input.lot_area_m2,
        input.bedrooms,
        input.bathrooms, // mapped to "toilets" in training
        input.year_built,
        input.has_garden ? 1 : 0,
        input.has_garage ? 1 : 0,
        input.has_terrace ? 1 : 0,
        cityEnc,
        postalEnc,
        energyEnc,
      ];

      // Normalise using scaler stats: (x - mean) / scale
      const normalized = raw.map(
        (val, i) => (val - scaler.mean[i]) / scaler.scale[i],
      );

      const inputTensor = tf.tensor2d([normalized]);
      const out = m.predict(inputTensor) as tf.Tensor;
      const logPrice = (await out.data())[0];

      inputTensor.dispose();
      out.dispose();

      const price = Math.exp(logPrice);
      return Math.max(50_000, Math.round(price / 1000) * 1000);
    } catch (error) {
      console.warn("Model prediction failed, using formula fallback", error);
    }
  }

  // Fallback: Use a sophisticated formula-based estimation
  // Base price per m² varies by city
  const cityMultipliers: Record<string, number> = {
    brussels: 3200,
    antwerp: 2800,
    ghent: 2600,
    bruges: 2700,
    leuven: 2900,
    liege: 2100,
    charleroi: 1800,
    namur: 2200,
  };

  const basePrice = cityMultipliers[input.municipality] || 2500;

  // Calculate base value
  let estimate = input.living_area_m2 * basePrice;

  // Add value for lot area (land is valuable)
  estimate += input.lot_area_m2 * 150;

  // Age adjustment (newer properties are more valuable)
  const age = 2026 - input.year_built;
  if (age < 5) {
    estimate *= 1.15; // New construction premium
  } else if (age < 15) {
    estimate *= 1.05; // Recent construction
  } else if (age > 50) {
    estimate *= 0.85; // Older properties discount
  }

  // Room count adjustments
  estimate += (input.bedrooms - 2) * 15000; // Extra bedrooms add value
  estimate += (input.bathrooms - 1) * 12000; // Extra bathrooms add value

  // Amenities
  if (input.has_garden) estimate += 25000;
  if (input.has_terrace) estimate += 15000;
  if (input.has_garage) estimate += 20000;

  // Round to nearest thousand
  return Math.max(50_000, Math.round(estimate / 1000) * 1000);
}
