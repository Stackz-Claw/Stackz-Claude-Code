import { create } from 'zustand'
import chatData from '@mock/chat-messages.json'

export const useChatStore = create((set) => ({
  messages: chatData.messages,
  isAutoPlay: true,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  addBossMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `msg_boss_${Date.now()}`,
          agentId: 'boss',
          text,
          timestamp: new Date().toISOString(),
          type: 'boss',
        },
      ],
    })),

  toggleAutoPlay: () =>
    set((state) => ({ isAutoPlay: !state.isAutoPlay })),

  clearMessages: () => set({ messages: [] }),
}))
