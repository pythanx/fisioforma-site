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

  const track  = root.querySelector('.testimonial-track');
  const slides = Array.from(root.querySelectorAll('.testimonial-item'));
  const dots   = Array.from(root.querySelectorAll('.testimonial-dots button'));

  let idx = 0;
  let width = 0;
  let timer = null;
  const AUTOPLAY_MS = 6000;

  function measure() {
    // mede a largura visível do carrossel
    width = root.getBoundingClientRect().width || root.clientWidth || 0;
    if (!width) return;
    slides.forEach(s => { s.style.width = width + 'px'; });
    go(idx, false);
  }

  function go(n, animate = true) {
    idx = (n + slides.length) % slides.length;
    if (!width) measure();
    if (!animate) track.style.transition = 'none';

    const x = -idx * width;
    track.style.transform = `translate3d(${x}px,0,0)`;

    if (!animate) {
      // força reflow e reativa transição para próximos movimentos
      // eslint-disable-next-line no-unused-expressions
      track.offsetHeight;
      track.style.transition = '';
    }
    dots.forEach((d,i)=>d.classList.toggle('active', i===idx));
  }

  // dots
  dots.forEach((d,i)=> d.addEventListener('click', ()=> go(i)));

  // autoplay
  function start(){ stop(); timer = setInterval(()=>go(idx+1), AUTOPLAY_MS); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // drag / swipe
  let downX = 0, dragging = false;
  function onDown(e){
    dragging = true;
    track.style.transition = 'none';
    downX = (e.touches ? e.touches[0].clientX : e.clientX);
  }
  function onMove(e){
    if(!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = x - downX;
    track.style.transform = `translate3d(${(-idx*width)+dx}px,0,0)`;
  }
  function onUp(e){
    if(!dragging) return;
    dragging = false;
    track.style.transition = '';
    const x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
    const dx = x - downX;
    const threshold = Math.max(40, width*0.15);
    if (dx > threshold) go(idx-1);
    else if (dx < -threshold) go(idx+1);
    else go(idx);
  }
  track.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  track.addEventListener('touchstart', onDown, {passive:true});
  track.addEventListener('touchmove', onMove, {passive:true});
  track.addEventListener('touchend', onUp);

  // medir quando realmente pintou
  window.addEventListener('load', measure);
  // re-medir ao redimensionar
  window.addEventListener('resize', measure);

  // observer — se o container mudar de tamanho (fontes, banners, etc.)
  if ('ResizeObserver' in window){
    new ResizeObserver(measure).observe(root);
  }

  // init
  measure();
  start();
})();


(function initDepoCarousel() {
  const root = document.querySelector('#depo-carousel');
  if (!root) return;

  const track = root.querySelector('.testimonial-track');
  const slides = Array.from(track.querySelectorAll('.testimonial-item'));
  const dots   = Array.from(root.querySelectorAll('.testimonial-dots button'));

  // estilos mínimos para suavidade (caso não estejam no CSS)
  track.style.willChange = 'transform';
  track.style.transition  = 'transform .55s ease';

  let index = 0;
  let slideW = 0;
  let timer  = null;
  const INTERVAL = 5500;

  // dimensiona cada slide para 100% da largura do carrossel
  function measure() {
    // usa o conteúdo visível do root
    slideW = Math.round(root.getBoundingClientRect().width);
    slides.forEach(s => { s.style.minWidth = slideW + 'px'; });
    // reposiciona no slide atual
    goTo(index, true);
  }

  function updateDots() {
    dots.forEach((d,i) => {
      const active = (i === index);
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function goTo(i, noAnim) {
    // wrap-around
    index = (i + slides.length) % slides.length;
    if (noAnim) {
      const old = track.style.transition;
      track.style.transition = 'none';
      requestAnimationFrame(() => {
        track.style.transform = `translateX(${-index * slideW}px)`;
        // força reflow e restaura
        track.getBoundingClientRect();
        track.style.transition = old || 'transform .55s ease';
      });
    } else {
      track.style.transform = `translateX(${-index * slideW}px)`;
    }
    updateDots();
  }

  function start() {
    stop();
    timer = setInterval(() => goTo(index + 1), INTERVAL);
  }
  function stop() {
    if (timer) clearInterval(timer), (timer = null);
  }

  // Dots
  dots.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      goTo(i);
      start(); // reinicia autoplay após clique
    });
  });

  // Teclado (setas) quando o carrossel está focado
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); start(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index - 1); start(); }
  });

  // Pausar ao passar mouse/tocar
  root.addEventListener('pointerenter', stop);
  root.addEventListener('pointerleave', start);

  // Pausar quando aba não está visível
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // Redimensionamento responsivo
  const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
  ro ? ro.observe(root) : window.addEventListener('resize', measure);

  // Inicializa
  measure();
  start();
})();

