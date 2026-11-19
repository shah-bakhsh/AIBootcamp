
(()=>{
"use strict";
const slides=Array.isArray(window.BOOTCAMP_SLIDES)?window.BOOTCAMP_SLIDES:[];
const FORM="https://docs.google.com/forms/d/e/1FAIpQLScfzEzgYwAPpayLF27-M8ivG-axc6S2gQjHh3_g4lesVBavFQ/viewform";
const TOOL={
"CLAUDE":"https://claude.ai/",
"NOTEBOOKLM":"https://notebooklm.google.com/",
"GAMMA":"https://gamma.app/",
"FLOW":"https://labs.google/fx/tools/flow",
"SUNO":"https://suno.com/",
"ZAPIER":"https://zapier.com/"
};
let current=0,playing=false,playTimer=null,notesVisible=false,toastTimer=null;
const root=document.getElementById("deck");
const overlay=document.getElementById("slideOverview");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const userDeckUrl=()=>((location.protocol==="https:"||location.protocol==="http:")?location.origin+location.pathname+"#slide-1":"https://ai-bootcamp-shah-bakhsh.vercel.app/#slide-1");
const qrSrc=url=>"https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=14&color=0A0908&bgcolor=FF841F&data="+encodeURIComponent(url);
function titleHTML(title){const t=String(title);if(t==="AI BOOTCAMP 2026")return 'AI BOOTCAMP<span class="accent">.</span>';
const last=t.lastIndexOf(" ");return last===-1?'<span class="accent">'+esc(t)+'</span>':esc(t.slice(0,last))+' <span class="accent">'+esc(t.slice(last+1))+'</span>';}
function notify(message){const el=document.getElementById("toast");if(!el)return;clearTimeout(toastTimer);el.textContent=message;el.classList.remove("hidden");toastTimer=setTimeout(()=>el.classList.add("hidden"),2400)}
function cardInfo(point,index,slide){
let title="",description=String(point);
const colon=description.indexOf(":");
if(colon>0&&colon<28){title=description.slice(0,colon).trim();description=description.slice(colon+1).trim()}
else if(slide.visual&&slide.visual.length===slide.points.length){title=slide.visual[index];}
else if(description.length<55){title=description;description="";}
else {title="KEY IDEA "+String(index+1).padStart(2,"0");}
return {title,description};
}
function cardMarkup(slide){
let pts=slide.points||[];
return '<div class="cards'+(slide.layout==="cards"||pts.length<3?" onecol":"")+'">'+pts.map((p,i)=>{const {title,description}=cardInfo(p,i,slide);
const symbol=["✳","↔","◎","▤","⌘","✦","◇","✓"][i%8];
return '<div class="info-card">'+(slide.layout==="cards"?'<div class="card-number">'+String(i+1).padStart(2,"0")+'</div>':'<div class="card-icon" aria-hidden="true">'+symbol+'</div>')+
'<h3 class="card-title">'+esc(title)+'</h3>'+(description?'<p class="card-description">'+esc(description)+'</p>':"")+'</div>'}).join("")+'</div>';}
function challengeMarkup(slide){return slide.challenge?'<div class="student-challenge"><strong>✦ Try it yourself</strong> · '+esc(slide.challenge)+'</div>':""}
function getTool(slide){
const x=(slide.section||"")+" "+(slide.title||"");for(const [key,url] of Object.entries(TOOL)){if(x.includes(key))return {name:key==="FLOW"?"Google Flow":key==="SUNO"?"Suno":key==="CLAUDE"?"Claude":key==="NOTEBOOKLM"?"NotebookLM":key==="GAMMA"?"Gamma":"Zapier",url};}
if(slide.prompt)return {name:"Claude",url:"https://claude.ai/"};return null;
}
function toolMarkup(slide){let t=getTool(slide);if(!t)return "";return '<a class="tool-link" href="'+esc(t.url)+'" target="_blank" rel="noopener noreferrer">Open '+esc(t.name)+' ↗</a>';}
function qrMarkup(url,title,description){return '<div class="qr-card"><img src="'+esc(qrSrc(url))+'" alt="QR code to open '+esc(title)+'"><div class="qr-info"><h3>'+esc(title)+'</h3><p>'+esc(description)+'</p><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(url)+'</a></div></div>';}
function promptMarkup(slide){
if(!slide.prompt)return "";
const long=slide.prompt.length>800;
return '<div class="prompt-area"><div class="prompt-top"><div class="prompt-label">✦ Live prompt · Copy & try</div><div class="prompt-hint">'+(long?'Complete, ready-to-use example':'Edit the prompt or use it as written')+'</div></div>'+
'<textarea class="prompt-editor" id="promptEditor" aria-label="Editable prompt text" spellcheck="false"></textarea>'+
'<div class="prompt-actions"><span class="dim-note">Copy from this slide to an AI tool on your phone.</span><div class="buttons"><button class="btn tiny" id="resetPrompt">Reset</button><button class="btn tiny" id="expandPrompt">'+(long?'Expand':'Show more')+'</button><button class="btn bright" id="copyPrompt">Copy prompt ⧉</button></div></div></div>';
}
function basicSlide(slide){return '<main class="slide-inner">'+
'<div class="slide-eyebrow">'+esc(slide.section)+'</div>'+
'<h1 class="slide-title">'+titleHTML(slide.title)+'</h1>'+
'<p class="slide-subtitle">'+esc(slide.lead||"")+'</p>'+
((slide.points&&slide.points.length)?cardMarkup(slide):"")+
promptMarkup(slide)+toolMarkup(slide)+(slide.section==="ATTENDANCE"?qrMarkup(FORM,"SCAN FOR ATTENDANCE","Submit once, then check your inbox for the confirmation email."): "")+
challengeMarkup(slide)+
'</main>';}
function coverSlide(slide){
return '<main class="slide-inner cover">'+
'<div class="cover-kicker">KECH ACADEMIC GALA 2026 · UNIVERSITY OF TURBAT</div>'+
'<div class="slide-eyebrow">ARTIFICIAL INTELLIGENCE · HANDS-ON WORKSHOP</div>'+
'<h1 class="slide-title">AI BOOTCAMP<span class="accent">.</span></h1>'+
'<div class="orange-bar"></div>'+
'<p class="slide-subtitle">Level Up Your AI Skills</p>'+
'<p class="cover-details">Prompt Engineering · Claude · NotebookLM · Gamma · Google Flow · Suno · Zapier</p>'+
qrMarkup(userDeckUrl(),"SCAN ME","Open this full presentation on your phone. Copy the live prompts and take part in every challenge.")+
'</main>';
}
function speakerSlide(slide){
return '<main class="slide-inner speaker-layout">'+
'<div class="speaker-photo"><img class="portrait" src="https://github.com/shah-bakhsh.png" alt="Public profile photograph of Shah Bakhsh" onerror="this.outerHTML=\'<div class=&quot;portrait&quot; style=&quot;display:grid;place-items:center;font-size:80px;font-weight:800;color:white;background:#222&quot;>SB</div>\'"></div>'+
'<div class="speaker-copy"><div class="slide-eyebrow">YOUR SPEAKER</div>'+
'<h1 class="slide-title">Shah <span class="accent">Bakhsh.</span></h1>'+
'<p class="slide-subtitle">'+esc(slide.lead)+'</p><div class="orange-bar"></div>'+
'<div class="cards onecol">'+slide.points.map((point,i)=>'<div class="info-card" style="padding:18px 20px;min-height:0"><p class="card-description">'+esc(point)+'</p></div>').join("")+'</div>'+
'<div><a class="tool-link" href="https://www.linkedin.com/in/shah-bakhsh/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a class="tool-link" href="https://github.com/shah-bakhsh" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div>'+
'</main>';
}
function missionSlide(slide){return '<main class="slide-inner mission"><div class="slide-eyebrow">THE MISSION</div><h1 class="slide-title">Today, you become a <span class="accent">creator.</span></h1><p class="slide-subtitle">Not just a user of AI.</p><div class="mission-pill">Understand it. Question it. Build with it.</div></main>';}
function compareSlide(slide){
return '<main class="slide-inner"><div class="slide-eyebrow">BETTER INSTRUCTIONS · BETTER RESULTS</div><h1 class="slide-title">How to write a <span class="accent">good prompt.</span></h1><p class="slide-subtitle">A useful prompt tells AI what you want, who it is for, and what the answer should look like.</p>'+
'<div class="compare-grid"><div class="compare-card"><div class="compare-label">VAGUE PROMPT</div><p class="compare-quote">“Write about AI.”</p><p class="compare-caption">Too broad. The result may be long, general or irrelevant to your audience.</p></div>'+
'<div class="compare-card good"><div class="compare-label">BETTER PROMPT</div><p class="compare-quote">“Explain AI for students in Turbat.”</p><p class="compare-caption">Use simple language, a real university example and a short 100-word speech.</p></div></div>'+
promptMarkup(slide)+challengeMarkup(slide)+'</main>';
}
function htmlFor(slide){return slide.layout==="hero"?coverSlide(slide):slide.layout==="speaker"?speakerSlide(slide):slide.layout==="mission"?missionSlide(slide):slide.layout==="compare"?compareSlide(slide):basicSlide(slide);}
function navMarkup(){
return '<nav class="deck-nav" aria-label="Slide controls">'+
'<button type="button" class="navbutton" id="previous" title="Previous slide" aria-label="Previous slide">‹</button>'+
'<span id="pageCounter" class="slidecount"></span>'+
'<button type="button" class="navbutton primary" id="following" title="Next slide" aria-label="Next slide">›</button>'+
'<button type="button" class="navbutton" id="showOverview" title="View all slides" aria-label="Slide overview">▦</button>'+
'<button type="button" class="navbutton" id="togglePlay" title="Play or pause auto-advance" aria-label="Play or pause auto-advance">'+(playing?"Ⅱ":"▶")+'</button>'+
'<button type="button" class="navbutton" id="fullScreen" title="Fullscreen" aria-label="Fullscreen">⛶</button></nav>'+
'<div class="progressline"><div class="progressfill" id="progressFill"></div></div>';
}
function render(){
if(!slides.length)return;
const slide=slides[current];document.title=slide.title+" · AI Bootcamp 2026";
document.body.classList.toggle("cover-theme",current===0);
root.innerHTML='<div class="slide-wrap"><header class="slide-header"><span class="deck-mark">AI BOOTCAMP 2026</span></header>'+htmlFor(slide)+
'<aside class="speaker-notes'+(notesVisible?" visible":"")+'" id="presenterNote"><strong>Speaker notes:</strong> '+esc(slide.note||"")+'</aside></div>'+navMarkup();
document.getElementById("pageCounter").textContent=String(current+1).padStart(2,"0")+" / "+slides.length;
document.getElementById("progressFill").style.width=((current+1)/slides.length*100)+"%";
document.getElementById("previous").disabled=current===0;document.getElementById("following").disabled=false;
const edit=document.getElementById("promptEditor");if(edit){edit.value=slide.prompt;
document.getElementById("resetPrompt").onclick=()=>{edit.value=slide.prompt;notify("Original prompt restored")};
document.getElementById("copyPrompt").onclick=()=>copyText(edit.value,edit);
document.getElementById("expandPrompt").onclick=()=>{const expanded=edit.dataset.expanded==="true";edit.dataset.expanded=expanded?"false":"true";edit.style.maxHeight=expanded?"315px":"none";edit.style.height=expanded?"130px":"65vh";document.getElementById("expandPrompt").textContent=expanded?"Expand":"Collapse";};
}
document.getElementById("previous").onclick=()=>go(current-1);
document.getElementById("following").onclick=()=>go(current===slides.length-1?0:current+1);
document.getElementById("showOverview").onclick=()=>openOverview();
document.getElementById("fullScreen").onclick=()=>{if(document.fullscreenElement){document.exitFullscreen?.()}else{document.documentElement.requestFullscreen?.().catch(()=>notify("Fullscreen is unavailable in this browser"))}};
document.getElementById("togglePlay").onclick=togglePlaying;
const newHash="#slide-"+(current+1);if(location.hash!==newHash)history.replaceState(null,"",newHash);
window.scrollTo({top:0,behavior:"instant"});
}
function copyText(text,source){
if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(()=>notify("Copied! Paste this prompt into your AI app.")).catch(()=>manualCopy(source));}
else manualCopy(source);
}
function manualCopy(source){
if(source){source.select();try{document.execCommand("copy");notify("Prompt copied")}catch(_){notify("Select the prompt and copy it manually")}}
else notify("Copy the link from your browser address bar");
}
function go(next){current=Math.min(slides.length-1,Math.max(0,next));render()}
function togglePlaying(){playing=!playing;if(playTimer)clearInterval(playTimer);playTimer=playing?setInterval(()=>{if(current>=slides.length-1)togglePlaying();else go(current+1)},16000):null;render()}
function openOverview(){
overlay.classList.remove("hidden");document.body.style.overflow="hidden";
overlay.innerHTML='<div class="overview-top"><h2>All slides</h2><input class="overview-search" id="slideFilter" type="search" placeholder="Search slides..." aria-label="Search slides"><button class="btn bright" id="closeOverview">Close ✕</button></div><div class="overview-list" id="overviewList"></div>';
const inp=document.getElementById("slideFilter");inp.oninput=()=>drawTiles(inp.value);document.getElementById("closeOverview").onclick=closeOverview;drawTiles("");inp.focus();
}
function drawTiles(query){
const q=query.trim().toLowerCase();
document.getElementById("overviewList").innerHTML=slides.map((s,i)=>({s,i})).filter(x=>!q||x.s.title.toLowerCase().includes(q)||x.s.section.toLowerCase().includes(q)).map(({s,i})=>
'<button class="overview-card" data-number="'+i+'"><small>'+String(i+1).padStart(2,"0")+' / '+esc(s.section)+'</small><strong>'+esc(s.title)+'</strong></button>').join("");
document.querySelectorAll(".overview-card").forEach(b=>b.onclick=()=>{closeOverview();go(+b.dataset.number)});
}
function closeOverview(){overlay.classList.add("hidden");document.body.style.overflow="";}
window.addEventListener("hashchange",()=>{const h=location.hash.match(/slide-(\d+)/);if(h&&Number(h[1])-1!==current)go(Number(h[1])-1)});
document.addEventListener("keydown",e=>{
if(!overlay.classList.contains("hidden")){if(e.key==="Escape")closeOverview();return}
if(e.target.closest("textarea,input,button"))return;
if(["ArrowRight","PageDown"," "].includes(e.key)){e.preventDefault();go(Math.min(current+1,slides.length-1))}
if(["ArrowLeft","PageUp"].includes(e.key)){e.preventDefault();go(current-1)}
if(e.key==="Home")go(0);
if(e.key==="End")go(slides.length-1);
if(e.key.toLowerCase()==="o")openOverview();
if(e.key.toLowerCase()==="n"){notesVisible=!notesVisible;render()}
if(e.key==="Escape"&&document.fullscreenElement)document.exitFullscreen?.();
});
let startX=null,startY=null;
root.addEventListener("touchstart",e=>{if(e.target.closest("textarea,button,a"))return;startX=e.changedTouches[0].screenX;startY=e.changedTouches[0].screenY},{passive:true});
root.addEventListener("touchend",e=>{if(startX==null||e.target.closest("textarea,button,a"))return;const dx=e.changedTouches[0].screenX-startX,dy=e.changedTouches[0].screenY-startY;if(Math.abs(dx)>110&&Math.abs(dx)>Math.abs(dy)*1.6)go(current+(dx<0?1:-1));startX=startY=null},{passive:true});
const hash=location.hash.match(/slide-(\d+)/);if(hash)current=Math.max(0,Math.min(slides.length-1,+hash[1]-1));
render();
})();
