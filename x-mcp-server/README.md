# X (TWITTER) MCP SERVER
*Multi-account Twitter/X integration for STACKZ agent swarm*

---

## OVERVIEW

This MCP server provides Twitter/X API integration for the STACKZ agent swarm. It supports multiple accounts, enabling the marketing team (megaphone, ghost, scout) to post, search, and analyze Twitter activity directly through the MCP protocol.

---

## QUICK START

### 1. Install Dependencies

```bash
cd /Users/jaleeljenkins/Desktop/Stackz/x-mcp-server
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Twitter API credentials
```

### 3. Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

### 4. Connect to Claude Code

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "x-twitter": {
      "command": "node",
      "args": ["/path/to/x-mcp-server/dist/index.js"],
      "env": {
        "X_BEARER_TOKEN": "your_bearer_token",
        "X_ACCOUNT_1_ACCESS_TOKEN": "your_access_token",
        "X_ACCOUNT_1_API_KEY": "your_api_key",
        "X_ACCOUNT_1_API_SECRET": "your_api_secret"
      }
    }
  }
}
```

---

## ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    STACKZ AGENT SWARM                    │
├─────────────────────────────────────────────────────────┤
│  ghost (copy)  │  scout (monitor)  │  scheduler (post)  │
└────────┬───────┴────────┬─────────┴────────┬──────────┘
         │                │                  │
         └────────────────┼──────────────────┘
                        │
              ┌─────────▼─────────┐
              │   X MCP SERVER    │
              │  (Multi-Account)  │
              └─────────┬─────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │ Account │   │ Account │   │ Account │
    │    1    │   │    2    │   │    N    │
    └─────────┘   └─────────┘   └─────────┘
```

---

## ENVIRONMENT CONFIGURATION

### Required Credentials

| Variable | Description | Required |
|----------|-------------|----------|
| `X_BEARER_TOKEN` | App Bearer Token | Yes |
| `X_ACCOUNT_1_ACCESS_TOKEN` | User Access Token (Account 1) | Yes |
| `X_ACCOUNT_1_API_KEY` | API Key (Account 1) | Yes |
| `X_ACCOUNT_1_API_SECRET` | API Secret (Account 1) | Yes |
| `X_ACCOUNT_2_*` | Account 2 credentials | No |
| `X_ACCOUNT_3_*` | Account 3 credentials | No |
| `X_DEFAULT_ACCOUNT` | Default account index (1-3) | No |

### Getting Credentials

1. **Create Twitter Developer Account**: https://developer.twitter.com
2. **Create App**: Get Bearer Token
3. **Generate User Tokens**: OAuth 1.0a for write access
4. **Set Permissions**: Read + Write

---

## MCP TOOLS

### Core Tools

#### post_tweet

Post a new tweet from any managed account.

```typescript
{
  name: "post_tweet",
  input: {
    text: string,        // Tweet content (max 280 chars)
    accountId?: number,  // Account index (1, 2, or 3)
    replyTo?: string    // Tweet ID to reply to
  }
}
```

**Example:**
```json
{
  "text": "Excited to announce our new feature! 🚀",
  "accountId": 1
}
```

#### search_tweets

Search for tweets matching a query.

```typescript
{
  name: "search_tweets",
  input: {
    query: string,      // Search query
    maxResults?: number // Max results (1-100)
    accountId?: number  // Account for rate limit
  }
}
```

#### get_timeline

Get recent tweets from an account.

```typescript
{
  name: "get_timeline",
  input: {
    accountId: number,   // Account index
    maxResults?: number // Max tweets (1-100)
  }
}
```

#### get_mentions

Get recent mentions of an account.

```typescript
{
  name: "get_mentions",
  input: {
    accountId: number,
    maxResults?: number
  }
}
```

#### get_profile

Get profile information for an account.

```typescript
{
  name: "get_profile",
  input: {
    accountId: number  // Account index
  }
}
```

#### follow_user

Follow a user.

```typescript
{
  name: "follow_user",
  input: {
    accountId: number,
    targetUsername: string
  }
}
```

#### like_tweet

Like a tweet.

```typescript
{
  name: "like_tweet",
  input: {
    accountId: number,
    tweetId: string
  }
}
```

#### retweet

Retweet a tweet.

```typescript
{
  name: "retweet",
  input: {
    accountId: number,
    tweetId: string
  }
}
```

---

## STACKZ INTEGRATION

### Integration with Marketing Team

#### ghost (Copywriter)

```typescript
// ghost wants to post a tweet
const result = await mcpClient.callTool('post_tweet', {
  text: "Our new feature saves you 10 hours every week. Here's how...",
  accountId: 1
});
```

