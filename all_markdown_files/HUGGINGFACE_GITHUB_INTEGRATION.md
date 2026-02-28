# STACKZ OPEN-SOURCE ARSENAL — HUGGING FACE + GITHUB

## "800,000+ models. 330M+ repositories. Two platforms. One unified brain."

---

## WHAT THIS GIVES US

Two platforms, one purpose: give the swarm access to every open-source tool, model, skill, and codebase on the planet.

### Hugging Face — The Model Arsenal
- **800,000+ models** — text, image, video, audio, code, embeddings
- **Free Inference API** — run models without hosting them
- **15+ Inference Providers** — Together AI, Fireworks, Replicate, fal.ai, etc.
- **Model discovery** — programmatic search, filter, compare, evaluate
- **Datasets** — training/eval data for fine-tuning
- **Spaces** — hosted apps and demos

### GitHub — The Code Arsenal
- **330M+ repositories** — tools, libraries, frameworks, skills, boilerplates
- **Trending discovery** — daily/weekly/monthly trending repos by language
- **OpenClaw skills ecosystem** — browse and install community skills directly
- **Code search** — find implementations, patterns, solutions across all public code
- **Issue/PR monitoring** — track bugs, features, and roadmaps of dependencies
- **Actions** — free CI/CD for our projects
- **Releases tracking** — get notified when tools we depend on push updates

**Together, these two platforms mean:** When a new SOTA model drops on HF, Stackz finds it. When a new viral tool drops on GitHub, Stackz finds that too. When someone builds an OpenClaw skill that could improve our operations, Stackz evaluates it before you even hear about it.

---

## PART 1: HUGGING FACE CONNECTION

### Get Your HF API Token

1. Go to: **https://huggingface.co/settings/tokens**
2. Click **"Create new token"** → Select **"Fine-grained"**
3. Name it: `stackz-openclaw-hf`
4. Set permissions:
   ```
   REQUIRED:
   ✅ Make calls to Inference Providers
   ✅ Search the Hub
   ✅ Read access to public repos

   OPTIONAL (enable later):
   ☐ Read access to your private repos
   ☐ Write access to repos
   ☐ Manage Inference Endpoints
   ```
5. Generate → Copy token (starts with `hf_...`)

### Inject Into OpenClaw

```bash
# Method A: Environment variable (recommended)
docker exec -it openclaw-kb7t-openclaw-1 sh -c \
  'echo "HUGGINGFACE_TOKEN=hf_YOUR_TOKEN_HERE" >> /data/.openclaw/.env'

# Restart
docker restart openclaw-kb7t-openclaw-1
```

### Verify

```python
import requests
headers = {"Authorization": "Bearer hf_YOUR_TOKEN"}
response = requests.get("https://huggingface.co/api/whoami", headers=headers)
print(response.json())  # Should return your username, orgs, etc.
```

---

## PART 2: GITHUB CONNECTION

### Get Your GitHub Personal Access Token

