import argparse
import os
import subprocess


def main(model_h5_path: str, output_dir: str):
    if not os.path.isfile(model_h5_path):
        raise FileNotFoundError(f"model file not found: {model_h5_path}")

    os.makedirs(output_dir, exist_ok=True)

    converter_cmd = [
        "tensorflowjs_converter",
        "--input_format=keras",
        "--output_format=tfjs_layers_model",
        model_h5_path,
        output_dir,
    ]

    print("Running TensorFlow.js converter...")
    print(" ".join(converter_cmd))

    result = subprocess.run(converter_cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print("\nConverter stderr:\n")
        print(result.stderr)
        print("\nConverter stdout:\n")
        print(result.stdout)
        raise RuntimeError("TensorFlow.js conversion failed.")

    print("\nConversion completed successfully.")
    print(f"TF.js files written to: {output_dir}")

    model_json = os.path.join(output_dir, "model.json")
    if os.path.exists(model_json):
        print(f"Found: {model_json}")
    else:
        print("Warning: model.json was not found after conversion.")

    shard_files = [f for f in os.listdir(output_dir) if f.endswith(".bin")]
    if shard_files:
        print("Weight shard files:")
        for f in shard_files:
            print(f"  - {f}")
    else:
        print("Warning: no .bin shard files were found.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        default=os.path.join("public", "models", "belgium-price", "model.h5"),
        help="Path to saved Keras H5 model",
    )
    parser.add_argument(
        "--out",
        default=os.path.join("public", "models", "belgium-price", "tfjs"),
        help="Output directory for TF.js model",
    )
    args = parser.parse_args()

    main(args.model, args.out)