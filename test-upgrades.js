const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const key='radiosas_academy_v1';
function boot(storage, extra=0) {
  const listeners={}, app={innerHTML:''};
  const context={console,Date,Math,Array,Object,Number,String,JSON,Error,Map,Set,setTimeout,clearTimeout,setInterval:()=>{},Blob:function(){},URL,alert:()=>{},confirm:()=>true,
    localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},
    document:{body:{appendChild(){},classList:{add(){},remove(){},toggle(){}}},getElementById:id=>id==='app'?app:(id==='restore-session'||id==='discard-session')?{addEventListener(){}}:null,addEventListener:(event,cb)=>listeners[event]=cb,createElement:()=>({classList:{add(){},remove(){}},click(){},remove(){}})},
    window:{scrollTo(){}}};
  vm.createContext(context);
  for(const f of ['data.js','bank-master.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),context,{filename:f});
  for(let i=0;i<extra;i++)context.window.RADIOSAS_DATA.practice.push({id:`upgrade-new-${i}`,text:`Nueva pregunta verificada ${i}`,category:'Anatomía radiológica',options:['A','B','C','D'],answer:0,explanation:'Prueba de actualización',concept:`upgrade-${i}`});
  vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),context,{filename:'app.js'});
  return {html:()=>app.innerHTML,click:ds=>listeners.click({target:{closest:()=>({dataset:ds})}}),state:()=>JSON.parse(storage[key])};
}
const store={};let a=boot(store);
a.click({action:'quick'});const first=a.state().draft.questions.slice();a.click({action:'finish'});
a.click({nav:'inicio'});assert(a.html().includes('990'));
const before=a.state();assert.equal(before.attempts.length,1);
a=boot(store,50);
assert.equal(a.state().attempts.length,1,'keep previous scores');
assert.deepEqual(a.state().attempts[0],before.attempts[0],'preserve full previous exam');
assert.equal(a.state().seenQuestions.length,10,'keep seen questions');
assert.equal(a.state().bankKnownIds.length,1050,'bank grew');
assert.equal(a.state().bankUpdate.added,50,'show 50 new');
assert(/1\.?050/.test(a.html()),'total grows');
assert(/1\.?040/.test(a.html()),'remaining grows');
assert(a.html().includes('+50'),'show recent delta');
a.click({action:'quick'});
const newTest=a.state().draft.questions;
assert.equal(newTest.length,10);
assert(newTest.every(id=>id.startsWith('upgrade-new-')),'new questions should appear before previously unused older ones');
assert(newTest.every(id=>!first.includes(id)),'no past repeats');
a.click({action:'finish'});
assert.equal(a.state().attempts.length,2);
a=boot(store,50);
assert.equal(a.state().attempts.length,2,'keep new and old scores on next reload');
assert.equal(a.state().bankUpdate.added,50);
assert.equal(a.state().bankKnownIds.length,1050);
assert.equal(a.state().seenQuestions.length,20);
a.click({nav:'ajustes'});
assert(a.html().includes('Actualizaciones sin perder progreso'));
console.log('UPGRADE OK: 1000→1050, old notes retained, new questions prioritized, unique counter adjusted, status and reload persist, no assets required.');
