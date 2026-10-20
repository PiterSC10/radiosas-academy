const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/data.js','utf8'),ctx);vm.runInContext(fs.readFileSync(__dirname+'/bank-master.js','utf8'),ctx);
const d=ctx.window.RADIOSAS_DATA;
assert.equal(d.exams.length,3);
assert.equal(d.exams[0].answers.length,75);
assert.equal(d.exams[1].answers.length,75);
assert.equal(d.exams[2].answers.length,0);
assert.equal(d.practice.length,1000);
const ids=new Set();for(const q of d.practice){assert(!ids.has(q.id));ids.add(q.id);assert(q.text.length>10);assert.equal(q.options.length,4);assert(q.answer>=0&&q.answer<=3);assert(q.explanation.length>15)}
for(const exam of d.exams.filter(x=>x.answers)){assert.match(exam.pdf,/^https:\/\/www\.sspa\.juntadeandalucia\.es\//);assert.match(exam.answers,/^[ABCD]+$/)}
for(const f of ['index.html','app.js','data.js','bank-master.js','styles.css','manifest.webmanifest','sw.js','favicon.svg'])assert(fs.existsSync(__dirname+'/'+f));
assert(fs.readFileSync(__dirname+'/index.html','utf8').includes('manifest.webmanifest'));
console.log('CONTENT OK: 3 fichas de examen, 150 claves oficiales, 1000 preguntas de práctica y estructura para GitHub Pages.');
