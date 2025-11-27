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
    ;(async () => {
      try {
        const list = await api.reports()
        if (active) setReports(Array.isArray(list) ? list : [])
      } catch (e) {
        if (active) setReports(baseReports)
        setError('Falha ao carregar relatórios, usando dados mockados')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    const createdAt = new Date().toLocaleDateString()
    const period = dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : dateFrom || ''
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

  const handleSend = () => alert('Email enviado!')

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
                    <tr key={r.id} className="border-t">
                      <td className="p-2">{r.type}</td>
                      <td className="p-2">{r.period}</td>
                      <td className="p-2">{r.client || 'Todos'}</td>
                      <td className="p-2">{r.createdAt}</td>
                      <td className="p-2"><span className="text-gray-800">{r.status}</span></td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleDownload(r.id)}>Download PDF</Button>
                          <Button size="sm" variant="secondary" onClick={handleSend}>Enviar Email</Button>
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