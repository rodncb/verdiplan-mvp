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

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

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
          <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">{item.quantity} {item.unit}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categoria</div>
                <div className="text-sm text-gray-900 font-medium mt-1">{item.category}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quantidade</div>
                <div className="text-sm text-gray-900 font-medium mt-1">{item.quantity} {item.unit}</div>
              </div>
              {item.location && (
                <div className="sm:col-span-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Localização</div>
                  <div className="text-sm text-gray-900 mt-1">{item.location}</div>
                </div>
              )}
              {item.minStock > 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estoque Mínimo</div>
                  <div className="text-sm text-gray-900 mt-1">{item.minStock} {item.unit}</div>
                </div>
              )}
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Atualizado em</div>
                <div className="text-sm text-gray-900 mt-1">{new Date(item.updatedAt).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
            {item.notes && (
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Observações</div>
                <div className="text-sm text-gray-900 mt-1">{item.notes}</div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => navigate('/inventory')}>Voltar</Button>
        </div>
      </div>
    </Layout>
  )
}