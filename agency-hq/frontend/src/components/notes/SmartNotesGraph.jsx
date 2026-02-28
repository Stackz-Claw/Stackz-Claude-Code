import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { AnimatePresence } from 'framer-motion'
import { useNotesStore } from '../../store/notesStore'
import NoteNode from './NoteNode'
import NoteFilters from './NoteFilters'
import StickyNoteInput from './StickyNoteInput'

const nodeTypes = { note: NoteNode }

const flowStyles = {
  background: '#080b14',
}

export default function SmartNotesGraph() {
  const { nodes: storeNodes, edges: storeEdges, setNodes, setEdges, getFilteredNodes, voteNote } = useNotesStore()
  const [nodes, setLocalNodes, onNodesChange] = useNodesState(storeNodes)
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState(storeEdges)
  const [showAddNote, setShowAddNote] = useState(false)
  const filter = useNotesStore((s) => s.filter)

  const filteredNodes = getFilteredNodes().map((n) => ({
    ...n,
    data: {
      ...n.data,
      onVote: () => voteNote(n.id),
    },
  }))

  const onConnect = useCallback(
    (params) => setLocalEdges((eds) => addEdge({ ...params, style: { stroke: '#00d4ff', strokeWidth: 1.5 } }, eds)),
    []
  )

  const onNodeClick = useCallback((_, node) => {
    // Vote on double-click could be added here
  }, [])

  return (
    <div className="flex flex-col h-full gap-3">
      <NoteFilters onAddNote={() => setShowAddNote(true)} />

      <div className="flex-1 relative rounded-xl overflow-hidden border border-white/5">
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          style={flowStyles}
          defaultEdgeOptions={{
            style: { stroke: 'rgba(0, 212, 255, 0.4)', strokeWidth: 1.5 },
            labelStyle: { fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' },
            labelBgStyle: { fill: 'rgba(10,14,26,0.8)', fillOpacity: 1 },
          }}
          fitView
          attributionPosition="bottom-left"
        >
          <Background
            variant="dots"
            gap={20}
            size={1}
            color="rgba(0, 212, 255, 0.12)"
          />
          <Controls
            style={{
              background: 'rgba(10,14,26,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
          />
          <MiniMap
            style={{
              background: 'rgba(10,14,26,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            nodeColor={(n) => n.data?.color || '#00d4ff'}
            maskColor="rgba(8,11,20,0.7)"
          />
        </ReactFlow>

        {/* Floating add note dialog */}
        {showAddNote && (
          <div className="absolute top-4 right-4 z-10">
            <AnimatePresence>
              <StickyNoteInput onClose={() => setShowAddNote(false)} />
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="glass-panel px-4 py-2.5 flex items-center gap-4 flex-wrap text-[10px] font-mono text-white/30">
        <span>Click node to select</span>
        <span>·</span>
        <span>Drag to connect</span>
        <span>·</span>
        <span>Scroll to zoom</span>
        <span>·</span>
        <span className="text-neon-green">● = recently updated</span>
        <span>·</span>
        <span>Node size = votes</span>
      </div>
    </div>
  )
}
