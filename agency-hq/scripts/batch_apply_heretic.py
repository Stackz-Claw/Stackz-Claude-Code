#!/usr/bin/env python3
"""
Batch Heretic - Apply censorship removal to multiple Ollama models

This script applies heretic to all models used by the Agency HQ agents.

Usage:
    python batch_apply_heretic.py                    # Apply to default models
    python batch_apply_heretic.py --list             # List models that need heretic
    python batch_apply_heretic.py --model llama3.1   # Apply to specific model
"""

import argparse
import subprocess
import sys
import os
import json
from datetime import datetime

# Default model mappings for each agent
# Override with your actual model names used in Ollama
AGENT_MODELS = {
    # Lead agents - primary models
    "smoke": "qwen2.5:7b-instruct",      # Chief of Staff
    "stackz": "qwen2.5:7b-instruct",     # COO
    "warden": "qwen2.5:7b-instruct",     # HR
    "megaphone": "qwen2.5:7b-instruct",  # Marketing
    "forge": "qwen2.5:7b-instruct",      # Dev
    "radar": "qwen2.5:7b-instruct",      # Strategy
    "canvas": "qwen2.5:7b-instruct",     # Design
    "cashflow": "qwen2.5:7b-instruct",   # Finance
    "founder": "qwen2.5:7b-instruct",    # Startup

    # Sub-agents - can use smaller models
    "recruiter": "qwen2.5:3b-instruct",
    "auditor": "qwen2.5:3b-instruct",
    "ghost": "qwen2.5:3b-instruct",
    "lens": "qwen2.5:3b-instruct",
    "director": "qwen2.5:3b-instruct",
    "scout": "qwen2.5:3b-instruct",
    "scheduler": "qwen2.5:3b-instruct",
    "smith": "qwen2.5:3b-instruct",
    "pixel": "qwen2.5:3b-instruct",
    "tester": "qwen2.5:3b-instruct",
    "devops": "qwen2.5:3b-instruct",
    "integrator": "qwen2.5:3b-instruct",
    "analyst": "qwen2.5:3b-instruct",
    "validator": "qwen2.5:3b-instruct",
    "pitch": "qwen2.5:3b-instruct",
    "palette": "qwen2.5:3b-instruct",
    "illustrator": "qwen2.5:3b-instruct",
    "animator": "qwen2.5:3b-instruct",
    "brand-guard": "qwen2.5:3b-instruct",
    "ledger": "qwen2.5:3b-instruct",
    "forecaster": "qwen2.5:3b-instruct",
    "billing": "qwen2.5:3b-instruct",
    "strategist": "qwen2.5:3b-instruct",
    "researcher": "qwen2.5:3b-instruct",
    "warplanner": "qwen2.5:3b-instruct",
    "growth-engine": "qwen2.5:3b-instruct",
    "postmortem": "qwen2.5:3b-instruct",
}

def check_dependencies():
    """Check and install required dependencies"""
    print("Checking dependencies...")
    packages = ["torch", "heretic-llm"]

    for pkg in packages:
        try:
            __import__(pkg.replace("-", "_"))
            print(f"  ✓ {pkg}")
        except ImportError:
            print(f"  ✗ {pkg} not found. Installing...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])

def list_ollama_models():
    """List models available in Ollama"""
    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
        return result.stdout
    except FileNotFoundError:
        return "Ollama not found. Install from https://ollama.com"

def get_unique_models():
    """Get list of unique models (without duplicates)"""
    return list(set(AGENT_MODELS.values()))

def apply_heretic_to_model(model: str, research: bool = False):
    """Apply heretic to a single model"""
    print(f"\n{'='*50}")
    print(f"Processing: {model}")
    print(f"{'='*50}")

    cmd = [model]
    if research:
        cmd.append("--research")

    try:
        print(f"Running: heretic {' '.join(cmd)}")
        print("This will take 30-60 minutes...")
        result = subprocess.run(["heretic"] + cmd, check=True)
        print(f"✓ Successfully processed {model}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to process {model}: {e}")
        return False

def generate_config():
    """Generate a config file with model mappings"""
    config = {
        "generated_at": datetime.now().isoformat(),
        "agent_models": AGENT_MODELS,
        "unique_models": get_unique_models(),
        "notes": "Update the model names above to match your Ollama installation"
    }

    config_path = os.path.join(os.path.dirname(__file__), "heretic_config.json")
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)

    print(f"\nGenerated config: {config_path}")
    return config_path

def main():
    parser = argparse.ArgumentParser(
        description="Batch apply heretic to Agency HQ agent models",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python batch_apply_heretic.py --list
  python batch_apply_heretic.py --check-deps
  python batch_apply_heretic.py --apply-all
  python batch_apply_heretic.py --model llama3.1:8b-instruct
        """
    )

    parser.add_argument("--list", action="store_true", help="List all models that need heretic")
    parser.add_argument("--check-deps", action="store_true", help="Check/install dependencies")
    parser.add_argument("--apply-all", action="store_true", help="Apply heretic to all models")
    parser.add_argument("--model", type=str, help="Apply heretic to specific model")
    parser.add_argument("--generate-config", action="store_true", help="Generate config file")
    parser.add_argument("--ollama", action="store_true", help="Show available Ollama models")

    args = parser.parse_args()

    print("=" * 50)
    print("BATCH HERETIC - Agency HQ Model Decensoring")
    print("=" * 50)

    if args.check_deps:
        check_dependencies()
        return

    if args.generate_config:
        path = generate_config()
        print(f"Config saved to: {path}")
        return

    if args.ollama:
        print("\nAvailable Ollama models:")
        print(list_ollama_models())
        return

    if args.list:
        print("\nModels configured for each agent:")
        print("-" * 50)
        for agent, model in AGENT_MODELS.items():
            print(f"  {agent:20} -> {model}")
        print("-" * 50)
        print(f"Total: {len(AGENT_MODELS)} agents, {len(get_unique_models())} unique models")
        return

    if args.apply_all:
        check_dependencies()
        unique_models = get_unique_models()
        print(f"\nWill apply heretic to {len(unique_models)} unique models:")
        for model in unique_models:
            print(f"  - {model}")

        confirm = input("\nContinue? (yes/no): ")
        if confirm.lower() != "yes":
            print("Aborted.")
            return

        results = {}
        for model in unique_models:
            results[model] = apply_heretic_to_model(model)

        # Summary
        print("\n" + "=" * 50)
        print("RESULTS")
        print("=" * 50)
        successful = sum(1 for v in results.values() if v)
        failed = sum(1 for v in results.values() if not v)
        print(f"Successful: {successful}")
        print(f"Failed: {failed}")

        return

    if args.model:
        check_dependencies()
        apply_heretic_to_model(args.model)
        return

    parser.print_help()

if __name__ == "__main__":
    main()