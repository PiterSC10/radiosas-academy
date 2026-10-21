(function install54(){
"use strict";
const DATA="radiosas_academy_v1",STORE="radiosas_simulacros_historicos_v54";
const SPECS=[
["2025","Acceso libre 2025",75,120],["2024","Estabilización 2024",75,120],
["2022-l","Acceso libre 2022",150,180],["2022-a","Prueba aplazada 2022",150,180],
["2018","OEP 2016–2017",100,150]
];
let current=null,index=0,timer=null,last=null,packs=null;
const safe=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const host=()=>document.querySelector("main.page")||document.getElementById("app");
const pool=()=>Array.isArray(window.RADIOSAS_DATA?.practice)?window.RADIOSAS_DATA.practice.filter(q=>q&&typeof q.id==="string"&&q.text&&Array.isArray(q.options)&&q.options.length===4&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<=3):[];
function read(){try{let s=JSON.parse(localStorage.getItem(STORE));return s&&Array.isArray(s.attempts)?s:{attempts:[],draft:null}}catch{return{attempts:[],draft:null}}}
function save(s){localStorage.setItem(STORE,JSON.stringify(s))}
function paint(html){let el=host();if(el)el.innerHTML=html}
function hash(v){let h=2166136261;for(let c of v){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function build(){
if(packs)return packs;
let by=new Map();for(let q of pool()){let c=q.category||"General";if(!by.has(c))by.set(c,[]);by.get(c).push(q)}
let cats=[...by.keys()].sort(),used=new Set();for(let c of cats)by.get(c).sort((a,b)=>hash(a.id+"paula54")-hash(b.id+"paula54"));
packs={};for(let s of SPECS){let ids=[];while(ids.length<s[2]){let n=0;for(let c of cats){let group=by.get(c);while(group.length&&used.has(group[0].id))group.shift();if(group.length){let q=group.shift();used.add(q.id);ids.push(q.id);n++;if(ids.length===s[2])break}}if(n===0)break}packs[s[0]]=ids}return packs}
function spec(id){return SPECS.find(s=>s[0]===id)}
function questionById(id){return pool().find(q=>q.id===id)}
function renderCatalog(){
let s=read(),sets=build();
return `<div class="s54-root"><div class="s54-heading"><small>PAULA MASTER EDITION ♥ · RADIOSAS 5.4</small><h1>Exámenes tipo test listos para hacer</h1><p>Selecciona una prueba y responde directamente, sin abrir PDFs. Son <strong>simulacros originales inspirados en el formato de convocatorias históricas</strong>, no reproducciones literales de los cuadernillos oficiales.</p></div><div class="s54-cards">${SPECS.map(d=>{let last=s.attempts.filter(x=>x.id===d[0]).at(-1);return `<article><span class="s54-year">${d[0].slice(0,4)}</span><div><strong>${safe(d[1])}</strong><small>${d[2]} preguntas · ${d[3]} minutos</small><small>${last?'Última nota '+last.score.toFixed(1).replace(".",",")+'/100':'Pendiente de realizar'}</small></div><button data-s54="start:${d[0]}" ${sets[d[0]].length===d[2]?"":"disabled"}>${s.draft?.id===d[0]?"Continuar":"Empezar"} →</button></article>`}).join("")}</div><div class="s54-bottom"><b>${pool().length.toLocaleString("es-ES")} preguntas en el banco de entrenamiento</b><p>Los cinco simulacros utilizan conjuntos diferentes. Notas, respuestas y progreso quedan guardados en este navegador.</p><button data-s54="original">Archivo oficial y conversor privado</button></div>${s.attempts.length?`<section class="s54-history"><h3>Resultados recientes</h3>${s.attempts.slice(-5).reverse().map(a=>`<div><span>${safe(spec(a.id)?.[1]||a.id)}</span><b>${a.score.toFixed(1).replace(".",",")}/100</b></div>`).join("")}</section>`:""}</div>`}
function saveDraft(){if(!current)return;let s=read();s.draft={...current,index};save(s)}
function start(id){let d=spec(id),ids=build()[id];if(!d||ids?.length!==d[2])return alert("Banco incompleto para este formato.");let s=read();if(s.draft?.id!==id&&s.draft&&!confirm("Hay un examen pendiente. ¿Crear uno nuevo?"))return;current=s.draft?.id===id?s.draft:{id,ids,answers:{},flags:[],started:Date.now(),index:0};index=current.index||0;show()}
function clock(){clearInterval(timer);function tick(){if(!current)return;let t=Math.max(0,spec(current.id)[3]*60-Math.floor((Date.now()-current.started)/1000)),el=document.getElementById("s54-time");if(el)el.textContent=[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(n=>String(n).padStart(2,"0")).join(":");if(t===0)finish(true)}tick();timer=setInterval(tick,1000)}
function show(){if(!current)return;let d=spec(current.id),q=questionById(current.ids[index]);if(!q){paint('<p>Falta esta pregunta. Vuelve a cargar la web.</p>');return}let choice=current.answers[q.id],marked=current.flags.includes(q.id),answered=Object.keys(current.answers).length;
paint(`<div class="s54-root s54-exam"><header><button data-s54="exit" aria-label="Guardar y salir">←</button><div><b>${safe(d[1])}</b><small>${index+1}/${d[2]} · Simulacro de práctica</small></div><b id="s54-time">00:00:00</b></header><div class="s54-track"><i style="width:${answered/d[2]*100}%"></i></div><section class="s54-question"><small>${safe(q.category||"Radiodiagnóstico")}</small><h2>${safe(q.text)}</h2><div class="s54-options">${q.options.map((o,i)=>`<button type="button" data-s54="pick:${i}" class="${choice===i?"selected":""}"><b>${"ABCD"[i]}</b><span>${safe(o)}</span></button>`).join("")}</div></section><nav class="s54-controls"><button data-s54="prev">Anterior</button><button data-s54="flag">${marked?"★ Marcada":"☆ Revisar"}</button><button data-s54="${index===d[2]-1?"finish":"next"}">${index===d[2]-1?"Entregar":"Siguiente →"}</button></nav><details class="s54-map"><summary>Mapa de preguntas: ${answered}/${d[2]}</summary><div>${current.ids.map((id,i)=>`<button data-s54="go:${i}" class="${current.answers[id]!==undefined?"done":""} ${index===i?"on":""}">${i+1}</button>`).join("")}</div></details></div>`);saveDraft();clock()}
function finish(auto=false){if(!current)return;if(!auto&&!confirm("¿Entregar el simulacro y corregir las respuestas?"))return;clearInterval(timer);let s=read(),correct=0,wrong=0,blank=0,detail=[],byTopic={};
for(let [i,id] of current.ids.entries()){let q=questionById(id);if(!q)continue;let answer=current.answers[id],category=q.category||"General";if(!byTopic[category])byTopic[category]={right:0,total:0};byTopic[category].total++;if(answer===undefined)blank++;else if(answer===q.answer){correct++;byTopic[category].right++}else wrong++;detail.push({number:i+1,text:q.text,selected:answer??null,answer:q.answer,explanation:q.explanation||"",category})}
let score=Math.max(0,(correct-.25*wrong)/spec(current.id)[2]*100);last={id:current.id,completed:Date.now(),total:current.ids.length,correct,wrong,blank,score,byTopic,detail};s.attempts.push(last);s.draft=null;save(s);current=null;result()}
function result(){if(!last)return paint(renderCatalog());paint(`<div class="s54-root s54-result"><small>PAULA MASTER EDITION ♥</small><h1>Resultado: ${safe(spec(last.id)[1])}</h1><p>Nota orientativa con penalización de ¼ por respuesta incorrecta. No es calificación oficial del SAS.</p><div class="s54-score">${last.score.toFixed(2).replace(".",",")} <small>/100</small></div><div class="s54-stats"><span>✓ ${last.correct} aciertos</span><span>× ${last.wrong} fallos</span><span>○ ${last.blank} blancas</span></div><div class="s54-subjects"><h3>Resultados por materia</h3>${Object.entries(last.byTopic).map(([k,v])=>`<div><span>${safe(k)}</span><b>${v.right}/${v.total}</b></div>`).join("")}</div><nav><button data-s54="review">Ver corrección</button><button data-s54="catalog">Volver a exámenes</button></nav></div>`)}
function review(){if(!last)return;paint(`<div class="s54-root s54-review"><h1>Corrección detallada</h1>${last.detail.map(x=>`<article><small>Pregunta ${x.number} · ${safe(x.category)}</small><h3>${safe(x.text)}</h3><p>Marcada: ${x.selected===null?"En blanco":"ABCD"[x.selected]} · Correcta: ${"ABCD"[x.answer]}</p><p>${safe(x.explanation)}</p></article>`).join("")}<button data-s54="catalog">Volver a exámenes</button></div>`)}
function act(a){if(a==="original"){clearInterval(timer);if(originalRender)paint(originalRender());return}if(a==="catalog"||a==="exit"){clearInterval(timer);if(a==="exit")saveDraft();current=null;paint(renderCatalog());return}if(a.startsWith("start:")){start(a.slice(6));return}if(a==="review"){review();return}if(!current)return;
if(a.startsWith("pick:"))current.answers[current.ids[index]]=Number(a.slice(5));
else if(a==="next")index=Math.min(current.ids.length-1,index+1);
else if(a==="prev")index=Math.max(0,index-1);
else if(a.startsWith("go:"))index=Math.max(0,Math.min(current.ids.length-1,Number(a.slice(3))));
else if(a==="flag"){let id=current.ids[index];current.flags=current.flags.includes(id)?current.flags.filter(x=>x!==id):current.flags.concat(id)}
else if(a==="finish"){finish();return}
show()}
let originalRender=null;
if(window.RADIOSAS_OFICIALES){originalRender=window.RADIOSAS_OFICIALES.render;window.RADIOSAS_OFICIALES.render=renderCatalog}
document.addEventListener("click",e=>{let b=e.target.closest?.("[data-s54]");if(!b)return;e.preventDefault();e.stopImmediatePropagation();try{act(b.dataset.s54)}catch(err){console.error(err);alert(err.message)}},true);
window.RADIOSAS_SIMULACROS_54={renderCatalog,SPECS,pool,build};
})();
