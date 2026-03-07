# OPENCLAW → CLAUDE CODE MIGRATION GUIDE
*Converting STACKZ from OpenClaw to Claude Code tooling*

---

## OVERVIEW

This guide documents the migration path from OpenClaw-specific functionality to Claude Code equivalents. The goal is to maintain all current capabilities while leveraging Claude Code's native features.

---

## MAPPING TABLE

| OpenClaw Feature | Claude Code Equivalent | Status |
|-----------------|----------------------|--------|
| OpenClaw Cron | Claude Code scheduled tasks | To implement |
| OpenClaw spreadsheet skill | Claude Code data management | To implement |
| OpenClaw x-engagement | Claude Code Twitter MCP | To implement |
| OpenClaw agent runtime | Claude Code agent management | Native |
| OpenClaw Lane Queue | Claude Code Task API | Native |
| OpenClaw skill system | Claude Code Skills | Native |

---

## OPENCLAW CRON → CLAUDE CODE SCHEDULED TASKS

### Current OpenClaw Usage

```yaml
# OpenClaw Cron - example
schedules:
  - name: daily-scan
    cron: "0 6 * * *"
    task: analyst-scan
  - name: weekly-report
    cron: "0 12 * * 0"
    task: generate-report
```

### Claude Code Migration

```typescript
// Claude Code scheduled task implementation
const scheduledTasks = {
  tasks: [
    {
      id: 'daily-scan',
      schedule: { cron: '0 6 * * *' },
      handler: async (context) => {
        await runAgent('analyst', 'scan-opportunities');
      },
      enabled: true
    },
    {
      id: 'weekly-report',
      schedule: { cron: '0 12 * * 0' },
      handler: async (context) => {
        await generateWeeklyReport();
      },
      enabled: true
    }
  ]
};
```

### Implementation

```typescript
// scheduler.ts - Claude Code task scheduler
import { TaskScheduler } from '@anthropic-ai/sdk';

class STACKZScheduler {
  private scheduler: TaskScheduler;

  constructor() {
    this.scheduler = new TaskScheduler({
      timezone: 'UTC'
    });
  }

  async scheduleTask(task: ScheduledTask): Promise<string> {
    return this.scheduler.create({
      schedule: task.cron,
      handler: task.handler
    });
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.scheduler.cancel(taskId);
  }

  async listTasks(): Promise<ScheduledTask[]> {
    return this.scheduler.list();
  }
}
```

---

## SPREADSHEET SKILL → DATA MANAGEMENT

### Current OpenClaw Usage

```yaml
# OpenClaw spreadsheet - ledger tracking
skills:
  - name: spreadsheet
    config:
      file: ledger/transactions.json
      operations:
        - read
        - write
        - query
```

### Claude Code Migration

```typescript
// data-manager.ts - Claude Code data management
import { promises as fs } from 'fs';
import path from 'path';

class DataManager {
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  async readJSON(file: string): Promise<any> {
    const content = await fs.readFile(
      path.join(this.dataDir, file),
      'utf-8'
    );
    return JSON.parse(content);
  }

  async writeJSON(file: string, data: any): Promise<void> {
    await fs.writeFile(
      path.join(this.dataDir, file),
      JSON.stringify(data, null, 2)
    );
  }

  async queryJSON(file: string, filter: QueryFilter): Promise<any[]> {
    const data = await this.readJSON(file);
    return this.applyFilter(data, filter);
  }

  private applyFilter(data: any[], filter: QueryFilter): any[] {
    return data.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  }
}
```

---

## X-ENGAGEMENT → TWITTER MCP

### Current OpenClaw Usage

```yaml
# OpenClaw x-engagement skill
skills:
  - name: x-engagement
    config:
      accounts:
        - stackz_main
        - stackz_updates
      operations:
        - post
        - reply
        - search
        - analyze
```

### Claude Code Migration

```typescript
// twitter-mcp.ts - Twitter MCP integration
import { TwitterClient } from './twitter-client';

class XEngagement {
  private client: TwitterClient;

  constructor(credentials: TwitterCredentials) {
    this.client = new TwitterClient(credentials);
  }

  async postTweet(account: string, content: string): Promise<Tweet> {
    return this.client.v2.tweet(account, { text: content });
  }

  async replyTo(tweetId: string, content: string): Promise<Tweet> {
    return this.client.v2.tweet(account, {
      text: content,
      reply: { in_reply_to_tweet_id: tweetId }
    });
  }

  async search(query: string, options?: SearchOptions): Promise<Tweet[]> {
    return this.client.v2.search(query, options);
  }

  async analyzeAccount(username: string): Promise<AccountAnalysis> {
    const [tweets, metrics, following] = await Promise.all([
      this.client.v2.userTimeline(username),
      this.client.v2.userMetrics(username),
      this.client.v2.following(username)
    ]);
    return this.analyze(username, tweets, metrics, following);
  }
}
```

### MCP Server Integration

