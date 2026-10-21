'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname,KEY='radiosas_academy_v1';
function boot(storage){
 const app={innerHTML:''},listeners={};
 const ctx={console,Date,Math,Array,Object,Number,String,JSON,Error,Map,Set,setTimeout:()=>0,clearTimeout:()=>{},setInterval:()=>{},Blob:function(){},URL,alert:()=>{},confirm:()=>true,
 localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},
 document:{body:{appendChild(){},classList:{add(){},remove(){},toggle(){}}},getElementById:id=>id==='app'?app:null,addEventListener:(ev,fn)=>listeners[ev]=fn,createElement:()=>({classList:{add(){},remove(){}},click(){}})},
 window:{scrollTo(){}}};
 vm.createContext(ctx);
 for(let file of ['data.js','bank-master.js','bank-5000.js','lab-data.js','app.js']) vm.runInContext(fs.readFileSync(root+'/'+file,'utf8'),ctx,{filename:file});
 return {html:()=>app.innerHTML,state:()=>JSON.parse(storage[KEY]),click:ds=>listeners.click({target:{closest:()=>({dataset:ds})}}),touch:(x,y)=>listeners.click({clientX:x,clientY:y,target:{closest:selector=>selector==='[data-lab-canvas]'?{getBoundingClientRect:()=>({left:0,top:0,width:700,height:850})}:null}}),spots:ctx.window.RADIOSAS_LAB.spots};
}
const storage={};let a=boot(storage);
assert.equal(a.state().bankKnownIds.length,5000,'preserve bank');
assert.equal(a.spots.length,18,'18 anatomy zones');
assert.equal(new Set(a.spots.map(s=>s.id)).size,18,'unique spot identifiers');
assert(a.spots.every(s=>s.r>=30&&s.x>=50&&s.y>=80),'reasonable touch zones');
assert(fs.readFileSync(root+'/index.html','utf8').includes('<script src="lab-data.js"></script>'));
assert(fs.readFileSync(root+'/.github/workflows/deploy.yml','utf8').includes('rx-torax-esquema.svg'));
assert(fs.readFileSync(root+'/sw.js','utf8').includes('lab-data.js'));
a.click({nav:'laboratorio'});assert(a.html().includes('Laboratorio de Radiología'));
assert(a.html().includes('rx-torax-esquema.svg'));
a.click({labChoice:'traquea'});
assert.equal(a.state().labSeen.length,1,'study seen stored');
a.click({action:'lab-next'});
a.click({action:'lab-start-exam'});
let original=a.state(),oldQ=original.bankKnownIds.length;
assert.equal(original.labDraft.order.length,18,'exam has 18 exercises');
const order=original.labDraft.order;
for(let i=0;i<order.length;i++){
 const before=a.state();
 assert.equal(before.labDraft.order[before.labDraft.index],order[i]);
 a.click({labChoice:order[i]});
 a.click({action:'lab-next'});
}
const state=a.state();
assert.equal(state.labAttempts.length,1);
assert.equal(state.labAttempts[0].correct,18);
assert.equal(state.labAttempts[0].blank,0);
assert.equal(state.labDraft,null);
assert.equal(state.attempts.length,0,'practice attempts unchanged');
assert.equal(state.bankKnownIds.length,oldQ,'original 5k bank preserved');
a.click({nav:'estadisticas'});assert(a.html().includes('Laboratorio de Radiología'));
assert(a.html().includes('100%'));
a=boot(storage);a.click({nav:'laboratorio'});
assert(a.html().includes('Exámenes visuales'));
assert.equal(a.state().labAttempts[0].correct,18,'exam result persists across reload');
a.click({action:'quick'});
assert.equal(a.state().draft.questions.length,10,'core practice flow intact');
console.log('LAB OK: 18 zonas, modo estudio, examen completo, evaluación, persistencia, estadísticas separadas, 5.000 preguntas intactas, assets raíz y despliegue.');

// Exercise the coordinate conversion and all 18 anatomical hit targets.
const coordsStorage={};let coords=boot(coordsStorage);coords.click({nav:'laboratorio'});
coords.click({action:'lab-power'});coords.touch(351,196);
assert.equal(coords.state().labSeen.length,0,'powered-off monitor ignores touches');
coords.click({action:'lab-power'});
for(const spot of coords.spots){coords.touch(spot.x,spot.y);coords.click({action:'lab-next'});}
assert.equal(coords.state().labSeen.length,18,'all 18 coordinate centres work');
coords.click({action:'lab-start-exam'});let sequence=coords.state().labDraft.order;
for(let i=0;i<sequence.length;i++){
 const id=sequence[i],spot=coords.spots.find(s=>s.id===id);
 if(i===0)coords.touch(1,1);else coords.touch(spot.x,spot.y);
 if(i===5){coords=boot(coordsStorage);coords.click({nav:'laboratorio'});assert.equal(coords.state().labDraft.index,5,'exam resumes after reload');}
 coords.click({action:'lab-next'});
}
const mixed=coords.state().labAttempts[0];assert.equal(mixed.correct,17);assert.equal(mixed.wrong,1);assert.equal(mixed.blank,0);
coords=boot(coordsStorage);coords.click({nav:'laboratorio'});coords.click({action:'lab-review-'+mixed.id});
assert(coords.html().includes('17 de 18 aciertos'),'historical result opens after reload');
assert(coords.html().includes('La tráquea')||coords.html().includes('Las')||coords.html().includes('El '),'review explains errors');
assert.deepEqual(coords.state().attempts,[]);assert.equal(coords.state().bankKnownIds.length,5000);
console.log('LAB COORDINATES OK: power protection, all 18 hit targets, incorrect point, 17/18 score, draft recovery and historical review.');
