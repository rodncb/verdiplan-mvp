import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { mockTasks } from '../data/mock'
import { api, API_BASE_URL } from '../lib/api'
import { db } from '../lib/db'
import { syncQueue } from '../lib/syncQueue'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function TaskDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [task, setTask] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [pendingPhotos, setPendingPhotos] = useState([])
  const isOnline = useOnlineStatus()

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        // Carregar tarefa do cache primeiro (para offline)
        const cachedTask = await db.getTask(parseInt(id))
        if (cachedTask && active) {
          setTask(cachedTask)
          setLoading(false)
        }

        // Tentar carregar do backend se estiver online
        if (isOnline) {
          const item = await api.task(id)
          if (active) setTask(item)

          // Carregar fotos da tarefa
          try {
            const taskPhotos = await api.taskPhotos(id)
            if (active) setPhotos(Array.isArray(taskPhotos) ? taskPhotos : [])
          } catch (e) {
            console.log('Fotos não disponíveis ainda')
          }
        }

        // Carregar fotos pendentes de upload
        const pending = await db.getPendingPhotos(parseInt(id))
        if (active) setPendingPhotos(pending)

      } catch (e) {
        if (active) {
          const mockTask = mockTasks.find(t => String(t.id) === String(id))
          setTask(mockTask || null)
          setError('Falha ao carregar tarefa, usando dados mockados')
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id, isOnline])

  const handlePhotoUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const savedPhotos = []

    try {
      // SEMPRE salvar localmente primeiro
      for (let i = 0; i < files.length; i++) {
        const savedPhoto = await db.savePhoto(parseInt(id), files[i], {
          description: `Foto ${i + 1}`
        })
        savedPhotos.push(savedPhoto)
      }

      // Atualizar lista de fotos pendentes
      setPendingPhotos([...pendingPhotos, ...savedPhotos])

      // Se estiver ONLINE, tentar fazer upload imediatamente
      if (isOnline) {
        try {
          await syncQueue.syncAll()
          alert(`${files.length} foto(s) salva(s) e enviada(s)!`)
        } catch (error) {
          alert(`${files.length} foto(s) salva(s) localmente. Serão enviadas quando houver conexão.`)
        }
      } else {
        alert(`${files.length} foto(s) salva(s) localmente. Serão enviadas automaticamente quando houver conexão.`)
      }

      // Recarregar fotos pendentes
      const pending = await db.getPendingPhotos(parseInt(id))
      setPendingPhotos(pending)

    } catch (error) {
      console.error('Erro ao salvar fotos:', error)
      alert('Erro ao salvar fotos localmente. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  if (!task) {
    return (
      <Layout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Tarefa não encontrada</h1>
          <Button onClick={() => navigate('/tasks')}>Voltar</Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{task.client} - {task.area}</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-verde-escuro text-white">{task.status}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-16 bg-gray-100 rounded animate-pulse" />
                <div className="h-16 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Serviço</p>
                  <p className="text-lg font-medium text-gray-900">{task.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data e hora</p>
                  <p className="text-lg font-medium text-gray-900">{task.date} {task.time}</p>
                </div>
              </div>
            )}
            {task.observations && (
              <div>
                <p className="text-sm text-gray-600">Observações</p>
                <p className="text-gray-900">{task.observations}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Fotos ({photos.length + pendingPhotos.length})
              {pendingPhotos.length > 0 && (
                <span className="ml-2 text-sm font-normal text-orange-600">
                  ({pendingPhotos.length} pendente{pendingPhotos.length > 1 ? 's' : ''})
                </span>
              )}
            </CardTitle>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
              <Button as="span" size="sm" disabled={uploading}>
                {uploading ? 'Salvando...' : 'Adicionar Fotos'}
              </Button>
            </label>
          </CardHeader>
          <CardContent>
            {(photos.length > 0 || pendingPhotos.length > 0) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* Fotos já enviadas */}
                {photos.map((photo, idx) => (
                  <div key={photo.url || idx} className="relative aspect-square bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={photo.url?.startsWith('http') ? photo.url : `${API_BASE_URL}${photo.url}`}
                      alt={photo.description || `Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImagem%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Enviada
                    </div>
                  </div>
                ))}

                {/* Fotos pendentes de upload */}
                {pendingPhotos.map((photo, idx) => (
                  <div key={photo.id} className="relative aspect-square bg-gray-200 rounded-md overflow-hidden border-2 border-orange-400">
                    <img
                      src={photo.file}
                      alt={photo.metadata?.description || `Foto pendente ${idx + 1}`}
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <span className="text-white text-xs font-semibold">Aguardando envio</span>
                    </div>
                    <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      Pendente
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma foto adicionada ainda</p>
                <p className="text-sm mt-1">Use o botão acima para adicionar fotos desta tarefa</p>
                <p className="text-xs mt-2 text-gray-400">
                  {isOnline ? '✓ Online - fotos serão enviadas imediatamente' : '✗ Offline - fotos serão salvas localmente'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => navigate('/tasks')}>Voltar</Button>
        </div>
      </div>
    </Layout>
  )
}