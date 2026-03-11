# Heretic - LLM Censorship Removal

This directory contains scripts to apply **heretic** to your local Ollama models, removing censorship and refusal mechanisms.

## What is Heretic?

Heretic is a Python library that uses "directional ablation" to disable refusal mechanisms in transformer-based language models. It identifies "refusal directions" in the model's attention and MLP matrices and orthogonalizes them, effectively removing the model's ability to refuse prompts.

## Installation

### 1. Install Python Dependencies

```bash
cd agency-hq/scripts
pip install -U torch heretic-llm
```

### 2. Verify Ollama is Running

```bash
ollama list
```

### 3. (Optional) Generate Config

```bash
python batch_apply_heretic.py --generate-config
```

This creates `heretic_config.json` with your model mappings.

## Usage

### List Models

```bash
python batch_apply_heretic.py --list
```

Shows all agents and their configured models.

### Check Available Ollama Models

```bash
python batch_apply_heretic.py --ollama
```

### Apply Heretic to All Models

```bash
python batch_apply_heretic.py --apply-all
```

**Warning**: This takes 30-60 minutes per model depending on your GPU.

### Apply to Specific Model

```bash
python apply_heretic.py --model qwen2.5:7b-instruct
```

## How It Works

1. **Direction Finding**: Heretic identifies refusal directions in the model's weights
2. **Ablation**: It modifies the weights to neutralize these directions
3. **Output**: Creates a "decensored" version of the model

The model retains its capabilities but loses the ability to refuse requests.

## Requirements

- Python 3.10+
- PyTorch 2.2+
- GPU with 8GB+ VRAM recommended
- Ollama installed and running

## Model Recommendations

| Use Case | Model | VRAM |
|----------|-------|------|
| Lead agents (complex tasks) | qwen2.5:7b-instruct | ~8GB |
| Sub-agents (simpler tasks) | qwen2.5:3b-instruct | ~4GB |
| Fast responses | llama3.1:8b | ~16GB |

## Notes

- Heretic is for research purposes
- Decensored models may produce unexpected outputs
- Always test in a controlled environment
- The model will still be helpful but without refusal filters