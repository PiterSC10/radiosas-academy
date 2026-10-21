const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const s=fs.readFileSync(path.join(__dirname,'clinica-real-banco.js'),'utf8'),sandbox={window:{}};
vm.runInNewContext(s,sandbox);
const db=sandbox.window.RADIOSAS_CLINICA,q=db.questions,imgs=db.images;
assert.equal(q.length,500);assert.equal(imgs.length,31);assert.equal(new Set(q.map(x=>x.id)).size,500);assert.equal(new Set(q.map(x=>x.text)).size,500);assert.equal(new Set(q.map(x=>x.concept)).size,100);
const counts=Object.fromEntries(['RX','TC','RM','MAMO','DXA'].map(m=>[m,q.filter(x=>x.mod===m).length]));
assert.deepEqual(counts,{RX:200,TC:125,RM:100,MAMO:50,DXA:25});
const imgIds=new Set(imgs.map(x=>x.id));
for(const x of q){assert.equal(x.options.length,4);assert.equal(new Set(x.options).size,4);assert(Number.isInteger(x.answer)&&x.answer>=0&&x.answer<4);assert(imgIds.has(x.image));assert(x.explain?.length>12)}
for(const x of imgs){assert(/^https:\/\/commons.wikimedia.org\/wiki\/File:/.test(x.page));assert(/^https:\/\/upload.wikimedia.org\/wikipedia\/commons\//.test(x.url));assert(x.author && x.license);const h=crypto.createHash('md5').update(x.filename.replace(/ /g,'_')).digest('hex');assert(x.url.includes('/'+h[0]+'/'+h.slice(0,2)+'/'));}
console.log('RADIOSAS 5.2: OK 500 retos, 31 imágenes, 100 conceptos, 5 modalidades');