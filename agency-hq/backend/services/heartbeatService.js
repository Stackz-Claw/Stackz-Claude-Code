/**
 * MCP Heartbeat Monitoring Service
 *
 * Monitors the health of all MCP servers and API connections every 30 minutes.
 * Sends urgent alerts to the UI when issues are detected.
 */

// Get fetch - native in Node 21+, or use node-fetch package
const nodeMajorVersion = parseInt(process.version.slice(1).split('.')[0]);
const fetch = nodeMajorVersion >= 21 ? globalThis.fetch : require('node-fetch');

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database connection
const dbPath = path.join(__dirname, '../db/agency.db');
let db;

try {
  db = new Database(dbPath);
} catch (error) {
  console.error('[Heartbeat] Failed to connect to database:', error.message);
}

// MCP Server configurations
const MCP_SERVERS = {
  bookmarks: {
    name: 'Bookmarks MCP',
    type: 'stdio',
    path: '/Users/jaleeljenkins/Desktop/Stackz/mcp-servers/bookmarks/server.js',
    apiKeyEnvVar: null // No API key needed
  },
  x: {
    name: 'X MCP',
    type: 'stdio',
    path: '/Users/jaleeljenkins/Desktop/Stackz/x-mcp-server/src/index.js',
    apiKeyEnvVar: 'X_API_KEY'
  },
  obsidian: {
    name: 'Obsidian MCP',
    type: 'stdio',
    path: '/Users/jaleeljenkins/Desktop/Stackz/obsidian-vault-mcp/src/server.ts',
    apiKeyEnvVar: null // No API key needed
  },
  braveSearch: {
    name: 'Brave Search MCP',
    type: 'http',
    url: 'http://localhost:3005', // Default port for Brave Search
    healthEndpoint: '/health',
    apiKeyEnvVar: 'BRAVE_SEARCH_API_KEY'
  }
};

/**
 * Check if an API key is valid
 */
function isValidApiKey(apiKey) {
  // Basic validation - check if key exists and has reasonable length
  return apiKey && typeof apiKey === 'string' && apiKey.length > 10;
}

/**
 * Check the health of a single MCP server
 */
async function checkMcpServer(name, config) {
  const startTime = Date.now();

  try {
    // Check API key first if required
    let apiKeyValid = true;
    let apiKeyMessage = '';

    if (config.apiKeyEnvVar) {
      const apiKey = process.env[config.apiKeyEnvVar];
      apiKeyValid = isValidApiKey(apiKey);
      apiKeyMessage = apiKeyValid ? 'API key valid' : `Missing or invalid API key: ${config.apiKeyEnvVar}`;

      if (!apiKeyValid) {
        return {
          name: config.name,
          status: 'error',
          message: apiKeyMessage,
          responseTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          urgent: true // API key issues are urgent
        };
      }
    }

    // Try to ping the health endpoint
    const healthUrl = `${config.url}${config.healthEndpoint}`;
    const response = await fetch(healthUrl, {
      timeout: 5000, // 5 second timeout
      headers: config.apiKeyEnvVar ? {
        'Authorization': `Bearer ${process.env[config.apiKeyEnvVar]}`
      } : {}
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: config.name,
        status: 'healthy',
        message: 'Server responding normally',
        responseTime,
        timestamp: new Date().toISOString(),
        urgent: false
      };
    } else {
      return {
        name: config.name,
        status: 'warning',
        message: `Server returned status ${response.status}`,
        responseTime,
        timestamp: new Date().toISOString(),
        urgent: response.status >= 500 // Server errors are urgent
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Determine if this is an urgent issue
    const urgent = error.code === 'ECONNREFUSED' ||
                  error.code === 'ENOTFOUND' ||
                  error.type === 'system';

    return {
      name: config.name,
      status: 'error',
      message: `Connection failed: ${error.message}`,
      responseTime,
      timestamp: new Date().toISOString(),
      urgent
    };
  }
}

/**
 * Send urgent alert to UI via WebSocket
 */
function sendUrgentAlert(alert) {
  // In a real implementation, this would emit to connected clients via socket.io
  console.warn(`🚨 URGENT ALERT: ${alert.server} - ${alert.message}`);

  // Also log to database if available
  if (db) {
    try {
      db.prepare(`
        INSERT INTO urgent_alerts (server, message, severity, created_at)
        VALUES (?, ?, ?, ?)
      `).run(alert.server, alert.message, alert.severity || 'high', new Date().toISOString());
    } catch (error) {
      console.error('[Heartbeat] Failed to log urgent alert:', error.message);
    }
  }
}

/**
 * Run a complete heartbeat check on all MCP servers
 */
async function runHeartbeatCheck() {
  console.log('[Heartbeat] Running MCP server health check...');

  const results = [];
  const urgentAlerts = [];

  // Check all MCP servers in parallel
  const checkPromises = Object.entries(MCP_SERVERS).map(async ([key, config]) => {
    const result = await checkMcpServer(key, config);
    results.push(result);

    // If this is an urgent issue, add to alerts
    if (result.urgent) {
      urgentAlerts.push({
        server: result.name,
        message: result.message,
        severity: result.status === 'error' ? 'critical' : 'high',
        timestamp: result.timestamp
      });
    }

    return result;
  });

  // Wait for all checks to complete
  await Promise.all(checkPromises);

  // Log results
  console.log('[Heartbeat] Health check complete:');
  results.forEach(result => {
    const statusIcon = result.status === 'healthy' ? '✅' :
                      result.status === 'warning' ? '⚠️' : '❌';
    console.log(`  ${statusIcon} ${result.name}: ${result.message} (${result.responseTime}ms)`);
  });

  // Send urgent alerts
  if (urgentAlerts.length > 0) {
    console.log(`[Heartbeat] Sending ${urgentAlerts.length} urgent alert(s)...`);
    urgentAlerts.forEach(alert => {
      sendUrgentAlert(alert);
    });
  }

  // Save results to file for debugging
  const report = {
    timestamp: new Date().toISOString(),
    results,
    urgentAlerts
  };

  const reportPath = path.join(__dirname, '../../logs/heartbeat-report.json');
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  } catch (error) {
    console.error('[Heartbeat] Failed to save report:', error.message);
  }

  return { results, urgentAlerts };
}

/**
 * Start periodic heartbeat monitoring
 */
function startHeartbeatMonitoring() {
  console.log('[Heartbeat] Starting MCP server monitoring (30-minute intervals)');

  // Run immediately on startup
  runHeartbeatCheck();

  // Then run every 30 minutes (1800000 ms)
  setInterval(runHeartbeatCheck, 30 * 60 * 1000);
}

module.exports = {
  runHeartbeatCheck,
  startHeartbeatMonitoring,
  MCP_SERVERS
};