/**
 * Completion Matrix API Routes
 * GET /api/completion-matrix - Returns parsed matrix as JSON
 * PATCH /api/completion-matrix/:component - Updates a component status
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const MATRIX_PATH = path.join(__dirname, '../../docs/Self-Build/COMPLETION_MATRIX.md');

/**
 * Parse the markdown completion matrix into JSON
 */
function parseMatrix(content) {
  const lines = content.split('\n');
  const matrix = {
    executiveAgents: [],
    teamAgents: [],
    coreSystems: [],
    advancedFeatures: [],
    infrastructure: []
  };

  let currentSection = null;
  const sectionMap = {
    '## Executive Agents': 'executiveAgents',
    '## Team Agents': 'teamAgents',
    '## Core Systems': 'coreSystems',
    '## Advanced Features': 'advancedFeatures',
    '## Infrastructure': 'infrastructure'
  };

  for (const line of lines) {
    // Check for section headers
    if (sectionMap[line.trim()]) {
      currentSection = sectionMap[line.trim()];
      continue;
    }

    // Parse table rows
    if (line.startsWith('| ') && currentSection) {
      const parts = line.split('|').map(p => p.trim()).filter(p => p);

      if (parts.length >= 4 && parts[0] !== 'Component') {
        matrix[currentSection].push({
          component: parts[0],
          status: parts[1],
          priority: parts[2],
          owner: parts[3],
          blocking: parts[4] || ''
        });
      }
    }
  }

  return matrix;
}

/**
 * GET /api/completion-matrix
 * Returns the full completion matrix as JSON
 */
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(MATRIX_PATH)) {
      return res.status(404).json({ error: 'Completion matrix not found' });
    }

    const content = fs.readFileSync(MATRIX_PATH, 'utf8');
    const matrix = parseMatrix(content);

    res.json(matrix);
  } catch (error) {
    console.error('[CompletionMatrix] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/completion-matrix/:component
 * Updates a component's status
 * Body: { status: string }
 */
router.patch('/:component', (req, res) => {
  try {
    const { component } = req.params;
    const { status, owner, priority } = req.body;

    if (!fs.existsSync(MATRIX_PATH)) {
      return res.status(404).json({ error: 'Completion matrix not found' });
    }

    let content = fs.readFileSync(MATRIX_PATH, 'utf8');

    // Build regex to find the component row
    const escapedComponent = component.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(\\| ${escapedComponent} \\|)([^|]+)(\\|)`;

    if (!regex.test(content)) {
      return res.status(404).json({ error: `Component not found: ${component}` });
    }

    // Replace status
    if (status) {
      content = content.replace(regex, (match, before, middle, after) => {
        const parts = middle.split('|').map(p => p.trim());
        parts[1] = status;
        return before + ' ' + parts.join(' | ') + ' ' + after;
      });
    }

    // Replace owner
    if (owner) {
      content = content.replace(regex, (match, before, middle, after) => {
        const parts = middle.split('|').map(p => p.trim());
        parts[2] = owner;
        return before + ' ' + parts.join(' | ') + ' ' + after;
      });
    }

    // Replace priority
    if (priority) {
      content = content.replace(regex, (match, before, middle, after) => {
        const parts = middle.split('|').map(p => p.trim());
        parts[3] = priority;
        return before + ' ' + parts.join(' | ') + ' ' + after;
      });
    }

    fs.writeFileSync(MATRIX_PATH, content);

    res.json({ success: true, component, status, owner, priority });
  } catch (error) {
    console.error('[CompletionMatrix] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/completion-matrix/summary
 * Returns a summary of completion status
 */
router.get('/summary', (req, res) => {
  try {
    if (!fs.existsSync(MATRIX_PATH)) {
      return res.status(404).json({ error: 'Completion matrix not found' });
    }

    const content = fs.readFileSync(MATRIX_PATH, 'utf8');
    const matrix = parseMatrix(content);

    const allComponents = [
      ...matrix.executiveAgents,
      ...matrix.teamAgents,
      ...matrix.coreSystems,
      ...matrix.advancedFeatures,
      ...matrix.infrastructure
    ];

    const summary = {
      total: allComponents.length,
      complete: allComponents.filter(c => c.status === 'COMPLETE').length,
      inProgress: allComponents.filter(c => c.status === 'IN PROGRESS').length,
      partial: allComponents.filter(c => c.status === 'PARTIAL').length,
      todo: allComponents.filter(c => c.status === 'TODO').length,
      blocked: allComponents.filter(c => c.status === 'BLOCKED').length,
      byPriority: {
        p0: allComponents.filter(c => c.priority === 'P0').length,
        p1: allComponents.filter(c => c.priority === 'P1').length,
        p2: allComponents.filter(c => c.priority === 'P2').length,
        p3: allComponents.filter(c => c.priority === 'P3').length
      }
    };

    summary.percentComplete = Math.round((summary.complete / summary.total) * 100);

    res.json(summary);
  } catch (error) {
    console.error('[CompletionMatrix] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;