const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const KEY='radiosas_academy_v1';
// Datos sintéticos para probar una actualización grande. No forman parte del banco público.
function boot(storage, count=0) {
  const handlers={}, root={innerHTML:''};
  const ctx={console,Date,Math,Array,Object,Number,String,JSON,Error,Map,Set,setTimeout,clearTimeout,setInterval:()=>{},
    Blob:function(){},URL,alert:()=>{},confirm:()=>true,
    localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>{storage[k]=v}},
    document:{body:{appendChild(){},classList:{add(){},remove(){},toggle(){}}},getElementById:id=>id==='app'?root:id==='restore-session'||id==='discard-session'?{addEventListener(){}}:null,
      addEventListener:(event,handler)=>handlers[event]=handler,createElement:()=>({classList:{add(){},remove(){}},click(){},remove(){}})},
    window:{scrollTo(){}}};
  vm.createContext(ctx);
  ['data.js','bank-master.js'].forEach(file=>vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),ctx,{filename:file}));
  for(let i=0;i<count;i++)ctx.window.RADIOSAS_DATA.practice.push({id:`loadtest-5000-${i}`,text:`Caso de laboratorio ${i}`,category:'Anatomía radiológica',options:['A','B','C','D'],answer:0,explanation:'Pregunta simulada no incluida en la edición distribuida',concept:`unique-loadtest-${i}`});
  vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),ctx,{filename:'app.js'});
  return {html:()=>root.innerHTML,state:()=>JSON.parse(storage[KEY]),click:ds=>handlers.click({target:{closest:()=>({dataset:ds})}})};
}
const store={};
let first=boot(store);
first.click({action:'quick'});
const oldIds=first.state().draft.questions.slice();
first.click({action:'finish'});
const historic=first.state().attempts.map(a=>JSON.stringify(a));
assert.equal(first.state().bankKnownIds.length,1000);
assert.equal(first.state().seenQuestions.length,10);
first.click({nav:'inicio'});assert(first.html().includes('question-bank-counts'));
let upgraded=boot(store,4000);
assert.equal(upgraded.state().bankKnownIds.length,5000);
assert.equal(upgraded.state().bankUpdate.added,4000);
assert.deepEqual(upgraded.state().attempts.map(a=>JSON.stringify(a)),historic);
assert.equal(upgraded.state().seenQuestions.length,10);
assert.match(upgraded.html(),/5\.?000/);
assert.match(upgraded.html(),/4\.?990/);
assert.match(upgraded.html(),/4\.?000<\/strong> preguntas nuevas/);
upgraded.click({action:'quick'});
const fresh=upgraded.state().draft.questions;
assert.equal(fresh.length,10);
assert(fresh.every(id=>id.startsWith('loadtest-5000-')),'a new test must prefer newly-added questions');
assert(fresh.every(id=>!oldIds.includes(id)));
upgraded.click({action:'finish'});
assert.equal(upgraded.state().attempts.length,2);
const restart=boot(store,4000);
assert.equal(restart.state().attempts.length,2);
assert.equal(restart.state().seenQuestions.length,20);
assert.equal(restart.state().bankKnownIds.length,5000);
assert.deepEqual(restart.state().attempts[0]&&JSON.stringify(restart.state().attempts[0]),historic[0]);
console.log('CAPACIDAD 5000 OK: simulación 1000→5000, +4000 nuevas priorizadas, progreso anterior intacto, 4990 pendientes, persistencia entre cargas. Las 4000 preguntas ficticias NO se distribuyen.');
