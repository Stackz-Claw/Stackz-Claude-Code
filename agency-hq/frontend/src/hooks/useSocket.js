import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useChatStore } from '../store/chatStore'
import { useApprovalStore } from '../store/approvalStore'
import { useAgentStore } from '../store/agentStore'

let socketInstance = null

export function useSocket() {
  const socketRef = useRef(null)
  const addMessage = useChatStore((s) => s.addMessage)
  const addApprovalRequest = useApprovalStore((s) => s.addApprovalRequest)
  const updateAgentStatus = useAgentStore((s) => s.updateAgentStatus)

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      })
    }

    socketRef.current = socketInstance

    socketInstance.on('chat:message', (msg) => {
      addMessage(msg)
    })

    socketInstance.on('approval:new', (request) => {
      addApprovalRequest(request)
    })

    socketInstance.on('agent:update', ({ agentId, updates }) => {
      updateAgentStatus(agentId, updates)
    })

    return () => {
      socketInstance.off('chat:message')
      socketInstance.off('approval:new')
      socketInstance.off('agent:update')
    }
  }, [])

  const emit = (event, data) => {
    socketRef.current?.emit(event, data)
  }

  return { emit, socket: socketRef.current }
}
