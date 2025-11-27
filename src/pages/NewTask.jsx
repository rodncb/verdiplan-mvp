import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Camera, Image, X } from 'lucide-react'
import { clients, areas, services } from '../data/mock'
import { api } from '../lib/api'
import { db } from '../lib/db'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function NewTask() {
  const navigate = useNavigate()
  const isOnline = useOnlineStatus()
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [observations, setObservations] = useState('')
  const [photos, setPhotos] = useState([])
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  // Filtrar áreas baseado no cliente selecionado
  const filteredAreas = selectedClient
    ? areas.filter(area => area.clientId === parseInt(selectedClient))
    : []

  const handlePhotoSelect = (e, fromCamera = false) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Convert files to preview objects
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      fromCamera
    }))

    setPhotos(prev => [...prev, ...newPhotos])
  }

  const removePhoto = (index) => {
    setPhotos(prev => {
      const updated = [...prev]
      // Cleanup preview URL
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const clientName = clients.find(c => c.id === parseInt(selectedClient))?.name || ''
    const areaName = areas.find(a => a.id === parseInt(selectedArea))?.name || ''
    const serviceName = services.find(s => s.id === parseInt(selectedService))?.name || ''

    const payload = {
      client: clientName,
      area: areaName,
      service: serviceName,
      scheduledDate: date,
      scheduledTime: time,
      observations,
      status: 'pending'
    }

    try {
      // Create task first
      const createdTask = await api.taskCreate(payload)
      const taskId = createdTask._id || createdTask.id

      // If we have photos, handle them
      if (photos.length > 0) {
        if (isOnline) {
          // Try to upload photos to backend if online
          try {
            const photoFiles = photos.map(p => p.file)
            await api.taskUploadPhotos(taskId, photoFiles)
          } catch (err) {
            console.error('Erro ao enviar fotos para o servidor:', err)
            // If upload fails, save locally for later sync
            for (const photo of photos) {
              await db.savePhoto(taskId, photo.file)
            }
          }
        } else {
          // Save locally if offline
          for (const photo of photos) {
            await db.savePhoto(taskId, photo.file)
          }
        }
      }

      alert(`Tarefa salva com sucesso! ${photos.length > 0 ? `${photos.length} foto(s) adicionada(s).` : ''}`)
      navigate('/tasks')
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error)
      alert('Erro ao salvar tarefa. Verifique o console.')
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Tarefa</h1>
          <p className="text-gray-600 mt-1">Preencha os dados da tarefa realizada</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select
                  id="client"
                  value={selectedClient}
                  onChange={(e) => {
                    setSelectedClient(e.target.value)
                    setSelectedArea('') // Reset área quando mudar cliente
                  }}
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Área */}
              <div className="space-y-2">
                <Label htmlFor="area">Área *</Label>
                <Select
                  id="area"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={!selectedClient}
                  required
                >
                  <option value="">
                    {selectedClient ? 'Selecione uma área' : 'Primeiro selecione um cliente'}
                  </option>
                  {filteredAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </Select>
                {selectedClient && (
                  <p className="text-xs text-gray-500">
                    {filteredAreas.length} áreas disponíveis
                  </p>
                )}
              </div>

              {/* Serviço */}
              <div className="space-y-2">
                <Label htmlFor="service">Serviço *</Label>
                <Select
                  id="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Hora *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Descreva detalhes sobre a tarefa realizada..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Fotos */}
              <div className="space-y-3">
                <Label>Fotos {!isOnline && <span className="text-sm text-orange-600">(Offline - fotos serão sincronizadas)</span>}</Label>

                {/* Hidden inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePhotoSelect(e, false)}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handlePhotoSelect(e, true)}
                />

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Tirar Foto
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Galeria
                  </Button>
                </div>

                {/* Photo previews */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.preview}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">{photo.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {photos.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma foto adicionada
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" size="lg" className="flex-1">
                  Salvar Tarefa
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
