#!/bin/bash
# Vault Organizer Cron Registration Script
# Run this to schedule the Daily Vault Organizer workflow

# Register the cron job with OpenClaw
openclaw cron add \
  --name "Daily Vault Organizer" \
  --cron "0 2 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Run the VAULT_ORGANIZER workflow. Connect to obsidian-vault-mcp, execute all 5 phases in sequence, and deliver the summary report when complete." \
  --announce

echo "Cron job registered successfully!"
