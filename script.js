(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = document.querySelector('#sobre .ff-fade');
  if(!box) return;
  const radios = [...box.querySelectorAll('input[name="fff"]')];
  const imgs = [...box.querySelectorAll('.slides img')];
  let i = 0, hold = false, loaded = 0;
  function start(){
    if (!reduce) {
      setInterval(()=>{ if(!hold){ i = (i+1) % radios.length; radios[i].checked = true; } }, 4200);
      box.addEventListener('mouseenter', ()=> hold = true);
      box.addEventListener('mouseleave', ()=> hold = false);
    }
  }
  imgs.forEach(img=>{
    if(img.complete){ if(++loaded===imgs.length) start(); }
    else{
      img.addEventListener('load', ()=>{ if(++loaded===imgs.length) start(); }, {once:true});
      img.addEventListener('error', ()=>{ if(++loaded===imgs.length) start(); }, {once:true});
    }
  });
})();
</script>

<script> // garante que o primeiro esteja marcado
(function(){ const first = document.querySelector('#depoimentos input[name="t"]'); if (first) first.checked = true; })();
</script>

<!-- Autoplay depoimentos (respeita prefers-reduced-motion) -->
<script>
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = document.querySelector('#depoimentos .t-carousel');
  if(!box) return;
  const radios = [...box.querySelectorAll('input[name="t"]')];
  let i = radios.findIndex(r => r.checked);
  if (i < 0) { radios[0].checked = true; i = 0; }
  let hold = false;
  const tick = () => { if(!hold){ i = (i+1)%radios.length; radios[i].checked = true; } };
  if (!reduce) setInterval(tick, 4500);
  box.addEventListener('mouseenter', ()=> hold = true);
  box.addEventListener('mouseleave', ()=> hold = false);
})();


 // swipe nos depoimentos
(function(){
  const box = document.querySelector('#depoimentos .t-carousel');
  if(!box) return;
  let x0=null, i=[...box.querySelectorAll('input[name="t"]')].findIndex(r=>r.checked);
  const radios=[...box.querySelectorAll('input[name="t"]')];
  const go=n=>{ i=(n+radios.length)%radios.length; radios[i].checked=true; };
  box.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
  box.addEventListener('touchend',e=>{
    if(x0==null) return;
    const dx=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(dx)>40) go(i + (dx<0?1:-1));
  },{passive:true});
})();


<!-- JSON-LD (SEO Local) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "FisioForma Academia",
  "image": "https://fisioforma-site.vercel.app/logo-fisioforma.png",
  "url": "https://fisioforma-site.vercel.app/",
  "telephone": "+55 98 99222-3926",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Avenida Vaticano, 04",
    "addressLocality": "São Luís",
    "addressRegion": "MA",
    "postalCode": "65085-255",
    "addressCountry": "BR"
  },
  "sameAs": [
    "https://instagram.com/fisioforma.acad",
    "https://wa.me/5598992223926"
  ],
  "openingHoursSpecification": [
    {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"06:00","closes":"22:00"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"08:00","closes":"12:00"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"14:30","closes":"17:30"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"08:00","closes":"12:00"}
  ],
  "geo": {"@type":"GeoCoordinates","latitude": -2.5610109,"longitude": -44.3353749},
  "hasMap": "https://www.google.com/maps/search/Av.+Vaticano,+4+-+Anjo+da+Guarda,+S%C3%A3o+Lu%C3%ADs+-+MA,+65085-255",
  "potentialAction": {"@type":"ReserveAction","target":"https://wa.me/5598992223926","result":{"@type":"Thing","name":"Atendimento via WhatsApp"}}
}


(function(){
  const body   = document.querySelector('.igdm-body');
  const typing = body ? body.querySelector('.typing') : null;
  if(!body || !typing) return;

  const atBottom = () =>
    (body.scrollHeight - body.scrollTop - body.clientHeight) < 12;

  function updateTypingVisibility(){
    typing.style.display = atBottom() ? 'flex' : 'none';
  }

  // aparece quando chega no fim, e some ao sair do fim
  body.addEventListener('scroll', updateTypingVisibility, {passive:true});
  // se você entrar já no fim:
  requestAnimationFrame(updateTypingVisibility);

  // “pisca” de forma realista: só mantém visível ~3s após chegar no fundo
  let timer;
  body.addEventListener('scroll', ()=>{
    clearTimeout(timer);
    if(atBottom()){
      typing.style.display='flex';
      timer=setTimeout(()=>{ typing.style.display='none'; }, 3200);
    }
  }, {passive:true});
})();



(function(){
  const box = document.querySelector('#depoimentos .t-carousel');
  if(!box) return;
  const radios = [...box.querySelectorAll('input[name="t"]')];
  let i = radios.findIndex(r => r.checked); if(i<0){ i=0; radios[0].checked=true; }

  const go = n => { i = (n + radios.length) % radios.length; radios[i].checked = true; };
  box.querySelector('.nav-arrows .prev')?.addEventListener('click', () => go(i-1));
  box.querySelector('.nav-arrows .next')?.addEventListener('click', () => go(i+1));

  // teclado: ← → e PgUp/PgDn
  box.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowLeft' || e.key==='PageUp'){ e.preventDefault(); go(i-1); }
    if(e.key==='ArrowRight'|| e.key==='PageDown'){ e.preventDefault(); go(i+1); }
  });
})();



(() => {
  const links = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = [...links].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  sections.forEach(sec => io.observe(sec));
})();



// Autoplay suave da galeria #sobre (respeita prefers-reduced-motion)
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = document.querySelector('#sobre .gallery');
  if(!box) return;
  const radios = [...box.querySelectorAll('input[name="ph"]')];
  let i = radios.findIndex(r => r.checked); if (i < 0) { i = 0; radios[0].checked = true; }
  let hold = false;

  // troca slide
  const go = n => { i = (n + radios.length) % radios.length; radios[i].checked = true; };

  // autoplay
  let timer;
  const start = () => { if (reduce) return; timer = setInterval(() => { if(!hold) go(i+1); }, 4200); };
  const stop  = () => { clearInterval(timer); };

  box.addEventListener('mouseenter', () => hold = true);
  box.addEventListener('mouseleave', () => hold = false);

  // swipe mobile
  let x0=null;
  box.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
  box.addEventListener('touchend',e=>{
    if(x0==null) return;
    const dx=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(dx)>40) go(i + (dx<0?1:-1));
  },{passive:true});

  // iniciar quando as imagens carregarem (ou depois de um pequeno grace period)
  const imgs = box.querySelectorAll('.slides img');
  let loaded = 0, done = false;
  const maybeStart = () => { if(done) return; if(++loaded >= imgs.length) { done = true; start(); setTimeout(start, 150); } };
  imgs.forEach(img => img.complete ? maybeStart() : img.addEventListener('load', maybeStart, {once:true}));
  setTimeout(()=>{ if(!done){ done = true; start(); } }, 1500);
})();
