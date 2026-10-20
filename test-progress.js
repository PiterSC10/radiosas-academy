const fs=require('node:fs'), vm=require('node:vm'),assert=require('node:assert/strict');
const key='radiosas_academy_v1';
function boot(storage){
 const listeners={},app={innerHTML:''};
 const context={console,Date,Math,Array,Object,Number,String,JSON,Error,Map,Set,setTimeout,clearTimeout,setInterval:()=>{},Blob:function(){},URL,alert:()=>{},confirm:()=>true,localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},document:{body:{appendChild(){},classList:{add(){},remove(){},toggle(){}}},getElementById:id=>id==='app'?app:(id==='restore-session'||id==='discard-session')?{addEventListener(){}}:null,addEventListener:(event,cb)=>listeners[event]=cb,createElement:()=>({classList:{add(){},remove(){}},click(){},remove(){}})},window:{scrollTo(){}}};
 vm.createContext(context);
 for(const f of ['data.js','bank-master.js','app.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),context,{filename:f});
 return {html:()=>app.innerHTML,click:ds=>listeners.click({target:{closest:()=>({dataset:ds})}}),state:()=>JSON.parse(storage[key]),context};
}
function counts(html){const m=html.match(/class="question-bank-counts">\s*<div><b>([\d.]+)<\/b><span>Total<\/span><\/div><div><b>([\d.]+)<\/b><span>Usadas<\/span><\/div><div><b>([\d.]+)<\/b><span>Sin usar<\/span>/);assert(m,'Missing counter widget on page');return m.slice(1).map(n=>+n.replaceAll('.',''));}
const store={};let app=boot(store);
assert.deepEqual(counts(app.html()),[1000,0,1000],'fresh install');
app.click({action:'quick'});
let first=app.state().draft.questions;
assert.equal(first.length,10);assert.equal(app.state().seenQuestions.length,10);
app.click({action:'finish'});assert.deepEqual(counts((app.click({nav:'inicio'}),app.html())),[1000,10,990]);
app.click({action:'quick'});let second=app.state().draft.questions;assert.equal(second.filter(x=>first.includes(x)).length,0);
assert.equal(app.state().seenQuestions.length,20);
app.click({action:'finish'});app.click({nav:'estadisticas'});assert.deepEqual(counts(app.html()),[1000,20,980]);
app=boot(store);assert.deepEqual(counts(app.html()),[1000,20,980],'reload persistence');
app.click({official:'2025'});assert.equal(app.state().seenQuestions.length,20,'official must not increase practice counter');
app.click({action:'finish'});assert.equal(app.state().seenQuestions.length,20);
app.click({nav:'ajustes'});assert(app.html().includes('Reiniciar vuelta de preguntas'));
app.click({action:'reset-question-cycle'});assert.deepEqual(counts(app.html()),[1000,0,1000]);assert.equal(app.state().attempts.length,3,'reset keeps historic scores');
app.click({action:'quick'});assert.equal(app.state().seenQuestions.length,10,'reset allows fresh count despite old attempt history');
// Migrate users of 3.3 from finished or suspended sessions
let older=app.state();delete older.seenQuestions;older.rotations={};store[key]=JSON.stringify(older);
app=boot(store);assert.deepEqual(counts(app.html()),[1000,30,970],'migrate old attempts and live draft without duplicates');
assert.equal(new Set(app.state().attempts.filter(a=>a.kind==='practice').flatMap(a=>a.questions).concat(app.state().draft.questions)).size,30);
console.log('PROGRESS OK: bank totals, unique assignment, completed test persistence, reload, official exclusion, safe reset and 3.3 migration.');
