/* RADIOSAS 5.4 · Simulacros históricos de entrenamiento original, sin reproducir cuadernillos SAS */
(()=>{'use strict';
const KEY='radiosas_simulacros_540',MAIN='radiosas_academy_v1';
const FORMATS=[
{id:'s25',year:'2025',title:'Simulacro formato SAS 2025',sub:'Acceso libre',total:75,minutes:120},
{id:'s24',year:'2024',title:'Simulacro formato SAS 2024',sub:'Estabilización',total:75,minutes:120},
{id:'s22',year:'2022',title:'Simulacro formato SAS 2022',sub:'Acceso libre',total:150,minutes:180},
{id:'s22a',year:'2022',title:'Simulacro formato SAS 2022',sub:'Prueba aplazada',total:150,minutes:180},
{id:'s18',year:'2018',title:'Simulacro formato SAS 2018',sub:'OEP 2016–2017',total:100,minutes:150}
];
let run=null,position=0,last=null,clock=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const data=()=>{try{const x=JSON.parse(localStorage.getItem(KEY));return x&&Array.isArray(x.attempts)?{attempts:x.attempts,draft:x.draft||null,usage:x.usage||{}}:{attempts:[],draft:null,usage:{}}}catch{return{attempts:[],draft:null,usage:{}}}};
const write=x=>localStorage.setItem(KEY,JSON.stringify(x));
const validQuestion=q=>q&&typeof q.id==='string'&&typeof q.text==='string'&&q.text.trim().length>=12&&Array.isArray(q.options)&&q.options.length===4&&q.options.every(o=>typeof o==='string'&&o.trim())&&new Set(q.options.map(o=>o.trim().toLocaleLowerCase('es'))).size===4&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4&&typeof q.explanation==='string'&&q.explanation.trim().length>=12;
const questions=()=>window.RADIOSAS_DATA?.practice?.filter(validQuestion)||[];
// Para estos simulacros se usan las 1.000 preguntas originales: se excluyen las 4.000 reformulaciones automáticas.
const vetted=()=>questions().filter(q=>/^(?:p\d+|master-\d+)$/.test(q.id));
const conceptOf=q=>q.concept||q.id;
const defs=id=>FORMATS.find(x=>x.id===id);
const root=()=>document.querySelector('main.page')||document.querySelector('#app');
const btn=(t,a,c='')=>'<button type="button" class="sim54-btn '+c+'" data-sim54="'+a+'">'+t+'</button>';
function catalog(){
const s=data(),n=vetted().length,tries=s.attempts.length,avg=tries?s.attempts.reduce((a,v)=>a+v.score,0)/tries:0,peak=tries?Math.max(...s.attempts.map(v=>v.score)):0;
return '<section class="sim54 sim54-catalog" aria-label="Exámenes organizados por año"><header class="sim54-head"><span>PAULA MASTER EDITION ♥ · OPOSICIONES SAS</span><h2>Exámenes por año</h2><p>Escoge una convocatoria y comienza directamente el test, con cronómetro, respuestas A–D y nota. Estos cinco exámenes están preparados con preguntas propias: son simulacros de entrenamiento y <strong>no copias literales de los cuadernillos oficiales</strong>.</p></header><div class="sim54-overview"><div><small>CONVOCATORIAS</small><strong>5</strong></div><div><small>EXÁMENES REALIZADOS</small><strong>'+tries+'</strong></div><div><small>NOTA MEDIA</small><strong>'+(tries?avg.toFixed(1).replace('.',','):'—')+'</strong></div><div><small>MEJOR NOTA</small><strong>'+(tries?peak.toFixed(1).replace('.',','):'—')+'</strong></div></div><div class="sim54-cards">'+FORMATS.map(f=>{const past=s.attempts.filter(a=>a.id===f.id),prev=past.at(-1),best=past.length?Math.max(...past.map(a=>a.score)):null;return '<article class="sim54-card"><span class="sim54-year">'+esc(f.year)+'</span><div><strong>'+esc(f.title)+'</strong><small>'+esc(f.sub)+' · '+f.total+' preguntas · '+f.minutes+' minutos</small><small>'+(past.length?past.length+' intentos · Última: '+prev.score.toFixed(1).replace('.',',')+'/100 · Mejor: '+best.toFixed(1).replace('.',',')+'/100':'Sin exámenes realizados · pendiente de estreno')+'</small></div>'<div class="sim54-card-actions">'+btn(s.draft?.id===f.id?'Continuar →':'Comenzar test →','start:'+f.id,'primary')+((past.length||s.draft?.id===f.id)?btn('Reiniciar examen ↻','reset:'+f.id,'reset'):'')+'</div></article>'}).join('')+'</div><div class="sim54-footer">'+btn('Ver estadísticas e historial','history','')+'<p class="sim54-hint">'+n.toLocaleString('es-ES')+' preguntas estructuralmente revisadas del banco base. No se repiten dentro de la misma prueba. Cada convocatoria tiene historial independiente y se conserva en este navegador.</p></div></section>'}
function historyPage(){const s=data(),items=s.attempts.slice().reverse();render('<header class="sim54-head"><span>PAULA MASTER EDITION ♥</span><h2>Estadísticas · Exámenes por año</h2><p>Resultados de todos los simulacros por convocatoria. La nota es orientativa sobre 100, con penalización de 0,25 por error.</p></header><div class="sim54-history">'+(items.length?items.map(a=>{const f=defs(a.id);return '<article class="sim54-history-item"><span class="sim54-year">'+esc(f?.year||'—')+'</span><div><strong>'+esc(f?.sub||'Simulacro')+'</strong><small>'+new Date(a.at).toLocaleDateString('es-ES')+' · '+a.total+' preguntas · '+a.correct+' aciertos · '+a.wrong+' errores · '+a.blank+' blancas</small></div><b>'+a.score.toFixed(1).replace('.',',')+'/100</b></article>'}).join(''):'<p class="sim54-hint">Todavía no hay exámenes realizados. Completa un test y aquí aparecerá su nota.</p>')+'</div>'+btn('← Volver a exámenes','return','primary'))}
function render(markup){const h=root();if(h)h.innerHTML='<section class="sim54 sim54-player">'+markup+'</section>';window.scrollTo?.({top:0,behavior:'instant'})}
function bank(){const m=new Map();for(const q of questions())m.set(q.id,q);return m}
function pick(n,usage){
 const candidates=vetted();if(candidates.length<n)throw Error('No hay suficientes preguntas comprobadas para esta convocatoria.');
 const groups=new Map();
 for(const q of candidates){
  const category=q.category||'General';
  if(!groups.has(category))groups.set(category,[]);
  groups.get(category).push({id:q.id,concept:conceptOf(q),rank:(usage[q.id]||0)+Math.random()*.20});
 }
 for(const xs of groups.values())xs.sort((a,b)=>a.rank-b.rank);
 const keys=[...groups.keys()],ids=[],seenConcepts=new Set();
 while(ids.length<n){
  const before=ids.length;
  for(const k of keys){
   const xs=groups.get(k);
   let candidate;
   while(xs.length){const q=xs.shift();if(!seenConcepts.has(q.concept)){candidate=q;break}}
   if(candidate){ids.push(candidate.id);seenConcepts.add(candidate.concept)}
   if(ids.length===n)break;
  }
  if(ids.length===before)break;
 }
 if(ids.length<n)throw Error('No hay suficientes conceptos distintos para este examen.');
 return ids;
}
function reset(id){
 const f=defs(id);if(!f)return;
 const state=data(),draft=state.draft?.id===id?state.draft:null,previous=state.attempts.filter(a=>a.id===id).at(-1);
 if(!confirm('¿Reiniciar '+f.year+' ('+f.sub+')? Se borrarán las respuestas en curso y el reloj comenzará de cero. Las notas anteriores se conservarán.'))return;
 let ids=draft?.ids?.length===f.total?draft.ids.slice():previous?.ids?.length===f.total?previous.ids.slice():null;
 if(!ids||ids.some(x=>!bank().has(x)))ids=pick(f.total,state.usage);
 clearInterval(clock);
 run={id,ids,answers:{},flags:[],at:Date.now(),position:0};
 position=0;state.draft={...run};write(state);show();
}
function store(){if(!run)return;const s=data();s.draft={...run,position};write(s)}
function start(id){const f=defs(id);if(!f)return;clearInterval(clock);const s=data();if(s.draft?.id===id){run=s.draft;position=s.draft.position||0}else{const ids=pick(f.total,s.usage);ids.forEach(x=>s.usage[x]=(s.usage[x]||0)+1);run={id,ids,answers:{},flags:[],at:Date.now(),position:0};position=0;s.draft=run;write(s)}show()}
function remaining(){const f=defs(run.id);return Math.max(0,f.minutes*60-Math.floor((Date.now()-run.at)/1000))}
function tick(){clearInterval(clock);const refresh=()=>{if(!run)return;const t=remaining(),e=document.getElementById('sim54-clock');if(e)e.textContent=[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(v=>String(v).padStart(2,'0')).join(':');if(t===0){clearInterval(clock);finish(true)}};refresh();clock=setInterval(refresh,1000)}
function show(){const f=defs(run.id),q=bank().get(run.ids[position]);if(!q){render('<p>Falta una pregunta del banco. Comprueba la versión publicada.</p>');return}const current=run.answers[q.id],marked=run.flags.includes(q.id),count=Object.keys(run.answers).length;
render('<header class="sim54-bar">'+btn('←','exit')+'<div><b>'+esc(f.title)+'</b><small>Práctica original · '+(position+1)+'/'+f.total+'</small></div><b id="sim54-clock">—</b></header><div class="sim54-progress"><i style="width:'+(count/f.total*100)+'%"></i></div><article class="sim54-question"><small>'+esc(q.category||'Radiodiagnóstico')+' · Pregunta '+(position+1)+'</small><h2>'+esc(q.text)+'</h2><div class="sim54-options">'+q.options.map((v,i)=>'<button type="button" class="sim54-opt '+(current===i?'selected':'')+'" data-sim54="answer:'+i+'"><b>'+'ABCD'[i]+'</b><span>'+esc(v)+'</span></button>').join('')+'</div></article><nav class="sim54-nav">'+btn('← Anterior','prev')+btn(marked?'★ Marcada':'☆ Revisar','mark')+btn(position===f.total-1?'Entregar':'Siguiente →',position===f.total-1?'finish':'next','primary')+'</nav><div class="sim54-exam-tools">'+btn('↻ Reiniciar este examen','reset:'+run.id,'reset')+'</div><details class="sim54-map"><summary>'+count+' respondidas · Ver mapa</summary><div>'+run.ids.map((id,i)=>'<button type="button" class="'+(run.answers[id]!==undefined?'done ':'')+(i===position?'active':'')+'" data-sim54="go:'+i+'">'+(i+1)+'</button>').join('')+'</div></details><p class="sim54-hint">Puedes salir y continuar más tarde. Esta tanda no reproduce un examen oficial.</p>');
store();tick()}
function score(){const b=bank();let correct=0,wrong=0,blank=0;const detail=run.ids.map((id,i)=>{const q=b.get(id),a=run.answers[id];if(a===undefined)blank++;else if(a===q.answer)correct++;else wrong++;return {number:i+1,text:q.text,category:q.category,selected:a??null,correct:q.answer,explanation:q.explanation||''}});return{correct,wrong,blank,score:Math.max(0,100*(correct-wrong*.25)/run.ids.length),detail}}
function finish(auto){if(!run)return;if(!auto&&!confirm('¿Entregar simulacro? Las preguntas sin contestar quedarán en blanco.'))return;clearInterval(clock);const f=defs(run.id),m=score(),s=data();last={id:run.id,ids:run.ids.slice(),at:Date.now(),total:f.total,elapsed:Date.now()-run.at,...m};s.attempts.push(last);s.draft=null;write(s);run=null;
render('<header class="sim54-head"><span>RESULTADO · SIMULACRO PROPIO ♥</span><h2>'+esc(f.title)+'</h2><p>Nota de entrenamiento orientativa. No es la nota de un cuadernillo SAS oficial.</p></header><div class="sim54-result"><strong>'+m.score.toFixed(2).replace('.',',')+' <small>/100</small></strong><p>✓ '+m.correct+' aciertos · ✕ '+m.wrong+' fallos · ○ '+m.blank+' blancas</p>'+btn('Revisar errores','review','primary')+btn('↻ Repetir mismo examen','reset:'+last.id,'reset')+btn('Volver a exámenes','return')+'</div>')}
function review(){if(!last)return;render('<div class="sim54-head"><h2>Corrección y explicaciones</h2><p>'+last.correct+' aciertos · '+last.wrong+' errores · '+last.blank+' blancas</p></div>'+last.detail.map(q=>'<article class="sim54-review"><small>Pregunta '+q.number+' · '+esc(q.category)+'</small><h3>'+esc(q.text)+'</h3><p>Tu respuesta: '+(q.selected===null?'Blanca':'ABCD'[q.selected])+' · Correcta: '+'ABCD'[q.correct]+'</p><p>'+esc(q.explanation)+'</p></article>').join('')+btn('Volver','return','primary'))}
function action(a){if(a.startsWith('reset:'))return reset(a.slice(6));if(a.startsWith('start:'))return start(a.slice(6));if(a==='return'||a==='exit'){clearInterval(clock);if(run)store();run=null;const h=root();if(h)h.innerHTML=catalog();return}if(a==='review')return review();if(a==='history')return historyPage();if(!run)return;const id=run.ids[position];if(a.startsWith('answer:'))run.answers[id]=Number(a.slice(7));else if(a==='prev')position=Math.max(0,position-1);else if(a==='next')position=Math.min(run.ids.length-1,position+1);else if(a==='mark')run.flags=run.flags.includes(id)?run.flags.filter(x=>x!==id):run.flags.concat(id);else if(a.startsWith('go:'))position=Math.min(run.ids.length-1,Math.max(0,Number(a.slice(3))));else if(a==='finish')return finish(false);show()}
document.addEventListener('click',ev=>{const b=ev.target.closest?.('[data-sim54]');if(!b)return;ev.preventDefault();ev.stopImmediatePropagation();try{action(b.dataset.sim54)}catch(e){console.error(e);alert('Error en simulacro: '+e.message)}},true);
window.RADIOSAS_HIST_SIM={catalog,definitions:FORMATS,pick,reset,validQuestion,vetted,score:()=>run?score():null};
})();
