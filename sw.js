// Сербский тренажёр: работа без интернета
const CACHE='srb-v7';
const FILES=['./','./index.html','./pics.json','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const SOUNDS=["./sound-g0.json", "./sound-g1.json", "./sound-g2.json", "./sound-g3.json", "./sound-g4.json", "./sound-g5.json", "./sound-g6.json", "./sound-g7.json"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES).then(()=>Promise.all(SOUNDS.map(u=>c.add(u).catch(()=>{}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  // сначала показываем сохранённую копию, а в фоне подтягиваем свежую версию
  e.respondWith(caches.open(CACHE).then(c=>c.match(req,{ignoreSearch:true}).then(hit=>{
    const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(req,r.clone());return r}).catch(()=>hit);
    return hit||net;
  })));
});
