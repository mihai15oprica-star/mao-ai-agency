/* ── MAO case-study shared interactions ── */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;

  /* Custom cursor */
  const cursor = document.getElementById('cursor'), ring = document.getElementById('cursor-ring');
  if(fine && cursor && ring){
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
    (function r(){ rx+=(mx-rx)*0.16; ry+=(my-ry)*0.16; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(r); })();
    document.querySelectorAll('a,button,[tabindex]').forEach(el=>{
      el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
    });
  }

  /* Scroll progress */
  const progress = document.getElementById('progress');
  if(progress) window.addEventListener('scroll', ()=>{
    progress.style.width = (window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100)+'%';
  }, {passive:true});

  /* Reveal on scroll — position-based so nothing can stay hidden,
     even on reload scroll-restoration or deep links */
  const sections = [...document.querySelectorAll('.case-section')];
  function reveal(){
    const vh = window.innerHeight;
    sections.forEach(s=>{ if(!s.classList.contains('visible') && s.getBoundingClientRect().top < vh*0.9) s.classList.add('visible'); });
  }
  reveal();
  window.addEventListener('scroll', reveal, {passive:true});
  window.addEventListener('resize', reveal);
  window.addEventListener('load', reveal);

  /* Current year */
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  /* Hero canvas — drifting red particle field + faint ring */
  const c = document.getElementById('case-fx');
  if(c){
    const ctx = c.getContext('2d'); let W,H,dots=[];
    function rs(){ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; const n=Math.min(90, Math.round(W/16));
      dots=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.3,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,red:Math.random()<.5})); }
    rs(); window.addEventListener('resize', rs);
    function draw(){
      ctx.clearRect(0,0,W,H);
      const g=ctx.createRadialGradient(W*0.5,0,0,W*0.5,0,Math.max(W,H)*0.7);
      g.addColorStop(0,'rgba(60,6,12,0.55)'); g.addColorStop(1,'transparent'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      dots.forEach(d=>{ d.x+=d.vx; d.y+=d.vy; if(d.x<0)d.x=W; if(d.x>W)d.x=0; if(d.y<0)d.y=H; if(d.y>H)d.y=0;
        ctx.fillStyle = d.red ? 'rgba(255,60,70,0.55)' : 'rgba(255,255,255,0.35)';
        ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,7); ctx.fill(); });
      if(!reduce) requestAnimationFrame(draw);
    }
    draw();
  }
})();
