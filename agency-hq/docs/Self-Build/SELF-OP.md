# SELF-OP.md

Stackz's self-optimization tasking file. This is the human-programming interface
— the program.md equivalent from Andrej Karpathy's autoresearch.

Stackz reads this file at the start of every SELF_BUILD and SELF-OP session.
The STRATEGY section shapes how Stackz prioritizes work.

---

## STRATEGY

<!-- Your current strategic direction for the system.
     What matters most right now. What to deprioritize.
     What experiments to try. What to avoid.
     Stackz reads this before every session. Update it anytime. -->

Focus on making the 6 team agents functional before adding new features to the UI.
Revenue workflows before polish. Get Megaphone posting autonomously first.

---

## TASKING

<!-- Active tasks for Stackz to work on.
     Format: Task description
     Optional: BUDGET: Xmin (time budget for this item)
     Optional: PRIMARY_FILE: path/to/file.js (main file to modify)
     End each entry with --->

Fix the wallet page runway calculation.
BUDGET: 20min
PRIMARY_FILE: frontend/src/pages/Wallet.jsx
---

Wire up the timeline API to the frontend Timeline page.
BUDGET: 30min
PRIMARY_FILE: frontend/src/pages/TimelinePage.jsx
---

Add the Stripe webhook handler for real-time payment updates.
BUDGET: 45min
PRIMARY_FILE: backend/routes/stripe.js
---
