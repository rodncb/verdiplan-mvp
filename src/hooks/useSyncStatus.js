import { useState, useEffect } from 'react'
import { syncQueue } from '../lib/syncQueue'
import { db } from '../lib/db'

export function useSyncStatus() {
  const [pendingCount, setPendingCount] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  const updatePendingCount = async () => {
    const stats = await syncQueue.getStats()
    setPendingCount(stats.total)
  }

  useEffect(() => {
    // Atualizar contagem inicial
    updatePendingCount()

    // Listener para eventos de sincronização
    const unsubscribe = syncQueue.addListener((event) => {
      switch (event.type) {
        case 'sync_start':
          setSyncing(true)
          break

        case 'sync_complete':
          setSyncing(false)
          setLastSync(new Date())
          updatePendingCount()
          break

        case 'photo_uploaded':
          updatePendingCount()
          break

        default:
          break
      }
    })

    // Atualizar periodicamente
    const interval = setInterval(updatePendingCount, 5000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  const triggerSync = async () => {
    await syncQueue.syncAll()
  }

  return {
    pendingCount,
    syncing,
    lastSync,
    triggerSync
  }
}
