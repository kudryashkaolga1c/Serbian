// Сербский тренажёр: работа без интернета
const CACHE='srb-v31';
const FILES=['./','./index.html','./pics.json','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const SOUNDS=["./sound-g0.json", "./sound-g1.json", "./sound-g10.json", "./sound-g2-t0.json", "./sound-g2-t1.json", "./sound-g2-t10.json", "./sound-g2-t11.json", "./sound-g2-t12.json", "./sound-g2-t13.json", "./sound-g2-t14.json", "./sound-g2-t15.json", "./sound-g2-t16.json", "./sound-g2-t17.json", "./sound-g2-t18.json", "./sound-g2-t19.json", "./sound-g2-t2.json", "./sound-g2-t20.json", "./sound-g2-t21.json", "./sound-g2-t22.json", "./sound-g2-t23.json", "./sound-g2-t24.json", "./sound-g2-t3.json", "./sound-g2-t4.json", "./sound-g2-t5.json", "./sound-g2-t6.json", "./sound-g2-t7.json", "./sound-g2-t8.json", "./sound-g2-t9.json", "./sound-g2.json", "./sound-g3.json", "./sound-g4.json", "./sound-g5.json", "./sound-g6.json", "./sound-g7.json", "./sound-g9.json"];
// при установке берём свежие файлы с сервера, а не из кэша браузера
const fresh=u=>fetch(new Request(u,{cache:'reload'}));
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>
  Promise.all(FILES.map(u=>fresh(u).then(r=>c.put(u,r))))
  .then(()=>Promise.all(SOUNDS.map(u=>fresh(u).then(r=>r.ok&&c.put(u,r)).catch(()=>{}))))
).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  // звук и картинки: сначала с телефона (они обновляются вместе с версией приложения), сеть — только если копии нет
  if(/\/(sound-[^/]*|pics)\.json$/.test(new URL(req.url).pathname)){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r}))));
    return;
  }
  // страница: сначала сеть (свежая версия), без интернета — сохранённая копия
  e.respondWith(caches.open(CACHE).then(c=>fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r})
    .catch(()=>c.match(req,{ignoreSearch:true}).then(hit=>hit||c.match('./index.html')))));
});
