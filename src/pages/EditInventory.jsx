import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { clients, areas } from '../data/mock'
import { api } from '../lib/api'

export function EditInventory() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [clientId, setClientId] = useState('')
  const [areaId, setAreaId] = useState('')
  const [minStock, setMinStock] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Carregar dados do item
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const item = await api.inventoryItem(id)
        if (!item) {
          alert('Item não encontrado')
          navigate('/inventory')
          return
        }

        if (active) {
          setName(item.name || '')
          setCategory(item.category || '')
          setQuantity(item.quantity?.toString() || '')
          setUnit(item.unit || '')
          setMinStock(item.minStock?.toString() || '')
          setNotes(item.notes || '')

          // Extrair cliente e área da location
          if (item.location) {
            const parts = item.location.split(' - ')
            const clientName = parts[0]
            const areaName = parts[1]

            const client = clients.find(c => c.name === clientName)
            const area = areas.find(a => a.name === areaName)

            setClientId(client?.id.toString() || '')
            setAreaId(area?.id.toString() || '')
          }

          setLoading(false)
        }
      } catch (error) {
        console.error('Erro ao carregar item:', error)
        alert('Erro ao carregar item')
        navigate('/inventory')
      }
    })()
    return () => { active = false }
  }, [id, navigate])

  const filteredAreas = clientId ? areas.filter(a => a.clientId === parseInt(clientId)) : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const clientName = clientId ? clients.find(c => c.id === parseInt(clientId))?.name : ''
    const areaName = areaId ? areas.find(a => a.id === parseInt(areaId))?.name : ''
    const location = clientName && areaName ? `${clientName} - ${areaName}` : clientName || areaName || ''

    const payload = {
      name,
      category,
      quantity: parseInt(quantity),
      unit,
      location,
      minStock: minStock ? parseInt(minStock) : 0,
      notes
    }

    try {
      await api.inventoryUpdate(id, payload)
      alert('Item atualizado com sucesso!')
      navigate(`/inventory/${id}`)
    } catch (error) {
      console.error('Erro ao atualizar item:', error)
      alert('Erro ao atualizar item')
    } finally {
      setSaving(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Editar Item de Inventário</h1>
          <p className="text-gray-600 mt-1">Atualize as informações do item</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Item *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Palmeira Imperial, Adubo NPK, Tesoura de Poda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Selecione</option>
                    <option value="Plantas">Plantas</option>
                    <option value="Árvores">Árvores</option>
                    <option value="Arbustos">Arbustos</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Insumos">Insumos (Adubo, Terra, etc)</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Materiais">Materiais</option>
                    <option value="Outros">Outros</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade *</Label>
                  <Select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} required>
                    <option value="">Selecione</option>
                    <option value="un">Unidade (un)</option>
                    <option value="kg">Quilograma (kg)</option>
                    <option value="g">Grama (g)</option>
                    <option value="L">Litro (L)</option>
                    <option value="m">Metro (m)</option>
                    <option value="m²">Metro² (m²)</option>
                    <option value="m³">Metro³ (m³)</option>
                    <option value="cx">Caixa (cx)</option>
                    <option value="sc">Saco (sc)</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input id="quantity" type="number" min="0" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Estoque Mínimo</Label>
                  <Input id="minStock" type="number" min="0" step="any" placeholder="Opcional" value={minStock} onChange={(e) => setMinStock(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Cliente (Localização)</Label>
                <Select id="client" value={clientId} onChange={(e) => { setClientId(e.target.value); setAreaId('') }}>
                  <option value="">Nenhum (estoque geral)</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </div>

              {clientId && (
                <div className="space-y-2">
                  <Label htmlFor="area">Área</Label>
                  <Select id="area" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
                    <option value="">Nenhuma área específica</option>
                    {filteredAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Informações adicionais sobre o item..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate(`/inventory/${id}`)}>
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
