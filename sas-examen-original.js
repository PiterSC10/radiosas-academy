/* Práctica interactiva sobre cuadernillos alojados por el SAS; no se redistribuyen los textos ni imágenes. */
(()=>{'use strict';
const SAS='https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/sites/default/files/sincfiles/wsas-media-mediafile_sasdocumento/';
const exams=[
{id:'2025',year:'2025',name:'Acceso libre',n:75,min:120,url:SAS+'2025/tecnicoa_especialista_en_radiodiagnostico_librepi.pdf'},
{id:'2024',year:'2024',name:'Estabilización',n:75,min:120,url:SAS+'2024/20240210_55018_te_radiodiagnostico.pdf'},
{id:'2022-l',year:'2022',name:'Acceso libre',n:150,min:180,url:SAS+'2022/22003%20T%C3%89CNICO%20ESPECIALISTA%20RADIODIAGN%C3%93STICO%20LIBRE.pdf',annex:SAS+'2022/19004_Imagenes%20RADIODIAGNOSTICO.pdf'},
{id:'2022-a',year:'2022',name:'Prueba aplazada',n:150,min:180,url:SAS+'2022/30001_te_radiodiag_aplazado.pdf',annex:SAS+'2022/30001_images__ter_aplazado.pdf'},
{id:'2018',year:'2018',name:'Acceso libre',n:150,min:180,url:'https://ws027.sspa.juntadeandalucia.es/library/plantillas/externa.asp?pag=%2Fcontenidos%2Fprofesionales%2Fseleccion%2Foep%2Fcategorias%2F..%2Fplantillas%2F2016%2Fexamen_tec_radiodiag_l.pdf'}];
const table2022='DDBACCDDABADDBBAACCDDAAABAAADACCCABCCBDBDCDACDDDDCBACDDABACDBCDCCDDCCDACDACBCCDCCADCADDCCBCDDDCDDBCDDBCCDDADBACCABBAABBBACDDCCDDADCBADDAACADDDAACD';
const rawFree=String.raw`1 D 51 D 101 B
2 A 52 C 102 B
3 C 53 B 103 B
4 B 54 A 104 D
5 C 55 C 105 D
6 D 56 D 106 A
7 D 57 B 107 A
8 A 58 A 108 C
9 A 59 B 109 D
10 D 60 A 110 D
11 D 61 C 111 C
12 D 62 B 112 C
13 C 63 A 113 D
14 A 64 D 114 A
15 C 65 D 115 D
16 D 66 C 116 A
17 C 67 C 117 A
18 A 68 D 118 B
19 C 69 B 119 B
20 C 70 D 120 B
21 D 71 C 121 A
22 B 72 C 122 ANULADA
23 B 73 C 123 B
24 B 74 C 124 A
25 C 75 D 125 C
26 A 76 C 126 A
27 B 77 D 127 A
28 A 78 A 128 C
29 A 79 C 129 A
30 A 80 A 130 D
31 D 81 D 131 B
32 C 82 D 132 C
33 C 83 A 133 A
34 C 84 D 134 D
35 A 85 C 135 D
36 B 86 D 136 D
37 C 87 C 137 B
38 C 88 D 138 A
39 B 89 C 139 D
40 B 90 C 140 D
41 D 91 D 141 A
42 A 92 B 142 D
43 C 93 D 143 A
44 D 94 A 144 D
45 A 95 D 145 C
46 D 96 A 146 C
47 C 97 A 147 A
48 D 98 A 148 D
49 C 99 B 149 C
50 D 100 C 150 C`;
const rawApl=String.raw`1 A 51 A 101 B
2 D 52 B 102 C
3 A 53 D 103 D
4 D 54 B 104 C
5 D 55 D 105 C
6 D 56 D 106 A
7 D 57 A 107 A
8 D 58 C 108 A
9 B 59 D 109 D
10 B 60 B 110 D
11 A 61 A 111 C
12 D 62 D 112 A
13 C 63 D 113 B
14 D 64 D 114 D
15 A 65 B 115 C
16 B 66 A 116 A
17 A 67 D 117 D
18 C 68 A 118 D
19 B 69 C 119 B
20 A 70 D 120 C
21 C 71 C 121 A
22 A 72 D 122 B
23 D 73 D 123 D
24 B 74 B 124 C
25 D 75 A 125 B
26 C 76 D 126 B
27 D 77 C 127 D
28 C 78 D 128 B
29 C 79 C 129 D
30 A 80 B 130 B
31 D 81 A 131 D
32 C 82 C 132 B
33 D 83 D 133 C
34 A 84 A 134 D
35 D 85 D 135 B
36 A 86 A 136 C
37 A 87 B 137 B
38 B 88 C 138 D
39 A 89 C 139 D
40 A 90 B 140 A
41 B 91 B 141 C
42 D 92 D 142 D
43 B 93 C 143 A
44 A 94 D 144 D
45 C 95 B 145 D
46 D 96 A 146 A
47 A 97 A 147 D
48 D 98 A 148 D
49 A 99 A 149 B
50 D 100 C 150 C`;
const parsed=raw=>{const k={};for(const m of raw.matchAll(/(?:^|\s)(\d{1,3})\s+(ANULADA|[A-D])(?=\s|$)/g)){if(+m[1]<=150)k[+m[1]]=m[2]==='ANULADA'?null:m[2]}return k};
const key=id=>{if(id==='2022-l')return parsed(rawFree);if(id==='2022-a')return parsed(rawApl);const x=window.RADIOSAS_DATA?.exams?.find(x=>x.year===+id)?.answers;return x?.length===75?Object.fromEntries([...x].map((v,i)=>[i+1,v])):null};

const STORE='radiosas_practica_examen_real_v1',CACHE='radiosas_sas_cuestionarios_personales_v57';
const root=()=>document.querySelector('main.page')||document.getElementById('app');
const escapeHTML=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(label,action)=>'<button type="button" data-original="'+action+'">'+label+'</button>';
const read=(k,base)=>{try{return JSON.parse(localStorage.getItem(k))||base}catch{return base}};
const state=()=>{const x=read(STORE,{});return{history:Array.isArray(x.history)?x.history:[],draft:x.draft||null}};
const save=x=>localStorage.setItem(STORE,JSON.stringify(x));
const getBank=()=>read(CACHE,{}),memory={};
const getPaper=id=>memory[id]||getBank()[id];
const setPaper=(id,q)=>{memory[id]=q;try{const bank=getBank();bank[id]=q;localStorage.setItem(CACHE,JSON.stringify(bank))}catch(e){console.warn('No se pudo conservar el cuadernillo en este navegador',e)}};
const def=id=>exams.find(x=>x.id===id);

/* Si se importó un cuadernillo con la versión 5.3, reutilizar la copia privada del navegador. */
async function fromPreviousVersion(id){
 if(typeof indexedDB==='undefined')return null;
 return new Promise(resolve=>{
  let done=false;const finish=x=>{if(!done){done=true;resolve(x)}};
  try{
   const request=indexedDB.open('radiosas_examenes_fuentes_v53');
   request.onerror=()=>finish(null);
   request.onblocked=()=>finish(null);
   request.onupgradeneeded=()=>{ /* No hay datos anteriores: no crear nada útil. */ };
   request.onsuccess=()=>{
    const db=request.result;
    if(!db.objectStoreNames.contains('exams')){db.close();finish(null);return}
    try{
     const tx=db.transaction('exams','readonly'),entry=tx.objectStore('exams').get(id);
     entry.onerror=()=>{db.close();finish(null)};
     entry.onsuccess=()=>{
      const old=entry.result,d=def(id);
      db.close();
      if(!old?.valid||!Array.isArray(old.questions)||!d||old.questions.length!==d.n){finish(null);return}
      const qs=old.questions.map(q=>({number:Number(q.number),text:q.text,options:q.options}));
      if(qs.every((q,i)=>q.number===i+1&&typeof q.text==='string'&&q.text.length>=12&&Array.isArray(q.options)&&q.options.length===4&&q.options.every(Boolean)))
       finish({questions:qs,complete:true,found:qs.length,expected:d.n,source:d.url});
      else finish(null);
     };
    }catch{db.close();finish(null)}
   };
  }catch{finish(null)}
 });
}

let current=null,ticker=null,busy=false,pickerId=null;
function paint(html){const r=root();if(r)r.innerHTML='<section class="sasoriginal">'+html+'</section>';window.scrollTo?.({top:0,behavior:'instant'})}
function parseText(content,id){
 const d=def(id),limit=d?d.n:150,lines=String(content).replace(/\r/g,'').split('\n'),out=[];let q=null,part=-1;
 function flush(){if(!q)return;q.text=q.text.replace(/\s+/g,' ').trim();q.options=q.options.map(t=>t.replace(/\s+/g,' ').trim());
 if(q.number<=limit&&q.text.length>=12&&q.options.length===4&&q.options.every(Boolean)&&!out.some(x=>x.number===q.number))out.push(q);
 q=null;part=-1}
 for(let item of lines){
   let t=item.replace(/^[\s*#]+/,'').replace(/\*+/g,'').trim();
   if(!t||/^(?:PÁGINA\s+\d+|CONTINÚA|SAS_TÉCNICO|PRUEBA ÚNICA:|CUESTIONARIO TEÓRICO|ACCESO LIBRE|TURNO LIBRE)/i.test(t))continue;
   const n=t.match(/^(\d{1,3})\s*[.)]?\s+(.{10,})$/);
   if(n&&+n[1]<=153){flush();q={number:+n[1],text:n[2],options:[]};continue}
   if(!q)continue;
   const o=t.match(/^([A-D])\s*[\).:-]\s*(.+)$/i);
   if(o){const idx='ABCD'.indexOf(o[1].toUpperCase());if(idx===q.options.length){q.options.push(o[2]);part=idx;continue}}
   if(part<0)q.text+=' '+t;else q.options[part]+=' '+t;
 }
 flush();out.sort((a,b)=>a.number-b.number);
 return{questions:out,complete:out.length===limit&&out.every((q,i)=>q.number===i+1),found:out.length,expected:limit,source:def(id)?.url};
}
function list(){
 clearInterval(ticker);current=null;
 const h=state(),cache=getBank();
 return '<section class="sas-original-catalog"><h2>Exámenes auténticos del SAS · por año</h2><p>Selecciona un año: las preguntas originales se convierten a test de cuatro respuestas en este dispositivo. No verás un PDF incrustado ni un cuestionario de letras sin enunciados.</p><div class="sas-original-years">'+exams.map(d=>{
  const past=h.history.filter(x=>x.id===d.id),last=past.at(-1),r=memory[d.id]||cache[d.id],label=r?.complete?'Preguntas originales disponibles':r?.found?'Extracción incompleta · '+r.found+'/'+d.n:'Fuente original SAS · carga automática';
  return '<article><span>'+d.year+'</span><div><b>'+escapeHTML(d.name)+'</b><small>'+d.n+' preguntas · '+d.min+' minutos · '+escapeHTML(label)+'</small><small>'+past.length+' intentos'+(last?.score!=null?' · '+last.score.toFixed(1)+'/100':'')+'</small></div>'+btn(h.draft?.id===d.id?'Continuar':'Empezar test','start:'+d.id)+(h.draft?.id===d.id||past.length?btn('↻ Reiniciar','reset:'+d.id):'')+'</article>'
 }).join('')+'</div>'+btn('Ver notas e historial','history')+'<p class="sasoriginal-note">Solo comienza el examen cuando se recuperan todos los enunciados y cuatro opciones. Las preguntas que dependen de imágenes pueden requerir el documento original para mostrar su figura; no se inventan. La plantilla de 2018 no está verificada.</p></section>'
}
function renderList(){paint(list())}
function loading(d){paint('<div class="sasoriginal-loading"><h2>SAS '+d.year+' · '+escapeHTML(d.name)+'</h2><p>Preparando preguntas originales y cuatro respuestas…</p><small>Consultando las fuentes del Servicio Andaluz de Salud.</small>'+btn('← Volver','back')+'</div>')}
function filePrompt(d,error){pickerId=d.id;paint('<div class="sasoriginal-loading"><h2>SAS '+d.year+' · '+escapeHTML(d.name)+'</h2><p>No se ha podido recuperar automáticamente el cuestionario completo desde la web del SAS. Para que aparezcan las preguntas literales sin publicar una copia en GitHub, selecciona el cuadernillo una sola vez en este dispositivo.</p><p class="sasoriginal-error">'+escapeHTML(error||'')+'</p><a class="sasoriginal-source" href="'+escapeHTML(d.url)+'" target="_blank" rel="noopener noreferrer">Obtener cuadernillo original del SAS ↗</a><label class="sasoriginal-upload">Seleccionar cuadernillo oficial<input id="sas-original-file" type="file" accept=".pdf,application/pdf"></label><p>Se extraen las preguntas en el propio dispositivo y después podrás practicar sin volver a abrir el PDF.</p>'+btn('← Volver a exámenes','back')+'</div>')}
function pdfLib(){return new Promise((resolve,reject)=>{if(window.pdfjsLib)return resolve(window.pdfjsLib);const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';s.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';resolve(window.pdfjsLib)};s.onerror=()=>reject(Error('No se pudo abrir el lector de documentos'));document.head.appendChild(s)})}
async function pdfText(buffer){
 const lib=await pdfLib(),pdf=await lib.getDocument({data:new Uint8Array(buffer)}).promise,lines=[];
 for(let p=1;p<=pdf.numPages;p++){
  const page=await pdf.getPage(p),contents=await page.getTextContent(),rows=[];
  for(const item of contents.items){
    if(!item.str?.trim()||!item.transform)continue;const x=item.transform[4],y=item.transform[5];
    let row=rows.find(v=>Math.abs(v.y-y)<2);
    if(!row){row={y,parts:[]};rows.push(row)}
    row.parts.push({x,t:item.str});
  }
  rows.sort((a,b)=>b.y-a.y);
  for(const row of rows){const str=row.parts.sort((a,b)=>a.x-b.x).map(v=>v.t).join(' ').replace(/\s+/g,' ').trim();if(str)lines.push(str)}
 }
 return lines.join('\n');
}
async function readRemote(url,isPdf=true){
 const ctl=new AbortController(),id=setTimeout(()=>ctl.abort(),23000);
 try{
  const response=await fetch(url,{credentials:'omit',signal:ctl.signal});
  if(!response.ok)throw Error('HTTP '+response.status);
  if(!isPdf){const text=await response.text();if(text.length<3500||/El servicio no se encuentra disponible/i.test(text))throw Error('Documento no disponible');return text}
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength<1000||new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw Error('La fuente no ha devuelto un PDF válido');
  return pdfText(bytes);
 }finally{clearTimeout(id)}
}
async function fromSource(d){
 const targets=[
   ()=>readRemote(d.url),
   ()=>readRemote('https://api.allorigins.win/raw?url='+encodeURIComponent(d.url)),
   ()=>readRemote('https://r.jina.ai/'+d.url,false)
 ];
 // Probar fuentes simultáneamente y aceptar solo cuadernillos con todas las opciones.
 const tasks=targets.map(async fn=>{
  const text=await fn(),p=parseText(text,d.id);
  if(!p.complete)throw Error(p.found+'/'+d.n+' preguntas recuperadas: incompleto');
  return p;
 });
 try{return await Promise.any(tasks)}
 catch(e){throw Error('La fuente no permite recuperar '+d.n+' preguntas completas: '+(e.errors||[]).map(x=>x.message).join(' · ').slice(0,450))}
}
async function start(id,force){
 const d=def(id);if(!d||busy)return;let paper=getPaper(id);
 if(!paper?.complete){paper=await fromPreviousVersion(id);if(paper?.complete)setPaper(id,paper)}
 if(!paper?.complete){
  busy=true;loading(d);
  try{paper=await fromSource(d);setPaper(id,paper)}catch(e){busy=false;filePrompt(d,e.message);return}
  busy=false;
 }
 const h=state();
 current=!force&&h.draft?.id===id?h.draft:{id,number:1,responses:{},at:Date.now()};
 if(!current.responses)current.responses={};if(!Number.isInteger(current.number))current.number=1;
 h.draft=current;save(h);show();
}
function show(){
 if(!current)return;const d=def(current.id),p=getPaper(d.id),q=p?.questions[current.number-1];
 if(!q){filePrompt(d,'Falta el texto íntegro de la pregunta '+current.number);return}
 const chosen=current.responses[q.number],count=Object.keys(current.responses).length;
 const choices=q.options.map((v,i)=>'<button type="button" class="sasoriginal-option '+(chosen==='ABCD'[i]?'selected':'')+'" data-original="pick:'+'ABCD'[i]+'"><strong>'+'ABCD'[i]+'</strong><span>'+escapeHTML(v)+'</span></button>').join('');
 const map=p.questions.map((v,i)=>'<button type="button" data-original="goto:'+(i+1)+'" class="'+(current.responses[v.number]?'answered':'')+'">'+(i+1)+'</button>').join('');
 paint('<header>'+btn('← Volver','back')+'<div><b>SAS '+d.year+' · '+escapeHTML(d.name)+'</b><small>'+count+'/'+d.n+' preguntas contestadas</small></div><strong id="sas-original-clock">--:--</strong></header><div class="sasoriginal-native"><div class="sasoriginal-native-head"><span>Pregunta '+current.number+' de '+d.n+'</span><span>Cuadernillo SAS</span></div><div class="sasoriginal-progress"><i style="width:'+(count/d.n*100)+'%"></i></div><h2>'+escapeHTML(q.text)+'</h2>'+(/\b(?:IMAGEN|FIGURA|ANEXO)\b/i.test(q.text)?'<p class="sasoriginal-warning">Pregunta con figura: comprueba que también está disponible la imagen original.</p>':'')+'<div class="sasoriginal-native-choices">'+choices+'</div><nav class="sasoriginal-nav">'+btn('← Anterior','prev')+btn(current.number===d.n?'Entregar examen':'Siguiente →',current.number===d.n?'finish':'next')+'</nav><details><summary>Mapa de preguntas · '+count+' respondidas</summary><div class="sasoriginal-map">'+map+'</div></details><div class="sasoriginal-actions">'+btn('↻ Reiniciar examen','reset:'+d.id)+btn('Guardar y salir','back')+'</div></div>');
 const h=state();h.draft=current;save(h);tick()
}
function tick(){
 clearInterval(ticker);
 const fn=()=>{if(!current)return;const d=def(current.id),rem=Math.max(0,d.min*60-Math.floor((Date.now()-current.at)/1000)),el=document.getElementById('sas-original-clock');if(el)el.textContent=[Math.floor(rem/3600),Math.floor(rem/60)%60,rem%60].map(x=>String(x).padStart(2,'0')).join(':');if(!rem)finish(true)};
 fn();ticker=setInterval(fn,1000)
}
function reset(id){if(!confirm('¿Reiniciar el examen? Se borrarán las respuestas actuales, pero se conservarán tus notas anteriores.'))return;const s=state();s.draft=null;save(s);current=null;clearInterval(ticker);start(id,true)}
function finish(auto){
 if(!current)return;if(!auto&&!confirm('¿Entregar y corregir el examen?'))return;
 clearInterval(ticker);const d=def(current.id),correct=key(d.id);
 let ok=0,wrong=0,voided=0;
 for(let i=1;i<=d.n;i++){if(correct&&Object.prototype.hasOwnProperty.call(correct,i)&&correct[i]===null){voided++;continue}if(correct&&current.responses[i])current.responses[i]===correct[i]?ok++:wrong++}
 const answered=Object.keys(current.responses).length,score=correct?Math.max(0,100*(ok-wrong*.25)/(d.n-voided)):null;
 const h=state();h.history.push({id:d.id,at:Date.now(),answered,ok,wrong,score});h.draft=null;save(h);current=null;
 paint('<div class="sasoriginal-result"><h2>Examen finalizado</h2><strong>'+(score==null?'Sin plantilla definitiva':score.toFixed(2).replace('.',',')+'/100')+'</strong><p>'+answered+' respuestas'+(correct?' · '+ok+' aciertos · '+wrong+' fallos':' · sin corrección validada')+'</p>'+btn('↻ Repetir desde cero','repeat:'+d.id)+btn('Volver a convocatorias','back')+'</div>')
}
function history(){const h=state().history.slice().reverse();paint('<section class="sas-original-catalog"><h2>Historial de los exámenes SAS</h2><div class="sas-original-years">'+(h.length?h.map(v=>'<article><span>'+v.id.slice(0,4)+'</span><div><b>'+new Date(v.at).toLocaleDateString('es-ES')+'</b><small>'+v.answered+' respondidas · '+(v.score==null?'Sin nota':v.score.toFixed(2).replace('.',',')+'/100')+'</small></div></article>').join(''):'<p>No hay intentos anteriores.</p>')+'</div>'+btn('← Volver','back')+'</section>')}
function action(act){
 if(act==='back'){clearInterval(ticker);current=null;renderList();return}
 if(act==='history'){history();return}
 if(act.startsWith('start:')){start(act.slice(6),false);return}
 if(act.startsWith('repeat:')){start(act.slice(7),true);return}
 if(act.startsWith('reset:')){reset(act.slice(6));return}
 if(!current)return;
 const d=def(current.id);
 if(act==='prev')current.number=Math.max(1,current.number-1);
 else if(act==='next')current.number=Math.min(d.n,current.number+1);
 else if(act==='finish'){finish(false);return}
 else if(act.startsWith('goto:'))current.number=Math.max(1,Math.min(d.n,+act.slice(5)));
 else if(act.startsWith('pick:')){current.responses[current.number]=act.slice(5);current.number=Math.min(d.n,current.number+1)}
 show()
}
document.addEventListener('click',event=>{
 const b=event.target.closest?.('[data-original]');if(!b)return;
 event.preventDefault();event.stopImmediatePropagation();
 try{action(b.dataset.original)}catch(e){console.error(e);alert(e.message)}
},true);
document.addEventListener('change',event=>{
 if(event.target?.id!=='sas-original-file'||!event.target.files?.length)return;
 const d=def(pickerId),file=event.target.files[0];
 if(!d)return;
 loading(d);
 file.arrayBuffer().then(pdfText).then(text=>{
  const parsed=parseText(text,d.id);
  if(!parsed.complete){filePrompt(d,'Solo '+parsed.found+' de '+d.n+' preguntas con cuatro opciones verificables. No se inicia un examen incompleto.');return}
  setPaper(d.id,parsed);start(d.id,false)
 }).catch(e=>filePrompt(d,e.message));
},true);
window.RADIOSAS_ORIGINAL={list,renderList,exams,key,parsed,parseText,fromSource};
})();