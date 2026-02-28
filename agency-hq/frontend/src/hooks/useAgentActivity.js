import { useRef, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import { generateChatMessage } from '../utils/agentDialogue'

const ACTIVE_AGENTS = [
  'smoke', 'stackz', 'warden', 'megaphone', 'forge',
  'radar', 'canvas', 'cashflow', 'founder',
]
const CHAT_INTERVAL_MIN = 15000  // 15s
const CHAT_INTERVAL_MAX = 45000  // 45s

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function useAgentActivity() {
  const timersRef = useRef([])
  const addMessage = useChatStore((s) => s.addMessage)
  const isAutoPlay = useChatStore((s) => s.isAutoPlay)

  useEffect(() => {
    if (!isAutoPlay) return

    function scheduleNext(agentId) {
      const delay = randomBetween(CHAT_INTERVAL_MIN, CHAT_INTERVAL_MAX)
      const timer = setTimeout(() => {
        addMessage(generateChatMessage(agentId))
        scheduleNext(agentId)
      }, delay)
      timersRef.current.push(timer)
      return timer
    }

    ACTIVE_AGENTS.forEach((agentId) => {
      const initialDelay = randomBetween(3000, 12000)
      const timer = setTimeout(() => scheduleNext(agentId), initialDelay)
      timersRef.current.push(timer)
    })

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [isAutoPlay, addMessage])
}
