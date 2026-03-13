const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * GET /api/heartbeat
 * Returns the latest heartbeat report
 */
router.get('/', (req, res) => {
  const reportPath = path.join(__dirname, '../../logs/heartbeat-report.json');

  try {
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      res.json(report);
    } else {
      res.status(404).json({
        error: 'No heartbeat report found',
        message: 'Heartbeat monitoring may not have run yet'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read heartbeat report',
      message: error.message
    });
  }
});

/**
 * GET /api/heartbeat/status
 * Returns a simplified status of all MCP servers
 */
router.get('/status', (req, res) => {
  const reportPath = path.join(__dirname, '../../logs/heartbeat-report.json');

  try {
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

      // Simplify the results for quick status checks
      const statusSummary = report.results.map(result => ({
        server: result.name,
        status: result.status,
        message: result.message,
        responseTime: result.responseTime,
        timestamp: result.timestamp
      }));

      res.json({
        timestamp: report.timestamp,
        servers: statusSummary,
        urgentAlerts: report.urgentAlerts || []
      });
    } else {
      res.status(404).json({
        error: 'No heartbeat report found',
        servers: [],
        urgentAlerts: []
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read heartbeat report',
      message: error.message,
      servers: [],
      urgentAlerts: []
    });
  }
});

module.exports = router;