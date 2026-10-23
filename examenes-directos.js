/* RADIOSAS · Estado de integración oficial y archivo separado de práctica propia. */
(()=>{'use strict';
const KEY='radiosas_examenes_directos_2026_v1',YES='ABCD';
const DEFS=[
{id:'2025',year:'2025',name:'Acceso libre',expected:75,minutes:120},
{id:'2024',year:'2024',name:'Estabilización',expected:75,minutes:120},
{id:'2022-l',year:'2022',name:'Acceso libre · febrero',expected:150,minutes:180},
{id:'2022-a',year:'2022',name:'Prueba aplazada · mayo',expected:150,minutes:180},
{id:'2018',year:'2018',name:'Acceso libre',expected:150,minutes:180}
];
const BASE='https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/';
const SOURCES={
 '2025':{date:'07/06/2025',keyDate:'27/01/2026',path:'convocatorias-oep-2025/cuadro-de-evolucion/tecnicoa-especialista-en-radiodiagnostico'},
 '2024':{date:'10/02/2024',keyDate:'14/05/2024',path:'oep-extraordinaria-decreto-ley-122022-centros-sas/cuadro-de-evolucion-concurso-oposicion-centros-sas/tecnicoa-especialista-en-radiodiagnostico'},
 '2022-l':{date:'20/02/2022',keyDate:'04/07/2022',path:'convocatorias-oep-2021-22/cuadro-de-evolucion-de-acceso-libre/tecnicoa-especialista-en-radiodiagnostico-1'},
 '2022-a':{date:'15/05/2022',keyDate:'04/07/2022',path:'convocatorias-oep-2021-22/cuadro-de-evolucion-de-acceso-libre/tecnicoa-especialista-en-radiodiagnostico-1'},
 '2018':{date:'21/10/2018',keyDate:'15/03/2019',path:'oep-2016-2017-estabilizacion/cuadro-de-evolucion-de-acceso-libre/tecnicoa-especialista-en-radiodiagnostico'}
};
function officialCards(){return '<header class="ed-heading"><small>PAULA MASTER EDITION ♥ · EXÁMENES OFICIALES</small><h1>Exámenes por año</h1><p>Integración pendiente: 0 de 5 cuadernillos completos. Las preguntas reformuladas de la versión anterior no son exámenes oficiales y no se contabilizan como tales.</p></header><div class="ed-grid">'+DEFS.map(d=>{const x=SOURCES[d.id];return '<article class="ed-card"><span class="ed-year">'+d.year+'</span><div class="ed-card-copy"><strong>'+esc(d.name)+' · '+x.date+'</strong><small>NO DISPONIBLE · Integración incompleta</small><p>Ficha oficial localizada. Plantilla definitiva publicada el '+x.keyDate+'. Pendientes de cotejar íntegramente: enunciados, A–D, reservas, anulaciones y figuras.</p><p>Impedimentos: el SAS redirige a mantenimiento; no se ha confirmado autorización de reutilización del cuadernillo y sus imágenes.</p><a target="_blank" rel="noopener noreferrer" href="'+BASE+'profesionales/ofertas-de-empleo/oferta-de-empleo-publico-puestos-base/'+x.path+'">Consultar procedencia oficial</a></div></article>'}).join('')+'</div><div class="ed-bottom"><p>Comprobación: 23/10/2026. La política editorial del SAS reserva los derechos sobre textos e imágenes. El permiso general del portal de la Junta no acredita por sí solo que estos documentos y figuras puedan redistribuirse aquí.</p><p><a target="_blank" rel="noopener noreferrer" href="'+BASE+'politica-editorial">Política específica del SAS</a> · <a target="_blank" rel="noopener noreferrer" href="https://www.juntadeandalucia.es/informacion/legal.html">Condiciones generales de la Junta</a></p><p>Para completar cada examen hacen falta los originales accesibles, confirmar su reutilización y cotejar todas las preguntas, reservas e imágenes con la plantilla definitiva. No se habilitará como terminado antes de esa revisión.</p>'+button('Archivo de práctica propia (no oficial)','practice','ed-secondary')+button('Historial de práctica anterior','history','ed-secondary')+'</div>'}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function state(){try{const v=JSON.parse(localStorage.getItem(KEY));return {attempts:Array.isArray(v?.attempts)?v.attempts:[],draft:v?.draft||null}}catch{return{attempts:[],draft:null}}}
const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
const find=id=>DEFS.find(x=>x.id===id);
const src=id=>window.RADIOSAS_HIST_ITEMS?.[id]||[];
const valid=q=>Array.isArray(q)&&q.length===5&&Number.isInteger(q[0])&&q[0]>0&&typeof q[1]==='string'&&q[1].trim().length>14&&Array.isArray(q[2])&&q[2].length===4&&q[2].every(x=>typeof x==='string'&&x.trim())&&new Set(q[2].map(x=>x.trim().toLocaleLowerCase('es'))).size===4&&YES.includes(q[3])&&typeof q[4]==='string'&&q[4].trim();
const items=id=>{const arr=src(id).filter(valid);const seen=new Set();return arr.filter(q=>!seen.has(q[0])&&seen.add(q[0])).slice().sort((a,b)=>a[0]-b[0])};
const root=()=>document.querySelector?.('main.page')||document.getElementById('app');
let current=null,position=0,last=null,interval=null;
const button=(name,action,cl='')=>'<button type="button" class="ed-btn '+cl+'" data-ed="'+action+'">'+name+'</button>';
function paint(markup){const el=root();if(el)el.innerHTML='<section class="ed-exams">'+markup+'</section>';window.scrollTo?.({top:0,behavior:'instant'})}
function stop(){if(interval!==null)clearInterval(interval);interval=null}
function pretty(v){return Number(v).toFixed(1).replace('.',',')}
function practiceCards(){
 const h=state(),n=DEFS.reduce((x,d)=>x+items(d.id).length,0),attempts=h.attempts,avg=attempts.length?attempts.reduce((a,x)=>a+x.score,0)/attempts.length:0;
 return '<header class="ed-heading"><small>PAULA MASTER EDITION ♥ · PRÁCTICA PROPIA · NO OFICIAL</small><h1>Archivo de práctica propia</h1><p>Selecciones parciales reformuladas de la versión anterior. No son las preguntas auténticas ni un examen oficial completo. Sus notas e intentos se conservan por separado.</p></header>'+
 '<div class="ed-kpis"><div><b>'+n+'</b><span>Preguntas disponibles</span></div><div><b>'+attempts.length+'</b><span>Exámenes realizados</span></div><div><b>'+(attempts.length?pretty(avg)+'/100':'—')+'</b><span>Nota media</span></div></div>'+
 '<div class="ed-grid">'+DEFS.map(d=>{const qs=items(d.id),done=attempts.filter(a=>a.id===d.id),prev=done.at(-1),isDraft=h.draft?.id===d.id;return '<article class="ed-card"><span class="ed-year">'+d.year+'</span><div class="ed-card-copy"><strong>'+esc(d.name)+'</strong><small>'+qs.length+' preguntas de práctica; examen original: '+d.expected+' preguntas</small><small>'+(prev?'Última nota: '+pretty(prev.score)+'/100 · '+done.length+' intentos':'Sin intentos anteriores')+'</small></div><div class="ed-card-actions">'+button(isDraft?'Continuar →':'Hacer test →','start:'+d.id,'ed-primary')+button('↻ Reiniciar','reset:'+d.id,'ed-secondary')+'</div></article>'}).join('')+'</div>'+
 '<div class="ed-bottom">'+button('Ver estadísticas de práctica','history','ed-secondary')+'<p>Son selecciones parciales reformuladas heredadas; no son la transcripción íntegra de cada cuadernillo y no se ha realizado un nuevo cotejo documental. Las preguntas dependientes de imágenes no se presentan sin su figura.</p></div>';
}
function list(){current=null;stop();paint(officialCards())}
function practice(){current=null;stop();paint(practiceCards()+button('← Exámenes oficiales','back'))}
function start(id,force=false){const d=find(id),qs=items(id);if(!d||!qs.length)return;stop();const h=state();if(!force&&h.draft?.id===id&&Array.isArray(h.draft.answers)){current=h.draft;position=Math.max(0,Math.min(qs.length-1,current.index||0))}else{current={id,answers:Array(qs.length).fill(null),flags:[],started:Date.now(),index:0};position=0}h.draft=current;save(h);show()}
function reset(id){const d=find(id);if(!d)return;if(!confirm('¿Empezar de cero el examen '+d.year+' ('+d.name+')? Se borrarán las respuestas en curso, pero conservarás tus estadísticas anteriores.'))return;start(id,true)}
function remaining(){const d=find(current?.id);return Math.max(0,d.minutes*60-Math.floor((Date.now()-current.started)/1000))}
function clock(){stop();const refresh=()=>{if(!current)return;const t=remaining(),e=document.getElementById('ed-clock');if(e)e.textContent=[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(v=>String(v).padStart(2,'0')).join(':');if(t===0)finish(true)};refresh();interval=setInterval(refresh,1000)}
function persist(){if(!current)return;current.index=position;const s=state();s.draft=current;save(s)}
function show(){if(!current)return;const d=find(current.id),arr=items(d.id),q=arr[position];if(!q){list();return}const selected=current.answers[position],answered=current.answers.filter(v=>v!==null).length,flagged=current.flags.includes(position);
 paint('<div class="ed-exam-head">'+button('← Volver','back')+'<div><b>'+d.year+' · '+esc(d.name)+' · PRÁCTICA PROPIA, NO OFICIAL</b><small>Pregunta '+(position+1)+' / '+arr.length+' · '+answered+' contestadas</small></div><strong id="ed-clock">—</strong></div>'+
 '<div class="ed-progress"><i style="width:'+(answered/arr.length*100)+'%"></i></div>'+
 '<article class="ed-question"><div class="ed-question-meta"><span>N.º histórico '+q[0]+'</span><span>'+esc(q[4])+'</span></div><h2>'+esc(q[1])+'</h2><div class="ed-options">'+q[2].map((v,i)=>'<button type="button" class="ed-option '+(selected===YES[i]?'selected':'')+'" data-ed="pick:'+YES[i]+'"><b>'+YES[i]+'</b><span>'+esc(v)+'</span></button>').join('')+'</div></article>'+
 '<nav class="ed-controls">'+button('← Anterior','prev')+button(flagged?'★ Marcada':'☆ Revisar','flag')+button(position===arr.length-1?'Entregar examen':'Siguiente →',position===arr.length-1?'finish':'next','ed-primary')+'</nav>'+
 '<details class="ed-map"><summary>Mapa de preguntas · '+answered+' contestadas</summary><div>'+arr.map((_,i)=>'<button type="button" class="'+(current.answers[i]!==null?'done ':'')+(i===position?'active':'')+'" data-ed="go:'+i+'">'+(i+1)+'</button>').join('')+'</div></details>'+
 '<div class="ed-minor">'+button('↻ Reiniciar examen','reset:'+d.id)+'</div>');
 persist();clock()
}
function finish(auto=false){if(!current)return;if(!auto&&!confirm('¿Entregar y corregir este test? Las no contestadas quedarán en blanco.'))return;stop();const id=current.id,d=find(id),qs=items(id),draft=current,correct=qs.reduce((t,q,i)=>t+(draft.answers[i]===q[3]?1:0),0),wrong=qs.reduce((t,q,i)=>t+(draft.answers[i]!==null&&draft.answers[i]!==q[3]?1:0),0),blank=qs.length-correct-wrong,score=Math.max(0,100*(correct-.25*wrong)/qs.length),date=Date.now();
 const review=qs.map((q,i)=>({n:q[0],text:q[1],selected:draft.answers[i],answer:q[3],right:q[2][YES.indexOf(q[3])],category:q[4],options:q[2]}));
 last={id,date,correct,wrong,blank,score,total:qs.length,elapsed:Math.max(0,date-draft.started),review};const h=state();h.attempts.push(last);h.draft=null;save(h);current=null;position=0;
 paint('<div class="ed-result"><small>RESULTADO · '+d.year+'</small><h1>Test corregido ♥</h1><strong>'+pretty(score)+'/100</strong><div class="ed-result-stats"><span>✓ '+correct+' aciertos</span><span>✕ '+wrong+' errores</span><span>○ '+blank+' blancas</span></div><p>Calificación orientativa de estas '+qs.length+' preguntas, con penalización de 0,25 por error.</p><div class="ed-result-buttons">'+button('Revisar respuestas','review','ed-primary')+button('↻ Repetir desde cero','reset:'+id)+button('Exámenes por año','back')+'</div></div>')
}
function review(){if(!last)return;paint('<div class="ed-heading"><small>REPASO DE RESULTADOS</small><h1>'+last.total+' preguntas corregidas</h1><p>Seleccionada → válida. Repasa los errores y las preguntas dejadas en blanco.</p></div><div class="ed-reviews">'+last.review.map(x=>'<article class="ed-review '+(x.selected===x.answer?'ok':'bad')+'"><small>Pregunta histórica '+x.n+' · '+esc(x.category)+'</small><h3>'+esc(x.text)+'</h3><p>Tu respuesta: <b>'+(x.selected||'En blanco')+'</b> · Respuesta de práctica: <b>'+x.answer+'</b></p><p>'+esc(x.right)+'</p></article>').join('')+'</div>'+button('Volver a convocatorias','back','ed-primary'))}
function history(){stop();current=null;const s=state();paint('<div class="ed-heading"><small>PAULA MASTER EDITION ♥</small><h1>Historial de práctica propia</h1><p>Notas de las selecciones reformuladas, guardadas en este dispositivo. No equivalen a resultados de exámenes oficiales completos.</p></div><div class="ed-history">'+DEFS.map(d=>{const arr=s.attempts.filter(a=>a.id===d.id),avg=arr.length?arr.reduce((x,a)=>x+a.score,0)/arr.length:0,best=arr.length?Math.max(...arr.map(a=>a.score)):0;return '<article><span class="ed-year">'+d.year+'</span><div><strong>'+esc(d.name)+'</strong><small>'+arr.length+' intentos · Mejor '+(arr.length?pretty(best)+'/100':'—')+' · Media '+(arr.length?pretty(avg)+'/100':'—')+'</small></div></article>'}).join('')+'</div>'+button('← Volver','back','ed-primary'))}
function act(x){if(x==='back'){stop();if(current)persist();current=null;list();return}if(x==='practice'){practice();return}if(x==='history'){history();return}if(x.startsWith('start:')){start(x.slice(6));return}if(x.startsWith('reset:')){reset(x.slice(6));return}if(x==='review'){review();return}if(!current)return;const qs=items(current.id);
 if(x.startsWith('pick:'))current.answers[position]=x.slice(5);
 else if(x==='prev')position=Math.max(0,position-1);
 else if(x==='next')position=Math.min(qs.length-1,position+1);
 else if(x.startsWith('go:'))position=Math.max(0,Math.min(qs.length-1,Number(x.slice(3))));
 else if(x==='flag')current.flags=current.flags.includes(position)?current.flags.filter(k=>k!==position):current.flags.concat(position);
 else if(x==='finish'){finish(false);return}
 show()
}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-ed]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();try{act(b.dataset.ed)}catch(err){console.error(err);alert('Error de test: '+err.message)}},true);
window.RADIOSAS_DIRECTO={list,items,definitions:DEFS,valid,reset,start,history,practice,sources:SOURCES};
})();
