---
name: mcp-builder
description: This skill should be used when building MCP (Model Context Protocol) servers to integrate external APIs or services with LLMs. Activate for requests to create, scaffold, test, or evaluate any MCP server — whether in Python (FastMCP) or Node/TypeScript (MCP SDK). Also activate when asked to design tool schemas, write Pydantic/Zod validation models, implement evaluation harnesses, or audit an existing MCP server for quality or security.
license: Complete terms in LICENSE.txt
---

# MCP Server Development Guide

## Overview

An MCP server provides tools that allow LLMs to access external services and APIs. The quality of an MCP server is measured by **how well it enables LLMs to accomplish real-world tasks** — not by how many endpoints it wraps. Build for workflows, not for coverage.

---

## ⚡ Quick-Start Decision

```
New MCP server request?
    │
    ├─ Python / FastMCP?   → Read reference/python_mcp_server.md during Phase 2
    ├─ TypeScript / Node?  → Read reference/node_mcp_server.md during Phase 2
    └─ Both?               → Read both; pick Python for rapid prototyping
                                         pick TS for production typed APIs

Need to test/eval a server?
    └─ Use scripts/evaluation.py (manages server lifecycle automatically for stdio)
        See: Phase 4 + reference/evaluation.md
```

---

## 🧭 High-Level Workflow (4 Phases)

| Phase | What Happens | Key Output |
|-------|-------------|------------|
| 1 — Research & Plan | Study MCP spec, API docs, design tool contracts | Implementation plan |
| 2 — Implement | Build server with shared utilities, Pydantic/Zod, async patterns | Working server file |
| 3 — Review & Build | Quality checklist, compile/syntax check | Verified build |
| 4 — Evaluate | Create 10 QA pairs, run `evaluation.py`, iterate | Eval report + score |

---

## Phase 1: Deep Research and Planning

### 1.1 Agent-Centric Design Principles

**Build for Workflows, Not Just API Endpoints**
- Consolidate related operations: `schedule_event` should both check availability AND create the event
- Focus on tools that enable **complete tasks**, not just individual API calls
- Ask: "What does an agent actually need to accomplish?" — not "What does the API expose?"

**Optimize for Limited Context**
- Return high-signal information, not exhaustive data dumps
- Default to human-readable identifiers over opaque IDs
- Support `response_format: "markdown" | "json"` on all listing tools
- Set `CHARACTER_LIMIT = 25000` at module level; truncate gracefully with guidance

**Design Actionable Error Messages**
- ❌ `"Error 403"` → ✅ `"Error: Permission denied. Check your API key has write access to this workspace."`
- Errors should teach the agent correct usage, not just report failure

**Follow Natural Task Subdivisions**
- Tool names should reflect how humans think about tasks
- Group related tools with consistent `{service}_` prefixes for discoverability

### 1.2 Fetch Core MCP Documentation

```
Fetch during Phase 1 (not before — don't pollute context early):

  MCP Protocol spec:      https://modelcontextprotocol.io/llms-full.txt
  Python SDK README:      https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md
  TypeScript SDK README:  https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md
```

Also load `reference/mcp_best_practices.md` — it covers naming, pagination, transport, security, and compliance in full.

### 1.3 Exhaustively Study Target API Documentation

Read **ALL** available API docs for the service you're integrating:
- Authentication and authorization flows
- Rate limits, pagination patterns, cursor formats
- Error codes and HTTP status meanings
- Every endpoint's request/response schema
- Data model relationships

### 1.4 Create an Implementation Plan

Before writing any code, document:

**Tool Selection** — List the 5–10 highest-value tools. Prioritize tools that unblock workflows.

**Shared Utilities** — Identify common patterns: API client, pagination helper, error handler, response formatter.

**Input/Output Design**
- Pydantic models (Python) or Zod schemas (TypeScript) for every tool input
- Consistent response structure across similar tools
- Pagination metadata: `total`, `count`, `offset`, `has_more`, `next_offset`
- Truncation with `CHARACTER_LIMIT` and helpful filter guidance

**Error Handling Strategy**
- Map status codes → human-readable messages
- Rate limit → "Please wait before retrying"
- Auth failure → "Check your API key has X scope"

---

## Phase 2: Implementation

### 2.1 Project Structure

**Python (single file or module):**
```
{service}_mcp.py          # All tools, models, utilities in one file for simple servers
  OR
{service}_mcp/
  ├── __init__.py
  ├── server.py            # FastMCP init + tool registration
  ├── models.py            # All Pydantic input models
  ├── utils.py             # API client, error handler, formatters
  └── constants.py         # CHARACTER_LIMIT, API_BASE_URL, etc.
```

**TypeScript (required structure):**
```
{service}-mcp-server/
  ├── package.json
  ├── tsconfig.json
  ├── src/
  │   ├── index.ts          # McpServer init + transport
  │   ├── types.ts          # Interfaces + TypedDict
  │   ├── tools/            # One file per domain
  │   ├── services/         # API client, shared utilities
  │   ├── schemas/          # Zod schemas
  │   └── constants.ts      # CHARACTER_LIMIT, API_BASE_URL
  └── dist/                 # Built output (entry: dist/index.js)
```

