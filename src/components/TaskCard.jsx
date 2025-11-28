import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Image, Edit2, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { api } from '../lib/api'

export function TaskCard({ task, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return

    try {
      await api.taskDelete(task.id)
      if (onDelete) onDelete(task.id)
    } catch (error) {
      alert('Erro ao deletar tarefa')
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    navigate(`/tasks/${task.id}/edit`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-900">
          {task.client} - {task.area}
        </CardTitle>
        <p className="text-sm text-gray-600 font-medium">{task.service}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-verde-escuro" />
            <span>{task.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-verde-escuro" />
            <span>{task.time}</span>
          </div>
        </div>

        {task.observations && (
          <p className="text-sm text-gray-600 line-clamp-2">{task.observations}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Image className="w-4 h-4 text-laranja" />
            <span>{task.photos} fotos</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-verde-escuro text-white">
              {task.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
