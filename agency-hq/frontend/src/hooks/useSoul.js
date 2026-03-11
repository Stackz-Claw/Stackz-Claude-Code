/**
 * useSoul - Custom React hook for soul file API integration
 * Handles fetching, editing, and syncing agent soul files
 */

import { useState, useEffect, useCallback } from 'react'

const API_BASE = 'http://localhost:4001/api'

export const useSoul = (agentId) => {
  const [soul, setSoul] = useState(null)
  const [versionStatus, setVersionStatus] = useState('local')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  // Fetch soul for agent
  const fetchSoul = useCallback(async (id = agentId) => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/agents/${id}/soul`)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to fetch soul')
      }
      const data = await response.json()
      setSoul({
        frontmatter: data.frontmatter,
        body: data.body,
        raw: data.raw,
        source: data.source
      })
      setVersionStatus(data.versionStatus)
    } catch (err) {
      console.error(`[useSoul] Error fetching soul for ${id}:`, err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [agentId])

  // Save soul (local + sync to vault)
  const saveSoul = useCallback(async (id = agentId, updates) => {
    if (!id || !updates) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/agents/${id}/soul`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to save soul')
      }

      const data = await response.json()
      setSoul({
        frontmatter: data.frontmatter,
        body: data.body,
        source: 'local'
      })
      setVersionStatus(data.versionStatus)

      return data
    } catch (err) {
      console.error(`[useSoul] Error saving soul for ${id}:`, err)
      setError(err.message)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [agentId])

  // Pull from Obsidian vault
  const pullFromVault = useCallback(async (id = agentId) => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/agents/${id}/soul/pull-from-obsidian`, {
        method: 'POST'
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to pull from vault')
      }

      const data = await response.json()
      setSoul({
        frontmatter: data.frontmatter,
        body: data.body,
        source: 'vault'
      })
      setVersionStatus('vault')

      return data
    } catch (err) {
      console.error(`[useSoul] Error pulling soul for ${id}:`, err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [agentId])

  // Push to Obsidian vault
  const pushToVault = useCallback(async (id = agentId) => {
    if (!id) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/agents/${id}/soul/push-to-obsidian`, {
        method: 'POST'
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to push to vault')
      }

      const data = await response.json()
      setVersionStatus('local')

      return data
    } catch (err) {
      console.error(`[useSoul] Error pushing soul for ${id}:`, err)
      setError(err.message)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [agentId])

  // Get sync status
  const getStatus = useCallback(async (id = agentId) => {
    if (!id) return null

    try {
      const response = await fetch(`${API_BASE}/agents/${id}/soul/status`)
      if (!response.ok) return null
      return await response.json()
    } catch (err) {
      console.error(`[useSoul] Error getting status for ${id}:`, err)
      return null
    }
  }, [agentId])

  // Initial fetch
  useEffect(() => {
    if (agentId) {
      fetchSoul(agentId)
    }
  }, [agentId, fetchSoul])

  return {
    soul,
    versionStatus,
    isLoading,
    isSaving,
    error,
    fetchSoul,
    saveSoul,
    pullFromVault,
    pushToVault,
    getStatus
  }
}

export default useSoul