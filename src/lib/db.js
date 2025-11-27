// IndexedDB para armazenamento offline de fotos e dados
const DB_NAME = 'verdiplan_offline'
const DB_VERSION = 1

const STORES = {
  PHOTOS: 'photos',
  TASKS: 'tasks',
  SYNC_QUEUE: 'sync_queue'
}

class VerdiplanDB {
  constructor() {
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Store para fotos pendentes de upload
        if (!db.objectStoreNames.contains(STORES.PHOTOS)) {
          const photoStore = db.createObjectStore(STORES.PHOTOS, { keyPath: 'id', autoIncrement: true })
          photoStore.createIndex('taskId', 'taskId', { unique: false })
          photoStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Store para cache de tarefas
        if (!db.objectStoreNames.contains(STORES.TASKS)) {
          const taskStore = db.createObjectStore(STORES.TASKS, { keyPath: 'id' })
          taskStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }

        // Store para fila de sincronização
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true })
          syncStore.createIndex('type', 'type', { unique: false })
          syncStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  async ensureDB() {
    if (!this.db) {
      await this.init()
    }
    return this.db
  }

  // ========== FOTOS ==========
  async savePhoto(taskId, file, metadata = {}) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const transaction = db.transaction([STORES.PHOTOS], 'readwrite')
        const store = transaction.objectStore(STORES.PHOTOS)

        const photo = {
          taskId,
          file: reader.result, // Base64
          filename: file.name,
          type: file.type,
          size: file.size,
          timestamp: Date.now(),
          uploaded: false,
          metadata
        }

        const request = store.add(photo)
        request.onsuccess = () => resolve({ ...photo, id: request.result })
        request.onerror = () => reject(request.error)
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  async getPendingPhotos(taskId = null) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PHOTOS], 'readonly')
      const store = transaction.objectStore(STORES.PHOTOS)

      const request = store.getAll()
      request.onsuccess = () => {
        let photos = request.result.filter(p => !p.uploaded)
        if (taskId) {
          photos = photos.filter(p => p.taskId === taskId)
        }
        resolve(photos)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async markPhotoAsUploaded(photoId) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PHOTOS], 'readwrite')
      const store = transaction.objectStore(STORES.PHOTOS)

      const getRequest = store.get(photoId)
      getRequest.onsuccess = () => {
        const photo = getRequest.result
        if (photo) {
          photo.uploaded = true
          photo.uploadedAt = Date.now()
          const updateRequest = store.put(photo)
          updateRequest.onsuccess = () => resolve(photo)
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve(null)
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async deletePhoto(photoId) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PHOTOS], 'readwrite')
      const store = transaction.objectStore(STORES.PHOTOS)
      const request = store.delete(photoId)
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }

  // ========== TAREFAS (CACHE) ==========
  async saveTasks(tasks) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TASKS], 'readwrite')
      const store = transaction.objectStore(STORES.TASKS)

      // Limpar cache antigo
      store.clear()

      // Salvar novas tarefas
      tasks.forEach(task => {
        store.add({ ...task, updatedAt: Date.now() })
      })

      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async getTasks() {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TASKS], 'readonly')
      const store = transaction.objectStore(STORES.TASKS)
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getTask(taskId) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TASKS], 'readonly')
      const store = transaction.objectStore(STORES.TASKS)
      const request = store.get(taskId)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  // ========== FILA DE SINCRONIZAÇÃO ==========
  async addToSyncQueue(type, data) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite')
      const store = transaction.objectStore(STORES.SYNC_QUEUE)

      const item = {
        type,
        data,
        timestamp: Date.now(),
        retries: 0
      }

      const request = store.add(item)
      request.onsuccess = () => resolve({ ...item, id: request.result })
      request.onerror = () => reject(request.error)
    })
  }

  async getSyncQueue() {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readonly')
      const store = transaction.objectStore(STORES.SYNC_QUEUE)
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async removeFromSyncQueue(itemId) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite')
      const store = transaction.objectStore(STORES.SYNC_QUEUE)
      const request = store.delete(itemId)
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }

  async clearSyncQueue() {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite')
      const store = transaction.objectStore(STORES.SYNC_QUEUE)
      const request = store.clear()
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }
}

// Singleton
export const db = new VerdiplanDB()
