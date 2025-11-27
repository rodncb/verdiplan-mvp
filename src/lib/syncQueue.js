// Sistema de sincronização automática quando voltar online
import { db } from './db'

class SyncQueueManager {
  constructor() {
    this.isSyncing = false
    this.listeners = []
  }

  // Adiciona listener para mudanças de status
  addListener(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  notifyListeners(event) {
    this.listeners.forEach(listener => listener(event))
  }

  // Processa fila de fotos pendentes
  async syncPhotos() {
    const pendingPhotos = await db.getPendingPhotos()

    if (pendingPhotos.length === 0) {
      return { success: true, count: 0 }
    }

    this.notifyListeners({ type: 'sync_start', count: pendingPhotos.length })

    let successCount = 0
    let failCount = 0

    for (const photo of pendingPhotos) {
      try {
        await this.uploadPhoto(photo)
        await db.markPhotoAsUploaded(photo.id)
        successCount++

        this.notifyListeners({
          type: 'photo_uploaded',
          photo,
          progress: { current: successCount + failCount, total: pendingPhotos.length }
        })
      } catch (error) {
        failCount++
        console.error('Erro ao sincronizar foto:', error)

        this.notifyListeners({
          type: 'photo_failed',
          photo,
          error,
          progress: { current: successCount + failCount, total: pendingPhotos.length }
        })
      }
    }

    this.notifyListeners({
      type: 'sync_complete',
      success: successCount,
      failed: failCount
    })

    return { success: failCount === 0, successCount, failCount }
  }

  // Faz upload de uma foto para o backend
  async uploadPhoto(photo) {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.facilitaai.com.br/verdiplan'
    const token = localStorage.getItem('verdiplan_token') || ''

    // Converter Base64 de volta para Blob
    const response = await fetch(photo.file)
    const blob = await response.blob()
    const file = new File([blob], photo.filename, { type: photo.type })

    const formData = new FormData()
    formData.append('photos', file)

    const uploadResponse = await fetch(`${baseUrl}/tasks/${photo.taskId}/photos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload falhou: ${uploadResponse.status}`)
    }

    return uploadResponse.json()
  }

  // Sincroniza toda a fila
  async syncAll() {
    if (this.isSyncing) {
      console.log('Sincronização já em andamento')
      return
    }

    if (!navigator.onLine) {
      console.log('Dispositivo offline, aguardando conexão')
      return
    }

    this.isSyncing = true

    try {
      // Sincronizar fotos
      await this.syncPhotos()

      // Processar outras items da fila de sincronização
      const queue = await db.getSyncQueue()
      for (const item of queue) {
        try {
          await this.processQueueItem(item)
          await db.removeFromSyncQueue(item.id)
        } catch (error) {
          console.error('Erro ao processar item da fila:', error)
        }
      }
    } finally {
      this.isSyncing = false
    }
  }

  // Processa item genérico da fila
  async processQueueItem(item) {
    switch (item.type) {
      case 'task_create':
        return this.syncTaskCreate(item.data)
      case 'task_update':
        return this.syncTaskUpdate(item.data)
      default:
        console.warn('Tipo de sincronização desconhecido:', item.type)
    }
  }

  async syncTaskCreate(data) {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.facilitaai.com.br/verdiplan'
    const token = localStorage.getItem('verdiplan_token') || ''

    const response = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar tarefa: ${response.status}`)
    }

    return response.json()
  }

  async syncTaskUpdate(data) {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.facilitaai.com.br/verdiplan'
    const token = localStorage.getItem('verdiplan_token') || ''

    const response = await fetch(`${baseUrl}/tasks/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`Erro ao atualizar tarefa: ${response.status}`)
    }

    return response.json()
  }

  // Retorna estatísticas da fila
  async getStats() {
    const pendingPhotos = await db.getPendingPhotos()
    const syncQueue = await db.getSyncQueue()

    return {
      pendingPhotos: pendingPhotos.length,
      pendingActions: syncQueue.length,
      total: pendingPhotos.length + syncQueue.length
    }
  }
}

// Singleton
export const syncQueue = new SyncQueueManager()

// Auto-sync quando voltar online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Conexão restaurada, iniciando sincronização...')
    syncQueue.syncAll()
  })
}
