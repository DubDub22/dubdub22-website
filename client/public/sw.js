const CACHE_NAME = 'dubdub22-cache-v2';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Only handle GET requests, skip non-http(s)
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

    // Don't cache API calls
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache static assets (JS, CSS, images) but not HTML
                const url = new URL(event.request.url);
                if (url.pathname.startsWith('/assets/')) {
                    const cache = caches.open(CACHE_NAME).then(c => c.put(event.request, response.clone()));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
