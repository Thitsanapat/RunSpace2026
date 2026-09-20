import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1512,height:1120}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
async function param(key,value){const el=page.locator('#p-'+key);await el.evaluate(e=>e.closest('details').open=true);await el.fill(String(value));await el.dispatchEvent('change');await page.waitForFunction(([k,v])=>window.lunarLink.result.config[k]===v,[key,value]);}
try {
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.lunarLink?.webgl);
  assert.equal(await page.evaluate(()=>window.lunarLink.result.summary.surfaceInterface.candidateFit),true);
  assert.match(await page.locator('#surface-summary').textContent(),/1.50/);
  await page.locator('[data-preset="nominal"]').click();await page.locator('#rewind').click();await page.locator('#show-beam').uncheck();
  await mkdir('test-results',{recursive:true});
  await page.locator('#scene').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
  await page.locator('.viewport-card').screenshot({path:'test-results/surface-lander.png'});
  await page.locator('[data-view="mount"]').click();await page.waitForTimeout(300);
  await page.locator('.viewport-card').screenshot({path:'test-results/surface-mount.png'});
  await page.locator('[data-view="top"]').click();await page.locator('#show-zones').check();await page.waitForTimeout(300);
  await page.locator('.viewport-card').screenshot({path:'test-results/surface-zones.png'});
  await page.locator('#show-zones').uncheck();await page.locator('[data-view="detail"]').click();await page.waitForTimeout(300);
  await page.locator('.viewport-card').screenshot({path:'test-results/surface-2u.png'});
  await param('payloadMassKg',1.6);assert.match(await page.locator('#surface-summary').textContent(),/OVER LIMIT/);
  await param('payloadMassKg',1.4);await param('shockG',12);
  assert.ok(Math.abs(await page.evaluate(()=>window.lunarLink.result.summary.surfaceInterface.peakInterfaceForceN)-1.4*12*9.80665)<1e-9);
  await param('mountZ',0.73);assert.match(await page.locator('#surface-summary').textContent(),/OUTSIDE/);
  await page.locator('#surface-mount').click();await page.waitForFunction(()=>window.lunarLink.result.summary.surfaceInterface.candidateFit);
  assert.equal(await page.evaluate(()=>window.lunarLink.config.mountZ),0.45);
  await page.locator('.export-menu summary').click();const downloaded=page.waitForEvent('download');await page.locator('[data-export="report"]').click();
  const report=await readFile(await(await downloaded).path(),'utf8');assert.match(report,/Surface payload interface/);assert.match(report,/Entered total mass 1.4 kg/);
  await page.locator('.export-menu summary').click();const jsonDownload=page.waitForEvent('download');await page.locator('[data-export="json"]').click();
  const data=JSON.parse(await readFile(await(await jsonDownload).path(),'utf8'));assert.equal(data.summary.surfaceInterface.massKg,1.4);
  await page.locator('[data-preset="inverted"]').click();await page.locator('#timeline').fill('18');await page.locator('#timeline').dispatchEvent('input');assert.match(await page.locator('#live-los').textContent(),/GROUND/);
  await page.locator('[data-preset="nominal"]').click();await page.locator('[data-view="orbit"]').click();await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.locator('.viewport-card').screenshot({path:'test-results/surface-mobile.png'});
  assert.deepEqual(errors,[]);console.log('PASS surface: WebGL lander/mount/2U/zones, mass limits, interface force, mount restoration, report/JSON export, buried antenna and mobile layout.');
}finally{await browser.close();}
