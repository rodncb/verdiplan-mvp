import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { CheckCircle, Clock, MapPin, ListTodo } from 'lucide-react'

export function Dashboard() {
  const navigate = useNavigate()

  const stats = [
    {
      title: 'Tarefas Hoje',
      value: '5',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Pendentes',
      value: '3',
      icon: ListTodo,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Concluídas',
      value: '12',
      icon: CheckCircle,
      color: 'text-verde-escuro',
      bg: 'bg-green-50'
    },
    {
      title: 'Áreas',
      value: '26',
      icon: MapPin,
      color: 'text-laranja',
      bg: 'bg-orange-50'
    }
  ]

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
