/* RADIOSAS 5.2 — Clínica Real. Additive module; no edits to app.js or its localStorage.
   Wikimedia media are remote. A missing image displays a visible fallback and source link.
   Standalone local progress: radiosas_clinica_real_v1. */
(() => {
 'use strict';
 const db=window.RADIOSAS_CLINICA;
 if(!db || !Array.isArray(db.questions) || db.questions.length!==500){console.error('RADIOSAS Clínica Real: faltan las 500 preguntas.');return;}
 const KEY='radiosas_clinica_real_v1';
 const imagesById=new Map(db.images.map(x=>[x.id,x]));
 const questionsById=new Map(db.questions.map(x=>[x.id,x]));
 const label={ALL:'Todas',RX:'Radiografía',TC:'TC',RM:'RM',MAMO:'Mamografía',DXA:'DXA'};
 const base=()=>({version:1,seen:[],attempts:[],draft:null});
 const safe=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const selected=(x,y)=>x===y?' selected':'';
 function read(){try{const x=JSON.parse(localStorage.getItem(KEY));return x && typeof x==='object'?Object.assign(base(),x):base()}catch{return base()}}
 let record=read();
 record.seen=Array.isArray(record.seen)?record.seen:[];
 record.attempts=Array.isArray(record.attempts)?record.attempts:[];
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(record))}catch(e){console.warn('Sin espacio local para Clínica Real',e)}}
 let settings={mod:'ALL',size:10,mode:'study',onlyNew:false}, active=record.draft || null, lit=true, zoom=1,brightness=100,contrast=100,tab='home', currentFeedback=null, isOpen=false;
 const root=document.createElement('section');root.id='radiosas-clinica-root';root.setAttribute('aria-label','Imágenes clínicas reales');root.hidden=true;
 document.body.appendChild(root);
 function count(){const ids=new Set(db.questions.map(x=>x.id)),seen=new Set(record.seen.filter(x=>ids.has(x)));return {total:ids.size,seen:seen.size,left:ids.size-seen.size}}
 function byMod(mod){const q=db.questions.filter(x=>mod==='ALL'||x.mod===mod); const seen=new Set(record.seen);return {total:q.length,seen:q.filter(x=>seen.has(x.id)).length}}
 function fmt(n){return Number(n||0).toLocaleString('es-ES')}
 function stats(){const arr=record.attempts;const a=arr.reduce((sum,x)=>sum+x.correct,0),t=arr.reduce((sum,x)=>sum+x.total,0);return {n:arr.length,correct:a,total:t,pct:t?Math.round(a*100/t):0}}
 const modalCount=mod=>db.questions.filter(q=>q.mod===mod).length;
 const iconHeart='♥';
 function escapeClose(){isOpen=false;root.hidden=true;document.body.classList.remove('clinica-abierta');}
 function top(){root.scrollTop=0}
 function ensureTriggers(){
  const app=document.querySelector('#app'); if(!app)return;
  const host=app.querySelector('.sidebar');
  if(host&&!host.querySelector('[data-clinica-trigger]')){
   const anchor=host.querySelector('[data-nav="laboratorio"]');
   const btn=document.createElement('button');btn.className='nav cr-menu-entry';btn.type='button';btn.setAttribute('data-clinica-trigger','');btn.innerHTML='<span aria-hidden="true">✚</span><span>Imágenes clínicas</span><span class="cr-new">500</span>';
   if(anchor)anchor.after(btn);else host.insertBefore(btn,host.querySelector('.side-bottom'));
  }
  const nav=app.querySelector('.desktop-nav');
  if(nav&&!nav.querySelector('[data-clinica-trigger]')){
   const btn=document.createElement('button');btn.className='cr-desktop-entry';btn.type='button';btn.setAttribute('data-clinica-trigger','');btn.innerHTML='<span class="cr-cross-icon">✚</span><span>Imágenes clínicas</span>';
   nav.appendChild(btn);
  }
  const page=app.querySelector('main.page');
  if(page && !page.querySelector('[data-clinica-trigger]') && page.querySelector('.hero')){
   const button=document.createElement('button');button.type='button';button.className='cr-home-entry';button.setAttribute('data-clinica-trigger','');
   button.innerHTML='<span class="cr-home-entry-icon">✚</span><span><strong>Imágenes clínicas reales</strong><small>500 ejercicios · RX · TC · RM · Mamografía · DXA</small></span><span aria-hidden="true">➜</span>';
   const hero=page.querySelector('.hero');hero?.after(button);
  }
 }
 document.addEventListener('click',e=>{
  const button=e.target.closest?.('[data-clinica-trigger]');if(!button)return;
  e.preventDefault();e.stopPropagation();isOpen=true;tab='home';root.hidden=false;document.body.classList.add('clinica-abierta');render();top();top();
 },true);
 let frame=0;
 const host=document.querySelector('#app');
 if(host){new MutationObserver(()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;ensureTriggers()})}).observe(host,{childList:true});}
 ensureTriggers();
 const imagesMetadata=()=>`<span class="cr-tag">Imágenes reales verificables</span><span class="cr-tag">Fuentes y licencias visibles</span><span class="cr-tag">500 retos · 100 conceptos base</span>`;
 function header(){const p=count();return `<header class="cr-top"><div class="cr-top-brand"><span class="cr-pulse-symbol" aria-hidden="true">✚</span><div><strong>IMÁGENES CLÍNICAS</strong><small>RADIOSAS · Paula Master Edition ${iconHeart}</small></div></div><div class="cr-header-progress"><b>${fmt(p.seen)}</b><span>/ ${fmt(p.total)} vistas</span></div><button class="cr-close" type="button" data-cr="close" aria-label="Cerrar imágenes clínicas">✕</button></header>`}
 function buttons(arr,kind,value){return arr.map(([key,text])=>`<button class="cr-chip ${key===value?'on':''}" data-cr="${kind}" data-val="${key}" type="button" ${kind==='size'?'aria-pressed="'+(key===value)+'"':''}>${safe(text)}</button>`).join('')}
 function progressRow(){const p=count(),pct=Math.round(100*p.seen/p.total),s=stats();return `<div class="cr-summary"><div><span>Retos disponibles</span><strong>${fmt(p.total)}</strong></div><div><span>Distintos vistos</span><strong>${fmt(p.seen)}</strong></div><div><span>Pendientes</span><strong>${fmt(p.left)}</strong></div><div><span>Acierto histórico</span><strong>${s.total?s.pct+'%':'—'}</strong></div></div><div class="cr-track"><span style="width:${pct}%"></span></div><p class="cr-small">${pct}% recorrido · Los retos con un mismo concepto se alternan para reducir repeticiones. Las imágenes no representan 500 casos distintos.</p>`}
 function home(){const x=modalCount;return `<div class="cr-intro"><div class="cr-eyebrow">LABORATORIO DE RADIOLOGÍA · PAULA ${iconHeart}</div><h1>Explora, aprende y <em>descubre.</em></h1><p>Estudia con imágenes clínicas reales de fuentes abiertas. Una experiencia visual con controles de monitor, explicaciones y resultados propios.</p><div class="cr-pills">${imagesMetadata()}</div></div>
  ${progressRow()}<div class="cr-mod-cards">${[['RX','RADIOGRAFÍA','🩻'],['TC','TOMOGRAFÍA','◉'],['RM','RESONANCIA','◎'],['MAMO','MAMOGRAFÍA','♡'],['DXA','DENSITOMETRÍA','▤']].map(([key,title,glyph])=>`<button class="cr-mod-card ${settings.mod===key?'active':''}" data-cr="mod" data-val="${key}"><span class="cr-mod-ico">${glyph}</span><strong>${title}</strong><small>${fmt(modalCount(key))} retos</small><span class="cr-mod-progress">${byMod(key).seen} vistos</span></button>`).join('')}</div>
  <section class="cr-config"><div class="cr-section-title"><span>◈ Configura tu sesión</span><button type="button" data-cr="stats">Ver estadísticas ↗</button></div><p class="cr-small">Los ejercicios son de formación técnica asociada a las imágenes. Evitamos atribuir diagnósticos que no estén confirmados por la fuente.</p>
  <div class="cr-field"><label>Modalidad</label><div class="cr-chipline">${buttons([['ALL','Todas'],['RX','RX'],['TC','TC'],['RM','RM'],['MAMO','Mamo'],['DXA','DXA']],'mod',settings.mod)}</div></div>
  <div class="cr-field"><label>Tipo de sesión</label><div class="cr-chipline">${buttons([['study','Estudio con explicación'],['exam','Examen sin pistas']],'mode',settings.mode)}</div></div>
  <div class="cr-field"><label>Preguntas</label><div class="cr-chipline">${buttons([[10,'10'],[20,'20'],[25,'25'],[50,'50']],'size',settings.size)}</div></div>
  <label class="cr-checkbox"><input id="cr-new-only" type="checkbox" ${settings.onlyNew?'checked':''} /> Solo retos no vistos</label>
  <div class="cr-actions"><button class="cr-primary" type="button" data-cr="start">▶ Iniciar sesión</button>${active?'<button class="cr-outline" type="button" data-cr="resume">↺ Reanudar anterior</button>':''}</div>
  </section><div class="cr-footerbar"><span>Imágenes: ${db.images.length} referencias clínicas de Wikimedia Commons</span><button data-cr="sources" type="button">Licencias y créditos ↗</button></div>`}
 function imageTools(img){return `<section class="cr-viewer ${lit?'powered':''}" aria-label="Visor de imagen médica"><div class="cr-viewer-top"><span><i class="cr-led" aria-hidden="true"></i> VISOR CLÍNICO · ${safe(label[img.mod])}</span><button data-cr="power" type="button" aria-pressed="${lit}">${lit?'⏼ Encendido':'⏼ Encender'}</button></div><div class="cr-image-stage"><img class="cr-med-img" alt="${safe(img.title)}" src="${safe(img.url)}" style="transform:scale(${zoom});filter:brightness(${brightness}%) contrast(${contrast}%)"/><div class="cr-viewer-off">MONITOR EN ESPERA<br><small>Actívalo para inspeccionar</small></div><div class="cr-image-failure" hidden>Esta imagen externa no se ha podido cargar.<br><a href="${safe(img.page)}" target="_blank" rel="noopener">Abrir página de la imagen ↗</a></div><span class="cr-view-cross one">+</span><span class="cr-view-cross two">+</span></div><div class="cr-viewer-controls"><button data-cr="zoomout" type="button" title="Reducir">−</button><span>ZOOM ${Math.round(zoom*100)}%</span><button data-cr="zoomin" type="button" title="Ampliar">+</button><label>Brillo <input id="cr-brightness" type="range" min="70" max="145" step="5" value="${brightness}" aria-label="Brillo de la imagen"></label><label>Contraste <input id="cr-contrast" type="range" min="70" max="150" step="5" value="${contrast}" aria-label="Contraste de la imagen"></label><button data-cr="resetview" type="button" title="Restablecer">↺</button></div><div class="cr-img-source"><b>${safe(img.title)}</b> · ${safe(img.author)} · ${safe(img.license)} <a target="_blank" rel="noopener" href="${safe(img.page)}">Fuente y licencia ↗</a></div></section>`}
 function renderQuiz(){const ids=active?.ids||[];if(!active||!ids.length){tab='home';return home()}
 const q=questionsById.get(ids[active.index]);if(!q){return `<div class="cr-panel">No se encuentra la pregunta solicitada. <button data-cr="home">Volver</button></div>`}
 const im=imagesById.get(q.image), a=active.answers[q.id], isAnswered=a!==undefined,show=active.mode==='study'&&isAnswered;
 const finished=active.index===ids.length-1;
 return `<div class="cr-exam-bar"><button class="cr-back" data-cr="home" type="button">‹ Salir</button><div><b>${active.mode==='study'?'Modo estudio':'Modo examen'}</b><small>${safe(label[q.mod])} · Reto ${active.index+1} de ${ids.length}</small></div><span>${Math.round((active.index+1)/ids.length*100)}%</span></div><div class="cr-track"><span style="width:${(active.index+1)/ids.length*100}%"></span></div>
 <div class="cr-study-grid">${imageTools(im)}<section class="cr-question"><div class="cr-q-meta"><span>RETO ${safe(q.id)}</span><span>${safe(label[q.mod])} · ${safe(im.focus)}</span></div><h2>${safe(q.text)}</h2><p class="cr-source-context">La imagen es una referencia auténtica de la modalidad; no siempre ilustra directamente el fenómeno de la pregunta.</p><div class="cr-choices">${q.options.map((o,i)=>`<button type="button" class="cr-answer ${isAnswered&&a===i?'chosen':''} ${show&&i===q.answer?'right':''} ${show&&a===i&&i!==q.answer?'wrong':''}" data-cr="answer" data-val="${i}" ${active.mode==='study'&&isAnswered?'disabled':''}><span>${'ABCD'[i]}</span><b>${safe(o)}</b></button>`).join('')}</div>${show?`<div class="cr-feedback ${a===q.answer?'yes':'no'}"><strong>${a===q.answer?'✓ Correcto':'✕ Respuesta correcta: '+safe(q.options[q.answer])}</strong><p>${safe(q.explain)}</p><small>Formación técnica; no constituye interpretación diagnóstica del paciente.</small></div>`:''}
 <div class="cr-bottomnav"><button type="button" class="cr-outline" data-cr="previous" ${active.index===0?'disabled':''}>← Anterior</button><span>${Object.keys(active.answers).length} / ${ids.length} respondidas</span><button class="cr-primary" type="button" data-cr="${finished?'finish':'next'}">${finished?'Finalizar examen':'Siguiente →'}</button></div></section></div>`}
 function summary(){if(!active){tab='home';return home()}
 const rs=active.ids.map(id=>{const q=questionsById.get(id);return {q,chosen:active.answers[id]}}).filter(x=>x.q);
 const correct=rs.filter(x=>x.chosen===x.q.answer).length,answered=rs.filter(x=>x.chosen!==undefined).length,wrong=answered-correct;
 return `<div class="cr-results"><div class="cr-eyebrow">SESIÓN COMPLETADA ${iconHeart}</div><h1>Tu resultado</h1><div class="cr-result-score">${rs.length?Math.round(100*correct/rs.length):0}<small>% de acierto</small></div><div class="cr-summary"><div><span>Aciertos</span><strong>${correct}</strong></div><div><span>Errores</span><strong>${wrong}</strong></div><div><span>En blanco</span><strong>${rs.length-answered}</strong></div><div><span>Preguntas</span><strong>${rs.length}</strong></div></div><div class="cr-actions"><button class="cr-primary" data-cr="saveResult" type="button">Guardar y volver</button><button class="cr-outline" data-cr="review" type="button">Revisar fallos</button></div><p class="cr-small">Los resultados se guardan en este navegador, separados de las notas de los exámenes generales. Puedes exportarlos desde Estadísticas.</p></div>`}
 function calculateSession(){const items=active.ids.map(id=>questionsById.get(id)).filter(Boolean);let correct=0,answered=0;const by={};for(const q of items){if(!by[q.mod])by[q.mod]={total:0,correct:0};by[q.mod].total++;const a=active.answers[q.id];if(a!==undefined){answered++;if(a===q.answer){correct++;by[q.mod].correct++}}}return {at:Date.now(),mode:active.mode,filter:active.mod,ids:active.ids,answers:active.answers,total:items.length,correct,wrong:answered-correct,blank:items.length-answered,by}}
 function results(){const p=count(),s=stats();const perMod=['RX','TC','RM','MAMO','DXA'].map(mod=>{let correct=0,total=0;for(const a of record.attempts){const k=a.by?.[mod];if(k){correct+=k.correct||0;total+=k.total||0}}const b=byMod(mod);return {mod,total,correct,percent:total?Math.round(100*correct/total):0,used:b.seen,max:b.total}});
 return `<div class="cr-stats"><div class="cr-eyebrow">PROGRESO VISUAL</div><h1>Estadísticas clínicas ${iconHeart}</h1>${progressRow()}<div class="cr-summary"><div><span>Sesiones realizadas</span><strong>${s.n}</strong></div><div><span>Respuestas acertadas</span><strong>${s.correct}</strong></div><div><span>Respuestas totales</span><strong>${s.total}</strong></div><div><span>Nota histórica</span><strong>${s.total?s.pct+'%':'—'}</strong></div></div><div class="cr-panel"><h2>Por modalidad</h2>${perMod.map(x=>`<div class="cr-stat-row"><span>${safe(label[x.mod])}</span><div class="cr-mini-track"><span style="width:${x.percent}%"></span></div><b>${x.total?x.percent+'%':'—'}</b><small>${x.used}/${x.max} vistas</small></div>`).join('')}</div><div class="cr-panel"><h2>Últimas sesiones</h2>${record.attempts.length?record.attempts.slice(-8).reverse().map(a=>`<div class="cr-history-row"><span>${new Date(a.at).toLocaleDateString('es-ES')} · ${safe(label[a.filter]||'Mixta')} · ${a.mode==='study'?'Estudio':'Examen'}</span><b>${a.correct}/${a.total}</b></div>`).join(''):'<p class="cr-small">Todavía no has terminado ninguna sesión.</p>'}</div><div class="cr-actions"><button class="cr-primary" data-cr="home" type="button">Nueva sesión</button><button class="cr-outline" data-cr="export" type="button">Exportar historial JSON</button><button class="cr-outline" data-cr="mistakes" type="button">Repasar errores</button></div></div>`}
 function credits(){return `<div class="cr-credits"><div class="cr-eyebrow">LICENCIAS Y PROCEDENCIA</div><h1>Imágenes y atribuciones</h1><p>Se muestran imágenes alojadas en Wikimedia Commons mediante enlaces externos. No están copiadas dentro del ZIP. Requieren conexión y respetar sus licencias. Las preguntas son de práctica técnica; no constituyen diagnósticos clínicos.</p><div class="cr-credits-grid">${db.images.map(im=>`<div class="cr-source-row"><span><b>${safe(im.title)}</b><small>${safe(im.author)} · ${safe(im.license)} · ${safe(label[im.mod])}</small></span><a target="_blank" rel="noopener" href="${safe(im.page)}">Ficha ↗</a></div>`).join('')}</div><button class="cr-outline" data-cr="home">← Volver</button></div>`}
 function seenQuestion(id){if(!record.seen.includes(id)){record.seen.push(id);persist()}}
 function render(){if(!isOpen)return;
  let content=tab==='quiz'?renderQuiz():tab==='done'?summary():tab==='stats'?results():tab==='sources'?credits():home();
  root.innerHTML=`${header()}<div class="cr-content">${content}</div>`;
  const q=tab==='quiz' && active?questionsById.get(active.ids[active.index]):null;
  if(q){seenQuestion(q.id);const img=root.querySelector('.cr-med-img');if(img){img.addEventListener('error',()=>{const el=root.querySelector('.cr-image-failure');if(el)el.hidden=false},{once:true})}}
 }
 function start(ids,mode,mod){active={ids,index:0,answers:{},mode,mod,started:Date.now()};record.draft=active;persist();tab='quiz';currentFeedback=null;zoom=1;brightness=100;contrast=100;lit=true;render();top()}
 function shuffle(arr){return arr.map(x=>({x,n:Math.random()})).sort((a,b)=>a.n-b.n).map(x=>x.x)}
 function choose(pool,amount){const used=new Set(record.seen);const first=shuffle(pool.filter(q=>!used.has(q.id))),again=shuffle(pool.filter(q=>used.has(q.id)));
  const candidates=settings.onlyNew?first:[...first,...again];const grouped=new Map();for(const q of candidates){const x=grouped.get(q.concept)||[];x.push(q);grouped.set(q.concept,x)}
  const frequencies=new Map();for(const id of record.seen){const q=questionsById.get(id);if(q)frequencies.set(q.concept,(frequencies.get(q.concept)||0)+1)}
  const keys=shuffle([...grouped.keys()]).sort((a,b)=>(frequencies.get(b)||0)-(frequencies.get(a)||0)),out=[];while(out.length<amount && keys.length){for(let i=keys.length-1;i>=0&&out.length<amount;i--){const group=grouped.get(keys[i]); if(!group?.length){keys.splice(i,1);continue}out.push(group.shift().id);if(!group.length)keys.splice(i,1)}}return out;
 }
 function startSelected(){const pool=db.questions.filter(q=>settings.mod==='ALL'||q.mod===settings.mod);const ids=choose(pool,settings.size);if(!ids.length){alert('No hay preguntas nuevas con ese filtro. Desactiva «Solo no vistas» para practicar de nuevo.');return}start(ids,settings.mode,settings.mod)}
 function handleAction(action,val){
  if(action==='close'){escapeClose();return}
  if(action==='home'){tab='home';render();top();return}
  if(action==='sources'){tab='sources';render();top();return}
  if(action==='stats'){tab='stats';render();top();return}
  if(action==='mod'){settings.mod=val;render();return}
  if(action==='mode'){settings.mode=val;render();return}
  if(action==='size'){settings.size=Number(val);render();return}
  if(action==='start'){startSelected();return}
  if(action==='resume'){if(active){tab='quiz';render()}return}
  if(action==='power'){lit=!lit;render();return}
  if(action==='zoomin'){zoom=Math.min(2.4,Math.round((zoom+.2)*10)/10);render();return}
  if(action==='zoomout'){zoom=Math.max(1,Math.round((zoom-.2)*10)/10);render();return}
  if(action==='resetview'){zoom=1;brightness=100;contrast=100;lit=true;render();return}
  if(action==='answer'){if(!active)return;const id=active.ids[active.index];if(active.mode==='study'&&active.answers[id]!==undefined)return;active.answers[id]=Number(val);record.draft=active;persist();render();return}
  if(action==='previous'){if(active?.index>0){active.index--;record.draft=active;persist();render();top()}return}
  if(action==='next'){if(active&&active.index<active.ids.length-1){active.index++;record.draft=active;persist();render();top()}return}
  if(action==='finish'){tab='done';render();top();return}
  if(action==='saveResult'){if(active){record.attempts.push(calculateSession());record.draft=null;active=null;persist()}tab='stats';render();top();return}
  if(action==='review'){if(!active)return;const ids=active.ids.filter(id=>{const q=questionsById.get(id);return q && active.answers[id]!==q.answer});if(!ids.length){alert('¡No hay fallos que repasar!');return}record.attempts.push(calculateSession());record.draft=null;persist();start(ids,'study',active.mod);return}
  if(action==='mistakes'){const wrong=[];for(const a of record.attempts.slice().reverse()){for(const id of a.ids||[]){const q=questionsById.get(id);if(q && a.answers?.[id]!==q.answer && !wrong.includes(id))wrong.push(id)}}if(!wrong.length){alert('Todavía no tienes errores registrados en sesiones terminadas.');return}start(wrong.slice(0,25),'study','ALL');return}
  if(action==='export'){const blob=new Blob([JSON.stringify({schema:KEY,exportedAt:new Date().toISOString(),data:record},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='RADIOSAS_clinica_real_historial.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);return}
 }
 root.addEventListener('click',e=>{const target=e.target.closest('[data-cr]');if(!target || target.disabled)return;e.preventDefault();handleAction(target.dataset.cr,target.dataset.val||'')});
 root.addEventListener('change',e=>{if(e.target.id==='cr-new-only')settings.onlyNew=!!e.target.checked;
  if(e.target.id==='cr-brightness'){brightness=Number(e.target.value);const img=root.querySelector('.cr-med-img');if(img)img.style.filter=`brightness(${brightness}%) contrast(${contrast}%)`}
  if(e.target.id==='cr-contrast'){contrast=Number(e.target.value);const img=root.querySelector('.cr-med-img');if(img)img.style.filter=`brightness(${brightness}%) contrast(${contrast}%)`}});
 document.addEventListener('keydown',e=>{if(!isOpen)return;if(e.key==='Escape'){escapeClose();return}if(tab==='quiz'&&e.key==='ArrowRight')handleAction('next','');if(tab==='quiz'&&e.key==='ArrowLeft')handleAction('previous','')});
 window.RADIOSAS_CLINICA_APP={open(){isOpen=true;tab='home';root.hidden=false;document.body.classList.add('clinica-abierta');render();top()},close:escapeClose,count,validate(){return db.questions.length===500 && db.questions.every(q=>q.options.length===4&&q.answer>=0&&q.answer<4&&imagesById.has(q.image))}};
 if(window.RADIOSAS_CLINICA_PREVIEW)window.RADIOSAS_CLINICA_APP.open();
})();