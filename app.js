
(()=>{"use strict";
const slides=Array.isArray(window.BOOTCAMP_SLIDES)?window.BOOTCAMP_SLIDES:[];
const FORM_URL="https://docs.google.com/forms/d/e/1FAIpQLScfzEzgYwAPpayLF27-M8ivG-axc6S2gQjHh3_g4lesVBavFQ/viewform";
const SOURCES={
"CLAUDE AI":["https://claude.ai/","Open Claude"],
"CLAUDE BASICS":["https://claude.ai/","Open Claude"],
"CLAUDE LIVE DEMO":["https://claude.ai/","Open Claude"],
"CLAUDE ARTIFACTS":["https://claude.ai/","Open Claude"],
"CLAUDE WORKSPACE":["https://claude.ai/","Open Claude"],
"CLAUDE WORK MODES":["https://claude.ai/","Open Claude"],
"CLAUDE CHALLENGE":["https://claude.ai/","Open Claude"],
"NOTEBOOKLM":["https://notebooklm.google.com/","Open NotebookLM"],
"NOTEBOOKLM DEMO":["https://notebooklm.google.com/","Open NotebookLM"],
"NOTEBOOKLM CHALLENGE":["https://notebooklm.google.com/","Open NotebookLM"],
"GAMMA":["https://gamma.app/","Open Gamma"],
"GAMMA LIVE DEMO":["https://gamma.app/","Open Gamma"],
"GAMMA CHALLENGE":["https://gamma.app/","Open Gamma"],
"GOOGLE FLOW":["https://labs.google/fx/tools/flow","Open Google Flow"],
"FLOW LIVE DEMO":["https://labs.google/fx/tools/flow","Open Google Flow"],
"FLOW CHALLENGE":["https://labs.google/fx/tools/flow","Open Google Flow"],
"SUNO AI":["https://suno.com/","Open Suno"],
"SUNO LIVE DEMO":["https://suno.com/","Open Suno"],
"SUNO CHALLENGE":["https://suno.com/","Open Suno"],
"ZAPIER":["https://zapier.com/","Open Zapier"],
"ZAPIER LIVE DEMO":["https://zapier.com/","Open Zapier"]
};
const byId=(id)=>document.getElementById(id);
let index=0,notesOpen=false,toastTimer=null;
function escapeText(text){return String(text??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function currentShareUrl(){if(location.protocol==="https:"||location.protocol==="http:")return location.origin+location.pathname+"#slide-1";return "https://github.com/shah-bakhsh/AIBootcamp";}
function qrUrl(value){return "https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data="+encodeURIComponent(value);}
function showToast(message){const el=byId("toast");clearTimeout(toastTimer);el.textContent=message;el.classList.remove("hidden");toastTimer=setTimeout(()=>el.classList.add("hidden"),2600);}
function headerLinks(section){
let links=[];
if(section==="SPEAKER") links=[["https://www.linkedin.com/in/shah-bakhsh/","LinkedIn"],["https://github.com/shah-bakhsh","GitHub"]];
else if(SOURCES[section])links=[SOURCES[section]];
else if(["PROMPT ENGINEERING","ZERO-SHOT","ONE-SHOT","FEW-SHOT","PROMPT TECHNIQUES","PROMPT CHAINING","CHALLENGE 01","CONTEXT ENGINEERING","CHALLENGE 02","RAG","RAG CHALLENGE","AGENTS & AUTOMATION","AGENTIC AI","AUTOMATION"].includes(section))links=[["https://claude.ai/","Try in Claude"]];
return links.length?'<div class="links">'+links.map(([url,label])=>'<a href="'+escapeText(url)+'" target="_blank" rel="noopener noreferrer">'+escapeText(label)+' ↗</a>').join("")+'</div>':"";
}
function qrPanel(url,label,description){
return '<div class="qrwrap"><img src="'+escapeText(qrUrl(url))+'" alt="Scannable QR code for '+escapeText(label)+'" loading="eager" /><div class="sub"><strong>'+escapeText(label)+'</strong><p>'+escapeText(description)+'</p><a href="'+escapeText(url)+'" target="_blank" rel="noopener noreferrer">Open link ↗</a></div></div>';
}
function render(){
const s=slides[index];if(!s)return;
document.title=s.title+" · AI Bootcamp 2026";
const presentation=byId("presentation");
presentation.className="slide"+(index===0?" is-intro":"")+(s.prompt&&s.points?.length>=3?" is-wide":"");
presentation.innerHTML="";
const left=document.createElement("div");left.className="copy";
const list=s.points?.length?'<ul class="bullets">'+s.points.map(p=>"<li>"+escapeText(p)+"</li>").join("")+"</ul>":"";
left.innerHTML='<div class="kicker">'+escapeText(s.section)+'</div><h1>'+escapeText(s.title)+'</h1><p class="lead">'+escapeText(s.lead)+'</p>'+list+headerLinks(s.section);
if(s.prompt){
const box=document.createElement("div");box.className="promptbox";
box.innerHTML='<div class="prompthead"><span>✦ Live prompt • Edit & copy</span><span>Audience ready</span></div>'+
'<textarea id="promptText" aria-label="Editable AI prompt" spellcheck="false"></textarea>'+
'<div class="prompttools"><span class="hint">Change the [BRACKETED] details for your task.</span><div class="actions"><button type="button" class="action" id="resetPrompt">Reset</button><button type="button" class="action primary" id="copyPrompt">Copy prompt ↗</button></div></div>';
left.append(box);box.querySelector("textarea").value=s.prompt;
box.querySelector("#resetPrompt").onclick=()=>{box.querySelector("textarea").value=s.prompt;showToast("Original prompt restored")};
box.querySelector("#copyPrompt").onclick=()=>copyPrompt(box.querySelector("textarea"));
}
if(s.challenge){const note=document.createElement("div");note.className="challenge";note.innerHTML='<b>✦ YOUR CHALLENGE</b> · '+escapeText(s.challenge);left.append(note);}
const right=document.createElement("aside");right.className="visual";
right.innerHTML='<div class="visualhead"><span class="codechip">◈ '+escapeText(s.section)+'</span><div class="dots"><i></i><i></i><i></i></div></div>';
if(index===0)right.innerHTML+=qrPanel(currentShareUrl(),"SCAN • OPEN THE SLIDES","Students can open the same interactive presentation on their phones and copy every prompt.");
else if(s.section==="ATTENDANCE")right.innerHTML+=qrPanel(FORM_URL,"SCAN • ATTENDANCE","Your submission adds a row to Sheets; Zapier sends a confirmation through Gmail.");
else if(s.section==="SPEAKER"){
const im=document.createElement("img");im.className="avatar";im.src="https://github.com/shah-bakhsh.png";im.alt="Shah Bakhsh GitHub profile photograph";im.onerror=()=>{im.remove();const fallback=document.createElement("div");fallback.className="avatar";fallback.style.cssText="display:grid;place-items:center;background:#16334b;color:#8de1eb;font-size:36px;font-weight:800";fallback.textContent="SB";right.append(fallback)};right.append(im);
}
if(index!==0&&s.section!=="ATTENDANCE"){
const diagram=document.createElement("div");diagram.className="diagram";
(s.visual?.length?s.visual:s.points?.slice(0,4)||[]).forEach((step,i)=>{
if(i) {const a=document.createElement("div");a.className="arrowline";diagram.append(a);}
const d=document.createElement("div");d.className="step";d.innerHTML='<span class="stepidx">'+String(i+1).padStart(2,"0")+'</span><span>'+escapeText(step)+'</span>';diagram.append(d);
});right.append(diagram);
}
if(index===0){const mini=document.createElement("div");mini.className="sectionline";mini.innerHTML="UNIVERSITY OF TURBAT <span></span> 19 NOV 2026";right.append(mini);}
presentation.append(left,right);
byId("counter").textContent=String(index+1).padStart(2,"0")+" / "+slides.length;
byId("progressBar").style.width=((index+1)/slides.length*100)+"%";
byId("prev").disabled=index===0;
byId("next").textContent=index===slides.length-1?"Restart ↻":"Next →";
byId("note").textContent=s.note||"Explain this slide simply, then ask the audience to try or respond.";
byId("note").classList.toggle("show",notesOpen);
history.replaceState(null,"","#slide-"+(index+1));
window.scrollTo({top:0,behavior:"instant"});
}
function copyPrompt(ta){
const val=ta.value; if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(val).then(()=>showToast("Prompt copied — paste it in your AI tool")).catch(()=>legacyCopy(ta))}
else legacyCopy(ta);
}
function legacyCopy(ta){ta.select();try{document.execCommand("copy");showToast("Prompt copied — ready to paste")}catch(_){showToast("Select the prompt and copy it manually")}}
function go(n){if(!slides.length)return;index=Math.max(0,Math.min(slides.length-1,n));render();}
function toggleOverview(show){byId("overviewPanel").classList.toggle("hidden",!show);if(show){byId("slideSearch").value="";filterTiles();byId("slideSearch").focus()}}
function filterTiles(){const q=byId("slideSearch").value.toLowerCase().trim();byId("tiles").innerHTML=slides.map((s,i)=>({s,i})).filter(({s})=>!q||s.title.toLowerCase().includes(q)||s.section.toLowerCase().includes(q)).map(({s,i})=>'<button class="tile" data-slide="'+i+'" type="button"><span class="num">'+String(i+1).padStart(2,"0")+' / '+escapeText(s.section)+'</span><strong>'+escapeText(s.title)+'</strong></button>').join("")}
const hash=location.hash.match(/slide-(\d+)/);if(hash)index=Math.min(slides.length-1,Math.max(0,Number(hash[1])-1));
byId("prev").onclick=()=>go(index-1);
byId("next").onclick=()=>go(index===slides.length-1?0:index+1);
byId("overviewBtn").onclick=()=>toggleOverview(true);
byId("closeOverview").onclick=()=>toggleOverview(false);
byId("slideSearch").oninput=filterTiles;
byId("tiles").onclick=(e)=>{const button=e.target.closest("[data-slide]");if(button){go(Number(button.dataset.slide));toggleOverview(false)}};
byId("fullscreenBtn").onclick=()=>{if(document.fullscreenElement){document.exitFullscreen?.()}else{document.documentElement.requestFullscreen?.().catch(()=>showToast("Fullscreen not supported on this device"))}};
byId("speakerBtn").onclick=()=>{notesOpen=!notesOpen;byId("note").classList.toggle("show",notesOpen);showToast(notesOpen?"Presenter notes shown":"Presenter notes hidden")};
window.addEventListener("hashchange",()=>{const h=location.hash.match(/slide-(\d+)/);if(h&&+h[1]!==index+1)go(Number(h[1])-1)});
document.addEventListener("keydown",e=>{
if(!byId("overviewPanel").classList.contains("hidden")){if(e.key==="Escape")toggleOverview(false);return;}
if(e.target.closest("textarea, input, button"))return;
if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" "){e.preventDefault();go(index+1)}
else if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();go(index-1)}
else if(e.key==="Home"){e.preventDefault();go(0)}
else if(e.key==="End"){e.preventDefault();go(slides.length-1)}
else if(e.key.toLowerCase()==="n"){notesOpen=!notesOpen;byId("note").classList.toggle("show",notesOpen)}
else if(e.key.toLowerCase()==="o")toggleOverview(true);
});
let sx=0,sy=0;
byId("presentation").addEventListener("touchstart",e=>{if(e.target.closest("textarea,button,a"))return;sx=e.changedTouches[0].screenX;sy=e.changedTouches[0].screenY},{passive:true});
byId("presentation").addEventListener("touchend",e=>{if(!sx||e.target.closest("textarea,button,a"))return;const dx=e.changedTouches[0].screenX-sx,dy=e.changedTouches[0].screenY-sy;if(Math.abs(dx)>85&&Math.abs(dx)>Math.abs(dy)*1.4)go(index+(dx<0?1:-1));sx=0;sy=0},{passive:true});
render();
})();
