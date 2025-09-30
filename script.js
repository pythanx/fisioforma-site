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


// ===== Motor de carrossel baseado em <input type="radio"> =====
// Reutiliza para a galeria (name="g" por ex.) e para depoimentos (name="t")
(function(){
  const INTERVAL = 5000; // 5s
  const containers = [
    document.querySelector('#depo-carousel') // só controlamos o de depoimentos aqui
  ].filter(Boolean);

  containers.forEach(initRadioCarousel);

  function initRadioCarousel(container){
    // radios deste carrossel
    const radios = Array.from(container.querySelectorAll('input[type="radio"]'));
    if(radios.length === 0) return;

    // dots (labels) correspondentes
    const dots = Array.from(container.querySelectorAll('.dots label'));

    // estado
    let idx = radios.findIndex(r => r.checked) || 0;
    let timer = null;
    let hovering = false;

    // Atualiza UI (radio + dot ativo)
    function setIndex(next){
      idx = (next + radios.length) % radios.length;
      radios[idx].checked = true;
      updateDots();
    }

    function updateDots(){
      dots.forEach((d,i)=> d.classList.toggle('active', i === idx));
    }
    updateDots();

    // Clique nos dots
    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        setIndex(i);
        resetTimer();
      });
    });

    // Troca automática
    function tick(){
      if(hovering) return;
      setIndex(idx + 1);
    }

    function startTimer(){
      if(timer) return;
      timer = setInterval(tick, INTERVAL);
    }
    function stopTimer(){
      if(timer){ clearInterval(timer); timer=null; }
    }
    function resetTimer(){
      stopTimer(); startTimer();
    }

    // Pausa no hover
    container.addEventListener('mouseenter', ()=>{ hovering=true; });
    container.addEventListener('mouseleave', ()=>{ hovering=false; });

    // Só roda autoplay quando visível na tela
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ startTimer(); }
        else{ stopTimer(); }
      });
    }, {threshold: .3});
    io.observe(container);

    // Segurança: se o usuário trocar manualmente via teclado
    radios.forEach((r,i)=> r.addEventListener('change', ()=>{
      if(r.checked){ idx = i; updateDots(); resetTimer(); }
    }));
  }
})();

// ===== Carrossel de Depoimentos (independente, estilo da galeria) =====
(function initDepoCarousel(){
  const root = document.getElementById('depo-carousel');
  if(!root) return;

  const track = root.querySelector('.testimonial-track');
  const slides = Array.from(root.querySelectorAll('.testimonial-item'));
  const dotsWrap = root.querySelector('.testimonial-dots');

  let index = 0;
  let width = root.clientWidth;
  let timer = null;
  const INTERVAL = 5000;

  // cria dots
  slides.forEach((_,i)=>{
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
    b.addEventListener('click', ()=>goTo(i,true));
    dotsWrap.appendChild(b);
  });

  function markDots(){
    dotsWrap.querySelectorAll('button').forEach((d,i)=>{
      d.classList.toggle('active', i===index);
    });
  }

  function update(){
    width = root.clientWidth; // garante cálculo correto quando a coluna muda de largura
    track.style.transform = `translateX(${-index * width}px)`;
    markDots();
  }

  function goTo(i, stopAuto){
    index = (i + slides.length) % slides.length;
    update();
    if(stopAuto) restart();
  }

  // Auto-play com pausa no hover e quando a aba perde o foco
  function start(){ timer = setInterval(()=>goTo(index+1,false), INTERVAL); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function restart(){ stop(); start(); }

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', ()=> (document.hidden ? stop() : start()));
  window.addEventListener('resize', update);

  // largura fixa por slide (para o translate em px)
  const ro = new ResizeObserver(update);
  ro.observe(root);

  // inicia
  markDots(); update(); start();
})();


// ===== Carrossel de Depoimentos (final) =====
(function initDepoCarousel(){
  const root = document.getElementById('depo-carousel');
  if(!root) return;

  const track = root.querySelector('.testimonial-track');
  const slides = Array.from(root.querySelectorAll('.testimonial-item'));
  const dotsWrap = root.querySelector('.testimonial-dots');

  let index = 0;
  let timer = null;
  const INTERVAL = 5500; // ritmo um pouco mais suave

  // cria dots
  dotsWrap.innerHTML = '';
  slides.forEach((_,i)=>{
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
    b.addEventListener('click', ()=>goTo(i,true));
    dotsWrap.appendChild(b);
  });

  function slideWidth(){
    // mede a largura REAL do slide (desconsidera paddings do container)
    return slides[0].getBoundingClientRect().width;
  }

  function markDots(){
    dotsWrap.querySelectorAll('button').forEach((d,i)=>{
      d.classList.toggle('active', i===index);
    });
  }

  function update(){
    const w = slideWidth();
    track.style.transform = `translateX(${-index * w}px)`;
    markDots();
  }

  function goTo(i, stopAuto){
    index = (i + slides.length) % slides.length;
    update();
    if(stopAuto) restart();
  }

  // Auto-play com pausa
  function start(){ timer = setInterval(()=>goTo(index+1,false), INTERVAL); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function restart(){ stop(); start(); }

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', ()=> (document.hidden ? stop() : start()));
  window.addEventListener('resize', update);

  // observa mudanças sutis de largura do slide
  const ro = new ResizeObserver(update);
  ro.observe(slides[0]);

  // inicia
  update(); start();
})();

