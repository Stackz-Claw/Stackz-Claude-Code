/**
 * KnowledgeGraph - D3.js Force-Directed Graph
 * The hero component for Smart Notes - interactive knowledge graph visualization
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { useNotesStore } from '../../store/notesStore';
import { NOTE_TYPES, getNoteType } from './NoteTypeConfig';

// Icons mapping (using Lucide React)
import {
  Lightbulb, Cpu, Folder, GitBranch, Zap,
  BookOpen, User, Wrench
} from 'lucide-react';

const ICON_MAP = {
  concept: Lightbulb,
  agent: Cpu,
  project: Folder,
  decision: GitBranch,
  insight: Zap,
  resource: BookOpen,
  person: User,
  tool: Wrench
};

const KnowledgeGraph = ({
  notes = [],
  onNodeClick,
  onNodeDoubleClick,
  selectedNodeId = null,
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  width = 800,
  height = 600
}) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const containerRef = useRef(null);

  // Graph state
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [dimensions, setDimensions] = useState({ width, height });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  // Graph settings
  const [layout, setLayout] = useState('force'); // force, radial, tree
  const [depth, setDepth] = useState('full'); // full, 1-hop, 2-hop
  const [filter, setFilter] = useState('all');

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: w, height: h } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: w, height: h || 500 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Prepare graph data
  const graphData = useMemo(() => {
    // Filter notes
    let filteredNotes = notes;
    if (filter !== 'all') {
      filteredNotes = notes.filter(n => n.type === filter);
    }

    // Create nodes
    const nodes = filteredNotes.map(note => ({
      id: note.id,
      title: note.title,
      type: note.type,
      status: note.status,
      author: note.author,
      backlinks: note.backlinks?.length || 0,
      links: note.links?.length || 0,
      modified: note.modified,
      // Position will be set by simulation
      x: dimensions.width / 2 + (Math.random() - 0.5) * 100,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 100
    }));

    // Create links from notes
    const links = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    filteredNotes.forEach(note => {
      if (note.links) {
        note.links.forEach(link => {
          // Try to find target node
          const linkId = link.replace(/\[\[|\]\]/g, '');
          const target = nodes.find(n =>
            n.id === linkId ||
            n.title.toLowerCase().includes(linkId.toLowerCase())
          );
          if (target && target.id !== note.id) {
            links.push({
              source: note.id,
              target: target.id
            });
          }
        });
      }
    });

    return { nodes, links };
  }, [notes, filter, dimensions]);

  // Initialize D3 simulation
  useEffect(() => {
    if (!svgRef.current || !graphData.nodes.length) return;

    const svg = d3.select(svgRef.current);
    const { width: w, height: h } = dimensions;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create container group for zoom/pan
    const g = svg.append('g').attr('class', 'graph-container');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setTransform(event.transform);
      });

    svg.call(zoom);

    // Create arrow marker for directed edges
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', 'rgba(255,255,255,0.3)');

    // Create links group
    const linkGroup = g.append('g').attr('class', 'links');

    // Create nodes group
    const nodeGroup = g.append('g').attr('class', 'nodes');

    // Create simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links)
        .id(d => d.id)
        .distance(80)
        .strength(0.3))
      .force('charge', d3.forceManyBody()
        .strength(-200))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide()
        .radius(d => Math.sqrt(d.backlinks) * 6 + 16));

    simulationRef.current = simulation;

    // Create links
    const hasHighlights = highlightedNodeIds.length > 0;
    const link = linkGroup.selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', d => {
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        const isHighlighted = highlightedEdgeIds.some(
          e => (e.source === sourceId && e.target === targetId) ||
               (e.source === targetId && e.target === sourceId)
        );
        if (isHighlighted) return '#7c3aed';
        if (hasHighlights) return 'rgba(255,255,255,0.05)';
        return 'rgba(255,255,255,0.15)';
      })
      .attr('stroke-width', d => {
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        const isHighlighted = highlightedEdgeIds.some(
          e => (e.source === sourceId && e.target === targetId) ||
               (e.source === targetId && e.target === sourceId)
        );
        return isHighlighted ? 4 : 2;
      })
      .attr('marker-end', 'url(#arrowhead)')
      .style('opacity', d => {
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        const isHighlighted = highlightedEdgeIds.some(
          e => (e.source === sourceId && e.target === targetId) ||
               (e.source === targetId && e.target === sourceId)
        );
        if (hasHighlights && !isHighlighted) return 0.1;
        return 1;
      })
      .style('transition', 'all 0.3s ease');

    // Create node groups
    const node = nodeGroup.selectAll('.node')
      .data(graphData.nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add glow filter for evergreen nodes
    const defs = svg.select('defs');
    graphData.nodes.filter(n => n.status === 'evergreen').forEach(n => {
      const typeConfig = getNoteType(n.type);
      defs.append('filter')
        .attr('id', `glow-${n.id}`)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%')
        .append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
    });

    // Add circles for nodes
    node.append('circle')
      .attr('r', d => Math.min(8 + Math.sqrt(d.backlinks || 1) * 3, 28))
      .attr('fill', d => getNoteType(d.type).color)
      .attr('stroke', d => {
        if (selectedNodeId === d.id) return '#fff';
        if (highlightedNodeIds.includes(d.id)) return '#00ffcc';
        return 'transparent';
      })
      .attr('stroke-width', d => highlightedNodeIds.includes(d.id) ? 4 : 3)
      .attr('filter', d => {
        if (d.status === 'evergreen' || highlightedNodeIds.includes(d.id)) {
          return `url(#glow-${d.id})`;
        }
        return 'none';
      })
      .style('transition', 'all 0.2s ease')
      .style('opacity', d => {
        if (highlightedNodeIds.length > 0 && !highlightedNodeIds.includes(d.id)) {
          return 0.15;
        }
        return 1;
      });

    // Add icons inside nodes
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#fff')
      .attr('font-size', d => Math.min(8 + Math.sqrt(d.backlinks || 1) * 2, 14))
      .text(d => {
        const Icon = ICON_MAP[d.type] || Lightbulb;
        return '';
      });

    // Add labels for nodes with many backlinks
    node.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('y', d => Math.min(8 + Math.sqrt(d.backlinks || 1) * 3, 28) + 14)
      .attr('fill', 'rgba(255,255,255,0.8)')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .text(d => d.backlinks > 3 ? d.title.substring(0, 20) + (d.title.length > 20 ? '...' : '') : '')
      .style('opacity', d => d.backlinks > 3 ? 1 : 0);

    // Node interactions
    node
      .on('mouseenter', function(event, d) {
        setHoveredNode(d);

        // Highlight node and connections
        node.style('opacity', n => {
          const isConnected = n.id === d.id ||
            graphData.links.some(l =>
              (l.source.id === d.id && l.target.id === n.id) ||
              (l.target.id === d.id && l.source.id === n.id)
            );
          return isConnected ? 1 : 0.15;
        });

        link.style('opacity', l =>
          l.source.id === d.id || l.target.id === d.id ? 1 : 0.05
        );
      })
      .on('mouseleave', function() {
        setHoveredNode(null);
        node.style('opacity', 1);
        link.style('opacity', 1);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        if (onNodeClick) onNodeClick(d);
      })
      .on('dblclick', function(event, d) {
        event.stopPropagation();
        if (onNodeDoubleClick) onNodeDoubleClick(d);

        // Zoom to node
        const scale = 1.5;
        svg.transition()
          .duration(500)
          .call(zoom.transform,
            d3.zoomIdentity
              .translate(w / 2, h / 2)
              .scale(scale)
              .translate(-d.x, -d.y)
          );
      })
      .on('contextmenu', function(event, d) {
        event.preventDefault();
        setContextMenu({
          x: event.clientX,
          y: event.clientY,
          node: d
        });
      });

    // Click on background to deselect
    svg.on('click', () => {
      if (onNodeClick) onNodeClick(null);
    });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions, selectedNodeId, filter, highlightedNodeIds, highlightedEdgeIds]);

  // Handle node click from parent
  const handleNodeClick = useCallback((node) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  // Reset view
  const resetView = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(500)
      .call(d3.zoom().transform, d3.zoomIdentity);
  }, []);

  // Zoom to fit
  const zoomFit = useCallback(() => {
    if (!svgRef.current || !graphData.nodes.length) return;

    const svg = d3.select(svgRef.current);
    const bounds = d3.select(svgRef.current).select('.nodes').node()?.getBBox();

    if (!bounds) return;

    const fullWidth = dimensions.width;
    const fullHeight = dimensions.height;
    const width = bounds.width;
    const height = bounds.height;
    const midX = bounds.x + width / 2;
    const midY = bounds.y + height / 2;

    const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
    const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    svg.transition()
      .duration(500)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
  }, [graphData, dimensions]);

  // Handle context menu action
  const handleContextAction = useCallback((action) => {
    if (!contextMenu) return;

    switch (action) {
      case 'open':
        if (onNodeClick) onNodeClick(contextMenu.node);
        break;
      case 'new-linked':
        // Trigger new linked note
        break;
      case 'copy-id':
        navigator.clipboard.writeText(contextMenu.node.id);
        break;
      default:
        break;
    }
    setContextMenu(null);
  }, [contextMenu, onNodeClick]);

  return (
    <div
      ref={containerRef}
      className="knowledge-graph"
      style={{
        width: '100%',
        height: '100%',
        background: '#08080f',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Graph SVG */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block' }}
      />

      {/* Graph Controls */}
      <div
        className="graph-controls"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          display: 'flex',
          gap: 8,
          zIndex: 10
        }}
      >
        <button
          onClick={resetView}
          className="graph-btn"
          style={{
            background: 'rgba(26, 26, 36, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13
          }}
        >
          Reset
        </button>
        <button
          onClick={zoomFit}
          className="graph-btn"
          style={{
            background: 'rgba(26, 26, 36, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13
          }}
        >
          Fit
        </button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            background: 'rgba(26, 26, 36, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13
          }}
        >
          <option value="all">All Types</option>
          {Object.entries(NOTE_TYPES).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Tooltip */}
      {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            background: 'rgba(26, 26, 36, 0.95)',
            border: `1px solid ${getNoteType(hoveredNode.type).color}`,
            borderRadius: 8,
            padding: '12px 16px',
            color: '#fff',
            maxWidth: 280,
            zIndex: 20
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {hoveredNode.title}
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            <span>{getNoteType(hoveredNode.type).label}</span>
            <span>↩ {hoveredNode.backlinks}</span>
            <span>{hoveredNode.author}</span>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'rgba(26, 26, 36, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '8px 0',
            zIndex: 100,
            minWidth: 160
          }}
        >
          <button
            onClick={() => handleContextAction('open')}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              color: '#fff',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            Open Note
          </button>
          <button
            onClick={() => handleContextAction('new-linked')}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              color: '#fff',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            New Linked Note
          </button>
          <button
            onClick={() => handleContextAction('copy-id')}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              color: '#fff',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            Copy ID
          </button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;
