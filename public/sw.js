// Service Worker para PWA Verdiplan
const CACHE_NAME = 'verdiplan-v1'
const RUNTIME_CACHE = 'verdiplan-runtime'

// Assets para cachear na instalação
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.json'
]

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...')

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando assets estáticos')
      return cache.addAll(STATIC_ASSETS)
    })
  )

  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...')

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[SW] Removendo cache antigo:', name)
            return caches.delete(name)
          })
      )
    })
  )

  return self.clients.claim()
})

// Estratégia de cache: Network First com fallback para cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requests de outras origens (exceto API)
  if (url.origin !== location.origin && !url.href.includes('api.facilitaai.com.br')) {
    return
  }

  // Para requisições da API: Network Only (não cachear dados dinâmicos)
  if (url.href.includes('/verdiplan') || url.href.includes('api.facilitaai.com.br')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Se falhar, retornar resposta offline
        return new Response(
          JSON.stringify({ error: 'offline', message: 'Sem conexão com a internet' }),
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
      })
    )
    return
  }

  // Para assets estáticos: Cache First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        // Não cachear responses inválidas
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        // Clonar a resposta (pode ser usada apenas uma vez)
        const responseToCache = response.clone()

        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
    })
  )
})

// Sync em background quando voltar online
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag)

  if (event.tag === 'sync-photos') {
    event.waitUntil(
      // O syncQueue será chamado automaticamente quando o app voltar online
      self.registration.showNotification('Verdiplan', {
        body: 'Sincronizando fotos pendentes...',
        icon: '/logo.png'
      })
    )
  }
})

// Notificação push (futuro)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}

  const options = {
    body: data.body || 'Nova notificação',
    icon: '/logo.png',
    badge: '/logo.png',
    data: data.data || {}
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Verdiplan', options)
  )
})

// Click em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})
