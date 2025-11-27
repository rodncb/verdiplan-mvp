import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { clients, areas, inventory as mockInventory } from '../data/mock'
import { api } from '../lib/api'

export function InventoryDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await api.inventoryItem(id)
        if (active) setItem(data)
      } catch (e) {
        if (active) setItem(mockInventory.find(i => String(i.id) === String(id)) || null)
        setError('Falha ao carregar item, usando dados mockados')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  const getClientName = (cid) => clients.find(c => c.id === cid)?.name || ''
  const getAreaName = (aid) => areas.find(a => a.id === aid)?.name || ''

  if (!item) {
    return (
      <Layout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Item não encontrado</h1>
          <Button onClick={() => navigate('/inventory')}>Voltar</Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{item.species}</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100">{item.quantity}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-gray-700">{getClientName(item.clientId)} - {getAreaName(item.areaId)}</div>
            <div className="text-sm text-gray-700">Estado: {item.status}</div>
            <div className="text-sm text-gray-700">Atualizado em {item.updatedAt}</div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>
            )}
            {item.observations && <div className="text-sm text-gray-700">{item.observations}</div>}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => navigate('/inventory')}>Voltar</Button>
        </div>
      </div>
    </Layout>
  )
}