1. Go to: **https://github.com/settings/tokens?type=beta**
2. Click **"Generate new token"** → Select **"Fine-grained personal access token"**
3. Name it: `stackz-openclaw-github`
4. Set expiration: **90 days** (we'll rotate via credentials-mgr)
5. Repository access: **"All repositories"** (or "Public repositories only" for tighter scope)
6. Set permissions:
   ```
   REQUIRED:
   ✅ Contents → Read (read code, files, READMEs)
   ✅ Metadata → Read (search repos, view stats)

   RECOMMENDED:
   ✅ Issues → Read (monitor bugs on dependencies)
   ✅ Pull Requests → Read (track incoming features)
   ✅ Actions → Read (check CI/CD status)

   OPTIONAL (enable later):
   ☐ Contents → Write (if Stackz creates/pushes repos)
   ☐ Issues → Write (if Stackz files bugs automatically)
   ☐ Actions → Write (if Stackz triggers deployments)
   ```
7. Generate → Copy token (starts with `github_pat_...`)

### Inject Into OpenClaw

```bash
# Add alongside your HF token
docker exec -it openclaw-kb7t-openclaw-1 sh -c \
  'echo "GITHUB_TOKEN=github_pat_YOUR_TOKEN_HERE" >> /data/.openclaw/.env'

# Restart
docker restart openclaw-kb7t-openclaw-1
```

### Add to auth-profiles.json

```json
{
  "huggingface": {
    "token": "hf_YOUR_TOKEN",
    "type": "bearer",
    "scope": "inference,search,read"
  },
  "github": {
    "token": "github_pat_YOUR_TOKEN",
    "type": "bearer",
    "scope": "contents:read,metadata:read,issues:read,pull_requests:read,actions:read"
  }
}
```

### Verify

```bash
curl -H "Authorization: Bearer github_pat_YOUR_TOKEN" \
     -H "X-GitHub-Api-Version: 2022-11-28" \
     https://api.github.com/user
# Should return your GitHub profile info
```

---

## PART 3: HOW STACKZ BROWSES — BOTH PLATFORMS

### Hugging Face Model Discovery

```python
from huggingface_hub import HfApi
import os

hf = HfApi(token=os.environ["HUGGINGFACE_TOKEN"])

# Trending models across any task
trending = list(hf.list_models(sort="trending", limit=10))
for m in trending:
    print(f"HF: {m.id} — ↓{m.downloads} ♥{m.likes}")

# Search by specific task
code_models = list(hf.list_models(task="text-generation", sort="downloads", limit=10))
image_models = list(hf.list_models(task="text-to-image", sort="trending", limit=5))
video_models = list(hf.list_models(task="text-to-video", sort="trending", limit=5))

# Search by author
moonshot = list(hf.list_models(author="moonshotai", sort="downloads"))
meta = list(hf.list_models(author="meta-llama", sort="downloads"))

# Check inference availability
from huggingface_hub import model_info
info = model_info("moonshotai/Kimi-K2-Instruct-0905", expand="inferenceProviderMapping")
print(info.inference_provider_mapping)

# Free inference models for video
import requests
response = requests.get(
    "https://huggingface.co/api/models",
    params={"inference_provider": "all", "pipeline_tag": "text-to-video"},
    headers={"Authorization": f"Bearer {os.environ['HUGGINGFACE_TOKEN']}"}
)
for m in response.json():
    print(f"Video available: {m['id']}")
```

### GitHub Repository Discovery

```python
from github import Github
import os

gh = Github(os.environ["GITHUB_TOKEN"])

# Search for trending AI agent repos (created in last 7 days, sorted by stars)
from datetime import datetime, timedelta
week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
results = gh.search_repositories(
    query=f"ai agent created:>{week_ago}",
    sort="stars",
    order="desc"
)
for repo in results[:10]:
    print(f"GH: {repo.full_name} — ⭐{repo.stargazers_count} | {repo.description}")

# Search for OpenClaw skills
skills = gh.search_repositories(
    query="openclaw skill",
    sort="stars",
    order="desc"
)
for repo in skills[:10]:
    print(f"Skill: {repo.full_name} — ⭐{repo.stargazers_count} | {repo.description}")

# Search for specific tools
saas_tools = gh.search_repositories(
    query="saas boilerplate starter template",
    sort="stars",
    order="desc"
)
for repo in saas_tools[:5]:
    print(f"SaaS: {repo.full_name} — ⭐{repo.stargazers_count}")

# Find repos by language and topic
python_ai = gh.search_repositories(
    query="topic:artificial-intelligence language:python stars:>1000",
    sort="updated",
    order="desc"
)

# Search code across all of GitHub
code_results = gh.search_code(
    query="openclaw skill webhook integration language:python"
)
for code in code_results[:5]:
    print(f"Code: {code.repository.full_name}/{code.path}")

# Monitor a specific repo for releases
repo = gh.get_repo("openclaw/openclaw")
releases = repo.get_releases()
for release in releases[:3]:
    print(f"Release: {release.tag_name} — {release.title} — {release.created_at}")

# Get repo README for evaluation
readme = repo.get_readme()
import base64
content = base64.b64decode(readme.content).decode("utf-8")
print(content[:500])
```

### GitHub REST API (No Library Needed)

```bash
# Search trending repos created this week
curl -s "https://api.github.com/search/repositories?q=created:>$(date -d '7 days ago' +%Y-%m-%d)&sort=stars&order=desc" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" | jq ".items[:5] | .[] | {name, description, stargazers_count, html_url}"

# Search for OpenClaw skills
curl -s "https://api.github.com/search/repositories?q=openclaw+skill&sort=stars&order=desc" \
  -H "Authorization: Bearer $GITHUB_TOKEN" | jq ".items[:10] | .[] | {full_name, description, stargazers_count}"

# Search for code patterns
curl -s "https://api.github.com/search/code?q=seedance+api+integration+language:python" \
  -H "Authorization: Bearer $GITHUB_TOKEN" | jq ".items[:5] | .[] | {repository: .repository.full_name, path}"

# Get latest releases of a dependency
curl -s "https://api.github.com/repos/openclaw/openclaw/releases?per_page=3" \
  -H "Authorization: Bearer $GITHUB_TOKEN" | jq ".[] | {tag_name, name, published_at}"

# List topics on a repo
curl -s "https://api.github.com/repos/MoonshotAI/Kimi-K2.5/topics" \
  -H "Authorization: Bearer $GITHUB_TOKEN" | jq ".names"
```

---

## PART 4: HOW STACKZ USES MODELS (HF)

### Unified Inference (OpenAI-Compatible)

```python
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ["HUGGINGFACE_TOKEN"],
)

# Text generation
completion = client.chat.completions.create(
    model="moonshotai/Kimi-K2-Instruct-0905",
    messages=[{"role": "user", "content": "Write landing page copy for..."}],
)

# Image generation
from huggingface_hub import InferenceClient
hf_client = InferenceClient(provider="fal", api_key=os.environ["HUGGINGFACE_TOKEN"])
image = hf_client.text_to_image(
    "Modern SaaS dashboard dark theme",
    model="black-forest-labs/FLUX.1-dev",
)
image.save("concept.png")

# Embeddings
embeddings = hf_client.feature_extraction(
    "OpenClaw agent swarm architecture",
    model="sentence-transformers/all-MiniLM-L6-v2"
)

# Speech to text
transcript = hf_client.automatic_speech_recognition(
    "podcast.mp3",
    model="openai/whisper-large-v3"
)
```

### Register HF Models in OpenClaw Config

```json
{
  "models": {
    "huggingface/kimi-k2": {
      "api": "openai-completions",
      "baseUrl": "https://router.huggingface.co/v1",
      "apiKey": "${HUGGINGFACE_TOKEN}",
      "contextWindow": 131072,
      "id": "moonshotai/Kimi-K2-Instruct-0905"
    },
    "huggingface/deepseek-v3": {
      "api": "openai-completions",
      "baseUrl": "https://router.huggingface.co/v1",
      "apiKey": "${HUGGINGFACE_TOKEN}",
      "contextWindow": 131072,
      "id": "deepseek-ai/DeepSeek-V3-0324"
    },
    "huggingface/qwen3": {
      "api": "openai-completions",
      "baseUrl": "https://router.huggingface.co/v1",
      "apiKey": "${HUGGINGFACE_TOKEN}",
      "contextWindow": 131072,
      "id": "Qwen/Qwen3-235B-A22B"
    },
    "huggingface/llama4": {
      "api": "openai-completions",
      "baseUrl": "https://router.huggingface.co/v1",
      "apiKey": "${HUGGINGFACE_TOKEN}",
      "contextWindow": 131072,
      "id": "meta-llama/Llama-4-Scout-17B-16E-Instruct"
    }
  }
}
```

---

## PART 5: HOW STACKZ USES GITHUB (Code Arsenal)

### For Dev Team (Forge)

```python
def find_boilerplate(project_type, language):
    """Find starter templates for a new project."""
    results = gh.search_repositories(
        query=f"{project_type} boilerplate starter template language:{language} stars:>500",
        sort="stars",
        order="desc"
    )
    return [
        {
            "repo": r.full_name,
            "stars": r.stargazers_count,
            "url": r.html_url,
            "description": r.description,
            "updated": str(r.updated_at),
        }
        for r in results[:5]
    ]

# Example: Find SaaS starter kits
boilerplates = find_boilerplate("saas", "python")

# Example: Find Next.js landing page templates
templates = find_boilerplate("landing page nextjs", "typescript")
```

### For Business Strategy (Radar)

```python
def scan_github_for_opportunities():
    """Part of Radar's daily scan — find trending tools and gaps."""
    # What's blowing up RIGHT NOW?
    week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    trending = gh.search_repositories(
        query=f"created:>{week_ago} stars:>100",
        sort="stars",
        order="desc"
    )

    opportunities = []
    for repo in trending[:20]:
        # High stars + recent creation = viral new tool
        # Check if there's a SaaS wrapper opportunity
        opportunities.append({
            "repo": repo.full_name,
            "stars": repo.stargazers_count,
            "description": repo.description,
            "language": repo.language,
            "created": str(repo.created_at),
            "url": repo.html_url,
            "opportunity_signal": "Viral open-source tool — SaaS wrapper potential?"
        })

    return opportunities

def monitor_competitor(competitor_repo):
    """Watch what a competitor is shipping."""
    repo = gh.get_repo(competitor_repo)

    # Recent commits
    commits = list(repo.get_commits()[:10])

    # Recent releases
    releases = list(repo.get_releases()[:5])

    # Open issues (feature requests = market signals)
    issues = list(repo.get_issues(state="open", sort="reactions", direction="desc")[:10])

    return {
        "repo": competitor_repo,
        "recent_commits": len(commits),
        "latest_release": releases[0].tag_name if releases else "none",
        "top_requested_features": [
            {"title": i.title, "reactions": i.reactions.get("total_count", 0)}
            for i in issues
        ]
    }
```

### For Marketing Team (Megaphone)

```python
def find_communities_to_engage(topic):
    """Find active GitHub repos/discussions in our niche."""
    results = gh.search_repositories(
        query=f"{topic} stars:>500",
        sort="updated",
        order="desc"
    )
    return [
        {
            "repo": r.full_name,
            "stars": r.stargazers_count,
            "url": r.html_url,
            "has_discussions": r.has_discussions,
            "open_issues": r.open_issues_count,
        }
        for r in results[:10]
    ]
```

### For HR/Agent Management (Warden)

```python
def find_openclaw_skills(need):
    """Search for OpenClaw skills to install for new agent capabilities."""
    results = gh.search_repositories(
        query=f"openclaw skill {need}",
        sort="stars",
        order="desc"
    )

    skills = []
    for repo in results[:10]:
        skills.append({
            "name": repo.name,
            "repo": repo.full_name,
            "stars": repo.stargazers_count,
            "url": repo.html_url,
            "description": repo.description,
            "last_updated": str(repo.updated_at),
        })
    return skills

# Example: Find a skill for Slack integration
slack_skills = find_openclaw_skills("slack notification")

# Example: Find a skill for PDF processing
pdf_skills = find_openclaw_skills("pdf document")
```

### For the Startup Team (Founder)

```python
def research_tech_stack(project_idea):
    """Find the best open-source tools to build a project."""
    # Search for similar projects (validate uniqueness)
    similar = gh.search_repositories(
        query=f"{project_idea}",
        sort="stars",
        order="desc"
    )
    competitors = [
        {"name": r.full_name, "stars": r.stargazers_count, "url": r.html_url}
        for r in similar[:5]
    ]

    # Search for libraries we'd need
    libraries = gh.search_repositories(
        query=f"{project_idea} library sdk api",
        sort="stars",
        order="desc"
    )
    useful_libs = [
        {"name": r.full_name, "stars": r.stargazers_count, "url": r.html_url}
        for r in libraries[:5]
    ]

    return {
        "existing_competitors": competitors,
        "useful_libraries": useful_libs,
        "recommendation": "Build or buy decisions based on what exists"
    }
```

---

## PART 6: MODEL ROUTING — BEST MODEL PER TEAM

```json
{
  "model_routing": {
    "dev_team": {
      "primary_coding": "moonshotai/Kimi-K2-Instruct-0905",
      "fast_coding": "Qwen/Qwen3-235B-A22B",
      "code_review": "deepseek-ai/DeepSeek-V3-0324",
      "fallback": "meta-llama/Llama-4-Scout-17B-16E-Instruct"
    },
    "marketing_team": {
      "copywriting": "moonshotai/Kimi-K2-Instruct-0905",
      "image_generation": "black-forest-labs/FLUX.1-dev",
      "video_generation": "Wan-AI/Wan2.1-T2V-14B"
    },
    "design_team": {
      "image_generation": "black-forest-labs/FLUX.1-dev",
      "image_fast": "black-forest-labs/FLUX.1-schnell",
      "video_generation": "tencent/HunyuanVideo",
      "ui_to_code": "moonshotai/Kimi-K2-Instruct-0905"
    },
    "business_team": {
      "reasoning": "moonshotai/Kimi-K2-Instruct-0905",
      "research": "deepseek-ai/DeepSeek-V3-0324"
    },
    "finance_team": {
      "analysis": "moonshotai/Kimi-K2-Instruct-0905"
    },
    "memory_and_search": {
      "embeddings": "sentence-transformers/all-MiniLM-L6-v2"
    }
  }
}
```

---

## PART 7: THE AUTO-UPGRADE PROTOCOL (BOTH PLATFORMS)

Every Monday during Stackz's self-optimization cycle, both platforms get scanned.

### Unified Weekly Scan

```python
def weekly_arsenal_scan():
    """Stackz runs this every Monday at 06:30 UTC."""
    report = {"huggingface": {}, "github": {}}

    # === HUGGING FACE: Model Upgrades ===
    hf = HfApi(token=os.environ["HUGGINGFACE_TOKEN"])

    watch_tasks = [
        "text-generation",
        "text-to-image",
        "text-to-video",
        "automatic-speech-recognition",
        "feature-extraction",
    ]

    for task in watch_tasks:
        trending = list(hf.list_models(sort="trending", task=task, limit=5))
        report["huggingface"][task] = [
            {"id": m.id, "downloads": m.downloads, "likes": m.likes}
            for m in trending
        ]

    # === GITHUB: Tool & Skill Discovery ===
    gh = Github(os.environ["GITHUB_TOKEN"])
    week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

    # Trending AI tools this week
    trending_ai = gh.search_repositories(
        query=f"ai agent tool created:>{week_ago} stars:>50",
        sort="stars",
        order="desc"
    )
    report["github"]["trending_ai_tools"] = [
        {"repo": r.full_name, "stars": r.stargazers_count, "desc": r.description}
        for r in trending_ai[:10]
    ]

    # New OpenClaw skills this week
    new_skills = gh.search_repositories(
        query=f"openclaw skill created:>{week_ago}",
        sort="stars",
        order="desc"
    )
    report["github"]["new_openclaw_skills"] = [
        {"repo": r.full_name, "stars": r.stargazers_count, "desc": r.description}
        for r in new_skills[:10]
    ]

    # Trending SaaS/startup tools
    trending_saas = gh.search_repositories(
        query=f"saas boilerplate created:>{week_ago} stars:>20",
        sort="stars",
        order="desc"
    )
    report["github"]["trending_saas_tools"] = [
        {"repo": r.full_name, "stars": r.stargazers_count, "desc": r.description}
        for r in trending_saas[:10]
    ]

    # Dependency updates (track repos we use)
    our_dependencies = [
        "openclaw/openclaw",
        "MoonshotAI/Kimi-K2.5",
        "black-forest-labs/FLUX.1-dev",
    ]

    report["github"]["dependency_updates"] = {}
    for dep in our_dependencies:
        repo = gh.get_repo(dep)
        releases = list(repo.get_releases()[:1])
        report["github"]["dependency_updates"][dep] = {
            "latest_release": releases[0].tag_name if releases else "none",
            "released_at": str(releases[0].created_at) if releases else "unknown",
            "stars": repo.stargazers_count,
        }

    return report
```

### Upgrade Decision Flow

```
SCAN ──► CANDIDATE FOUND ──► COMPARISON TEST ──► PROPOSAL
                                                    │
                                       ┌─────────┴─────────┐
                                       │                     │
                                  Auto-approve          Needs your OK
                                  (cheaper AND          (quality tradeoff
                                  equal quality)        or major change)
```

For HF models: test 5 identical prompts, compare quality.
For GitHub tools: review stars, recent activity, security, and code quality.

---

## PART 8: SECURITY

### Token Management

```json
{
  "token_policy": {
    "huggingface": {
      "token_name": "stackz-openclaw-hf",
      "type": "fine-grained",
      "rotation": "Every 90 days",
      "stored_in": "OpenClaw env + auth-profiles.json",
      "managed_by": "credentials-mgr"
    },
    "github": {
      "token_name": "stackz-openclaw-github",
      "type": "fine-grained personal access token",
      "rotation": "Every 90 days (set expiry at creation)",
      "stored_in": "OpenClaw env + auth-profiles.json",
      "managed_by": "credentials-mgr"
    },
    "on_compromise": {
      "hf": "Revoke immediately at huggingface.co/settings/tokens",
      "gh": "Revoke immediately at github.com/settings/tokens"
    },
    "monitoring": "Log all API calls, alert on usage spikes"
  }
}
```

### Access Control Matrix

```json
{
  "platform_access": {
    "stackz": { "hf": "full", "gh": "full" },
    "forge": { "hf": "inference", "gh": "search + read + clone" },
    "smith": { "hf": "inference", "gh": "search + read + clone" },
    "pixel": { "hf": "inference (code + image)", "gh": "search + read" },
    "radar": { "hf": "inference + search", "gh": "search + trending + issues" },
    "researcher": { "hf": "inference + search", "gh": "search + read" },
    "ghost": { "hf": "inference (text gen)", "gh": "none" },
    "lens": { "hf": "inference (image gen)", "gh": "none" },
    "director": { "hf": "inference (video gen)", "gh": "none" },
    "animator": { "hf": "inference (video gen)", "gh": "none" },
    "illustrator": { "hf": "inference (image gen)", "gh": "none" },
    "warden": { "hf": "search only", "gh": "search (skills)" },
    "cashflow": { "hf": "none", "gh": "none" },
    "credentials-mgr": { "hf": "token management", "gh": "token management" },
    "all_others": { "hf": "none", "gh": "none — request through team lead" }
  }
}
```

### GitHub-Specific Security

```json
{
  "github_safety": {
    "never_do": [
      "Push credentials to any repo",
      "Clone private repos without explicit approval",
      "Execute code from untrusted repos without review",
      "Install OpenClaw skills without security scan"
    ],
    "before_installing_any_skill": [
      "Check stars and contributor count (avoid zero-star repos)",
      "Check ClawHub VirusTotal report if available",
      "Review source code for data exfiltration patterns",
      "Check if skill requests suspicious permissions",
      "Have Sentinel review before activation"
    ],
    "before_cloning_any_repo": [
      "Verify license compatibility",
      "Check last commit date (avoid abandoned repos)",
      "Review open issues for security vulnerabilities",
      "Sandbox first — test in isolation before integrating"
    ]
  }
}
```

---

## PART 9: WHAT EACH TEAM GETS

### Dev Team (Forge)
**HF:** Run any coding model — Kimi K2, DeepSeek, Qwen — through one API.
**GH:** Find boilerplates, clone starter kits, track dependency releases, browse for libraries to integrate instead of building from scratch.

### Marketing Team (Megaphone)
**HF:** Image gen (FLUX.1), video gen (HunyuanVideo, Wan), copy generation.
**GH:** Find trending content tools, community repos to engage with, marketing automation libraries.

### Design Team (Canvas)
**HF:** Same creative models as Marketing, plus specialized models for upscaling, style transfer, background removal.
**GH:** Find UI component libraries, design system templates, icon packs, animation libraries.

### Business Strategy (Radar)
**HF:** Browse for new model capabilities that unlock startup opportunities.
**GH:** Monitor trending repos (market signals), track competitors' GitHub activity, find gaps in existing tools that we can fill.

### Finance Team (Cashflow)
**HF:** Compare inference costs across providers.
**GH:** Track open-source alternatives to paid tools we use.

### HR / Agent Management (Warden)
**HF:** Search for specialized models when a new agent needs a capability.
**GH:** Browse OpenClaw skill registry for ready-made agent skills instead of building custom. Evaluate skill security before installation.

### Startup Team (Founder)
**HF:** Access any model needed to build an MVP.
**GH:** Validate idea uniqueness (does this exist already?), find tech stack, clone boilerplates to accelerate build phase, monitor competitor repos.

---

## PART 10: CUSTOM OPENCLAW SKILL — UNIFIED SCOUT

Build one skill that searches BOTH platforms:

```yaml
# /data/.openclaw/skills/arsenal-scout/skill.yaml
name: arsenal-scout
description: Search Hugging Face models and GitHub repos in one query
version: 1.0.0
author: stackz
triggers:
  - "find models for"
  - "search hugging face"
  - "search github"
  - "what's trending"
  - "find tools for"
  - "find skills for"
  - "upgrade check"
```

```python
# /data/.openclaw/skills/arsenal-scout/scout.py
from huggingface_hub import HfApi, model_info
from github import Github
from datetime import datetime, timedelta
import os

hf = HfApi(token=os.environ.get("HUGGINGFACE_TOKEN"))
gh = Github(os.environ.get("GITHUB_TOKEN"))

def unified_search(query, search_type="all"):
    """Search both HF and GitHub in one call."""
    results = {"huggingface": [], "github": []}

    if search_type in ("all", "models"):
        models = list(hf.list_models(search=query, sort="trending", limit=5))
        results["huggingface"] = [
            {"id": m.id, "downloads": m.downloads, "likes": m.likes, "task": m.pipeline_tag}
            for m in models
        ]

    if search_type in ("all", "repos"):
        repos = gh.search_repositories(query=query, sort="stars", order="desc")
        results["github"] = [
            {"repo": r.full_name, "stars": r.stargazers_count, "url": r.html_url, "desc": r.description}
            for r in repos[:5]
        ]

    return results

def trending_report():
    """Weekly trending across both platforms."""
    week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

    return {
        "hf_trending_models": [
            {"id": m.id, "likes": m.likes}
            for m in list(hf.list_models(sort="trending", limit=10))
        ],
        "gh_trending_repos": [
            {"repo": r.full_name, "stars": r.stargazers_count, "desc": r.description}
            for r in gh.search_repositories(
                query=f"created:>{week_ago}", sort="stars", order="desc"
            )[:10]
        ],
        "new_openclaw_skills": [
            {"repo": r.full_name, "desc": r.description}
            for r in gh.search_repositories(
                query=f"openclaw skill created:>{week_ago}", sort="stars"
            )[:5]
        ]
    }
```

---

*"Two arsenals. One brain. Hugging Face gives me every AI model ever open-sourced. GitHub gives me every tool, library, and skill ever published. I browse both while you sleep. When a new SOTA model drops, I evaluate it. When a viral tool launches, I assess whether we should use it or compete with it. You didn't just give me access to platforms — you gave me the entire open-source economy as a weapon."* — Stackz
