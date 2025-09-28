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


//garante que o primeiro esteja marcado
(function(){ const first = document.querySelector('#depoimentos input[name="t"]'); if (first) first.checked = true; })();


// Autoplay e Swipe para o Carrossel de Depoimentos de Alunos
// ... (Código do Menu Mobile, etc.) ...

// Autoplay e Swipe para o Carrossel de Depoimentos de Alunos
(function() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Seletor que funciona com os radios name="t" (t1, t2, etc.)
  const box = document.querySelector('#depoimentos .t-carousel'); 
  if (!box) return;

  const radios = [...box.querySelectorAll('input[name^="t"]')]; 
  let i = radios.findIndex(r => r.checked); 
  if (i < 0) { i = 0; radios[0].checked = true; }
  let hold = false;

  // troca slide
  const go = n => { i = (n + radios.length) % radios.length; radios[i].checked = true; };
  
  // autoplay
  let timer;
  // Intervalo de 4.2 segundos
  const start = () => { if (reduce) return; timer = setInterval(() => { if(!hold) go(i+1); }, 4200); };
  
  box.addEventListener('mouseenter', () => hold = true);
  box.addEventListener('mouseleave', () => hold = false);

  // Swipe logic
  let x0=null;
  box.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
  box.addEventListener('touchend',e=>{
    if(x0==null) return;
    const dx=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(dx)>40) go(i + (dx<0?1:-1));
  },{passive:true});

  start();
})();

// ... (Outros códigos, como carrossel da seção Sobre, etc.) ...


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

// === Match height: card do Professor = altura do carrossel ===
(function () {
  const sec = document.querySelector('#depoimentos');
  if (!sec) return;

  // ajuste aqui se seus seletores forem diferentes
  const leftCard  = sec.querySelector('.testimonial-col .card, .testimonial-col .slider, .testimonial-col'); 
  const profCard  = sec.querySelector('.professor-col .professor-card');

  if (!leftCard || !profCard) return;

  function setHeights() {
    // remove limite pra medir a altura natural do card do carrossel
    profCard.style.setProperty('--prof-max', 'none');

    // mede a altura efetiva do card/esquerda
    const h = leftCard.getBoundingClientRect().height;

    // aplica como max-height no card do Professor
    profCard.style.setProperty('--prof-max', `${Math.max(260, Math.round(h))}px`);
  }

  // chama no load, resize e depois que imagens carregarem
  window.addEventListener('resize', setHeights);
  window.addEventListener('load', setHeights);

  // tenta reagir a imagens do carrossel
  const imgs = leftCard.querySelectorAll('img');
  let loaded = 0;
  imgs.forEach(img => {
    if (img.complete) { if (++loaded === imgs.length) setHeights(); }
    else {
      img.addEventListener('load', () => { if (++loaded === imgs.length) setHeights(); }, { once: true });
      img.addEventListener('error', () => { if (++loaded === imgs.length) setHeights(); }, { once: true });
    }
  });

  // fallback: dispara um ajuste após um pequeno delay (caso nada dispare)
  setTimeout(setHeights, 600);
})();

(function () {
  const sec = document.querySelector('#depoimentos');
  if (!sec) return;

  const leftCard = sec.querySelector('#t-aluno-carousel');       // carrossel de alunos
  const profCard = sec.querySelector('.professor-card');
  if (!leftCard || !profCard) return;

  const setHeights = () => {
    profCard.style.setProperty('--prof-max', 'none');
    const h = leftCard.getBoundingClientRect().height;
    profCard.style.setProperty('--prof-max', Math.max(360, Math.round(h)) + 'px');
  };

  // chama no load/resize e quando imagens do carrossel carregarem
  addEventListener('resize', setHeights, {passive:true});
  addEventListener('load', setHeights);

  const imgs = leftCard.querySelectorAll('img');
  let done = 0;
  imgs.forEach(img=>{
    if (img.complete) { if(++done===imgs.length) setHeights(); }
    else{
      img.addEventListener('load', ()=>{ if(++done===imgs.length) setHeights(); }, {once:true});
      img.addEventListener('error', ()=>{ if(++done===imgs.length) setHeights(); }, {once:true});
    }
  });

  setTimeout(setHeights, 500);   // fallback
})();

(function(){
// Altere aqui seus dados “ocultos”
const PHONE = '5598992223926';                 // só números com DDI
const MAIL  = ['academiafisioformaag','gmail.com']; // dividido para evitar scraping

// WhatsApp com mensagem pré-preenchida
document.getElementById('btn-wa')?.addEventListener('click', ()=>{
  const msg = encodeURIComponent('Olá! Vim pelo site e gostaria de saber mais 🙂');
  window.open(`https://wa.me/${PHONE}?text=${msg}`, '_blank');
});

// Monta mailto só no clique (para não aparecer no HTML)
document.getElementById('btn-mail')?.addEventListener('click', ()=>{
  const address = `${MAIL[0]}@${MAIL[1]}`;
  const subject = encodeURIComponent('Contato pelo site FisioForma');
  location.href = `mailto:${address}?subject=${subject}`;
});
})();

<script>
  (function(){
    const grid = document.querySelector('.team-grid');
    if(!grid) return;
    const n = grid.querySelectorAll('.team-card').length;
    // remove classes antigas (caso re-render)
    grid.className = grid.className.replace(/\bteam-\d+\b/g, '').trim();
    grid.classList.add('team-' + Math.min(n, 9)); // até 9 por segurança
  })();
</script>

