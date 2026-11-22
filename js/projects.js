(function(){
const grid=document.getElementById("projectGrid"),search=document.getElementById("projectSearch"),filters=document.getElementById("projectFilters"),count=document.getElementById("projectCount");
let selected="All";
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function render(){
 const all=window.portfolioProjects||[],q=search.value.trim().toLowerCase();
 const found=all.filter(p=>{
  const ok=selected==="All"||p.category===selected;
  return ok&&[p.name,p.category,p.status,p.description,...p.technologies,...p.features].join(" ").toLowerCase().includes(q);
 });
 count.textContent=`Showing ${found.length} of ${all.length} projects`;
 if(!found.length){grid.innerHTML='<div class="project-empty">No projects match. Clear the search or pick another category.</div>';return;}
 grid.innerHTML=found.map((p,i)=>`<article class="project-card ${["","m2","m3"][i%3]} reveal" style="--d:${(i%3)*.08}s">
 <div class="project-media" data-art="${esc(p.id)}"><span class="project-symbol">${esc(p.symbol)}</span></div>
 <div class="project-body"><div class="meta-row"><span class="project-category">${esc(p.category)}</span><span class="project-status ${["In Development","Learning Project"].includes(p.status)?"progress":""}">${esc(p.status)}</span></div>
 <h3>${esc(p.name)}</h3><p>${esc(p.description)}</p>
 <div class="tech-row">${p.technologies.slice(0,4).map(t=>`<span class="tech-pill">${esc(t)}</span>`).join("")}</div>
 <div class="project-actions"><a class="btn btn-primary btn-sm" href="project-details/${encodeURIComponent(p.id)}.html">View details</a>
 ${p.demo?`<a class="btn btn-sm" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">Live / view</a>`:""}</div></div></article>`).join("");
 if(window.poArt)window.poArt(grid);if(window.observeReveal)window.observeReveal(grid);
}
filters.addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;selected=b.dataset.category;filters.querySelectorAll(".project-filter").forEach(x=>x.classList.toggle("active",x===b));render();});
search.addEventListener("input",render);
render();
})();
