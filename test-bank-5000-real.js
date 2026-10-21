'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const cwd=__dirname,KEY='radiosas_academy_v1';
function boot(storage,extended) {
 const handlers={},app={innerHTML:''};
 const ctx={console,Date,Math,Array,Object,Number,String,JSON,Error,Map,Set,
  setTimeout:()=>0,clearTimeout:()=>{},setInterval:()=>{},Blob:function(){},URL,alert:()=>{},confirm:()=>true,
  localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},
  document:{body:{appendChild(){},classList:{add(){},remove(){},toggle(){}}},getElementById:id=>id==='app'?app:null,
   createElement:()=>({classList:{add(){},remove(){}},click(){},remove(){}}),addEventListener:(event,fn)=>handlers[event]=fn},
  window:{scrollTo(){}}};
 vm.createContext(ctx);
 for(const name of ['data.js','bank-master.js',...(extended?['bank-5000.js']:[]),'lab-data.js'])vm.runInContext(fs.readFileSync(cwd+'/'+name,'utf8'),ctx,{filename:name});
 if(extended)assert.equal(ctx.window.RADIOSAS_DATA.practice.length,5000);
 vm.runInContext(fs.readFileSync(cwd+'/app.js','utf8'),ctx,{filename:'app.js'});
 return{click:ds=>handlers.click({target:{closest:()=>({dataset:ds})}}),state:()=>JSON.parse(storage[KEY]),app,questions:ctx.window.RADIOSAS_DATA.practice};
}
const storage={};let old=boot(storage,false);
old.click({action:'quick'});
const legacyIds=old.state().draft.questions.slice();
old.click({pick:'0'});old.click({action:'finish'});
const orig=JSON.stringify(old.state().attempts);
assert.equal(old.state().bankKnownIds.length,1000);
let latest=boot(storage,true);
assert.equal(latest.state().bankKnownIds.length,5000);
assert.equal(latest.state().bankUpdate.added,4000);
assert.equal(JSON.stringify(latest.state().attempts),orig);
for(const id of legacyIds)assert(latest.state().seenQuestions.includes(id));
assert.match(latest.app.innerHTML,/5\.?000/);
assert.match(latest.app.innerHTML,/4\.?990/);
assert.match(latest.app.innerHTML,/\+4000|\+4\.000/);
// Verify existing question IDs and that additional questions are available.
const qs=latest.questions;
assert.equal(new Set(qs.map(q=>q.id)).size,5000);
assert.equal(new Set(qs.map(q=>q.text.trim().toLocaleLowerCase('es'))).size,5000);
assert.equal(qs.filter(q=>q.id.startsWith('ampliacion-')).length,4000);
const validCats=new Set(qs.slice(0,1000).map(q=>q.category));
assert.equal(validCats.size,10);
let balance=[0,0,0,0],counter={};
for(const q of qs){
 assert(validCats.has(q.category),'unknown category '+q.category);
 assert.equal(q.options.length,4,q.id);
 assert.equal(new Set(q.options.map(s=>s.trim().toLocaleLowerCase('es'))).size,4,q.id);
 assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<=3,q.id);
 assert(q.text.length>10&&q.explanation.length>7,q.id);
 balance[q.answer]++;
 counter[q.category]=(counter[q.category]||0)+1;
 if(q.expected)assert.equal(q.options[q.answer],q.expected,q.id);
}
for(const cnt of balance)assert(cnt>=1000&&cnt<=1550,'unbalanced answer key');
// Examine early real quick tests, including a practice attempt, without repeating.
const seen=new Set();
for(let i=0;i<25;i++){
 latest.click({action:'quick'});
 const draft=latest.state().draft;
 assert.equal(draft.questions.length,10);
 assert(draft.questions.every(id=>id.startsWith('ampliacion-')),'new questions not prioritized');
 assert(draft.questions.every(id=>!seen.has(id)),'duplicate question before exhausting bank');
 for(const id of draft.questions)seen.add(id);
 latest.click({action:'finish'});
}
assert.equal(seen.size,250);
assert.equal(latest.state().seenQuestions.length,260);
assert.equal(latest.state().attempts.length,26);
const back=boot(storage,true);
assert.equal(back.state().attempts.length,26,'attempt history persisted');
assert.equal(back.state().seenQuestions.length,260,'unique seen persisted');
console.log('5000 REAL OK: 4.000 nuevos archivos estructurados + 1.000 previos; 10 materias; 5.000 enunciados literales distintos; respuestas válidas; 25 tests consecutivos sin repetir; 4.000 nuevas priorizadas; estadísticas anteriores intactas; persistencia en recarga.');
console.log('Por materia:',JSON.stringify(counter));
console.log('Balance respuestas:',balance.join('/'));
