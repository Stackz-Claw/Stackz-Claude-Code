import { useEffect } from 'react'
import { useSyncBusStore } from '../store/syncBusStore'
import { useSocket } from './useSocket'

export function useSyncBus() {
  const { addMessage, addOverride, triggerPulse, messages, overrides, isActive } = useSyncBusStore()
  const socket = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.on('syncbus:message', (msg) => {
      addMessage(msg)
    })

    socket.on('syncbus:override', (override) => {
      addOverride(override)
      triggerPulse()
    })

    return () => {
      socket.off('syncbus:message')
      socket.off('syncbus:override')
    }
  }, [socket, addMessage, addOverride, triggerPulse])

  return { messages, overrides, isActive }
}
