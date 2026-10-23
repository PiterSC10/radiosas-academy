'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const events={},map=new Map(),main={innerHTML:''};
const seed='{"attempts":[{"id":"antiguo"}],"custom":[],"favorites":["p1"]}';
map.set('radiosas_academy_v1',seed);
const context={console,Date,Math,JSON,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},confirm:()=>true,alert(){},localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)},document:{getElementById:()=>({textContent:''}),querySelector:()=>main,addEventListener:(t,fn)=>{if(t==='click')events.click=fn}},window:{scrollTo(){}}};
vm.createContext(context);
for(const file of ['data.js','sas-examen-original.js','historicos-2025.js','historicos-2024.js','historicos-2022-l.js','historicos-2022-a.js','historicos-2018.js','examenes-directos.js']){
 vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file,timeout:10000});
}
const app=context.window.RADIOSAS_DIRECTO;
assert.equal(app.definitions.length,5);
const counts={'2025':20,'2024':29,'2022-l':20,'2022-a':20,'2018':27};
let grand=0;
for(const exam of app.definitions){
 const qs=app.items(exam.id),keys=context.window.RADIOSAS_ORIGINAL.key(exam.id);
 assert.equal(qs.length,counts[exam.id],exam.id);
 assert.equal(new Set(qs.map(q=>q[0])).size,qs.length,'numbers cannot repeat');
 assert(qs.every(app.valid),'every question has four distinct options, answer and source number');
 for(const q of qs){
  const official=exam.id==='2025'&&q[0]===151?'B':keys[q[0]];
  assert.equal(q[3],official,'answer-key match '+exam.id+' '+q[0]);
 }
 grand+=qs.length;
}
assert.equal(grand,116);
app.list();
assert.equal((main.innerHTML.match(/data-ed="start:/g)||[]).length,5,'five adapted historical quizzes visible on opening');
assert.equal((main.innerHTML.match(/NO DISPONIBLE/g)||[]).length,0,'not a blocked landing page');
assert(main.innerHTML.includes('116'),'the 116 retrieved adaptations are immediately accessible');
assert(!map.has('radiosas_examenes_directos_2026_v1'),'view does not mutate historical storage');
app.practice();
assert.equal((main.innerHTML.match(/data-ed="start:/g)||[]).length,5);
assert(!/\.pdf|<iframe|c[oó]digo QR|Abrir cuadernillo|SAS_T[ÉE]CNICO/.test(main.innerHTML),'no PDFs/QR/official document links exposed');
function click(action){events.click({target:{closest:()=>({dataset:{ed:action}})},preventDefault(){},stopImmediatePropagation(){}})}
click('start:2025');
assert(main.innerHTML.includes('N.º histórico 10'),'real source numbering shown');
click('pick:D');
let draft=JSON.parse(map.get('radiosas_examenes_directos_2026_v1')).draft;
assert.equal(draft.answers[0],'D');
click('reset:2025');
draft=JSON.parse(map.get('radiosas_examenes_directos_2026_v1')).draft;
assert(draft.answers.every(x=>x===null),'reset clears responses');
assert(main.innerHTML.includes('N.º histórico 10'),'reset returns to first question');
click('pick:D');click('finish');
const history=JSON.parse(map.get('radiosas_examenes_directos_2026_v1'));
assert.equal(history.attempts.length,1);
assert.equal(history.attempts[0].correct,1);
assert.equal(history.attempts[0].blank,19);
assert.equal(map.get('radiosas_academy_v1'),seed,'old progress must remain byte-identical');
click('history');
assert(main.innerHTML.includes('Historial de práctica propia'));
click('reset:2025');
assert.equal(JSON.parse(map.get('radiosas_examenes_directos_2026_v1')).attempts.length,1,'reset preserves past grades');
assert.equal(map.get('radiosas_academy_v1'),seed);
assert(main.innerHTML.includes('PRÁCTICA PROPIA, NO OFICIAL'));
const pageHtml=fs.readFileSync('index.html','utf8');
assert(pageHtml.includes('sas-examen-original.js?v=620'),'reader for real exam text is loaded');
const html=fs.readFileSync('app.js','utf8');
assert.equal((html.match(/data-action="goto-historicos"/g)||[]).length,1,'one featured home entry');
console.log('OK: cinco quizzes historicos adaptados visibles al abrir, 116 items, reset e historial preservados, originales aparte y un unico acceso destacado.');
