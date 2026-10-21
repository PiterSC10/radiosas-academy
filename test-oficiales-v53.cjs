const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('examenes-oficiales-v53.js','utf8');
const context={console,window:{},indexedDB:{open:()=>({})},localStorage:{getItem:()=>null},document:{addEventListener(){}}};
vm.runInNewContext(source,context);
const officialModule=context.window.RADIOSAS_OFICIALES;
assert.equal(officialModule.defs.length,5);
const t=[
{s:'1 ¿Cuál de las siguientes comprobaciones es adecuada en un equipo de prueba?',page:2},
{s:'A) Control rutinario',page:2},{s:'B) Ninguna comprobación',page:2},
{s:'C) Evitar los controles',page:2},{s:'D) No usar el equipo',page:2},
{s:'2 ¿Qué procedimiento emplea radiación ionizante para formar la imagen?',page:2},
{s:'A) Ecografía',page:2},{s:'B) Electrocardiografía',page:2},
{s:'C) Radiografía',page:2},{s:'D) Resonancia magnética',page:2}];
const parsed=officialModule.parseQ(t);
assert.equal(parsed.length,2);
assert.equal(parsed[1].options[2],'Radiografía');
const answers=officialModule.parseK([{s:'1 A 51 C',page:1},{s:'2 C 52 B',page:1}]);
assert.equal(answers.get(51),'C');assert.equal(answers.get(2),'C');
console.log('OK: 5 convocatorias, conversión de preguntas y plantillas de respuesta');