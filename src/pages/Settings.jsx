import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Select } from '../components/ui/select'

export function Settings() {
  const [name, setName] = useState('Murillo Rodrigues')
  const [email] = useState('murillo@verdiplan.com.br')
  const [phone, setPhone] = useState('')
  const [reportTime, setReportTime] = useState('16:00')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const saveProfile = () => { setSaving(true); setTimeout(() => { setSaving(false); alert('Perfil atualizado') }, 500) }
  const changePassword = () => { setSaving(true); setTimeout(() => { setSaving(false); alert('Senha alterada') }, 500) }
  const savePrefs = () => { setSaving(true); setTimeout(() => { setSaving(false); alert('Preferências salvas') }, 500) }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>

        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <Input value={email} disabled />
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Button onClick={saveProfile} disabled={saving}>Salvar Alterações</Button>
              </>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input type="password" placeholder="Senha Atual" />
            <Input type="password" placeholder="Nova Senha" />
            <Input type="password" placeholder="Confirmar Nova Senha" />
            <Button onClick={changePassword} disabled={saving}>Alterar Senha</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={reportTime} onChange={(e) => setReportTime(e.target.value)}>
              <option>15:00</option>
              <option>16:00</option>
              <option>17:00</option>
            </Select>
            <Button onClick={savePrefs} disabled={saving}>Salvar Preferências</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div>Versão: 1.0.0</div>
            <div>Ambiente: Desenvolvimento</div>
            <Button onClick={() => alert('Abrir WhatsApp')} aria-label="Abrir suporte via WhatsApp">Suporte via WhatsApp</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}