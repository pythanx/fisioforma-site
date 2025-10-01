FisioForma — Limpeza de arquivos (sem quebrar o site)

O QUE FOI ENTREGUE
1) script.slim.js → substitui seu script.js, removendo duplicidades e mantendo todas as funcionalidades existentes (navbar ativa, vídeo do herói, carrosséis com autoplay/pausa/teclado).
2) ff2.clean.css → bloco CSS consolidado só para a seção de Depoimentos+Dicas (.ff2-*), com altura de 680px, avatares 300x300 com borda azul arredondada, e dots unificados.

COMO APLICAR
A) JavaScript
- Troque a referência no final do index.html para apontar para "script.slim.js" OU sobrescreva seu "script.js" com o conteúdo fornecido.
- Remova os scripts inline antigos do index.html que repetem a lógica da seção (os que contêm '.ff2-viewport' ou 'testimonial-track').

B) CSS
- Abra style.css e apague os blocos duplicados de .ff2-* / fallback antigo (:has) que não estão protegidos por 'html:not(.js) ...'.
  Em especial:
  - Remova o bloco que mostra slides com ':first-of-type' e ':target' fora do guard 'html:not(.js)'.
  - Remova duplicatas de '.ff2-dots', '.ff2-card', '.ff2-carousel', '.ff2-scroll-content' repetidas ao longo do arquivo.
- Na sequência, cole o conteúdo do arquivo ff2.clean.css AO FINAL do seu style.css. Ele sobrescreve todo o necessário.
- Resultado: cards nivelados, 680px de altura, dots corretos e layout consistente, sem precisar manter os blocos repetidos.

C) HTML (index.html)
- Mantenha apenas UM bloco da seção 'DEPOIMENTOS + DICAS (v2, classes novas)'. Se houver outra seção idêntica anterior/seguinte, apague-a.

NOTAS
- Não alteramos NENHUM texto ou imagens.
- Os carrosséis respeitam 'prefers-reduced-motion' e pausam no hover/aba em segundo plano.
- Se quiser voltar atrás, basta remover o apêndice ff2.clean.css e restaurar o script.js antigo.
