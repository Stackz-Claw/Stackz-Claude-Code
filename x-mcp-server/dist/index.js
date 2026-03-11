"use strict";
/**
 * X MCP Server - Main Entry Point
 * Multi-account Twitter/X integration for STACKZ agent swarm
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/transport/stdio.js");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_js_1 = require("./utils/logger.js");
const index_js_1 = require("./tools/index.js");
// Load environment variables
dotenv_1.default.config();
async function main() {
    logger_js_1.logger.info('Starting X MCP Server...');
    // Create MCP Server instance
    const mcpServer = new mcp_js_1.McpServer('x-twitter', {
        version: '1.0.0',
        capabilities: {
            tools: {}
        }
    });
    // Register all tools
    (0, index_js_1.registerTools)(mcpServer);
    // Create stdio transport
    const transport = new stdio_js_1.StdioServerTransport();
    // Connect to transport
    try {
        await mcpServer.connect(transport);
        logger_js_1.logger.info('X MCP Server connected to stdio transport');
        // Send ready message
        process.send?.({ type: 'ready' });
    }
    catch (error) {
        logger_js_1.logger.error('Failed to connect MCP server:', error);
        process.exit(1);
    }
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        logger_js_1.logger.info('Shutting down X MCP Server...');
        await mcpServer.close();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        logger_js_1.logger.info('Shutting down X MCP Server...');
        await mcpServer.close();
        process.exit(0);
    });
}
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger_js_1.logger.error('Uncaught exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_js_1.logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});
main().catch((error) => {
    logger_js_1.logger.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map