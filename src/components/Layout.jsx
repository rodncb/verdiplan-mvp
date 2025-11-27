import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User, Home, FileText, Package, BarChart, Users as UsersIcon, Settings, Plus, List } from 'lucide-react'
import { Button } from './ui/button'
import { OfflineIndicator } from './OfflineIndicator'

export function Layout({ children, showHeader = true }) {
  const navigate = useNavigate()
  const location = useLocation()
  const base = '/verdiplan-mvp'
  const current = location.pathname.startsWith(base) ? location.pathname.slice(base.length) : location.pathname

  const handleLogout = () => {
    navigate('/')
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={handleLogoClick}
                className="text-2xl font-bold text-verde-escuro hover:text-verde-medio transition-colors"
              >
                VERDIPLAN
              </button>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">Murillo Rodrigues</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
          </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
                <nav className="flex flex-wrap gap-2 text-gray-700">
                  <Button variant="ghost" onClick={() => navigate('/dashboard')} aria-current={current === '/dashboard' ? 'page' : undefined} className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/tasks')} aria-current={current.startsWith('/tasks') ? 'page' : undefined} className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Tarefas
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/inventory')} aria-current={current.startsWith('/inventory') ? 'page' : undefined} className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Inventário
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/reports')} aria-current={current === '/reports' ? 'page' : undefined} className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" />
                    Relatórios
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/users')} aria-current={current === '/users' ? 'page' : undefined} className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    Usuários
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/settings')} aria-current={current === '/settings' ? 'page' : undefined} className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configurações
                  </Button>
                </nav>

                {/* Ações Rápidas */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate('/tasks/new')}
                    size="sm"
                    className="flex items-center gap-1 bg-verde-escuro hover:bg-verde-medio"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nova Tarefa</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/tasks')}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">Ver Todas</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <OfflineIndicator />
    </div>
  )
}
