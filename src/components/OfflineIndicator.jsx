import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useSyncStatus } from '../hooks/useSyncStatus'
import { WifiOff, Wifi, RefreshCw, CheckCircle } from 'lucide-react'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const { pendingCount, syncing, triggerSync } = useSyncStatus()

  // Não mostrar nada se está online e não há pendências
  if (isOnline && pendingCount === 0 && !syncing) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div
        className={`rounded-lg shadow-lg p-4 border-2 transition-all ${
          isOnline
            ? 'bg-green-50 border-green-500'
            : 'bg-orange-50 border-orange-500'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {syncing ? (
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            ) : isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-orange-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {syncing
                ? 'Sincronizando...'
                : isOnline
                ? 'Online'
                : 'Modo Offline'}
            </p>

            {pendingCount > 0 && (
              <p className="text-sm text-gray-700 mt-1">
                {pendingCount} {pendingCount === 1 ? 'item pendente' : 'itens pendentes'} de sincronização
              </p>
            )}

            {!isOnline && (
              <p className="text-xs text-gray-600 mt-2">
                Suas fotos e dados estão salvos localmente e serão enviados automaticamente quando a conexão for restaurada.
              </p>
            )}

            {isOnline && pendingCount > 0 && !syncing && (
              <button
                onClick={triggerSync}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Sincronizar agora
              </button>
            )}
          </div>

          {syncing && (
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Barra de progresso se estiver sincronizando */}
        {syncing && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}
