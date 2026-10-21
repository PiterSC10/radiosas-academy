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
 await page.locator('.lab-power').click();assert.match(await page.locator('.lab-power').innerText(),/Apagado/);
 await page.locator('.lab-power').click();
 await page.locator('[data-action="lab-hint"]').click();assert.equal(await page.locator('.lab-correct-circle').count(),1);
 const spots=await page.evaluate(()=>window.RADIOSAS_LAB.spots);
 async function touch(spot){await page.locator('[data-lab-canvas]').scrollIntoViewIfNeeded();const box=await page.locator('[data-lab-canvas]').boundingBox();await page.touchscreen.tap(box.x+spot.x/700*box.width,box.y+spot.y/850*box.height)}
 // Verify all touch centres, not just the accessible name-based alternative.
 await page.screenshot({path:`browser-results/initial-${engine}.png`,fullPage:true});
 for(const spot of spots){await touch(spot);await page.screenshot({path:`browser-results/last-touch-${engine}.png`,fullPage:true});await page.locator('.lab-ok').waitFor({timeout:5000});assert.equal(await page.locator('.lab-ok').count(),1,engine+': '+spot.id);await page.locator('[data-action="lab-next"]').click()}
 await page.locator('[data-action="lab-start-exam"]').click();let order=(await state()).labDraft.order;
 for(let i=0;i<18;i++){const spot=spots.find(s=>s.id===order[i]);await touch(i===0?spots.find(s=>s.id!==spot.id):spot);assert.equal(await page.locator('.lab-correct-circle').count(),0,'no exam solution leak');if(i===7){await page.reload();await page.locator('[data-action="goto-laboratorio"]').click();assert.equal((await state()).labDraft.index,7)}await page.locator('[data-action="lab-next"]').click()}
 let result=(await state()).labAttempts[0];assert.equal(result.correct,17);assert.equal(result.wrong,1);assert.equal(result.blank,0);
 const after=await state();for(const k of Object.keys(before).filter(k=>!k.startsWith('lab')))assert.deepEqual(after[k],before[k],'legacy field '+k);
 await page.reload();await page.locator('[data-action="goto-laboratorio"]').click();await page.locator('.lab-history [data-action^="lab-review-"]').click();assert.match(await page.locator('.lab-result h2').innerText(),/17 de 18/);assert.match(await page.locator('.lab-results-review').innerText(),/Marcaste/);
 await page.locator('.lab-modes [data-action="lab-start-study"]').click();
 for(const [width,height] of [[430,932],[390,844],[375,667],[320,568],[1440,1000]]){await page.setViewportSize({width,height});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow '+engine+' '+width);assert(await page.locator('.lab-viewer img').evaluate(i=>i.complete&&i.naturalWidth>0),'image loaded');await page.screenshot({path:`browser-results/laboratorio-${engine}-${width}.png`,fullPage:width===430});}
 await page.setViewportSize({width:430,height:932});await page.screenshot({path:`browser-results/laboratorio-${engine}-movil.png`});
 assert.deepEqual(errors,[],'JavaScript or resource errors');console.log(`${engine.toUpperCase()} OK: 18 touch zones, study, power, hints, exam 17/18, reload/resume, history, legacy state, 5 viewports, no JS errors`);
 }finally{await browser.close()}
 }}finally{server.close()}})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
