// Сербский тренажёр: работа без интернета
const CACHE='srb-v25';
const FILES=['./','./index.html','./pics.json','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const SOUNDS=["./sound-g0.json", "./sound-g1.json", "./sound-g2.json", "./sound-g3.json", "./sound-g4.json", "./sound-g5.json", "./sound-g6.json", "./sound-g7.json", "./sound-g8.json", "./sound-g9.json"];
// при установке берём свежие файлы с сервера, а не из кэша браузера
const fresh=u=>fetch(new Request(u,{cache:'reload'}));
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>
  Promise.all(FILES.map(u=>fresh(u).then(r=>c.put(u,r))))
  .then(()=>Promise.all(SOUNDS.map(u=>fresh(u).then(r=>r.ok&&c.put(u,r)).catch(()=>{}))))
).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  // сначала пробуем сеть (свежая версия), без интернета — сохранённая копия
  e.respondWith(caches.open(CACHE).then(c=>fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r})
    .catch(()=>c.match(req,{ignoreSearch:true}).then(hit=>hit||c.match('./index.html')))));
});
