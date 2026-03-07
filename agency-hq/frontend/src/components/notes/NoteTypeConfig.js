/**
 * Note Type Configuration
 * Shared configuration for note types and statuses used across the Smart Notes system
 */

// Note type definitions with colors and icons
export const NOTE_TYPES = {
  concept: {
    color: '#00d4aa',
    icon: 'lightbulb',
    label: 'Concept',
    description: 'Fundamental ideas and frameworks'
  },
  agent: {
    color: '#7c3aed',
    icon: 'cpu',
    label: 'Agent',
    description: 'Agent definitions and configurations'
  },
  project: {
    color: '#f59e0b',
    icon: 'folder',
    label: 'Project',
    description: 'Active ventures and initiatives'
  },
  decision: {
    color: '#ef4444',
    icon: 'git-branch',
    label: 'Decision',
    description: 'Strategic decisions and rationale'
  },
  insight: {
    color: '#06b6d4',
    icon: 'zap',
    label: 'Insight',
    description: 'Analysis results and observations'
  },
  resource: {
    color: '#22c55e',
    icon: 'book-open',
    label: 'Resource',
    description: 'Reference materials and documentation'
  },
  person: {
    color: '#3b82f6',
    icon: 'user',
    label: 'Person',
    description: 'People and team members'
  },
  tool: {
    color: '#64748b',
    icon: 'tool',
    label: 'Tool',
    description: 'Tools, skills, and technologies'
  }
};

// Note status definitions
export const NOTE_STATUS = {
  evergreen: {
    color: '#00d4aa',
    label: 'Evergreen',
    dot: 'solid',
    description: 'Validated, permanent knowledge'
  },
  budding: {
    color: '#f59e0b',
    label: 'Budding',
    dot: 'pulse',
    description: 'Growing, developing ideas'
  },
  seedling: {
    color: '#94a3b8',
    label: 'Seedling',
    dot: 'muted',
    description: 'New, unproven concepts'
  },
  archived: {
    color: '#475569',
    label: 'Archived',
    dot: 'faded',
    description: 'Inactive or superseded'
  }
};

// Get note type by key
export const getNoteType = (type) => NOTE_TYPES[type] || NOTE_TYPES.concept;

// Get note status by key
export const getNoteStatus = (status) => NOTE_STATUS[status] || NOTE_STATUS.seedling;

// Note type icons (Lucide icon names)
export const NOTE_TYPE_ICONS = {
  concept: 'Lightbulb',
  agent: 'Cpu',
  project: 'Folder',
  decision: 'GitBranch',
  insight: 'Zap',
  resource: 'BookOpen',
  person: 'User',
  tool: 'Wrench'
};

// Filter options for note list
export const NOTE_FILTERS = {
  types: Object.keys(NOTE_TYPES),
  statuses: Object.keys(NOTE_STATUS)
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent' },
  { value: 'linked', label: 'Most Linked' },
  { value: 'alpha', label: 'Alphabetical' }
];

// Export for convenience
export default {
  NOTE_TYPES,
  NOTE_STATUS,
  getNoteType,
  getNoteStatus,
  NOTE_TYPE_ICONS,
  NOTE_FILTERS,
  SORT_OPTIONS
};
