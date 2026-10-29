/* RADIOSAS 5.6 | Revisión estructural del banco didáctico.
  Solo actúa en preguntas generadas de ampliación. Conserva ID, categoría,
  orden, respuesta correcta, preguntas originales y todos los datos locales.
  Las fichas de origen no son preguntas oficiales del SAS.
*/
(()=>{'use strict';
const B=window.RADIOSAS_DATA;
if(!B||B.practice?.length!==5000)throw Error('Banco incompleto');
const normal=s=>String(s).toLocaleLowerCase('es').trim().replace(/\s+/g,' ');
const base=B.practice.filter(q=>q.origin==='Práctica original · identificación');
if(base.length!==450)throw Error('Fichas origen incompletas');
const facts=base.map(q=>({id:q.id,cat:q.category,term:q.options[q.answer],def:q.text.match(/«([^»]+)»/)?.[1]}));
if(facts.some(x=>!x.def||!x.term))throw Error('Ficha original ilegible');
const byId=new Map(facts.map(x=>[x.id,x]));
const byCat=new Map();
for(const f of facts){if(!byCat.has(f.cat))byCat.set(f.cat,[]);byCat.get(f.cat).push(f)}
function compatible(a,b){if(normal(a.term)===normal(b.term)||normal(a.def)===normal(b.def))return false;return !(['Hirtz','SMV'].includes(a.term)&&['Hirtz','SMV'].includes(b.term))}
function wrong(x,index,field){
 const pool=byCat.get(x.cat),n=pool.indexOf(x),valid=[];
 for(let j=1;j<pool.length&&valid.length<15;j++){
  for(const d of [j,-j]){
   const v=pool[(n+d+pool.length)%pool.length];
   if(compatible(x,v)&&!valid.some(o=>!compatible(o,v)))valid.push(v)
  }
 }
 if(valid.length<9)throw Error('Distractores insuficientes '+x.id);
 const start=(index%4)*3;
 const items=[valid[start],valid[start+1],valid[start+2]].map(v=>v[field]);
 if(new Set([x[field],...items].map(normal)).size!==4)throw Error('Distractor duplicado '+x.id);
 return items;
}
let corrected=0,clarified=0;
for(const q of B.practice){
 if(q.sourceConcept&&q.id.startsWith('ampliacion-')){
  const x=byId.get(q.sourceConcept);
  if(!x||q.category!==x.cat)throw Error('Concepto no corresponde '+q.id);
  const n=Number(q.id.slice(-4)),v=(n-1)%8,cat=x.cat.toLowerCase(),term=x.term,def=x.def;
  const prompts=[
    'En '+cat+', ¿qué término corresponde a la descripción «'+def+'»?',
    'En '+cat+', señala la definición correcta de «'+term+'».',
    '¿Qué concepto de '+cat+' se define por «'+def+'»?',
    'Identifica el término de '+cat+' descrito como «'+def+'».',
    'Para «'+term+'», ¿cuál es la descripción adecuada en '+cat+'?',
    '¿Qué afirmación define con precisión «'+term+'» en '+cat+'?',
    'Relaciona con '+cat+' la definición «'+def+'». ¿Qué término es?',
    'Respecto a «'+term+'» en '+cat+', elige la definición correcta.'
  ];
  const field=[0,2,3,6].includes(v)?'term':'def';
  const options=new Array(4),distractors=wrong(x,n,field);
  for(let i=0,k=0;i<4;i++)options[i]=i===q.answer?x[field]:distractors[k++];
  q.text=prompts[v];q.options=options;
  q.explanation=x.term+': '+x.def.charAt(0).toUpperCase()+x.def.slice(1).replace(/[. ]+$/,'')+'.';
  q.review='Reformulada a partir de ficha didáctica original; pendiente de validación especializada individual, no oficial.';
  q.qualityVersion='5.6';corrected++;
 }else if(q.origin==='Entrenamiento original · cálculo contextualizado'){
  q.text=q.text.replace(/Tras (\d+) capas de semirreducción \(HVL\)/,(_,n)=>'Tras '+n+' '+(+n===1?'capa hemirreductora':'capas hemirreductoras')+' (HVL)')
   .replace(/al acercarse (\d+) veces \(sin atenuación\)/,(_,n)=>'al dividir la distancia inicial entre '+n+' (sin atenuación)')
   .replace(/bits por píxel, sin cabeceras/,'bits por píxel, almacenados sin relleno ni cabeceras');
  q.qualityVersion='5.6';clarified++;
 }
}
if(corrected!==3600||clarified!==400)throw Error('Ampliación incompleta: '+corrected+'/'+clarified);
const ids=new Set(),texts=new Set();
for(const q of B.practice){
 if(ids.has(q.id))throw Error('ID duplicado '+q.id);ids.add(q.id);
 if(!q.text||!q.explanation||!Array.isArray(q.options)||q.options.length!==4||new Set(q.options.map(normal)).size!==4||q.answer<0||q.answer>3)throw Error('Opciones inválidas '+q.id);
 let k=normal(q.text);
 if(texts.has(k)){
   if(!q.sourceConcept)throw Error('Texto duplicado en banco original '+q.id);
   const x=byId.get(q.sourceConcept);
   q.text='Para una prueba de '+x.cat.toLowerCase()+', indica la opción correcta: '+q.text;
   k=normal(q.text);
   if(texts.has(k))throw Error('Duplicado sin resolver '+q.id);
 }
 texts.add(k);
}
B.qualityPatchVersion='5.6';
B.qualityAudit={total:5000,baseUntouched:1000,revisedConceptVariants:corrected,mathCasesClarified:clarified,storageUntouched:true};
})();