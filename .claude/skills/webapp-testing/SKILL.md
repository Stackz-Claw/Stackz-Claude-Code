---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. This skill should be used when verifying frontend functionality, debugging UI behavior, capturing browser screenshots, viewing browser console logs, writing automation scripts, testing user flows, checking accessibility, or inspecting DOM state of any local web app. Activate for requests involving Playwright, browser automation, UI testing, screenshot capture, form submission testing, navigation testing, or any task that requires a real browser to verify behavior.
license: Complete terms in LICENSE.txt
---

# Web Application Testing

To test local web applications, write native Python Playwright scripts.

**Helper Scripts Available**:
- `scripts/with_server.py` - Manages server lifecycle (supports multiple servers)

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is absolutely necessary. These scripts can be very large and thus pollute your context window. They exist to be called directly as black-box scripts rather than ingested into your context window.

## Decision Tree: Choosing Your Approach

```
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         ├─ Success → Write Playwright script using selectors
    │         └─ Fails/Incomplete → Treat as dynamic (below)
    │
    └─ No (dynamic webapp) → Is the server already running?
        ├─ No → Run: python scripts/with_server.py --help
        │        Then use the helper + write simplified Playwright script
        │
        └─ Yes → Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Example: Using with_server.py

To start a server, run `--help` first, then use the helper:

**Single server:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**Multiple servers (e.g., backend + frontend):**
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

To create an automation script, include only Playwright logic (servers are managed automatically):

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173')  # Server already running and ready
    page.wait_for_load_state('networkidle')  # CRITICAL: Wait for JS to execute
    # ... your automation logic
    browser.close()
```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```
2. **Identify selectors** from inspection results
3. **Execute actions** using discovered selectors

## Selector Strategy (Priority Order)

Use the most stable selector available. Prefer user-facing attributes over DOM structure — these survive UI refactors and also validate accessibility:

| Priority | Locator | Example | Use When |
|----------|---------|---------|----------|
| 1st | `get_by_role()` | `page.get_by_role('button', name='Submit')` | Element has ARIA role + accessible name |
| 2nd | `get_by_label()` | `page.get_by_label('Email address')` | Form inputs with labels |
| 3rd | `get_by_text()` | `page.get_by_text('Continue')` | Visible text content |
| 4th | `get_by_placeholder()` | `page.get_by_placeholder('Search...')` | Inputs with placeholder text |
| 5th | `get_by_test_id()` | `page.get_by_test_id('submit-btn')` | Elements with `data-testid` attribute |
| Last | CSS / XPath | `page.locator('#id')` | Only when nothing else works |

**Why role-based selectors first**: `get_by_role()` and `get_by_label()` are stable even when classes, IDs, and DOM structure change. They also confirm the app is accessible — if a button can't be found by role, it likely can't be found by a screen reader either.

**Avoid**:
```python
# Brittle — breaks on any DOM restructure
page.locator('#tsf > div:nth-child(2) > div.A8SBwf > input')

# Dynamic IDs — change per render
page.locator('#react-select-3-input')

# Stable — survives refactors
page.get_by_role('button', name='Sign in')
page.get_by_label('Password')
```

## Waiting Strategy

Playwright auto-waits for elements to be actionable — do not fight this with manual sleeps.

```python
# Never use fixed sleeps — causes flaky tests
page.wait_for_timeout(5000)

# Wait for application state
page.wait_for_load_state('networkidle')      # After navigation, before inspection
page.wait_for_selector('.dashboard-loaded')  # Wait for specific element
page.get_by_role('button', name='Submit').wait_for()  # Wait for element

# For SPA hydration — apps may render then become interactive later
page.wait_for_load_state('networkidle')
page.wait_for_function("() => document.readyState === 'complete'")
```

**Hydration warning**: Modern JS frameworks (React, Vue, Svelte) have a hydration period after initial render where the UI isn't interactive yet. Always wait for `networkidle` before attempting interactions, not just `load`.

## Capturing Diagnostic Artifacts

When a test fails or behavior is unexpected, capture artifacts before closing the browser:

```python
# Screenshot (full page captures scroll content too)
page.screenshot(path='/tmp/debug.png', full_page=True)

# Console logs — capture BEFORE the action that might fail
logs = []
page.on('console', lambda msg: logs.append(f'[{msg.type}] {msg.text}'))

# Network requests — useful for debugging API calls
page.on('request', lambda req: print(f'-> {req.method} {req.url}'))
page.on('response', lambda resp: print(f'<- {resp.status} {resp.url}'))

# Page content snapshot
with open('/tmp/page_content.html', 'w') as f:
    f.write(page.content())

# Playwright trace — records full timeline with DOM snapshots (most powerful)
context = browser.new_context()
context.tracing.start(screenshots=True, snapshots=True)
# ... test actions ...
context.tracing.stop(path='/tmp/trace.zip')
# Open with: playwright show-trace /tmp/trace.zip
```

## Common Pitfalls

| Pitfall | Fix |
|---|---|
| Inspecting DOM before `networkidle` on dynamic apps | Always `wait_for_load_state('networkidle')` first |
| Fixed `wait_for_timeout()` sleeps | Use auto-waiting locators and `wait_for_load_state` |
| Long chained CSS selectors | Use `get_by_role`, `get_by_label`, or `data-testid` |
| Not closing browser on error | Use `try/finally` to ensure `browser.close()` |
| Assuming page is interactive after `load` event | SPA hydration may lag — wait for `networkidle` |
| Single browser context across tests | Create fresh context per test to avoid shared state |

## Assertions

Always assert outcomes — don't just perform actions and assume they worked:

```python
from playwright.sync_api import expect

# Visibility
expect(page.get_by_role('heading', name='Dashboard')).to_be_visible()

# Text content
expect(page.get_by_test_id('status')).to_have_text('Success')

# URL after navigation
expect(page).to_have_url('http://localhost:5173/dashboard')

# Form state
expect(page.get_by_label('Email')).to_have_value('user@example.com')

# Element count
expect(page.get_by_role('listitem')).to_have_count(5)
```

Playwright assertions **auto-retry** until the condition is met or timeout expires — this eliminates most timing-related failures without manual waits.

## Best Practices

- **Use bundled scripts as black boxes** — run `--help` first, invoke directly. Don't read source unless customization is truly necessary.
- Use `sync_playwright()` for synchronous scripts
- Always close the browser — use `try/finally` to guarantee cleanup
- Prefer `get_by_role()` and `get_by_label()` — stable and accessibility-validating
- Add `data-testid` attributes to highly dynamic elements when you control the app source
- Capture a screenshot and console logs before any action that's expected to fail — you only get one shot at the pre-failure state
- For repeated workflows across multiple pages, consider a simple Page Object: a class that encapsulates selectors and actions for one page, keeping scripts readable and maintainable

## Reference Files

- **examples/** - Examples showing common patterns:
  - `element_discovery.py` - Discovering buttons, links, and inputs on a page
  - `static_html_automation.py` - Using `file://` URLs for local HTML
  - `console_logging.py` - Capturing console logs during automation
