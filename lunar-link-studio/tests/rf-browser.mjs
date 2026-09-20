import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1512,height:1120}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
async function param(key,value){const el=page.locator('#p-'+key);await el.evaluate(e=>e.closest('details').open=true);await el.fill(String(value));await el.dispatchEvent('change');await page.waitForFunction(([k,v])=>window.lunarLink.config[k]===v&&window.lunarLink.rfStudy.config[k]===v,[key,value]);}
try{
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.locator('[data-tab="radio"]').click();await page.waitForFunction(()=>window.lunarLink.rfStudy);
 assert.equal(await page.evaluate(()=>window.lunarLink.rfWebgl),true);assert.equal(await page.locator('#rf-scene canvas').count(),1);
 assert.match(await page.locator('#rf-metrics').textContent(),/C\/N₀/);
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/radio-laboratory.png',fullPage:true});
 await page.locator('#rf-shape').selectOption('elliptical');await param('beamwidthV',40);
 assert.ok(await page.evaluate(()=>{const row=window.lunarLink.rfStudy.cuts.find(r=>r.x===30);return row.v<row.h;}));
 await page.locator('#rf-time').fill('3.2');await page.locator('#rf-time').dispatchEvent('input');await page.waitForFunction(()=>Math.abs(window.lunarLink.rfStudy.selectedTime-3.2)<0.05);
 await page.locator('#rf-radius').selectOption('linear');
 await page.locator('#rf-response-file').setInputFiles('public/example-frequency-response.csv');await page.waitForFunction(()=>window.lunarLink.config.frequencyResponse?.length===5);
 assert.match(await page.locator('#rf-data-status').textContent(),/interpolation/);
 const lines=['frequency_ghz,theta_deg,phi_deg,gain_dbi'];for(const theta of [0,45,90,135,180])for(const phi of [0,90,180,270])lines.push([2.205,theta,phi,theta===0?6.5:theta===180?-33.5:6.5-Math.min(40,theta*(phi===90?0.3:0.2))].join(','));
 await page.locator('#rf-grid-file').setInputFiles({name:'synthetic-grid.csv',mimeType:'text/csv',buffer:Buffer.from(lines.join('\n'))});await page.waitForFunction(()=>window.lunarLink.config.patternGrid?.rows.length===20);
 assert.match(await page.locator('#rf-source').textContent(),/IMPORTED/);
 await param('frequencyGHz',2.4);assert.equal(await page.evaluate(()=>window.lunarLink.result.frames.at(-1).link.margin),null);assert.match(await page.locator('#rf-metrics').textContent(),/UNSUPPORTED/);assert.match(await page.locator('#rf-scale').textContent(),/No supported pattern/);
 await page.locator('#rf-export-grid').click();assert.match(await page.locator('#toast').textContent(),/Cannot export/);
 // Use a clear-LOS case to isolate bandwidth failure from the top mount's hull blockage.
 await page.locator('[data-preset="nominal"]').click();await param('receiverBandwidthKHz',1);
 assert.ok(await page.evaluate(()=>{const l=window.lunarLink.result.frames.at(-1).link;return l.margin>3&&!l.available&&!l.bandwidthPass;}));
 await page.locator('[data-preset="tilt"]').click();
 // Export synchronously after an edit: it must flush the 150 ms recalculation delay.
 const pendingDownload=page.waitForEvent('download');await page.evaluate(()=>{const input=document.querySelector('#p-installationLossDb');input.value='2';input.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('#rf-export-data').click();});
 const pending=await pendingDownload;const exported=JSON.parse(await readFile(await pending.path(),'utf8'));assert.equal(exported.config.installationLossDb,2);assert.ok(Math.abs(exported.patternMetrics.peakGain-4.5)<1e-8);
 const pendingTime=page.waitForEvent('download');await page.evaluate(()=>{const slider=document.querySelector('#rf-time');slider.value='3.2';slider.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#rf-export-data').click();});assert.ok(Math.abs(JSON.parse(await readFile(await (await pendingTime).path(),'utf8')).selectedTime-3.2)<0.05);
 const snapshotDownload=page.waitForEvent('download');await page.locator('#rf-export-grid').click();const snapshot=await snapshotDownload;await snapshot.saveAs('test-results/evaluated-pattern.csv');
 await page.locator('#rf-grid-file').setInputFiles('test-results/evaluated-pattern.csv');await page.waitForFunction(()=>window.lunarLink.config.patternGrid?.snapshot);
 assert.equal(await page.evaluate(()=>window.lunarLink.config.installationLossDb),0);assert.ok(Math.abs(await page.evaluate(()=>window.lunarLink.rfStudy.cuts.find(r=>r.x===0).h)-4.5)<1e-8);
 await page.locator('[data-preset="tilt"]').click();
 const download=page.waitForEvent('download');await page.locator('#rf-export-data').click();assert.equal((await download).suggestedFilename(),'antenna-rf-study.json');
 const gridDownload=page.waitForEvent('download');await page.locator('#rf-export-grid').click();assert.match((await gridDownload).suggestedFilename(),/generated\.csv/);
 await writeFile('examples/antenna-rf-study.json',JSON.stringify(await page.evaluate(()=>window.lunarLink.rfStudy),null,2));
 const bad=page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Expected CSV header'));
 await page.locator('#rf-response-file').setInputFiles({name:'bad.csv',mimeType:'text/csv',buffer:Buffer.from('wrong,header\n1,2')});await bad;await page.waitForTimeout(5600);
 await page.locator('#rf-scene').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/radiation-3d.png'});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(350);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'RF mobile layout must not overflow');await page.screenshot({path:'test-results/radio-mobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS RF: WebGL, imports, unsupported-data masking, bandwidth, pending-edit/time export, loss-preserving CSV round-trip, malformed data and mobile layout.');
}finally{await browser.close();}
