// Basic Service Worker for PWA Installability
const CACHE_NAME = 'timeline-cache-v1';

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (event) => {
    // Simple pass-through for now to satisfy PWA requirements
    event.respondWith(fetch(event.request));
});
