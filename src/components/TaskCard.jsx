import { Calendar, Clock, Image } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export function TaskCard({ task }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
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

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-verde-escuro text-white">
            {task.status}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
