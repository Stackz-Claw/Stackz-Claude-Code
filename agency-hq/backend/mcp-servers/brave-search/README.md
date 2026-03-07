# Brave Search MCP Server

Web search capabilities for your agents using Brave Search API.

## Quick Start

1. **Get a free API key** at https://brave.com/search/api/

2. **Add to your backend `.env`:**
   ```
   BRAVE_API_KEY=your_api_key_here
   ```

3. **Install dependencies:**
   ```bash
   cd agency-hq/backend/mcp-servers/brave-search
   npm install
   ```

4. **Run the MCP server:**
   ```bash
   npm start
   ```

## Usage with Claude Code

Add to your `~/.claude/settings.json` (MCP servers section):

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "node",
      "args": ["/Users/jaleeljenkins/Desktop/Stackz/agency-hq/backend/mcp-servers/brave-search/node_modules/@modelcontextprotocol/server-brave-search/dist/index.js"],
      "env": {
        "BRAVE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Or run directly with:
```bash
BRAVE_API_KEY=your_key npx mcp-server-brave-search
```

## Available Tools

### brave_search
Search the web and get results with title, URL, description, and date.

**Parameters:**
- `query` (required): Search query string
- `count` (optional): Number of results (default: 10, max: 20)

**Example:**
```
Search for "latest React 19 features"
```
