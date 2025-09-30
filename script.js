/* ========= Navbar: realça link da seção visível ========= */
(() => {
  const links = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = [...links]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || !sections.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
        );
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  sections.forEach(sec => io.observe(sec));
})();

/* ========= Hero vídeo (Prof. Fisão): pausa quando sai da viewport ========= */
(() => {
  const vid = document.querySelector('.hero-anim-video');
  if (!vid || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? vid.play().catch(()=>{}) : vid.pause());
  }, { threshold: 0.25 });

  io.observe(vid);
})();

/* ========= Carrossel DEPOIMENTOS (#t-aluno-carousel / name="t") ========= */
(() => {
  const box = document.getElementById('t-aluno-carousel');
  if (!box) return;

  const radios = [...box.querySelectorAll('input[type="radio"][name="t"]')];
  if (!radios.length) return;

  let i = radios.findIndex(r => r.checked);
  if (i < 0) { i = 0; radios[0].checked = true; }

  // Dots (sem :has)
  const labels = [...box.querySelectorAll('.dots label')];
  const paint = () => labels.forEach(l => {
    const r = document.getElementById(l.htmlFor);
    l.classList.toggle('active', !!(r && r.checked));
  });
  radios.forEach(r => r.addEventListener('change', paint));
  paint();

  const go = n => { i = (n + radios.length) % radios.length; radios[i].checked = true; paint(); };

  // Autoplay (pausa no hover/toque)
  let hold = false, timer;
  const start = () => { stop(); timer = setInterval(() => { if (!hold) go(i + 1); }, 5200); };
  const stop  = () => { if (timer) clearInterval(timer); };
  box.addEventListener('mouseenter', () => hold = true);
  box.addEventListener('mouseleave', () => hold = false);
  box.addEventListener('touchstart', () => hold = true, {passive:true});
  box.addEventListener('touchend',   () => hold = false, {passive:true});

  // Teclado
  box.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'PageUp')  { e.preventDefault(); go(i - 1); }
    if (e.key === 'ArrowRight'|| e.key === 'PageDown'){ e.preventDefault(); go(i + 1); }
  });

  start();
})();

/* ========= Carrossel GALERIA (#sobre .gallery / name="ph") ========= */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = document.querySelector('#sobre .gallery');
  if (!box) return;

  const radios = [...box.querySelectorAll('input[type="radio"][name="ph"]')];
  if (!radios.length) return;

  let i = radios.findIndex(r => r.checked);
  if (i < 0) { i = 0; radios[0].checked = true; }

  const go = n => { i = (n + radios.length) % radios.length; radios[i].checked = true; };

  // Autoplay com pausa + swipe
  let hold = false, timer;
  const start = () => { if (reduce) return; stop(); timer = setInterval(() => { if (!hold) go(i + 1); }, 4500); };
  const stop  = () => { if (timer) clearInterval(timer); };

  box.addEventListener('mouseenter', () => hold = true);
  box.addEventListener('mouseleave', () => hold = false);

  let x0 = null;
  box.addEventListener('touchstart', e => x0 = e.touches[0].clientX, {passive:true});
  box.addEventListener('touchend',   e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
  }, {passive:true});

  // só inicia após imagens carregarem (ou timeout de segurança)
  const imgs = box.querySelectorAll('.slides img');
  let loaded = 0, booted = false;
  const maybeStart = () => { if (booted) return; if (++loaded >= imgs.length) { booted = true; start(); } };
  imgs.forEach(img => img.complete ? maybeStart() : img.addEventListener('load', maybeStart, {once:true}));
  setTimeout(() => { if (!booted) { booted = true; start(); } }, 1500);
})();





(function () {
  const root = document.getElementById('depo-carousel');
  if (!root) return;

  const track = root.querySelector('.testimonial-track');
  const slides = Array.from(track.children);

  // Dots
  let dotsWrap = root.querySelector('.testimonial-dots') || document.createElement('div');
  dotsWrap.className = 'testimonial-dots';
  if (!dotsWrap.parentNode) root.appendChild(dotsWrap);
  dotsWrap.innerHTML = '';
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
    dotsWrap.appendChild(b);
    return b;
  });

  let index = 0, timer = null;
  const INTERVAL = 7200;

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translate3d(-${index * 100}%,0,0)`;
    dots.forEach((d,k)=>d.classList.toggle('active', k===index));
  }
  function play(){ stop(); timer = setInterval(()=>goTo(index+1), INTERVAL); }
  function stop(){ if (timer) { clearInterval(timer); timer=null; } }

  dots.forEach((btn,i)=>btn.addEventListener('click', ()=>{ goTo(i); play(); }, { passive:true }));

  // Hover pausa
  root.addEventListener('mouseenter', stop, { passive:true });
  root.addEventListener('mouseleave', play, { passive:true });

  // Swipe
  let startX=0, dragging=false, pid=null;
  root.addEventListener('pointerdown',(e)=>{ dragging=true; startX=e.clientX; pid=e.pointerId; root.setPointerCapture(pid); stop(); });
  root.addEventListener('pointerup',(e)=>{ if(!dragging) return; dragging=false; const dx=e.clientX-startX; if(Math.abs(dx)>40){ goTo(index+(dx<0?1:-1)); } play(); });
  root.addEventListener('pointercancel',()=>{ dragging=false; play(); });

  // Proteção de imagens
  slides.forEach(slide=>{
    const img = slide.querySelector('img'); if (!img) return;
    img.loading='lazy'; img.decoding='async';
    img.addEventListener('error', ()=>{ img.style.visibility='hidden'; }, { once:true });
  });

  goTo(0); play();
})();



