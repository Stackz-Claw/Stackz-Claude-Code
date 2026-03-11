#!/bin/bash
# The Briefing (Activity Tracker) Cron Registration Script
# Run this to schedule the Daily Activity Tracker & Briefing workflow

# Register the cron job with OpenClaw
openclaw cron add \
  --name "Daily Activity Tracker & Briefing" \
  --cron "0 6 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Run the ACTIVITY_TRACKER workflow. Collect all activity from the last 24 hours across all data sources. Smoke reviews for accuracy and tone. Post the full briefing to /api/briefings and write the Obsidian mirror note. Emit socket events for real-time UI update." \
  --announce

echo "Cron job registered successfully!"