import { useEffect, useState, useRef } from 'react'
import { Layout } from '../components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { users as baseUsers } from '../data/mock'
import { api } from '../lib/api'

export function Users() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Operador' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const nameRef = useRef(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const list = await api.users()
        if (active) setUsers(Array.isArray(list) ? list : [])
      } catch (e) {
        if (active) setUsers(baseUsers)
        setError('Falha ao carregar usuários, usando dados mockados')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (showModal && nameRef.current) nameRef.current.focus()
  }, [showModal])

  const toggleActive = async (u) => {
    const next = !u.active
    try {
      await api.userToggle(u.id, next)
    } catch {}
    setUsers(users.map(x => x.id === u.id ? { ...x, active: next } : x))
  }

  const openCreateModal = () => {
    setForm({ name: '', email: '', phone: '', role: 'Operador' })
    setShowModal(true)
  }

  const saveUser = async () => {
    setSaving(true)
    try {
      const created = await api.userCreate(form)
      const id = created?.id || (users.length ? Math.max(...users.map(u => u.id)) + 1 : 1)
      setUsers([{ id, ...form, active: true }, ...users])
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <Button onClick={openCreateModal}>Novo Usuário</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded bg-gray-50 animate-pulse h-24" />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left" role="table" aria-label="Lista de Usuários">
                    <thead>
                      <tr className="text-sm text-gray-600">
                        <th className="p-2">Nome</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Cargo</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-t">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{user.role}</td>
                          <td className="p-2">{user.active ? 'Ativo' : 'Inativo'}</td>
                          <td className="p-2">
                            <div aria-live="polite" className="sr-only">{saving ? 'Salvando...' : ''}</div>
                <div className="flex gap-2">
                              <Button size="sm" variant="secondary" onClick={() => toggleActive(user)} aria-label={user.active ? 'Desativar usuário' : 'Ativar usuário'}>{user.active ? 'Desativar' : 'Ativar'}</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {users.length === 0 && (
                  <div className="text-center text-gray-600 py-6">Nenhum usuário cadastrado</div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mt-4">{error}</div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <Card className="w-full max-w-lg sm:max-w-xl">
              <CardHeader>
                <CardTitle>Novo Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input ref={nameRef} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option>Admin</option>
                    <option>Gestor</option>
                    <option>Operacional</option>
                    <option>Operador</option>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveUser} disabled={saving}>Salvar</Button>
                  <Button variant="secondary" onClick={() => setShowModal(false)} aria-label="Cancelar criação de usuário">Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}