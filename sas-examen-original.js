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
const storeKey='radiosas_practica_examen_real_v1',root=()=>document.querySelector('main.page')||document.getElementById('app');
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));
const read=()=>{try{const s=JSON.parse(localStorage.getItem(storeKey)||'{}');return{history:s.history||[],draft:s.draft||null}}catch{return{history:[],draft:null}}},save=s=>localStorage.setItem(storeKey,JSON.stringify(s)),button=(s,a)=>'<button type="button" data-original="'+a+'">'+s+'</button>';
let current=null,timer=null,annex=false;
function paint(html){let r=root();if(r)r.innerHTML='<section class="sasoriginal">'+html+'</section>';window.scrollTo?.({top:0,behavior:'instant'})}
function list(){clearInterval(timer);current=null;const state=read();return '<section class="sas-original-catalog"><h2>Exámenes auténticos del SAS · por año</h2><p>Consulta el cuadernillo original dentro de la academia y responde en la hoja interactiva. No tienes que descargar ni subir ningún PDF. Las preguntas originales siguen alojadas en la web oficial del SAS.</p><div class="sas-original-years">'+exams.map(d=>{const hits=state.history.filter(a=>a.id===d.id),last=hits.at(-1);return '<article><span>'+d.year+'</span><div><b>'+d.name+'</b><small>'+d.n+' preguntas · '+d.min+' min · '+hits.length+' intentos'+(last?.score!=null?' · '+last.score.toFixed(2)+'/100':'')+'</small></div>'+button(state.draft?.id===d.id?'Continuar':'Hacer examen','start:'+d.id)+(hits.length||state.draft?.id===d.id?button('↻ Reiniciar','reset:'+d.id):'')+'</article>'}).join('')+'</div>'+button('Ver notas e historial','history')+'<p class="sasoriginal-note">Corrección definitiva integrada para 2025, 2024 y 2022. Para 2018, la clave completa todavía no ha podido verificarse; las respuestas se guardan pero no se inventa puntuación.</p></section>'}
function renderList(){paint(list())}
function launch(id,fresh=false){const d=exams.find(x=>x.id===id);if(!d)return;const s=read();current=!fresh&&s.draft?.id===id?s.draft:{id,n:1,started:Date.now(),responses:{}};s.draft=current;save(s);annex=false;show()}
function reset(id){if(!confirm('¿Reiniciar este examen? Se borrarán las respuestas en curso, conservando las notas anteriores.'))return;launch(id,true)}
function show(){if(!current)return;const d=exams.find(x=>x.id===current.id);const n=current.n,answered=Object.keys(current.responses).length;const opt='ABCD'.split('').map(c=>button((current.responses[n]===c?'✓ ':'')+c,'answer:'+c)).join('');
const numbers=Array.from({length:d.n},(_,i)=>i+1).map(i=>button((current.responses[i]?'● ':'')+i,'goto:'+i)).join('');
paint('<header>'+button('← Volver','back')+'<div><b>SAS '+d.year+' · '+d.name+'</b><small>Práctica con cuadernillo oficial</small></div><strong id="sas-original-clock">--:--</strong></header><div class="sasoriginal-layout"><div class="sasoriginal-paper"><nav>'+button('Cuadernillo','paper')+(d.annex?button('Anexo de imágenes','annex'):'')+'</nav><iframe title="Cuadernillo oficial SAS" src="'+esc(annex&&d.annex?d.annex:d.url)+'" loading="eager"></iframe><p>El documento es el original alojado por el SAS. Si no aparece incrustado, <a href="'+esc(d.url)+'" target="_blank" rel="noopener noreferrer">consúltalo en su fuente oficial</a>.</p></div><div class="sasoriginal-answer"><b>Pregunta '+n+' de '+d.n+'</b><small>'+answered+' respuestas marcadas</small><p>Lee la pregunta '+n+' en el cuadernillo original y selecciona la opción:</p><div class="sasoriginal-options">'+opt+'</div><div class="sasoriginal-nav">'+button('← Anterior','prev')+button(n===d.n?'Entregar':'Siguiente →',n===d.n?'finish':'next')+'</div><details><summary>Ir a una pregunta</summary><div class="sasoriginal-map">'+numbers+'</div></details>'+button('↻ Reiniciar examen','reset:'+d.id)+'</div></div>');const s=read();s.draft=current;save(s);tick()}
function tick(){clearInterval(timer);const fn=()=>{if(!current)return;const d=exams.find(x=>x.id===current.id),seconds=Math.max(0,d.min*60-Math.floor((Date.now()-current.started)/1000)),el=document.getElementById('sas-original-clock');if(el)el.textContent=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(x=>String(x).padStart(2,'0')).join(':');if(!seconds)finish(true)};fn();timer=setInterval(fn,1000)}
function finish(auto){if(!current)return;if(!auto&&!confirm('¿Entregar el examen y guardar la nota?'))return;clearInterval(timer);const d=exams.find(x=>x.id===current.id),k=key(d.id);let ok=0,fail=0,voided=0;for(let n=1;n<=d.n;n++){if(k&&k[n]===null){voided++;continue}if(k&&current.responses[n])current.responses[n]===k[n]?ok++:fail++}const marked=Object.keys(current.responses).length;const score=k?Math.max(0,100*(ok-fail*.25)/(d.n-voided)):null;const s=read();s.history.push({id:d.id,at:Date.now(),marked,ok,fail,score});s.draft=null;save(s);current=null;paint('<div class="sasoriginal-result"><h2>Examen entregado</h2><strong>'+(score===null?'Pendiente de plantilla':score.toFixed(2)+'/100')+'</strong><p>'+marked+' respuestas marcadas'+(k?' · '+ok+' aciertos · '+fail+' errores':' · Corrección automática aún no verificada para 2018')+'</p>'+button('Volver a exámenes','back')+button('Repetir desde cero','reset:'+d.id)+'</div>')}
function history(){const s=read();paint('<h2>Resultados de exámenes oficiales</h2><div class="sas-original-years">'+(s.history.length?s.history.slice().reverse().map(x=>'<article><span>'+x.id.slice(0,4)+'</span><div><b>'+new Date(x.at).toLocaleDateString('es-ES')+'</b><small>'+x.marked+' respondidas · '+(x.score==null?'Sin calificar':x.score.toFixed(2)+'/100')+'</small></div></article>').join(''):'Aún no hay intentos registrados.')+'</div>'+button('← Volver','back'))}
function action(a){if(a==='back')return renderList();if(a==='history')return history();if(a.startsWith('start:'))return launch(a.slice(6));if(a.startsWith('reset:'))return reset(a.slice(6));if(!current)return;if(a==='annex')annex=true;else if(a==='paper')annex=false;else if(a==='prev')current.n=Math.max(1,current.n-1);else if(a==='next')current.n=Math.min(exams.find(x=>x.id===current.id).n,current.n+1);else if(a.startsWith('goto:'))current.n=+a.slice(5);else if(a.startsWith('answer:')){current.responses[current.n]=a.slice(7);current.n=Math.min(exams.find(x=>x.id===current.id).n,current.n+1)}else if(a==='finish')return finish(false);show()}
document.addEventListener('click',e=>{const el=e.target.closest?.('[data-original]');if(!el)return;e.preventDefault();e.stopImmediatePropagation();try{action(el.dataset.original)}catch(ex){console.error(ex)}},true);
window.RADIOSAS_ORIGINAL={list,renderList,exams,key,parsed};
})();