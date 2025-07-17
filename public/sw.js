
const CACHE_NAME = 'clinic-app-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

const API_CACHE_NAME = 'clinic-api-v1';
const IMAGE_CACHE_NAME = 'clinic-images-v1';

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.includes('/rest/v1/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle image requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle other requests
  event.respondWith(handleStaticRequest(request));
});

async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Cache GET requests for specific tables
  const cachableEndpoints = ['services', 'testimonials', 'faqs', 'contact_info', 'message_templates'];
  const shouldCache = request.method === 'GET' && 
    cachableEndpoints.some(endpoint => url.pathname.includes(endpoint));

  if (!shouldCache) {
    return fetch(request);
  }

  try {
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Return cached version if available and not older than 30 minutes
    if (cachedResponse) {
      const cachedDate = new Date(cachedResponse.headers.get('sw-cached-date'));
      const now = new Date();
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (now - cachedDate < thirtyMinutes) {
        return cachedResponse;
      }
    }

    // Fetch fresh data
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-date', new Date().toISOString());
      
      const modifiedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Network error', { status: 503 });
  }
}

async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Image not found', { status: 404 });
  }
}

async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}
