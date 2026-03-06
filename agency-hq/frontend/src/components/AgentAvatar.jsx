import { AGENT_PERSONALITIES } from '../data/personalities'

/**
 * AgentAvatar — Renders a colored initial-based avatar for an agent.
 * Maps to the agent's accent color from the personality config.
 *
 * @param {string} agentId - Agent identifier (e.g. 'smoke', 'stackz')
 * @param {string} size - Tailwind size class number (e.g. '6', '7', '8')
 */
export default function AgentAvatar({ agentId, size = '7' }) {
    const p = AGENT_PERSONALITIES[agentId]
    if (!p) return null

    const sizeClass = `w-${size} h-${size}`

    return (
        <div
            className={`${sizeClass} rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0`}
            style={{
                background: `${p.color}15`,
                border: `1px solid ${p.color}33`,
                color: p.color,
            }}
        >
            {p.avatar}
        </div>
    )
}
