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





/* ================================================== */
/* ====== DEPOIMENTOS: LAYOUT GRID + CARROSSEL PURE-CSS ====== */
/* ================================================== */

/* Layout Grid para as duas colunas */
#depoimentos .depo-grid {
  display: grid;
  grid-template-columns: 1fr; /* Padrão Mobile: 1 coluna */
  gap: 32px;
  align-items: flex-start;
}
@media (min-width: 800px) {
  #depoimentos .depo-grid {
    grid-template-columns: 1.2fr 1fr; /* Desktop: Carrossel ligeiramente maior que a coluna do Prof. */
  }
}

/* Coluna 1: Carrossel */
#depoimentos .depo-col h3 {
  margin-top: 0;
  text-align: center;
}
#depoimentos .testimonial-carousel-wrap {
  /* O carrossel agora herda o estilo da caixa .gallery */
  box-shadow: 0 16px 32px rgba(8, 34, 66, .08);
  border-radius: 18px;
  background: #fff;
  padding: 0;
  margin: 0 auto; /* Centraliza a coluna */
}

/* Tamanho do viewport do depoimento (altura necessária para o conteúdo) */
#depoimentos .viewport { 
  min-height: 520px;
} 
#depoimentos .slides li {
  /* Altera para o item de depoimento ficar no centro superior, não no meio vertical */
  align-items: flex-start;
  padding: 32px 20px 20px;
}

/* Estilos do Conteúdo do Depoimento */
.testimonial-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}
.testimonial-item .avatar {
  width: 140px; 
  height: 140px;
  object-fit: cover;
  border-radius: 999px;
  border: 4px solid var(--brand);
  box-shadow: 0 8px 16px rgba(8, 34, 66, .10);
  margin-bottom: 20px;
}
.testimonial-card h4 {
  margin: 0 0 8px;
  font-size: 20px;
  line-height: 1.3;
  color: var(--brand-ink);
}
.testimonial-card p {
  margin: 0 0 4px;
  font-size: 16px;
  line-height: 1.6;
}
.testimonial-card .testimonial-source {
  font-size: 13px;
  color: var(--muted);
  opacity: .9;
  margin-top: 12px;
}
.testimonial-card .testimonial-author {
  font-weight: bold;
}

/* Coluna 2: Professor */
.professor-col h3 {
  margin-top: 0;
  text-align: center;
}
.professor-card {
  /* Garante que o card do professor tenha a mesma aparência de card da coluna do carrossel */
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 16px 32px rgba(8, 34, 66, .08);
  padding: 24px;
}
.professor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--brand);
}
.mini-heading {
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--brand-ink);
  margin: 10px 0;
}
.tip-type {
  font-weight: 700;
  color: var(--brand);
  display: block;
  margin-bottom: 2px;
}
.resposta-professor {
  font-size: 15px;
  margin-top: 6px;
  line-height: 1.5;
}
.section-div {
  border: none;
  border-top: 1px solid var(--line);
  margin: 20px 0;
}


/* ====== ATIVAÇÃO DOS 9 SLIDES (PURE CSS) ====== */

/* Ativação dos slides de depoimentos (9 itens - Reusa o efeito Fade da Galeria de Fotos) */
#t1:checked ~ .viewport .slides li:nth-child(1),
#t2:checked ~ .viewport .slides li:nth-child(2),
#t3:checked ~ .viewport .slides li:nth-child(3),
#t4:checked ~ .viewport .slides li:nth-child(4),
#t5:checked ~ .viewport .slides li:nth-child(5),
#t6:checked ~ .viewport .slides li:nth-child(6),
#t7:checked ~ .viewport .slides li:nth-child(7),
#t8:checked ~ .viewport .slides li:nth-child(8),
#t9:checked ~ .viewport .slides li:nth-child(9) {
  opacity: 1;
  transform: none;
}

/* Ativação dos dots de depoimentos (9 itens) */
#t1:checked ~ .dots label[for="t1"],
#t2:checked ~ .dots label[for="t2"],
#t3:checked ~ .dots label[for="t3"],
#t4:checked ~ .dots label[for="t4"],
#t5:checked ~ .dots label[for="t5"],
#t6:checked ~ .dots label[for="t6"],
#t7:checked ~ .dots label[for="t7"],
#t8:checked ~ .dots label[for="t8"],
#t9:checked ~ .dots label[for="t9"] {
  background: var(--brand);
  transform: scale(1.2);
  box-shadow: 0 0 0 8px rgba(43, 107, 138, .12);
}

/* Responsivo para depoimentos (ajusta altura em telas menores) */
@media (max-width: 640px) {
  #depoimentos .viewport {
    min-height: 480px;
  }
}





