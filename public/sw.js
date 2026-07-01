const CACHE_NAME = 'se-lab-v2'

const PRECACHE_URLS = [
  '/',
  '/blog/',
  '/decks/',
  '/projects/',
  '/publications/',
  '/researchers/',
  '/books/',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/favicon.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (shouldBypass(event.request, url)) return

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request)
      const fetched = await fetch(event.request).catch(() => cached)
      const response = fetched || cached

      if (fetched && shouldCache(fetched)) {
        const clone = fetched.clone()
        const cache = await caches.open(CACHE_NAME)
        cache.put(event.request, clone)
      }

      return response
    })(),
  )
})

function shouldBypass(request, url) {
  if (request.method !== 'GET') return true
  if (url.origin !== location.origin) return true
  if (url.pathname.startsWith('/@vite')) return true
  if (url.pathname.startsWith('/src/')) return true
  if (url.pathname.startsWith('/node_modules/')) return true
  if (url.pathname.includes('__vite')) return true
  if (request.headers.get('accept')?.includes('text/event-stream')) return true

  return false
}

function shouldCache(response) {
  if (!response.ok || response.type !== 'basic') return false
  if (response.headers.get('cache-control')?.includes('no-store')) return false

  return true
}
