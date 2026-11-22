/* Extra motion layer */
(function(){
  var doc=document,root=doc.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(pointer: fine)').matches;

  /* ---- loader ---- */
  var loader=doc.getElementById('loader');
  function ready(){root.classList.add('loaded')}
  if(loader){
    if(reduce){ready();loader.remove();}
    else{
      var nm=doc.getElementById('loaderName'),pct=doc.getElementById('loaderPct');
      nm.innerHTML=nm.textContent.split('').map(function(c,i){return '<span style="--i:'+i+'">'+(c===' '?'&nbsp;':c)+'</span>'}).join('');
      var seen=false;try{seen=sessionStorage.getItem('po-seen')==='1';sessionStorage.setItem('po-seen','1')}catch(e){}
      var t0=performance.now(),D=seen?650:1600;
      (function tick(now){
        var p=Math.min(1,(now-t0)/D);pct.textContent=Math.round(p*100)+'%';
        if(p<1)requestAnimationFrame(tick);
        else{loader.classList.add('out');setTimeout(ready,380);setTimeout(function(){loader.remove()},1200);}
      })(t0);
    }
  }else ready();

  if(reduce)return;

  /* ---- typewriter ---- */
  var ty=doc.getElementById('typer');
  if(ty){
    var words=['websites.','Android apps.','machine learning models.','Python tools.','ideas into projects.'],w=0,c=0,del=false;
    (function step(){
      var word=words[w];
      ty.textContent=word.slice(0,c);
      if(!del&&c===word.length){del=true;return setTimeout(step,1500);}
      if(del&&c===0){del=false;w=(w+1)%words.length;return setTimeout(step,350);}
      c+=del?-1:1;setTimeout(step,del?35:75);
    })();
  }

  /* ---- shooting stars ---- */
  var sp=doc.querySelector('.spotlight');
  if(sp){
    for(var i=0;i<4;i++){
      var s=doc.createElement('div');s.className='shoot';
      s.style.setProperty('--x',(Math.random()*60)+'%');
      s.style.setProperty('--y',(Math.random()*40)+'%');
      s.style.setProperty('--dl',(i*3.1+Math.random()*2)+'s');
      s.style.animationDuration=(5+Math.random()*4)+'s';
      doc.body.appendChild(s);
    }
  }

  /* ---- heading word reveal ---- */
  doc.querySelectorAll('.section-head h2,.hproj-head h2,.po-copy h2,.goal-text h2,.vision h2').forEach(function(h){
    var txt=h.textContent.trim();h.setAttribute('aria-label',txt);
    h.innerHTML=txt.split(/\s+/).map(function(w,i){return '<span class="hw" aria-hidden="true"><span style="--i:'+i+'">'+w+'</span></span>'}).join(' ');
  });

  /* ---- counters ---- */
  var co=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;co.unobserve(e.target);
      var el=e.target,to=+el.dataset.to,t0=performance.now();
      (function f(now){var p=Math.min(1,(now-t0)/1400),v=1-Math.pow(1-p,3);el.textContent=Math.round(v*to);if(p<1)requestAnimationFrame(f)})(t0);
    });
  },{threshold:.6});
  doc.querySelectorAll('.count').forEach(function(n){co.observe(n)});

  /* ---- cursor ring + magnetic buttons ---- */
  if(fine){
    var ring=doc.createElement('div');ring.className='cursor';ring.innerHTML='<span></span>';
    var dot=doc.createElement('div');dot.className='cursor-dot';
    doc.body.appendChild(ring);doc.body.appendChild(dot);
    var mx=0,my=0,rx=0,ry=0;
    addEventListener('pointermove',function(e){
      mx=e.clientX;my=e.clientY;ring.classList.add('show');dot.classList.add('show');
      dot.style.transform='translate('+mx+'px,'+my+'px)';
    },{passive:true});
    doc.addEventListener('pointerleave',function(){ring.classList.remove('show');dot.classList.remove('show')});
    (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop)})();
    doc.addEventListener('pointerover',function(e){
      var lab=e.target.closest&&e.target.closest('[data-cursor]');ring.classList.toggle('label',!!lab);if(lab)ring.firstChild.textContent=lab.dataset.cursor;ring.classList.toggle('big',!lab&&!!(e.target.closest&&e.target.closest('a,button,.project-card,input')));
    });
    doc.addEventListener('pointermove',function(e){
      doc.querySelectorAll('.btn:hover,.social-item:hover').forEach(function(b){
        var r=b.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);
        b.style.transform='translate('+(x*.2)+'px,'+(y*.3)+'px)';
      });
    });
    doc.addEventListener('pointerout',function(e){
      var b=e.target.closest&&e.target.closest('.btn,.social-item');
      if(b&&!b.contains(e.relatedTarget))b.style.transform='';
    });
  }

  /* ---- scroll: marquee speeds up with scroll, orbit drifts ---- */
  var track=doc.querySelector('.marquee-track'),anim=track&&track.getAnimations&&track.getAnimations()[0];
  var orbit=doc.querySelector('.hero .orbit'),last=scrollY,vel=0;
  (function raf(){
    var y=scrollY;vel=vel*.9+(y-last)*.1;last=y;
    if(anim)anim.playbackRate=1+Math.min(Math.abs(vel)*.35,9);
    if(orbit&&y<innerHeight)orbit.style.marginTop=(y*-.08)+'px';
    requestAnimationFrame(raf);
  })();
})();
