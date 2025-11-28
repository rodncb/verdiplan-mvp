import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { clients, areas, services } from '../data/mock'
import { api } from '../lib/api'

export function EditTask() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [observations, setObservations] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Carregar dados da tarefa
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const task = await api.task(id)
        if (!task) {
          alert('Tarefa não encontrada')
          navigate('/tasks')
          return
        }

        if (active) {
          // Encontrar IDs baseado nos nomes
          const client = clients.find(c => c.name === task.client)
          const area = areas.find(a => a.name === task.area)
          const service = services.find(s => s.name === task.service)

          setSelectedClient(client?.id.toString() || '')
          setSelectedArea(area?.id.toString() || '')
          setSelectedService(service?.id.toString() || '')

          // Converter data de DD/MM/YYYY para YYYY-MM-DD
          if (task.date) {
            const [day, month, year] = task.date.split('/')
            setDate(`${year}-${month}-${day}`)
          }

          setTime(task.time || '')
          setObservations(task.observations || '')
          setLoading(false)
        }
      } catch (error) {
        console.error('Erro ao carregar tarefa:', error)
        alert('Erro ao carregar tarefa')
        navigate('/tasks')
      }
    })()
    return () => { active = false }
  }, [id, navigate])

  // Filtrar áreas baseado no cliente selecionado
  const filteredAreas = selectedClient
    ? areas.filter(area => area.clientId === parseInt(selectedClient))
    : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const clientName = clients.find(c => c.id === parseInt(selectedClient))?.name || ''
    const areaName = areas.find(a => a.id === parseInt(selectedArea))?.name || ''
    const serviceName = services.find(s => s.id === parseInt(selectedService))?.name || ''

    const payload = {
      client: clientName,
      area: areaName,
      service: serviceName,
      scheduledDate: date,
      scheduledTime: time,
      observations
    }

    try {
      await api.taskUpdate(id, payload)
      alert('Tarefa atualizada com sucesso!')
      navigate(`/tasks/${id}`)
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      alert('Erro ao atualizar tarefa')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/tasks/${id}`)
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Tarefa</h1>
          <p className="text-gray-600 mt-1">Atualize os dados da tarefa</p>
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
                  placeholder="Detalhes adicionais sobre o serviço realizado..."
                  rows={4}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
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
