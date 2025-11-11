import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { TaskCard } from '../components/TaskCard'
import { Button } from '../components/ui/button'
import { Select } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { Plus, Filter } from 'lucide-react'
import { mockTasks } from '../data/mock'

export function TaskList() {
  const navigate = useNavigate()
  const [filterClient, setFilterClient] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

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

        {/* Filtros (apenas visual por enquanto) */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-client">Cliente</Label>
              <Select
                id="filter-client"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
              >
                <option value="">Todos os clientes</option>
                <option value="1">TerrasAlpha Resende 1</option>
                <option value="2">TerrasAlpha Resende 2</option>
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
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {mockTasks.length} {mockTasks.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Empty State (caso não tenha tarefas) */}
        {mockTasks.length === 0 && (
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
      </div>
    </Layout>
  )
}
