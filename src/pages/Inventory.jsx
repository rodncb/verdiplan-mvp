import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Select } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { clients, areas, inventory as mockInventory } from '../data/mock'
import { api } from '../lib/api'

export function Inventory() {
  const navigate = useNavigate()
  const [filterClient, setFilterClient] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [itemsData, setItemsData] = useState([])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const list = await api.inventory()
        if (active) setItemsData(Array.isArray(list) ? list : [])
      } catch (e) {
        setError('Falha ao carregar inventário, usando dados mockados')
        if (active) setItemsData(mockInventory)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const filteredAreas = useMemo(() => {
    return filterClient ? areas.filter(a => a.clientId === parseInt(filterClient)) : []
  }, [filterClient])

  const items = useMemo(() => {
    return (itemsData || []).filter(item => {
      if (filterClient && item.clientId !== parseInt(filterClient)) return false
      if (filterArea && item.areaId !== parseInt(filterArea)) return false
      if (filterStatus && item.status !== filterStatus) return false
      if (search && !item.species.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [itemsData, filterClient, filterArea, filterStatus, search])

  const getClientName = (id) => clients.find(c => c.id === id)?.name || ''
  const getAreaName = (id) => areas.find(a => a.id === id)?.name || ''

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventário</h1>
            <p className="text-gray-600 mt-1">Itens cadastrados por cliente e área</p>
          </div>
          <Button onClick={() => navigate('/inventory/new')} size="lg">Novo Item</Button>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="f-client">Cliente</Label>
              <Select id="f-client" value={filterClient} onChange={(e) => { setFilterClient(e.target.value); setFilterArea('') }}>
                <option value="">Todos</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-area">Área</Label>
              <Select id="f-area" value={filterArea} onChange={(e) => setFilterArea(e.target.value)} disabled={!filterClient}>
                <option value="">Todas</option>
                {filteredAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-status">Estado</Label>
              <Select id="f-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="bom">bom</option>
                <option value="regular">regular</option>
                <option value="ruim">ruim</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-search">Espécie</Label>
              <Input id="f-search" placeholder="Buscar por espécie" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{items.length} item(s) encontrado(s)</h2>
            {(filterClient || filterArea || filterStatus || search) && (
              <Button variant="ghost" onClick={() => { setFilterClient(''); setFilterArea(''); setFilterStatus(''); setSearch('') }}>Limpar filtros</Button>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border rounded bg-gray-50 animate-pulse h-32" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map(item => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/inventory/${item.id}`)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{item.species}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100">{item.quantity}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-gray-600">{getClientName(item.clientId)} - {getAreaName(item.areaId)}</div>
                    <div className="text-sm text-gray-600">Atualizado em {item.updatedAt}</div>
                    <div className="text-sm">
                      <span className={item.status === 'bom' ? 'text-green-700' : item.status === 'regular' ? 'text-yellow-700' : 'text-red-700'}>{item.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum item encontrado</h3>
              <p className="text-gray-600 mb-6">Ajuste os filtros ou adicione um novo item</p>
              <Button onClick={() => navigate('/inventory/new')}>Novo Item</Button>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>
          )}
        </div>
      </div>
    </Layout>
  )
}