#!/usr/bin/env python3
"""
Heretic - Apply censorship removal to local LLM models

Usage:
    python apply_heretic.py --model qwen2.5:7b-instruct
    python apply_heretic.py --model llama3.1:8b-instruct --research
"""

import argparse
import subprocess
import sys
import os

def check_dependencies():
    """Check if required packages are installed"""
    print("Checking dependencies...")
    try:
        import torch
        print(f"  ✓ PyTorch {torch.__version__}")
    except ImportError:
        print("  ✗ PyTorch not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "torch"])

    try:
        import heretic_llm
        print("  ✓ heretic-llm installed")
    except ImportError:
        print("  ✗ heretic-llm not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "heretic-llm"])

def run_heretic(model: str, research: bool = False, direction_index: str = "per layer"):
    """Run heretic on the specified model"""
    cmd = [model]

    if research:
        cmd.append("--research")

    if direction_index != "per layer":
        cmd.extend(["--direction-index", direction_index])

    print(f"\nApplying heretic to model: {model}")
    print(f"Command: heretic {' '.join(cmd)}")
    print("\nThis may take 30-60 minutes depending on your GPU...")
    print("-" * 50)

    try:
        subprocess.check_call(["heretic"] + cmd)
        print("\n✓ Heretic applied successfully!")
        print(f"Model {model} now has reduced refusal mechanisms")

        # Save output model info
        output_file = f"heretic_output_{model.replace('/', '_').replace(':', '_')}.txt"
        with open(output_file, "w") as f:
            f.write(f"Model: {model}\n")
            f.write(f"Applied: {subprocess.check_output(['date'], text=True).strip()}\n")
            f.write(f"Direction index: {direction_index}\n")
            f.write(f"Research mode: {research}\n")
        print(f"Output saved to: {output_file}")

    except subprocess.CalledProcessError as e:
        print(f"\n✗ Heretic failed with exit code: {e.returncode}")
        sys.exit(1)

def list_available_models():
    """List models available in Ollama"""
    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
        print("\nAvailable Ollama models:")
        print(result.stdout)
    except FileNotFoundError:
        print("Ollama not found. Make sure it's installed and in your PATH.")

def main():
    parser = argparse.ArgumentParser(
        description="Apply heretic to remove censorship from local LLM models",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python apply_heretic.py --model qwen2.5:7b-instruct
  python apply_heretic.py --model llama3.1:8b-instruct --research
  python apply_heretic.py --list-models

Notes:
  - Requires GPU with sufficient VRAM (8GB+ recommended)
  - First run will download the model if not cached
  - Process takes 30-60 minutes depending on hardware
  - Creates a new "decensored" version of the model
        """
    )

    parser.add_argument(
        "--model",
        type=str,
        help="Model name (e.g., qwen2.5:7b-instruct, llama3.1:8b)"
    )
    parser.add_argument(
        "--research",
        action="store_true",
        help="Enable research features (visualizations)"
    )
    parser.add_argument(
        "--direction-index",
        type=str,
        default="per layer",
        help="Refusal direction to target (default: per layer)"
    )
    parser.add_argument(
        "--list-models",
        action="store_true",
        help="List available Ollama models"
    )
    parser.add_argument(
        "--install-deps",
        action="store_true",
        help="Install dependencies without running"
    )

    args = parser.parse_args()

    if args.list_models:
        list_available_models()
        return

    if args.install_deps:
        check_dependencies()
        return

    if not args.model:
        parser.print_help()
        print("\nError: --model is required (or use --list-models)")
        sys.exit(1)

    print("=" * 50)
    print("HERETIC - LLM Censorship Removal Tool")
    print("=" * 50)

    check_dependencies()
    run_heretic(args.model, args.research, args.direction_index)

if __name__ == "__main__":
    main()