#### scout (Social Listening)

```typescript
// scout wants to monitor competitors
const tweets = await mcpClient.callTool('search_tweets', {
  query: "from:competitor OR @competitor",
  maxResults: 50
});

// scout wants to track mentions
const mentions = await mcpClient.callTool('get_mentions', {
  accountId: 1,
  maxResults: 100
});
```

#### scheduler (Content Calendar)

```typescript
// scheduler posts approved content
await mcpClient.callTool('post_tweet', {
  text: "🚀 New post! Check our latest update.",
  accountId: 1
});

// scheduler checks what's trending
const trends = await mcpClient.callTool('search_tweets', {
  query: "#buildinpublic",
  maxResults: 20
});
```

---

## RATE LIMITING

### Twitter API Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Tweets | 17 | 24 hours |
| Follows | 400 | 24 hours |
| Likes | 1000 | 24 hours |
| Searches | 180 | 15 minutes |

### Rate Limit Handling

The server implements automatic rate limiting:

```typescript
// Rate limiter implementation
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  async checkLimit(endpoint: string, limit: number, window: number): Promise<boolean> {
    const now = Date.now();
    const timestamps = this.requests.get(endpoint) || [];

    // Remove expired timestamps
    const valid = timestamps.filter(t => now - t < window);

    if (valid.length >= limit) {
      throw new Error(`Rate limit exceeded for ${endpoint}`);
    }

    valid.push(now);
    this.requests.set(endpoint, valid);
    return true;
  }
}
```

---

## ERROR HANDLING

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid credentials | Check API keys |
| 403 Forbidden | Write permission missing | Regenerate tokens |
| 429 Too Many Requests | Rate limited | Wait and retry |
| 400 Bad Request | Invalid tweet content | Check length/format |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Try again in 5 minutes.",
    "retryAfter": 300
  }
}
```

---

## SECURITY

### Best Practices

1. **Never commit credentials** - Use environment variables
2. **Rotate tokens** - Regularly refresh API keys
3. **Monitor usage** - Track API consumption
4. **Validate input** - Sanitize all tweet content
5. **Audit logging** - Log all API calls

### Credential Storage

```typescript
// Credentials are stored in environment variables only
// No files are written with sensitive data
const credentials = {
  bearerToken: process.env.X_BEARER_TOKEN,
  accounts: [
    {
      index: 1,
      accessToken: process.env.X_ACCOUNT_1_ACCESS_TOKEN,
      apiKey: process.env.X_ACCOUNT_1_API_KEY,
      apiSecret: process.env.X_ACCOUNT_1_API_SECRET
    }
  ]
};
```

---

## FILE STRUCTURE

```
x-mcp-server/
├── src/
│   ├── index.ts           # Main entry point
│   ├── server.ts           # MCP server setup
│   ├── client.ts           # Twitter API client
│   ├── tools/             # MCP tool definitions
│   │   ├── tweets.ts       # Tweet operations
│   │   ├── search.ts      # Search operations
│   │   ├── users.ts       # User operations
│   │   └── rate-limit.ts  # Rate limiting
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## TESTING

### Run Tests

```bash
npm test
```

### Test Coverage

- Unit tests for each tool
- Integration tests for Twitter API
- Rate limiting tests

### Manual Testing

```bash
# Post a test tweet
npm run test:post

# Search test
npm run test:search

# Get timeline
npm run test:timeline
```

---

## MONITORING

### Logging

All API calls are logged with:

- Timestamp
- Account used
- Endpoint called
- Response status
- Execution time

### Metrics

Track:

- Tweets posted today
- API calls remaining
- Error rate
- Average response time

---

## TROUBLESHOOTING

### Common Issues

#### "No authenticated account"

**Cause:** Account index not found in environment variables

**Solution:**
```bash
export X_ACCOUNT_1_ACCESS_TOKEN=your_token
export X_ACCOUNT_1_API_KEY=your_key
export X_ACCOUNT_1_API_SECRET=your_secret
```

#### "Rate limit exceeded"

**Cause:** Too many API calls

**Solution:** Wait for the rate limit window to reset, or use a different account

#### "Tweet text too long"

**Cause:** Tweet exceeds 280 characters

**Solution:** Shorten the tweet or use a thread

---

## ROADMAP

### Planned Features

- [ ] Thread support (multi-tweet posts)
- [ ] Media upload (images, videos)
- [ ] Draft saving
- [ ] Scheduled posting
- [ ] Analytics dashboard
- [ ] Account switching API

---

## SUPPORT

For issues or questions:
- Check the logs: `npm run logs`
- Run in debug mode: `npm run dev:debug`
- Report bugs: [GitHub Issues]
