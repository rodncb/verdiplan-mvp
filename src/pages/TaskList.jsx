import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { TaskCard } from '../components/TaskCard'
import { Button } from '../components/ui/button'
import { Select } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Plus, Filter } from 'lucide-react'
import { mockTasks, clients, areas, services } from '../data/mock'
import { api } from '../lib/api'

export function TaskList() {
  const navigate = useNavigate()
  const [filterClient, setFilterClient] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterService, setFilterService] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 12
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tasks, setTasks] = useState([])

  const loadTasks = async () => {
    try {
      const list = await api.tasks()
      setTasks(Array.isArray(list) ? list : [])
    } catch (e) {
      setError('Falha ao carregar tarefas, usando dados mockados')
      setTasks(mockTasks)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      if (active) await loadTasks()
    })()
    return () => { active = false }
  }, [])

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const filteredAreas = useMemo(() => {
    return filterClient ? areas.filter(a => a.clientId === parseInt(filterClient)) : []
  }, [filterClient])

  const parseDate = (d) => {
    const [dd, mm, yyyy] = d.split('/')
    return new Date(`${yyyy}-${mm}-${dd}`)
  }

  const filteredTasks = useMemo(() => {
    let list = tasks.length ? tasks : []
    if (filterClient) list = list.filter(t => clients.find(c => c.id === parseInt(filterClient))?.name === t.client)
    if (filterArea) list = list.filter(t => areas.find(a => a.id === parseInt(filterArea))?.name === t.area)
    if (filterService) list = list.filter(t => services.find(s => s.id === parseInt(filterService))?.name === t.service)
    if (filterStatus) list = list.filter(t => (filterStatus === 'concluida' ? 'Concluída' : 'Pendente') === t.status)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.client.toLowerCase().includes(q) ||
        t.area.toLowerCase().includes(q) ||
        t.service.toLowerCase().includes(q) ||
        (t.observations || '').toLowerCase().includes(q)
      )
    }
    if (dateFrom) list = list.filter(t => parseDate(t.date) >= parseDate(dateFrom))
    if (dateTo) list = list.filter(t => parseDate(t.date) <= parseDate(dateTo))
    return list
  }, [tasks, filterClient, filterArea, filterService, filterStatus, search, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize))
  const pageTasks = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredTasks.slice(start, start + pageSize)
  }, [filteredTasks, page])

  const setQuickToday = () => {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const iso = `${dd}/${mm}/${yyyy}`
    setDateFrom(iso)
    setDateTo(iso)
    setPage(1)
  }
  const setQuickPending = () => { setFilterStatus('pendente'); setPage(1) }
  const clearFilters = () => {
    setFilterClient('')
    setFilterArea('')
    setFilterService('')
    setFilterStatus('')
    setDateFrom('')
    setDateTo('')
    setSearch('')
    setPage(1)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
            <p className="text-gray-600 mt-1">Visualize todas as tarefas registradas</p>
          </div>
          <Button onClick={() => navigate('/tasks/new')} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-client">Cliente</Label>
              <Select
                id="filter-client"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
              >
                <option value="">Todos os clientes</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="concluida">Concluída</option>
                <option value="pendente">Pendente</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-area">Área</Label>
              <Select id="filter-area" value={filterArea} onChange={(e) => setFilterArea(e.target.value)} disabled={!filterClient}>
                <option value="">Todas</option>
                {filteredAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-service">Serviço</Label>
              <Select id="filter-service" value={filterService} onChange={(e) => setFilterService(e.target.value)}>
                <option value="">Todos</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">De</Label>
              <Input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Até</Label>
              <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input id="search" placeholder="Cliente, área, serviço, observações" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="secondary" onClick={setQuickToday}>Hoje</Button>
            <Button variant="secondary" onClick={setQuickPending}>Pendentes</Button>
            <Button variant="ghost" onClick={clearFilters}>Limpar</Button>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border rounded bg-gray-50 animate-pulse h-36" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageTasks.map((task) => (
                <TaskCard key={task.id} task={task} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</Button>
          <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
          <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Próxima</Button>
        </div>

        {/* Empty State (caso não tenha tarefas) */}
        {(!loading && filteredTasks.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando sua primeira tarefa
            </p>
            <Button onClick={() => navigate('/tasks/new')}>
              Nova Tarefa
            </Button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
      </div>
    </Layout>
  )
}
