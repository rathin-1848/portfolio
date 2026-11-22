/* Animated mini-illustrations for each project */
(function(){
var A={}, H={wordpro:'var(--gold)',lifekit:'var(--violet)','marks-prediction':'var(--teal)',wayfarer:'var(--teal)','paradox-orbit':'var(--violet)'};
var open='<svg class="art" viewBox="0 0 240 190" aria-hidden="true">';
var lines='',w=[96,80,96,58,96,86,44];
for(var i=0;i<7;i++)lines+='<rect class="ln" style="--k:'+i+'" x="72" y="'+(48+i*16)+'" width="'+w[i]+'" height="6" rx="3" fill="currentColor" opacity=".78"/>';
A.wordpro=open+'<rect x="60" y="12" width="120" height="156" rx="9" fill="#0b0d1c" stroke="currentColor" stroke-width="1.6"/><path d="M60 21a9 9 0 0 1 9-9h102a9 9 0 0 1 9 9v13H60z" fill="currentColor" opacity=".28"/><circle cx="73" cy="23" r="3" fill="currentColor"/><circle cx="84" cy="23" r="3" fill="currentColor" opacity=".6"/><circle cx="95" cy="23" r="3" fill="currentColor" opacity=".3"/>'+lines+'<rect class="sel" x="70" y="78" width="100" height="16" rx="3" fill="currentColor"/></svg>';

A.lifekit=open+'<g transform="translate(0,-6)"><circle class="pr" style="--k:0" cx="120" cy="78" r="30" fill="none" stroke="currentColor" stroke-width="1.5"/><circle class="pr" style="--k:1" cx="120" cy="78" r="30" fill="none" stroke="currentColor" stroke-width="1.5"/><circle class="pr" style="--k:2" cx="120" cy="78" r="30" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="120" cy="78" r="30" fill="#0b0d1c" stroke="currentColor" stroke-width="1.6"/><path class="beat" d="M106 78h28M120 64v28" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></g>'+
'<path d="M10 150H72l8-18 10 36 10-52 10 34 6-10H230" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".22" stroke-linejoin="round" stroke-linecap="round"/><path class="ecg" pathLength="100" d="M10 150H72l8-18 10 36 10-52 10 34 6-10H230" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>';

var pts=[[48,128],[66,112],[84,122],[104,96],[124,100],[144,78],[164,84],[184,58],[204,64]],pc='';
pts.forEach(function(p,k){pc+='<circle class="pt" style="--k:'+k+'" cx="'+p[0]+'" cy="'+p[1]+'" r="4.5" fill="currentColor"/>'});
A['marks-prediction']=open+'<path d="M30 20V160H224" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".4" stroke-linecap="round"/>'+pc+
'<path class="fit" pathLength="100" d="M36 134L216 52" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'+
'<g><circle r="9" fill="none" stroke="currentColor" stroke-width="1.6" class="ping"/><circle r="5" fill="#fff"/><animateMotion dur="6s" repeatCount="indefinite" path="M36 134L216 52" keyTimes="0;.5;.9;1" keyPoints="0;0;1;1" calcMode="linear"/></g></svg>';

var route='M24 140C70 40 120 170 170 90S215 50 220 50';
A.wayfarer=open+'<path d="'+route+'" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".25"/><path class="route" d="'+route+'" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'+
'<circle cx="24" cy="140" r="5.5" fill="#0b0d1c" stroke="currentColor" stroke-width="2"/><circle cx="95.5" cy="107.5" r="5.5" fill="#0b0d1c" stroke="currentColor" stroke-width="2"/><circle cx="170" cy="90" r="5.5" fill="#0b0d1c" stroke="currentColor" stroke-width="2"/>'+
'<path d="M220 52c-8-9-12-14-12-19a12 12 0 0 1 24 0c0 5-4 10-12 19z" fill="currentColor"/><circle cx="220" cy="33" r="4.2" fill="#0b0d1c"/>'+
'<g><circle class="ping" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="-13" y="-8" width="26" height="15" rx="4" fill="#0b0d1c" stroke="currentColor" stroke-width="1.8"/><rect x="-9" y="-5" width="7" height="5" rx="1" fill="currentColor"/><rect x="0" y="-5" width="7" height="5" rx="1" fill="currentColor"/><circle cx="-7" cy="8" r="2.6" fill="currentColor"/><circle cx="7" cy="8" r="2.6" fill="currentColor"/><animateMotion dur="8s" repeatCount="indefinite" path="'+route+'"/></g></svg>';

A['paradox-orbit']=open+'<defs><radialGradient id="poG" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#a39bff"/><stop offset="1" stop-color="#3a3194"/></radialGradient></defs>'+
'<g class="ob" style="--t:30s"><circle cx="120" cy="95" r="82" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="3 6" opacity=".6"/><circle cx="120" cy="13" r="6" fill="var(--gold)"/></g>'+
'<g class="ob" style="--t:18s;animation-direction:reverse"><circle cx="120" cy="95" r="58" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".5"/><circle cx="120" cy="37" r="5" fill="var(--teal)"/><circle cx="120" cy="153" r="3.5" fill="currentColor"/></g>'+
'<g class="ob" style="--t:10s"><circle cx="120" cy="95" r="38" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 5" opacity=".7"/><circle cx="158" cy="95" r="4.5" fill="#fff"/></g>'+
'<circle cx="120" cy="95" r="22" fill="url(#poG)"/><text x="120" y="102" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="19" fill="#fff">PO</text></svg>';

window.PO_ART=A;window.PO_HUE=H;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
window.poArt=function(root){
  (root||document).querySelectorAll('[data-art]:not(.has-art)').forEach(function(m){
    var a=A[m.dataset.art];if(!a)return;
    m.insertAdjacentHTML('afterbegin',a);m.classList.add('has-art');
    if(reduce){var s=m.querySelector('svg');if(s&&s.pauseAnimations)s.pauseAnimations();}
  });
};
window.poArt();
})();
