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



// ===== Carrossel de Depoimentos (único) =====
(() => {
  const root = document.querySelector('#depo-carousel');
  if (!root) return;

  const track  = root.querySelector('.testimonial-track');
  const slides = Array.from(track.querySelectorAll('.testimonial-item'));
  const dots   = Array.from(root.querySelectorAll('.testimonial-dots button'));

  let i = 0, w = 0, timer = null;
  const INTERVAL = 5500;

  function measure() {
    // largura visível do container
    const rect = root.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width));
    slides.forEach(s => { s.style.minWidth = w + 'px'; s.style.width = w + 'px'; });
    go(i, /*noAnim*/ true);
  }

  function paintDots() {
    dots.forEach((d,idx) => {
      const active = idx === i;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function go(n, noAnim = false) {
    i = (n + slides.length) % slides.length;
    if (noAnim) {
      const t = track.style.transition;
      track.style.transition = 'none';
      track.style.transform = `translate3d(${-i * w}px,0,0)`;
      // força reflow e devolve a transição
      track.getBoundingClientRect();
      track.style.transition = t || 'transform .55s ease';
    } else {
      track.style.transform = `translate3d(${-i * w}px,0,0)`;
    }
    paintDots();
  }

  // Dots
  dots.forEach((btn, idx) => {
    btn.addEventListener('click', () => { go(idx); restart(); });
  });

  // Autoplay (pausa no hover/aba oculta)
  function start() { stop(); timer = setInterval(() => go(i + 1), INTERVAL); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }
  function restart(){ stop(); start(); }

  root.addEventListener('pointerenter', stop);
  root.addEventListener('pointerleave', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  // Swipe / drag
  let downX = 0, dragging = false;
  function onDown(e){
    dragging = true;
    track.style.transition = 'none';
    downX = (e.touches ? e.touches[0].clientX : e.clientX);
  }
  function onMove(e){
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = x - downX;
    track.style.transform = `translate3d(${(-i * w) + dx}px,0,0)`;
  }
  function onUp(e){
    if (!dragging) return;
    dragging = false;
    track.style.transition = 'transform .55s ease';
    const x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
    const dx = x - downX;
    const threshold = Math.max(40, w * 0.15);
    if (dx >  threshold) go(i - 1);
    else if (dx < -threshold) go(i + 1);
    else go(i);
    restart();
  }
  track.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  track.addEventListener('touchstart', onDown, {passive:true});
  track.addEventListener('touchmove', onMove,  {passive:true});
  track.addEventListener('touchend',  onUp);

  // Acessível via teclado
  root.setAttribute('tabindex','0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); restart(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(i - 1); restart(); }
  });

  // Medidas confiáveis e responsivas
  window.addEventListener('load', measure);
  window.addEventListener('resize', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(root);

  measure();
  start();
})();


document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".testimonial-track");
  const items = document.querySelectorAll(".testimonial-item");
  const dotsContainer = document.querySelector(".testimonial-dots");

  let current = 0;
  const total = items.length;
  let interval;

  // Criar dots dinamicamente
  items.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToSlide(i);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("button");

  function goToSlide(index) {
    current = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function nextSlide() {
    current = (current + 1) % total;
    goToSlide(current);
  }

  function resetAutoplay() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }

  // Inicializar
  resetAutoplay();
});
// ===== Carrossel de Depoimentos (robusto, com autoplay) =====
(function(){
  const root = document.getElementById('depo-carousel');
  if(!root) return;

  const track = root.querySelector('.testimonial-track');
  const slides = Array.from(track.children);
  const dotsWrap = root.querySelector('.testimonial-dots');

  let idx = 0;
  const total = slides.length;

  // cria dots conforme nº de slides
  dotsWrap.innerHTML = '';
  slides.forEach((_s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
    b.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(b);
  });

  const dots = Array.from(dotsWrap.children);

  function updateUI(){
    // largura do container (cada slide = 100% do container)
    const offset = -idx * root.clientWidth;
    track.style.transform = `translateX(${offset}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function goTo(i, user=false){
    idx = (i + total) % total;
    updateUI();
    if (user) restartAutoplay();
  }

  // Redimensionamento (evita “desalinho” ao virar landscape/mobile)
  window.addEventListener('resize', () => updateUI());

  // ===== Autoplay com pausa no hover e quando não visível =====
  let timer = null;
  const INTERVAL = 4500;

  function startAutoplay(){
    stopAutoplay();
    timer = setInterval(() => goTo(idx+1, false), INTERVAL);
  }
  function stopAutoplay(){
    if (timer) clearInterval(timer);
    timer = null;
  }
  function restartAutoplay(){
    stopAutoplay();
    startAutoplay();
  }

  // pausa no hover (apenas no card do carrossel)
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);

  // pausa quando sai da tela (IntersectionObserver)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startAutoplay();
      else stopAutoplay();
    });
  }, { threshold: 0.25 });
  io.observe(root);

  // inicializa
  goTo(0);
  startAutoplay();
})();



