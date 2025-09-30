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
(function initDepoCarousel(){
  const root = document.getElementById('depo-carousel');
  if (!root) return;

  const track  = root.querySelector('.testimonial-track');
  const slides = Array.from(root.querySelectorAll('.testimonial-item'));
  const dotsEl = root.querySelector('.testimonial-dots');

  let index = 0, timer = null;
  const INTERVAL = 5500;

  // dots
  dotsEl.innerHTML = '';
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
    b.addEventListener('click', () => goTo(i, true));
    dotsEl.appendChild(b);
  });

  function sizeSlides(){
    const w = root.clientWidth;            // largura exata do viewport do carrossel
    slides.forEach(s => { s.style.flexBasis = w+'px'; s.style.width = w+'px'; });
    track.style.transform = `translateX(${-index*w}px)`;
  }
  function markDots(){
    dotsEl.querySelectorAll('button').forEach((d,i)=>d.classList.toggle('active', i===index));
  }
  function goTo(i, stopAuto){
    index = (i + slides.length) % slides.length;
    const w = root.clientWidth;
    track.style.transform = `translateX(${-index*w}px)`;
    markDots();
    if (stopAuto) restart();
  }
  function start(){ timer = setInterval(() => goTo(index+1,false), INTERVAL); }
  function stop(){ if (timer){ clearInterval(timer); timer=null; } }
  function restart(){ stop(); start(); }

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  window.addEventListener('resize', sizeSlides);

  sizeSlides(); markDots(); start();
})();

// ===== Inicialização do Carrossel de Depoimentos (versão JavaScript) =====
(function initDepoimentosCarousel() {
  const root   = document.getElementById('depo-carousel');
  if (!root) return;  // sai se a seção não existe na página

  const track  = root.querySelector('.testimonial-track');
  const slides = Array.from(root.querySelectorAll('.testimonial-item'));
  const dotsContainer = root.querySelector('.testimonial-dots');
  
  let index = 0;
  let timer = null;
  const INTERVAL = 5500; // intervalo de auto-play (ms)

  // Cria os botões de navegação (dots) dinamicamente
  dotsContainer.innerHTML = "";  // garante que está vazio
  slides.forEach((_, i) => {
    const dotButton = document.createElement('button');
    dotButton.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
    dotButton.addEventListener('click', () => goToSlide(i, true));
    dotsContainer.appendChild(dotButton);
  });

  // Marca o dot ativo de acordo com o índice atual
  function updateDots() {
    const allDots = dotsContainer.querySelectorAll('button');
    allDots.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  // Ajusta a largura de cada slide conforme a largura atual do contêiner
  function sizeSlides() {
    const width = root.clientWidth;                // largura visível do carrossel
    slides.forEach(slide => {
      slide.style.flexBasis = width + "px";        // define largura exata de cada slide
      slide.style.width = width + "px";
    });
    track.style.transform = `translateX(${-index * width}px)`;  // reposiciona o slide visível
  }

  // Função de navegação para um slide específico
  function goToSlide(i, stopAuto) {
    index = (i + slides.length) % slides.length;   // calcula índice (com loop infinito)
    const width = root.clientWidth;
    track.style.transform = `translateX(${-index * width}px)`;  // move o trilho
    updateDots();
    if (stopAuto) restartAuto();                   // reinicia auto-play se navegação manual
  }

  // Controle de auto-play
  function startAuto() {
    timer = setInterval(() => goToSlide(index + 1, false), INTERVAL);
  }
  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // Pausa o auto-play ao passar o mouse sobre o carrossel
  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);
  // Pausa quando a aba do navegador está oculta, retoma quando visível novamente
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });
  // Recalcula tamanhos ao redimensionar a janela
  window.addEventListener('resize', sizeSlides);

  // Inicialização do carrossel
  sizeSlides();   // define larguras iniciais corretas dos slides
  updateDots();   // destaca o primeiro dot
  startAuto();    // inicia o auto-play
})();