```typescript
// Twitter MCP server - runs as separate process
import { McpServer, Tool } from '@modelcontextprotocol/sdk/server/mcp.js';

const twitterMcp = new McpServer('twitter-integration');

twitterMcp.tool('post_tweet', async ({ text, account }) => {
  const client = getAccountClient(account);
  return await client.v2.tweet({ text });
});

twitterMcp.tool('search_tweets', async ({ query, count }) => {
  const client = getDefaultClient();
  return await client.v2.search(query, { max_results: count });
});

twitterMcp.tool('get_engagement', async ({ username }) => {
  const client = getDefaultClient();
  const metrics = await client.v2.userMetrics(username);
  return metrics;
});
```

---

## AGENT RUNTIME → NATIVE

### Current OpenClaw Usage

```yaml
# OpenClaw agent runtime configuration
agents:
  - name: radar
    model: kimi-k2.5
    config:
      thinking: true
      temperature: 0.7
      max_tokens: 8192
    capabilities:
      - web-search
      - file-read
      - file-write
```

### Claude Code Native Equivalent

```typescript
// Claude Code agent - native
const agent = {
  name: 'radar',
  model: 'claude-sonnet-4-20250514',
  config: {
    thinking: { type: 'enabled', budget_tokens: 12000 },
    temperature: 0.7,
    max_tokens: 8192
  },
  capabilities: [
    'web-search',
    'file-read',
    'file-write',
    'mcp-tools'
  ]
};

// Agent management is native to Claude Code
await claude.agents.create(agent);
await claude.agents.invoke(agent.name, task);
```

---

## LANE QUEUE → TASK API

### Current OpenClaw Usage

```yaml
# OpenClaw Lane Queue
queues:
  - name: high-priority
    priority: 1
    agents: [radar, forge]
  - name: default
    priority: 5
    agents: [*]
  - name: background
    priority: 10
    agents: [ledger, scheduler]
```

### Claude Code Native Equivalent

```typescript
// Task routing - native to Claude Code
const laneQueue = {
  lanes: [
    { name: 'high-priority', priority: 1, workers: ['radar', 'forge'] },
    { name: 'default', priority: 5, workers: 'any' },
    { name: 'background', priority: 10, workers: ['ledger', 'scheduler'] }
  ],

  async enqueue(task: Task, lane: string): Promise<string> {
    const laneConfig = this.lanes.find(l => l.name === lane);
    const worker = this.selectWorker(laneConfig.workers);
    return await this.dispatch(worker, task);
  }
};

// Native priority handling
await claude.tasks.create({
  priority: lane === 'high-priority' ? 'urgent' : 'normal',
  handler: taskHandler,
  timeout: 300000
});
```

---

## SKILL SYSTEM → CLAUDE CODE SKILLS

### Current OpenClaw Usage

```yaml
# OpenClaw skill definition
skills:
  - name: twitter-algorithm-optimizer
    triggers:
      - "optimize tweet"
      - "improve tweet"
      - "make viral"
    handler: twitter-optimizer.ts
    config:
      max_retries: 3
```

### Claude Code Migration

```typescript
// Skill definition in Claude Code
import { Skill } from '@anthropic-ai/sdk';

const twitterOptimizerSkill = new Skill({
  name: 'twitter-algorithm-optimizer',
  triggers: [
    'optimize tweet',
    'improve tweet',
    'make viral',
    'debug tweet',
    'analyze tweet'
  ],
  handler: async (trigger, context) => {
    const tweetContent = context.message;
    const optimized = await optimizeForAlgorithm(tweetContent);
    return optimized;
  },
  config: {
    maxRetries: 3,
    timeout: 30000
  }
});

// Register skill
await claude.skills.register(twitterOptimizerSkill);
```

---

## MIGRATION CHECKLIST

### Phase 1: Foundation
- [ ] Set up Claude Code project
- [ ] Configure agent definitions
- [ ] Test native capabilities

### Phase 2: Scheduled Tasks
- [ ] Implement task scheduler
- [ ] Migrate cron jobs
- [ ] Test reliability

### Phase 3: Data Management
- [ ] Build data manager
- [ ] Migrate ledger
- [ ] Migrate metrics storage

### Phase 4: External Integrations
- [ ] Set up Twitter MCP server
- [ ] Test posting/replying
- [ ] Migrate x-engagement workflows

### Phase 5: Agent Runtime
- [ ] Migrate agent configurations
- [ ] Test task dispatch
- [ ] Verify Lane Queue equivalent

### Phase 6: Skills
- [ ] Migrate skill definitions
- [ ] Test skill triggers
- [ ] Verify functionality

### Phase 7: Cutover
- [ ] Run parallel systems
- [ ] Validate outputs match
- [ ] Switch to Claude Code
- [ ] Decommission OpenClaw

---

## ROLLBACK PLAN

If migration fails:

1. **Keep OpenClaw running** as backup
2. **Identify failure point** via logs
3. **Fix and retry** specific phase
4. **Escalate** if systemic issue

---

## VALIDATION

### Test Criteria

| Component | Validation |
|----------|------------|
| Scheduled Tasks | Output matches OpenClaw |
| Data Management | Read/write integrity |
| Twitter MCP | Posts appear correctly |
| Agent Runtime | Task completion rates match |
| Skills | Trigger accuracy > 99% |
