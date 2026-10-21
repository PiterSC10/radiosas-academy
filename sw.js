const CACHE = 'radiosas-v4-0.1-paula';
const ASSETS = ['./','./index.html','./app.js','./app.js?v=401','./data.js','./bank-master.js','./bank-5000.js','./styles.css','./styles.css?v=401','./favicon.svg','./manifest.webmanifest','./paula-hero.webp','./paula-avatar.png','./paula-social-card.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k.startsWith('radiosas-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event => {
 const url=new URL(event.request.url);
 if (event.request.method!=='GET'||url.origin!==self.location.origin) return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
  return response;
 }).catch(()=>caches.match(event.request)));
});
