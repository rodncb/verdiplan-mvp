import { useMemo, useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { clients, reports as baseReports } from '../data/mock'
import { api } from '../lib/api'

export function Reports() {
  const [type, setType] = useState('daily')
  const [clientId, setClientId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [reports, setReports] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const clientName = useMemo(() => {
    return clientId ? (clients.find(c => c.id === parseInt(clientId))?.name || '') : 'Todos'
  }, [clientId])

  // load reports
  useEffect(() => {
    let active = true
    const loadReports = async () => {
      try {
        const list = await api.reports()
        if (active) setReports(Array.isArray(list) ? list : [])
      } catch (e) {
        if (active) setReports(baseReports)
        setError('Falha ao carregar relatórios, usando dados mockados')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadReports()

    // Pooling: atualizar a cada 5 segundos se houver relatórios pendentes
    const interval = setInterval(() => {
      if (reports.some(r => r.status === 'pendente')) {
        loadReports()
      }
    }, 5000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [reports])

  const handleGenerate = async () => {
    setGenerating(true)
    const createdAt = new Date().toLocaleDateString('pt-BR')

    // Converter datas de YYYY-MM-DD para DD/MM/YYYY
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    }

    const period = dateFrom && dateTo
      ? `${formatDate(dateFrom)} - ${formatDate(dateTo)}`
      : formatDate(dateFrom) || ''

    try {
      const created = await api.reportsGenerate({ type, period, client: clientName, createdAt })
      const newReport = created || { id: reports.length + 1, type, period, client: clientName, createdAt, status: 'pendente' }
      setReports([newReport, ...reports])
      alert('Relatório gerado!')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async (reportId) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.facilitaai.com.br/verdiplan'
      const token = localStorage.getItem('verdiplan_token') || ''
      const url = `${baseUrl}/reports/${reportId}/pdf`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Erro ao baixar PDF')

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `relatorio-${reportId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      alert('Erro ao baixar PDF. Funcionalidade será implementada no backend.')
    }
  }

  const handleSend = async (reportId) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.facilitaai.com.br/verdiplan'
      const token = localStorage.getItem('verdiplan_token') || ''
      const url = `${baseUrl}/reports/${reportId}/send`

      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Erro ao enviar email')

      alert('Email enviado com sucesso!')

      // Atualizar lista de relatórios
      const list = await api.reports()
      setReports(Array.isArray(list) ? list : [])

    } catch (error) {
      alert('Erro ao enviar email. Verifique as configurações de SMTP no backend.')
    }
  }

  const handleDelete = async (reportId) => {
    if (!confirm('Tem certeza que deseja deletar este relatório?')) return

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.facilitaai.com.br/verdiplan'
      const token = localStorage.getItem('verdiplan_token') || ''
      const url = `${baseUrl}/reports/${reportId}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Erro ao deletar relatório')

      alert('Relatório deletado com sucesso!')

      // Atualizar lista de relatórios
      const list = await api.reports()
      setReports(Array.isArray(list) ? list : [])

    } catch (error) {
      alert('Erro ao deletar relatório.')
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Gere e visualize relatórios</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerar Relatório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                  <option value="semester">Semestral</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  <option value="">Todos</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="from">De</Label>
                <Input id="from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">Até</Label>
                <Input id="to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>
            <div aria-live="polite" className="sr-only">{generating ? 'Gerando...' : ''}</div>
            <div className="flex gap-2">
              <Button onClick={() => setShowPreview(true)} disabled={generating}>Preview</Button>
              <Button onClick={handleGenerate} disabled={generating}>Gerar Relatório</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded bg-gray-50 animate-pulse h-24" />
                ))}
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Período</th>
                    <th className="p-2">Cliente</th>
                    <th className="p-2">Gerado em</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r._id || r.id} className="border-t">
                      <td className="p-2">{r.type}</td>
                      <td className="p-2">{r.period}</td>
                      <td className="p-2">{r.client || 'Todos'}</td>
                      <td className="p-2">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          r.status === 'gerado' ? 'bg-green-100 text-green-800' :
                          r.status === 'enviado' ? 'bg-blue-100 text-blue-800' :
                          r.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.status === 'pendente' ? '⏳ Gerando...' : r.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDownload(r._id || r.id)}
                            disabled={r.status === 'pendente' || r.status === 'erro'}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSend(r._id || r.id)}
                            disabled={r.status === 'pendente' || r.status === 'erro'}
                          >
                            Enviar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(r._id || r.id)}
                          >
                            Deletar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mt-4">{error}</div>
            )}
          </CardContent>
        </Card>
      </div>
  {showPreview && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle>Preview do Relatório</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-700">Tipo: {type}</div>
              <div className="text-sm text-gray-700">Cliente: {clientName}</div>
              <div className="text-sm text-gray-700">Período: {dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : (dateFrom || 'Não definido')}</div>
              <div aria-live="polite" className="sr-only">{generating ? 'Gerando...' : ''}</div>
              <div className="flex gap-2 pt-2">
                <Button onClick={() => { setShowPreview(false); handleGenerate() }} disabled={generating}>Confirmar Geração</Button>
                <Button variant="secondary" onClick={() => setShowPreview(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  )
}