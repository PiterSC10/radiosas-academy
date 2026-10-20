const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname+'/data.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/bank-master.js','utf8'),context);
const bank=context.window.RADIOSAS_DATA.practice;
assert.equal(bank.length,1000);
const ids=new Set(),prompts=new Set(),answers=[0,0,0,0],byTheme={};
for(const q of bank){
 assert(q.id&&!ids.has(q.id));ids.add(q.id);
 const prompt=q.text.trim().toLocaleLowerCase('es');
 assert(!prompts.has(prompt),'repeated question text: '+q.id);prompts.add(prompt);
 assert(Array.isArray(q.options)&&q.options.length===4);
 assert.equal(new Set(q.options).size,4,'repeated option: '+q.id);
 assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
 assert(typeof q.explanation==='string'&&q.explanation.length>12);
 assert(typeof q.category==='string');byTheme[q.category]=(byTheme[q.category]||0)+1;
 answers[q.answer]++;
}
assert.equal(Object.keys(byTheme).length,10);
for(const count of Object.values(byTheme))assert(count>=85,'one topic lacks diversity');
const roots=['paula-logo.png','paula-social-card.png','vista-previa-paula-edition.png'];
roots.forEach(f=>assert(fs.existsSync(__dirname+'/'+f),'missing root image '+f));
const html=fs.readFileSync(__dirname+'/index.html','utf8');
assert(html.indexOf('data.js')<html.indexOf('bank-master.js')&&html.indexOf('bank-master.js')<html.indexOf('app.js'));
assert(!html.includes('assets/'));
console.log('BANK QA OK:',bank.length,'unique stems, 4 distinct options each, 10 topics, root images, script order');
console.log('By topic:',byTheme);console.log('Correct-letter balance:',answers);
