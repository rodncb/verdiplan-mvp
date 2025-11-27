const baseUrl = import.meta.env.VITE_API_URL || 'https://api.facilitaai.com.br/verdiplan'

const tokenKey = 'verdiplan_token'

export const API_BASE_URL = baseUrl

export function getToken() {
  try {
    return localStorage.getItem(tokenKey) || ''
  } catch {
    return ''
  }
}

export function setToken(t) {
  try {
    localStorage.setItem(tokenKey, t || '')
  } catch {}
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  if (!baseUrl) throw new Error('API_URL not configured')
  const auth = getToken()
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

// Fallbacks
import { mockTasks, inventory as mockInventory, users as mockUsers, reports as mockReports } from '../data/mock'

export const api = {
  async login(email, password) {
    try {
      const data = await request('/auth/login', { method: 'POST', body: { email, password } })
      if (data?.token) setToken(data.token)
      return data
    } catch (e) {
      // Only use mock token if no API URL is configured
      if (!baseUrl || baseUrl.includes('localhost')) {
        setToken('mock-token')
        return { token: 'mock-token', user: { email } }
      }
      // Re-throw error if we have a real API configured
      throw e
    }
  },

  async tasks() {
    try {
      const list = await request('/tasks')
      if (!Array.isArray(list)) {
        console.error('API tasks() não retornou array:', list)
        return []
      }

      // Normalize backend data to frontend format
      return list.map(task => ({
        ...task,
        id: task._id || task.id,
        date: task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString('pt-BR') : '',
        time: task.scheduledTime || '',
        photos: Array.isArray(task.photos) ? task.photos.length : 0,
        status: task.status === 'pending' ? 'Pendente' : task.status === 'completed' ? 'Concluída' : task.status === 'cancelled' ? 'Cancelada' : task.status
      }))
    } catch (e) {
      console.error('Erro ao buscar tarefas:', e)
      return mockTasks
    }
  },

  async task(id) {
    try {
      const item = await request(`/tasks/${id}`)
      if (!item) return null

      // Normalize backend data to frontend format
      return {
        ...item,
        id: item._id || item.id,
        date: item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString('pt-BR') : '',
        time: item.scheduledTime || '',
        photos: Array.isArray(item.photos) ? item.photos.length : 0,
        status: item.status === 'pending' ? 'Pendente' : item.status === 'completed' ? 'Concluída' : item.status === 'cancelled' ? 'Cancelada' : item.status
      }
    } catch {
      return mockTasks.find(t => String(t.id) === String(id)) || null
    }
  },

  async taskPhotos(id) {
    try {
      const photos = await request(`/tasks/${id}/photos`)
      return Array.isArray(photos) ? photos : []
    } catch {
      return []
    }
  },

  async taskCreate(payload) {
    try {
      const created = await request('/tasks', { method: 'POST', body: payload })
      return created
    } catch (e) {
      console.error('Erro ao criar tarefa:', e)
      throw e
    }
  },

  async taskUpdate(id, payload) {
    try {
      const updated = await request(`/tasks/${id}`, { method: 'PATCH', body: payload })
      return updated
    } catch (e) {
      console.error('Erro ao atualizar tarefa:', e)
      throw e
    }
  },

  async taskUploadPhotos(taskId, files) {
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('photos', files[i])
      }

      const auth = getToken()
      const res = await fetch(`${baseUrl}/tasks/${taskId}/photos`, {
        method: 'POST',
        headers: {
          ...(auth ? { Authorization: `Bearer ${auth}` } : {})
        },
        body: formData
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }

      return await res.json()
    } catch (e) {
      console.error('Erro ao enviar fotos:', e)
      throw e
    }
  },

  async inventory() {
    try {
      const list = await request('/inventory')
      return Array.isArray(list) ? list : []
    } catch {
      return mockInventory
    }
  },

  async inventoryItem(id) {
    try {
      const item = await request(`/inventory/${id}`)
      return item
    } catch {
      return mockInventory.find(i => String(i.id) === String(id)) || null
    }
  },

  async inventoryCreate(payload) {
    try {
      const created = await request('/inventory', { method: 'POST', body: payload })
      return created
    } catch (e) {
      console.error('Erro ao criar item de inventário:', e)
      const id = mockInventory.length ? Math.max(...mockInventory.map(i => i.id)) + 1 : 1
      return { id, ...payload }
    }
  },

  async users() {
    try {
      const list = await request('/users')
      return Array.isArray(list) ? list : []
    } catch {
      return mockUsers
    }
  },

  async userCreate(payload) {
    try {
      const created = await request('/users', { method: 'POST', body: payload })
      return created
    } catch {
      const id = mockUsers.length ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1
      return { id, ...payload, active: true }
    }
  },

  async userToggle(id, active) {
    try {
      const updated = await request(`/users/${id}`, { method: 'PATCH', body: { active } })
      return updated
    } catch {
      return { id, active }
    }
  },

  async reports() {
    try {
      const list = await request('/reports')
      return Array.isArray(list) ? list : []
    } catch {
      return mockReports
    }
  },

  async reportsGenerate(payload) {
    try {
      const created = await request('/reports', { method: 'POST', body: payload })
      return created
    } catch {
      const id = mockReports.length ? Math.max(...mockReports.map(r => r.id)) + 1 : 1
      return { id, status: 'pendente', ...payload }
    }
  },
}
