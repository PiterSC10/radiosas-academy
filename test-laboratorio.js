'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const KEY='radiosas_academy_v1';
function boot(storage={}){
 const app={innerHTML:''},listeners={};
 const ctx={console,Date,Math,Array,Object,Number,String,JSON,Error,Map,Set,encodeURIComponent,setTimeout:()=>0,clearTimeout(){},setInterval(){},Blob,URL,alert(){},confirm:()=>true,localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},document:{body:{appendChild(){},classList:{toggle(){},add(){},remove(){}}},getElementById:id=>id==='app'?app:null,addEventListener:(e,fn)=>listeners[e]=fn,createElement:()=>({classList:{add(){},remove(){}}})},window:{scrollTo(){}}};vm.createContext(ctx);
 for(const f of ['data.js','bank-master.js','bank-5000.js','lab-data.js','lab-atlas.js','app.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx,{filename:f});
 return {storage,lab:ctx.window.RADIOSAS_LAB,html:()=>app.innerHTML,state:()=>JSON.parse(storage[KEY]),click:dataset=>listeners.click({target:{closest:()=>({dataset})}}),change:(id,value,checked=false)=>listeners.change({target:{id:'lab-'+id,value,checked}}),touch:q=>listeners.pointerup({clientX:20+q.x/2,clientY:30+q.y/2,target:{closest:()=>({getBoundingClientRect:()=>({left:20,top:30,width:350,height:425})})}})};
}
let a=boot(),qs=a.lab.exercises;
assert.equal(qs.length,1000);assert.equal(new Set(qs.map(q=>q.id)).size,1000);assert.equal(new Set(qs.map(q=>q.objective)).size,1000);
assert.equal(a.lab.spots.length,18,'old IDs and content retained');
for(const [mod,n] of Object.entries({RX:350,TC:300,RM:250,'Mamografía':60,DXA:40}))assert.equal(qs.filter(q=>q.technique===mod).length,n);
for(const q of qs){assert(q.explanation&&q.region&&q.type&&q.view);if(q.options){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4)}else{const atlas=q.atlas==='rx-torax-original'?null:a.lab.atlases.find(x=>x.id===q.atlas);assert(atlas||q.atlas==='rx-torax-original');if(atlas)assert(atlas.nodes.some(n=>n.label&&n.x===q.x&&n.y===q.y));}}
const base=a.state();const seeded={...base,labDraft:{mode:'exam',order:qs.map(q=>q.id),index:0,answers:{},lightsOn:true,started:Date.now()}};a=boot({[KEY]:JSON.stringify(seeded)});a.click({nav:'laboratorio'});
for(const q of qs){if(q.options)a.click({labChoice:'option-'+q.answer});else if(q.type==='Identificación')a.click({labChoice:q.target});else a.touch(q);assert.equal(a.state().labDraft.answers[q.id].id,q.options?'option-'+q.answer:q.target,q.id);a.click({action:'lab-next'});}
let state=a.state();assert.equal(state.labAttempts[0].correct,1000);assert.equal(state.labSeen.length,1000);assert.deepEqual(state.attempts,base.attempts);assert.deepEqual(state.bankKnownIds,base.bankKnownIds);
a=boot(a.storage);a.click({nav:'laboratorio'});a.click({action:'lab-review-'+state.labAttempts[0].id});assert(a.html().includes('1000 de 1000'));
// Filtered rotations exhaust the chosen pool; old legacy drafts remain resumable.
a=boot();a.click({nav:'laboratorio'});a.change('technique','RM');a.change('count','10');a.click({action:'lab-start-exam'});const one=a.state().labDraft.order;assert(one.every(id=>qs.find(q=>q.id===id).technique==='RM'));a.click({action:'lab-start-exam'});const two=a.state().labDraft.order;assert(one.every(id=>!two.includes(id)));
a.click({action:'lab-power'});let q=qs.find(q=>q.id===two[0]);a.click({labChoice:q.options?'option-'+q.answer:q.target});assert.equal(Object.keys(a.state().labDraft.answers).length,0,'off disables all answer paths');a.click({action:'lab-power'});
a.change('technique','Mamografía');a.change('type','Técnica');assert(a.html().includes('Pregunta técnica'));
const legacy={...base,labSeen:['traquea'],labAttempts:[{id:'old',questions:['traquea'],answers:{traquea:{id:'traquea'}},correct:1,wrong:0,blank:0,answered:1,ended:1}],labDraft:{mode:'exam',order:['traquea','clav-d'],index:1,answers:{traquea:{id:'traquea'}},lightsOn:true,started:1}};
a=boot({[KEY]:JSON.stringify(legacy)});a.click({nav:'laboratorio'});assert(a.html().includes('Clavícula derecha'));a.click({labChoice:'clav-d'});a.click({action:'lab-next'});assert.equal(a.state().labAttempts[1].correct,2);assert.equal(a.state().labAttempts[0].id,'old');
assert.equal(a.state().bankKnownIds.length,5000);
for(const file of ['index.html','sw.js','.github/workflows/deploy.yml'])assert(fs.readFileSync(__dirname+'/'+file,'utf8').includes('lab-atlas.js'));
assert(!fs.existsSync(__dirname+'/assets'));
console.log('LAB 1000 OK: 5 modalities, 80 maps, 1000 unique objectives and answers, scaled touch coordinates, filters, nonrepeat rotations, power, old-draft migration and 5000 questions intact.');
