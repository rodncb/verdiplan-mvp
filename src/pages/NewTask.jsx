import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Camera, Image } from 'lucide-react'
import { clients, areas, services } from '../data/mock'

export function NewTask() {
  const navigate = useNavigate()
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [observations, setObservations] = useState('')

  // Filtrar áreas baseado no cliente selecionado
  const filteredAreas = selectedClient
    ? areas.filter(area => area.clientId === parseInt(selectedClient))
    : []

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Tarefa salva com sucesso!')
    navigate('/tasks')
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

              {/* Fotos (simulado) */}
              <div className="space-y-3">
                <Label>Fotos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-verde-medio transition-colors">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <Button
                    type="button"
                    variant="outline"
                    className="mb-2"
                    onClick={() => alert('Funcionalidade de foto será implementada na versão completa')}
                  >
                    Adicionar Foto
                  </Button>
                  <p className="text-xs text-gray-500">
                    Tire fotos da área após realizar o serviço
                  </p>
                </div>

                {/* Preview fake */}
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <Image className="w-5 h-5 text-verde-escuro" />
                  <span className="font-medium">3 fotos adicionadas</span>
                </div>
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
