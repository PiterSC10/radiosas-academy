const CACHE = 'radiosas-v6-2-banco-auditado-560';
const ASSETS = ['./bank-quality.js?v=560','./historicos-2025.js?v=590','./historicos-2024.js?v=590','./historicos-2022-l.js?v=590','./historicos-2022-a.js?v=590','./historicos-2018.js?v=590','./examenes-directos.js?v=610','./examenes-directos.css?v=600','./simulacros-historicos-v54.js','./simulacros-historicos-v54.css','./clinica-real.css','./clinica-real.js','./clinica-real-banco.js','./','./index.html','./app.js','./app.js?v=610','./data.js','./bank-master.js','./bank-5000.js','./lab-data.js','./lab-atlas.js','./rx-torax-esquema.svg','./styles.css','./simulacros-historicos-v54.css?v=550','./favicon.svg','./manifest.webmanifest','./paula-hero.webp','./paula-avatar.png','./paula-social-card.png'];
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
