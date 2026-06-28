const CACHE_NAME = 'se-lab-v1'

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
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  if (url.origin === location.origin) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(event.request)
        const fetched = await fetch(event.request).catch(() => cached)
        const response = fetched || cached

        if (fetched && fetched.ok) {
          const clone = fetched.clone()
          const cache = await caches.open(CACHE_NAME)
          cache.put(event.request, clone)
        }

        return response
      })(),
    )
  }
})
