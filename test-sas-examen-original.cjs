'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={console,window:{},document:{addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},clearInterval(){}};
vm.createContext(ctx);
for(const f of ['data.js','sas-examen-original.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
const m=ctx.window.RADIOSAS_ORIGINAL;
assert.equal(m.exams.length,5,'5 convocatorias distintas');
assert.deepEqual([...m.exams.map(e=>e.n)],[75,75,150,150,150]);
assert.equal(m.key('2025')&&Object.keys(m.key('2025')).length,75);
assert.equal(m.key('2024')&&Object.keys(m.key('2024')).length,75);
assert.equal(Object.keys(m.key('2022-l')).length,150);
assert.equal(Object.keys(m.key('2022-a')).length,150);
assert.equal(m.key('2022-l')[122],null,'pregunta 122 anulada');
assert.equal(m.key('2018'),null,'sin inventar plantilla no verificada');
const view=m.list();
assert.equal((view.match(/data-original="start:/g)||[]).length,5,'5 botones de acceso directo');
assert.ok(view.includes('cuatro respuestas'));
assert.ok(!view.includes('iframe'),'sin visor PDF incrustado');
const example=['1 Una pregunta clínica sobre radiografía de tórax de prueba para validación','A) Primera respuesta','B) Segunda respuesta','C) Tercera respuesta','D) Cuarta respuesta','2 Una segunda pregunta clínica sobre resonancia magnética de prueba','A) Respuesta A','B) Respuesta B','C) Respuesta C','D) Respuesta D'].join('\n');
const parsed=m.parseText(example,'2025');assert.equal(parsed.questions.length,2);assert.equal(parsed.questions[0].options[3],'Cuarta respuesta');assert.equal(parsed.questions[1].number,2);assert.equal(parsed.complete,false,'dos preguntas no se presentan como examen de 75');

const app={innerHTML:''},callbacks={},storage={};
const sample=Array.from({length:75},(_,i)=>({number:i+1,text:'Pregunta clínica de prueba '+(i+1)+' sobre técnica de imagen médica.',options:['Opción alfa '+i,'Opción beta '+i,'Opción gamma '+i,'Opción delta '+i]}));
storage.radiosas_sas_cuestionarios_personales_v57=JSON.stringify({'2025':{complete:true,questions:sample,found:75,expected:75}});
const newCtx={console,setInterval:()=>0,clearInterval(){},confirm:()=>true,window:{scrollTo(){}},
  document:{querySelector:s=>s==='main.page'?app:null,getElementById:()=>({textContent:''}),addEventListener:(e,fn)=>callbacks[e]=fn},
  localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v}};
vm.createContext(newCtx);
for(const file of ['data.js','sas-examen-original.js'])vm.runInContext(fs.readFileSync(file,'utf8'),newCtx,{filename:file});
function click(original){const event={target:{closest:()=>({dataset:{original}})},preventDefault(){},stopImmediatePropagation(){}};callbacks.click(event)}
click('start:2025');assert.ok(app.innerHTML.includes('Pregunta clínica de prueba 1'),'se ve el enunciado');
assert.ok(app.innerHTML.includes('Opción alfa 0'),'se ven las respuestas, no solo letras');
assert.ok(!app.innerHTML.includes('<iframe'),'sin visor PDF');
click('pick:A');assert.ok(app.innerHTML.includes('Pregunta clínica de prueba 2'));
click('reset:2025');assert.ok(app.innerHTML.includes('Pregunta clínica de prueba 1'),'reinicio a pregunta 1');
assert.equal(Object.keys(JSON.parse(storage.radiosas_practica_examen_real_v1).draft.responses).length,0,'reinicio borra respuestas sin tocar notas');

console.log('RADIOSAS SAS NATIVO OK: 5 convocatorias, claves guardadas, extracción de preguntas, sin iframe y control de integridad');
