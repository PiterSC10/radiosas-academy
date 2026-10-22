'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const env={window:{},document:{addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},console,Math,Date};
vm.createContext(env);
for(const file of ['data.js','bank-master.js','bank-5000.js','simulacros-historicos-v54.js'])
 vm.runInContext(fs.readFileSync(file,'utf8'),env,{filename:file,timeout:30000});
const sim=env.window.RADIOSAS_HIST_SIM;
assert.equal(sim.definitions.length,5);
assert.equal(env.window.RADIOSAS_DATA.practice.length,5000);
assert.deepEqual(Array.from(sim.definitions.map(d=>d.total)),[75,75,150,150,100]);
assert.ok(sim.catalog().includes('no copias literales'));
assert.ok(sim.catalog().includes('Exámenes por año'));
assert.equal(sim.vetted().length,1000,'usar solamente banco base');
assert.ok(sim.vetted().every(sim.validQuestion),'opciones, índice y explicación presentes');
const uniqueText=new Set(sim.vetted().map(q=>q.text.trim().toLowerCase()));
assert.equal(uniqueText.size,1000,'enunciados del banco base sin duplicado literal');

for(const d of sim.definitions){
 const ids=sim.pick(d.total,{});
 assert.equal(ids.length,d.total);
 assert.equal(new Set(ids).size,d.total);
 const byId=new Map(sim.vetted().map(q=>[q.id,q]));
 assert.equal(new Set(ids.map(id=>byId.get(id).concept||id)).size,d.total,'sin concepto repetido en un mismo examen');
}
console.log('OK: 5 formatos de simulacro, 5.000 preguntas, catalogo, sin duplicados dentro del examen');
