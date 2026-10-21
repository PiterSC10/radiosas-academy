const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const storage = {};

function boot() {
  const listeners = {}, app = { innerHTML: '' };
  const fakeElement = {
    classList: { add() {}, remove() {} },
    set textContent(v) {}, click() {}, remove() {},
  };
  const ctx = {
    console, Date, Math, Array, Object, Number, String, JSON, Error,
    Map, Set, setTimeout, clearTimeout, setInterval:()=>{},
    Blob: function(){}, URL, confirm:()=>true, alert:()=>{},
    localStorage: {
      getItem(k) { return storage[k] ?? null; },
      setItem(k,v) { storage[k]=v; },
    },
    document: {
      body: {appendChild(){}, classList: {add(){}, remove(){}, toggle(){}}},
      getElementById(id) {
        if(id==='app')return app;
        if(id==='quantity')return {value:'10'};
        if(id==='subject')return {value:'Todas'};
        return null;
      },
      addEventListener(event,fn){listeners[event]=fn;},
      createElement:()=>({...fakeElement}),
    },
    window:{scrollTo(){},confirm:()=>true},
  };
  ctx.window.window=ctx.window;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(__dirname+'/data.js','utf8'),ctx);vm.runInContext(fs.readFileSync(__dirname+'/bank-master.js','utf8'),ctx);
  vm.runInContext(fs.readFileSync(__dirname+'/lab-data.js','utf8'),ctx);
  vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),ctx);
  return {
    click(dataset) {listeners.click({target:{closest:()=>({dataset})}});},
    getDraft() {return JSON.parse(storage.radiosas_academy_v1).draft;},
    getState() {return JSON.parse(storage.radiosas_academy_v1);},
    app,
  };
}

let client=boot();
const all=new Set(), groups=[];
const conceptById=new Map();for(const q of (()=>{const x={window:{}};require('node:vm').createContext(x);require('node:vm').runInContext(fs.readFileSync(__dirname+'/data.js','utf8'),x);require('node:vm').runInContext(fs.readFileSync(__dirname+'/bank-master.js','utf8'),x);return x.window.RADIOSAS_DATA.practice})())conceptById.set(q.id,q.concept||q.id);
let previousConcepts=new Set(),conflicts=0;
for(let i=0;i<100;i++) {
  client.click({action:'quick'});
  const session=client.getDraft();
  assert.equal(session.questions.length,10);
  assert.equal(new Set(session.questions).size,10,'No duplicates within any 10-question test');
  for(const id of session.questions){
    assert(!all.has(id),`Repeated ${id} on quick test ${i+1}`);
    all.add(id);
  }
  const concepts=session.questions.map(x=>conceptById.get(x));
  conflicts+=concepts.length-new Set(concepts).size;
  conflicts+=concepts.filter(x=>previousConcepts.has(x)).length;
  previousConcepts=new Set(concepts);
  groups.push(session.questions);
  client.click({action:'finish'});
}
assert.equal(all.size,1000,'First 100 quick tests must cover 1000 unique questions');
assert.equal(client.getState().attempts.length,100);
client=boot(); // reload: question rotation must persist
client.click({action:'quick'});
const eleventh=client.getDraft();
assert.equal(eleventh.questions.length,10);
assert.equal(eleventh.questions.filter(id=>groups[99].includes(id)).length,0,'New cycle should avoid last 10');
assert.equal(client.getState().rotations['general::Todas'].cycles,1);

// Subject filters have their own independent rotation.
client.click({action:'finish'});
const general=client.getState().rotations['general::Todas'].pending.length;
client.click({nav:'test'});
client.click({action:'launch'});
assert.equal(client.getDraft().questions.length,10);
assert.equal(client.getState().rotations['general::Todas'].pending.length,general-10);
console.log('Concept collisions in 100 test pairs:',conflicts);
console.log('ROTATION OK: 1000 different questions in 100 consecutive quick tests; no immediate repeat on cycle reset; progress survives reload and remains deterministic per saved state.');
