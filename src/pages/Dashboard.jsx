import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { CheckCircle, Clock, MapPin, ListTodo } from 'lucide-react'
import { areas } from '../data/mock'
import { api } from '../lib/api'

export function Dashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const list = await api.tasks()
        if (active) setTasks(Array.isArray(list) ? list : [])
      } catch (e) {
        console.error('Erro ao carregar tarefas:', e)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const todayStr = useMemo(() => {
    const d = new Date()
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }, [])

  const stats = useMemo(() => {
    const todayTasks = tasks.filter(t => t.date === todayStr).length
    const pending = tasks.filter(t => t.status === 'Pendente').length
    const completed = tasks.filter(t => t.status === 'Concluída').length
    const areaCount = areas.length
    return [
      { title: 'Tarefas Hoje', value: String(todayTasks), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
      { title: 'Pendentes', value: String(pending), icon: ListTodo, color: 'text-yellow-600', bg: 'bg-yellow-50' },
      { title: 'Concluídas', value: String(completed), icon: CheckCircle, color: 'text-verde-escuro', bg: 'bg-green-50' },
      { title: 'Áreas', value: String(areaCount), icon: MapPin, color: 'text-laranja', bg: 'bg-orange-50' }
    ]
  }, [tasks, todayStr])

  const parseDate = (d) => {
    const [dd, mm, yyyy] = d.split('/')
    return new Date(`${yyyy}-${mm}-${dd}`)
  }

  const weeklyData = useMemo(() => {
    const now = new Date()
    const startOfWeek = (date) => {
      const d = new Date(date)
      const day = d.getDay() || 7
      d.setHours(0,0,0,0)
      if (day !== 1) d.setDate(d.getDate() - (day - 1))
      return d
    }
    const weeks = [0, 1, 2, 3].map(w => {
      const start = new Date(startOfWeek(now))
      start.setDate(start.getDate() - w * 7)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      const count = tasks.filter(t => {
        const dt = parseDate(t.date)
        return dt >= start && dt <= end
      }).length
      return { label: `Sem ${4 - w}`, tarefas: count }
    }).reverse()
    return weeks
  }, [tasks])

  const topAreas = useMemo(() => {
    const counts = {}
    tasks.forEach(t => { counts[t.area] = (counts[t.area] || 0) + 1 })
    return Object.entries(counts)
      .map(([area, tarefas]) => ({ area, tarefas }))
      .sort((a, b) => b.tarefas - a.tarefas)
      .slice(0, 5)
  }, [tasks])

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bem-vindo ao sistema Verdiplan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas por Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-40">
                {weeklyData.map((w) => (
                  <div key={w.label} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-verde-escuro/80 rounded-sm min-h-[8px]" style={{ height: `${Math.max(8, (w.tarefas || 0) * 12)}px` }} />
                    <div className="text-xs text-gray-600">{w.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Áreas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topAreas.map(item => (
                  <div key={item.area} className="flex items-center gap-2">
                    <div className="text-sm w-36 truncate">{item.area}</div>
                    <div className="flex-1 bg-gray-200 h-2 rounded">
                      <div className="bg-laranja h-2 rounded" style={{ width: `${Math.min(100, item.tarefas * 12)}%` }} />
                    </div>
                    <div className="text-xs text-gray-700 w-6 text-right">{item.tarefas}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.slice(-5).reverse().map(t => (
                <div key={t.id} className="p-3 border rounded hover:shadow cursor-pointer" onClick={() => navigate(`/tasks/${t.id}`)}>
                  <div className="text-sm text-gray-700">{t.client} - {t.area}</div>
                  <div className="text-xs text-gray-600">{t.service} • {t.date} {t.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            size="lg"
            className="flex-1 sm:flex-none h-16 text-lg"
            onClick={() => navigate('/tasks/new')}
          >
            <ListTodo className="w-5 h-5 mr-2" />
            Nova Tarefa
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="flex-1 sm:flex-none h-16 text-lg"
            onClick={() => navigate('/tasks')}
          >
            Ver Todas as Tarefas
          </Button>
        </div>
      </div>
    </Layout>
  )
}