### 2.2 Implement Core Infrastructure First

Build shared utilities **before** any tool:

```python
# Python: shared utilities pattern
CHARACTER_LIMIT = 25000
API_BASE_URL = "https://api.example.com/v1"

async def _make_api_request(endpoint: str, method: str = "GET", **kwargs) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.request(method, f"{API_BASE_URL}/{endpoint}", timeout=30.0, **kwargs)
        resp.raise_for_status()
        return resp.json()

def _handle_api_error(e: Exception) -> str:
    if isinstance(e, httpx.HTTPStatusError):
        codes = {404: "not found", 403: "permission denied", 429: "rate limit exceeded"}
        msg = codes.get(e.response.status_code, f"status {e.response.status_code}")
        return f"Error: API request failed — {msg}. Check your parameters and retry."
    if isinstance(e, httpx.TimeoutException):
        return "Error: Request timed out. Retry or reduce the scope of your query."
    return f"Error: {type(e).__name__}: {e}"
```

### 2.3 Implement Each Tool Systematically

For each tool:

1. **Define Input Model** (Pydantic/Zod) with constraints and descriptions
2. **Write Docstring/Description** covering: purpose, args with types+examples, return schema, usage examples, error handling
3. **Implement Logic** using shared utilities
4. **Add Annotations** (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`)

**Load language-specific guide now:**
- Python → `reference/python_mcp_server.md`
- TypeScript → `reference/node_mcp_server.md`

### 2.4 Tool Naming Rules

| Rule | Example |
|------|---------|
| `snake_case` | `search_users` not `searchUsers` |
| Service prefix | `slack_send_message` not `send_message` |
| Action-oriented verb first | `get_`, `list_`, `search_`, `create_`, `update_`, `delete_` |
| Specific not generic | `github_create_issue` not `create_thing` |

**Server naming:**
- Python: `{service}_mcp` (e.g., `slack_mcp`)
- TypeScript: `{service}-mcp-server` (e.g., `slack-mcp-server`)

### 2.5 Pagination Pattern (Required for All List Tools)

```python
# Python pattern
class ListInput(BaseModel):
    limit: Optional[int] = Field(default=20, ge=1, le=100, description="Max results (1–100)")
    offset: Optional[int] = Field(default=0, ge=0, description="Results to skip for pagination")

# Return structure
{
    "total": 150,
    "count": 20,
    "offset": 0,
    "items": [...],
    "has_more": True,
    "next_offset": 20
}
```

### 2.6 Transport Selection

| Transport | Use When | Notes |
|-----------|----------|-------|
| `stdio` | Local CLI, Claude Desktop, subprocess | Default. Do NOT log to stdout — use stderr |
| `http` | Web service, multiple clients, cloud | Requires network config |
| `sse` | Real-time push, streaming data | Built on HTTP; long-lived connections |

**Critical:** MCP servers are long-running processes that block on stdio/stdin. Never run `python server.py` directly in your main process — it will hang. Use `timeout 5s python server.py` for syntax checks, or the evaluation harness for real testing.

---

## Phase 3: Review and Refine

### 3.1 Code Quality Review

Before declaring implementation complete, verify:

- **DRY**: No copy-pasted code between tools — shared logic is extracted into functions
- **Composability**: API client, formatter, error handler are reusable functions
- **Consistency**: Similar tools return structurally similar responses
- **Error Handling**: Every external call has `try/except` with actionable messages
- **Type Safety**: Full type hints (Python) or no `any` (TypeScript)
- **Documentation**: Every tool docstring covers inputs, outputs, examples, errors

### 3.2 Safe Build Verification

```bash
# Python — syntax check without running server
python -m py_compile your_server.py && echo "✅ Syntax OK"

# TypeScript — build check
npm run build && echo "✅ Build OK"

# If you need to run the server for manual inspection, use tmux:
tmux new-session -d -s mcp "python your_server.py"
# Then connect your test client. Kill with: tmux kill-session -t mcp
```

### 3.3 Quality Checklist

Load the language-specific checklist:
- Python → "Quality Checklist" section in `reference/python_mcp_server.md`
- TypeScript → "Quality Checklist" section in `reference/node_mcp_server.md`

---

## Phase 4: Create and Run Evaluations

Evaluations test whether an LLM with **only your MCP tools** can answer realistic, complex questions. This is the true measure of server quality — not lines of code or endpoint coverage.

**Load `reference/evaluation.md` for the complete evaluation guide.**

### 4.1 Create 10 QA Pairs

Follow this process:
1. **Tool Inspection** — List all tools, read schemas and descriptions (no code reading)
2. **Content Exploration** — Use READ-ONLY tools to explore real data; use `limit < 10` for all calls
3. **Question Generation** — Create 10 complex, realistic questions
4. **Answer Verification** — Solve each question yourself using the tools to confirm the answer

**Question requirements (all must be met):**
- Independent (not dependent on other questions)
- Read-only / non-destructive operations only
- Complex: requires multiple (potentially dozens of) tool calls
- Stable: answer does not change over time (use historical/closed data)
- Verifiable: single clear answer checkable by string comparison
- Not keyword-searchable: requires synthesis, not a lookup

### 4.2 Run Evaluations with `scripts/evaluation.py`

```bash
# Install dependencies
pip install -r scripts/requirements.txt
export ANTHROPIC_API_KEY=your_key_here

# stdio server (script launches the server automatically)
python scripts/evaluation.py \
  -t stdio \
  -c python \
  -a my_server.py \
  -e API_KEY=abc123 \
  -o eval_report.md \
  my_evaluation.xml

# SSE server (start server first, then run)
python scripts/evaluation.py \
  -t sse \
  -u https://example.com/mcp \
  -H "Authorization: Bearer token123" \
  my_evaluation.xml

# HTTP server
python scripts/evaluation.py \
  -t http \
  -u https://example.com/mcp \
  -H "Authorization: Bearer token123" \
  my_evaluation.xml
```

**Full CLI reference:**
```
positional:
  eval_file              Path to XML evaluation file

options:
  -t, --transport        stdio | sse | http (default: stdio)
  -m, --model            Claude model (default: claude-3-7-sonnet-20250219)
  -o, --output           Save report to file (default: stdout)

stdio only:
  -c, --command          Command to run server (e.g., python, node)
  -a, --args             Server arguments (e.g., server.py)
  -e, --env              Env vars as KEY=VALUE

sse/http only:
  -u, --url              MCP server URL
  -H, --header           HTTP headers as 'Key: Value'
```

**Evaluation XML format:**
```xml
<evaluation>
  <qa_pair>
    <question>Find the project archived in Q3 2023 with the most forks before archival. What was its primary language?</question>
    <answer>Python</answer>
  </qa_pair>
</evaluation>
```

**Report output includes:**
- Accuracy (correct/total)
- Average task duration and tool calls per task
- Per-task: expected vs actual, correctness, tool call breakdown, agent feedback on your tools

### 4.3 Iteration Loop

Low accuracy → read agent feedback → improve tool descriptions/schemas → re-run → repeat.

Common fixes from low scores:
- Tool description too vague → add return value schema and usage examples
- Wrong data returned → add `response_format` support
- Pagination not working → verify `has_more` + `next_offset` fields
- Response too long → lower default limit, add filter guidance in truncation messages

---

## Reference Files

Load these **as needed** during development — do not pre-load all at once:

### Core (Load in Phase 1)
| File | Contents |
|------|----------|
| `reference/mcp_best_practices.md` | Naming conventions, tool design, response formats, pagination, character limits, transport options, OAuth/security, compliance |

### Language Guides (Load in Phase 2)
| File | Contents |
|------|----------|
| `reference/python_mcp_server.md` | FastMCP setup, Pydantic v2 patterns, async/await, Context injection, lifespan management, resources, quality checklist |
| `reference/node_mcp_server.md` | McpServer + `registerTool`, Zod schemas, strict TypeScript, package.json + tsconfig.json, quality checklist |

### Evaluation (Load in Phase 4)
| File | Contents |
|------|----------|
| `reference/evaluation.md` | Complete question/answer guidelines, stability rules, complexity requirements, XML format, process, examples of good vs poor questions |

### Scripts (Use Directly — Do Not Read Source Unless Necessary)
| File | Purpose | Usage |
|------|---------|-------|
| `scripts/evaluation.py` | Full evaluation harness — runs LLM agent against your server, generates report | `python scripts/evaluation.py --help` |
| `scripts/connections.py` | MCP connection factory (stdio/SSE/HTTP) — imported by evaluation.py | Not called directly |
| `scripts/requirements.txt` | Dependencies: `anthropic>=0.39.0`, `mcp>=1.1.0` | `pip install -r scripts/requirements.txt` |
| `scripts/example_evaluation.xml` | Sample XML with 5 math QA pairs showing correct format | Reference for XML structure |

**Script rule:** Run with `--help` first. Only read source if you have a specific customization need that `--help` cannot resolve.

---

## Security Checklist

Before shipping any MCP server:

- [ ] API keys in environment variables only — never hardcoded
- [ ] All inputs validated via Pydantic/Zod — no raw string passthrough to shell or SQL
- [ ] File paths sanitized — no `../` traversal possible
- [ ] Error messages do NOT expose internal stack traces or secrets to the client
- [ ] Rate limiting handled gracefully with actionable error messages
- [ ] `CHARACTER_LIMIT` enforced — no unbounded response sizes
- [ ] Tools annotated accurately: `destructiveHint: true` on anything that modifies state
- [ ] Stdio servers log to `stderr`, never `stdout`
- [ ] OAuth tokens scoped to minimum required permissions
- [ ] No data sent to third parties without disclosure in tool description
