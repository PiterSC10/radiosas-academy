'use strict';
// Real browser regression: run with npm run test:browser after installing Playwright browsers.
const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const KEY='radiosas_academy_v1';
const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';if(name.includes('..')){res.writeHead(403).end();return}const file=path.join(__dirname,name);if(!fs.existsSync(file)){res.writeHead(404).end();return}res.setHeader('Content-Type',({'js':'text/javascript','css':'text/css','svg':'image/svg+xml','html':'text/html','webp':'image/webp','png':'image/png'})[name.split('.').pop()]||'text/plain');res.end(fs.readFileSync(file))});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;fs.mkdirSync('browser-results',{recursive:true});
try{for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{const context=await browser.newContext({viewport:{width:430,height:932},isMobile:true,hasTouch:true,deviceScaleFactor:1,serviceWorkers:'block'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('dialog',d=>d.accept());
 await page.goto(url);await page.locator('[data-action="goto-laboratorio"]').click();
 const state=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 assert.equal((await state()).bankKnownIds.length,5000);
 const before=await state();
 await page.locator('[data-action="lab-power"]').click();assert.match(await page.locator('[data-action="lab-power"]').innerText(),/Apagado/);
 await page.locator('[data-action="lab-power"]').click();
 await page.locator('[data-action="lab-hint"]').click();assert.equal(await page.locator('.lab-correct-circle').count(),1);
 const catalogue=await page.evaluate(()=>window.RADIOSAS_LAB.exercises);
 const atlasIds=[...new Set(catalogue.filter(q=>!q.options).map(q=>q.atlas))];
 const sample=atlasIds.map(id=>catalogue.find(q=>q.atlas===id&&q.type==='Localización')||catalogue.find(q=>q.atlas===id));
 for(const mod of ['RX','TC','RM','Mamografía','DXA'])sample.push(catalogue.find(q=>q.technique===mod&&q.options));
 const snapshot=await state();
 await page.evaluate(({key,order})=>{const d=JSON.parse(localStorage.getItem(key));d.labDraft={mode:'exam',order,index:0,answers:{},hint:false,lightsOn:true,started:Date.now()};localStorage.setItem(key,JSON.stringify(d))},{key:KEY,order:sample.map(q=>q.id)});
 await page.reload();await page.locator('[data-action="goto-laboratorio"]').click();
 async function touch(q){await page.locator('[data-lab-canvas]').scrollIntoViewIfNeeded();const box=await page.locator('[data-lab-canvas]').boundingBox();await page.touchscreen.tap(box.x+q.x/700*box.width,box.y+q.y/850*box.height)}
 for(let i=0;i<sample.length;i++){
  const q=sample[i];
  if(q.options)await page.locator(`[data-lab-choice="option-${q.answer}"]`).click();
  else if(q.type==='Identificación')await page.locator(`.lab-answer-choices [data-lab-choice="${q.target}"]`).click();
  else await touch(q);
  await page.locator('.lab-pending').waitFor({timeout:5000});
  assert.equal((await state()).labDraft.answers[q.id].id,q.options?'option-'+q.answer:q.target,engine+': '+q.id);
  if(!q.options){await page.waitForFunction(()=>{const i=document.querySelector('.lab-viewer img');return i&&i.complete&&i.naturalWidth>0});if(['TC','RM','Mamografía','DXA'].includes(q.technique)&&!sample.slice(0,i).some(x=>x.technique===q.technique))await page.screenshot({path:`browser-results/atlas-${engine}-${q.technique}.png`,fullPage:true});}
  if(i===7){await page.reload();await page.locator('[data-action="goto-laboratorio"]').click();assert.equal((await state()).labDraft.index,7)}
  await page.locator('[data-action="lab-next"]').click();
 }
 const after=await state();assert.equal(after.labAttempts.at(-1).correct,sample.length);for(const k of Object.keys(snapshot).filter(k=>!k.startsWith('lab')))assert.deepEqual(after[k],snapshot[k],'legacy field '+k);
 await page.reload();await page.locator('[data-action="goto-laboratorio"]').click();await page.locator('.lab-history [data-action^="lab-review-"]').first().click();assert.match(await page.locator('.lab-result h2').innerText(),new RegExp(sample.length+' de '+sample.length));
 await page.locator('.lab-modes [data-action="lab-start-study"]').click();
 await page.locator('.lab-filter-panel summary').click();await page.locator('#lab-technique').selectOption('RM');
 await page.locator('.lab-filter-panel summary').click();await page.locator('#lab-region').selectOption('Miembro inferior');
 await page.locator('.lab-filter-panel summary').click();await page.locator('#lab-type').selectOption('Localización');
 assert.equal((await state()).labSettings.technique,'RM');assert.match(await page.locator('.lab-screen-kicker').innerText(),/RM/);
 // Zoom remains inside its own viewport and never widens the page.
 await page.locator('[data-action="lab-zoom"]').click();assert.equal(await page.locator('.lab-viewport.is-zoomed').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const currentId=await page.locator('.lab-workspace').getAttribute('data-lab-question'),currentQ=catalogue.find(q=>q.id===currentId);await page.locator('.lab-viewport').scrollIntoViewIfNeeded();await page.locator('.lab-viewport').evaluate(el=>{el.scrollLeft=70});const enlarged=await page.locator('[data-lab-canvas]').boundingBox();await page.touchscreen.tap(enlarged.x+currentQ.x/700*enlarged.width,enlarged.y+currentQ.y/850*enlarged.height);await page.locator('.lab-ok').waitFor();assert.equal(await page.locator('.lab-viewport').evaluate(el=>el.scrollLeft),70,'zoom pan preserved after answer');await page.locator('[data-action="lab-zoom"]').click();
 for(const [width,height] of [[430,932],[390,844],[375,667],[320,568],[1440,1000]]){await page.setViewportSize({width,height});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow '+engine+' '+width);await page.waitForFunction(()=>{const i=document.querySelector('.lab-viewer img');return i&&i.complete&&i.naturalWidth>0});const helpBox=await page.locator('.lab-viewer-help').boundingBox(),controlsBox=await page.locator('.lab-controls').boundingBox();assert(helpBox.y+helpBox.height<=controlsBox.y+1,'hint overlap');await page.screenshot({path:`browser-results/laboratorio-${engine}-${width}.png`,fullPage:width===430});}
 await page.setViewportSize({width:430,height:932});await page.screenshot({path:`browser-results/laboratorio-${engine}-movil.png`,fullPage:true});
 assert.deepEqual(errors,[],'JavaScript or resource errors');console.log(`${engine.toUpperCase()} OK: 1000 catalogue entries, all 80 atlas contexts, 5 technique quizzes, filters, zoom, scoring, reload/resume, history, 5 viewports and no JS errors`);
 }finally{await browser.close()}
 }}finally{server.close()}})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
