import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { clients, areas } from '../data/mock'
import { api } from '../lib/api'

export function NewInventory() {
  const navigate = useNavigate()
  const [clientId, setClientId] = useState('')
  const [areaId, setAreaId] = useState('')
  const [species, setSpecies] = useState('')
  const [quantity, setQuantity] = useState('')
  const [status, setStatus] = useState('')
  const [observations, setObservations] = useState('')

  const filteredAreas = clientId ? areas.filter(a => a.clientId === parseInt(clientId)) : []

  const [saving, setSaving] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { clientId: parseInt(clientId), areaId: parseInt(areaId), species, quantity: parseInt(quantity), status, observations }
    try {
      await api.inventoryCreate(payload)
      alert('Item de inventário salvo!')
      navigate('/inventory')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Item de Inventário</h1>
          <p className="text-gray-600 mt-1">Cadastre um item associado a cliente e área</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select id="client" value={clientId} onChange={(e) => { setClientId(e.target.value); setAreaId('') }} required>
                  <option value="">Selecione um cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área *</Label>
                <Select id="area" value={areaId} onChange={(e) => setAreaId(e.target.value)} disabled={!clientId} required>
                  <option value="">Selecione uma área</option>
                  {filteredAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Espécie *</Label>
                <Input id="species" value={species} onChange={(e) => setSpecies(e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input id="quantity" type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado *</Label>
                  <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="">Selecione</option>
                    <option value="bom">bom</option>
                    <option value="regular">regular</option>
                    <option value="ruim">ruim</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea id="observations" rows={4} value={observations} onChange={(e) => setObservations(e.target.value)} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={saving}>Salvar</Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/inventory')}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}