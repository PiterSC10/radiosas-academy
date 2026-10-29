'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const seed={attempts:[{id:'legacy-001',correct:12}],favorites:['p1'],seenQuestions:['p1'],bankKnownIds:['p1']};
const store={radiosas_academy_v1:JSON.stringify(seed)},writes=[];
const ctx={window:{},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{writes.push(k);store[k]=v}},console};
vm.createContext(ctx);
for(const name of ['data.js','bank-master.js','bank-5000.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+name,'utf8'),ctx,{filename:name,timeout:30000});
const raw=ctx.window.RADIOSAS_DATA.practice;
const original=raw.map(q=>({id:q.id,answer:q.answer,text:q.text,options:[...q.options],explanation:q.explanation}));
vm.runInContext(fs.readFileSync(__dirname+'/bank-quality.js','utf8'),ctx,{filename:'bank-quality.js',timeout:30000});
const all=ctx.window.RADIOSAS_DATA.practice,qa=ctx.window.RADIOSAS_DATA.qualityAudit;
assert.equal(all.length,5000);assert.equal(qa.revisedConceptVariants,3600);assert.equal(qa.mathCasesClarified,400);
assert.equal(writes.length,0,'no write to any storage');
assert.deepEqual(JSON.parse(store.radiosas_academy_v1),seed,'history and favorites unchanged');
const normalize=x=>String(x).trim().toLocaleLowerCase('es').replace(/\s+/g,' ');
const texts=new Set();
for(let i=0;i<5000;i++){
 const q=all[i],prev=original[i];
 assert.equal(q.id,prev.id,'ID stable '+i);assert.equal(q.answer,prev.answer,'answer stable '+q.id);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(normalize)).size,4,'unique alternatives '+q.id);
 assert(!texts.has(normalize(q.text)),'unique question '+q.id);texts.add(normalize(q.text));
 assert(q.explanation.length>10,'explanation '+q.id);
 if(i<1000)assert.deepEqual({text:q.text,options:[...q.options],explanation:q.explanation},{text:prev.text,options:prev.options,explanation:prev.explanation},'base unaffected '+q.id);
}
const info=new Map(all.filter(q=>q.origin==='Práctica original · identificación').map(q=>[q.id,{category:q.category,term:q.options[q.answer],definition:q.text.match(/«([^»]+)»/)[1]}]));
for(const q of all.slice(1000,4600)){
 const o=info.get(q.sourceConcept);
 assert(o&&o.category===q.category,'source reference '+q.id);
 assert(q.options[q.answer]===o.term||q.options[q.answer]===o.definition,'source-backed correct option '+q.id);
 assert(q.explanation.includes(o.term),'explanation tied to source '+q.id);
}
const math=all.slice(4600);
const number=s=>Number(String(s).replace(/\./g,'').replace(',','.'));
const val=(s,r)=>{const m=s.match(r);if(!m)throw Error('Cannot parse '+s);return m.slice(1).map(number)};
for(const q of math){
 let v,x,concept=q.concept.replace(/-\d+$/,'');
 switch(concept){
 case'calc-inv':x=val(q.text,/registra ([\d,.]+) unidades.*se multiplica por ([\d,.]+)/);v=x[0]/(x[1]**2);break;
 case'calc-hvl':x=val(q.text,/intensidad inicial ([\d,.]+) u.*Tras ([\d,.]+) capas?/);v=x[0]/(2**x[1]);break;
 case'calc-mas':x=val(q.text,/con ([\d,.]+) mA.*de ([\d,.]+) ms/);v=x[0]*x[1]/1000;break;
 case'calc-time':x=val(q.text,/requiere ([\d,.]+) mAs.*de ([\d,.]+) mA/);v=1000*x[0]/x[1];break;
 case'calc-near':x=val(q.text,/tasa de ([\d,.]+) u.*distancia inicial entre ([\d,.]+)/);v=x[0]*x[1]**2;break;
 case'calc-dlp':x=val(q.text,/CTDIvol = ([\d,.]+) mGy.*barrido = ([\d,.]+) cm/);v=x[0]*x[1];break;
 case'calc-pitch':x=val(q.text,/colimación es ([\d,.]+) mm.*avance de mesa.*es ([\d,.]+) mm/);v=x[1]/x[0];break;
 case'calc-coverage':x=val(q.text,/generan ([\d,.]+) cortes.*de ([\d,.]+) mm/);v=x[0]*x[1];break;
 case'calc-pixel':x=val(q.text,/de ([\d,.]+) mm y ([\d,.]+) píxeles/);v=x[0]/x[1];break;
 case'calc-size':x=val(q.text,/de ([\d,.]+)×([\d,.]+) píxeles usa ([\d,.]+) bits/);v=x[0]*x[1]*x[2]/8/(1024**2);break;
 case'calc-magnification':x=val(q.text,/foco-detector es ([\d,.]+) cm.*foco-objeto ([\d,.]+) cm/);v=x[0]/x[1];break;
 case'calc-projected':x=val(q.text,/mide ([\d,.]+) mm.*es ([\d,.]+)/);v=x[0]*x[1];break;
 case'calc-larmor':x=val(q.text,/a ([\d,.]+) T/);v=42.58*x[0];break;
 case'calc-tr':x=val(q.text,/TR = ([\d,.]+) ms.*en ([\d,.]+) minutos/);v=x[1]*60000/x[0];break;
 case'calc-dxa':x=val(q.text,/medida de ([\d,.]+) g\/cm².*media joven ([\d,.]+) y DE ([\d,.]+)/);v=(x[0]-x[1])/x[2];break;
 case'calc-inject':x=val(q.text,/administra ([\d,.]+) mL.*de ([\d,.]+) mL\/s/);v=x[0]/x[1];break;
 default:throw Error('Unrecognized calculation '+q.id);
 }
 const options=q.options.map(s=>number((s.match(/^-?[\d,.]+/)||[])[0]));
 const tolerance=Math.max(.001,Math.abs(v)*.0001);
 assert(Math.abs(options[q.answer]-v)<tolerance,'wrong calculation '+q.id);
 assert.equal(options.filter(x=>Math.abs(x-v)<tolerance).length,1,'ambiguous calculation '+q.id);
}
console.log('AUDITORÍA BANCO OK: 5.000 IDs estables, 1.000 bases intactas, 3.600 enunciados revisados, 400 cálculos recalculados, progreso local protegido');
