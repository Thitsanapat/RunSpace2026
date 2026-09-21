import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url)),prefix='/RunSpace2026/';
const requested=[],errors=[],types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
  try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);requested.push(pathname);assert.ok(pathname.startsWith(prefix));const target=path.resolve(root,pathname.slice(prefix.length)||'index.html');assert.ok(target.startsWith(root));res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');res.end(await readFile(target));}catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(process.env.LIVE_URL||`http://127.0.0.1:${server.address().port}${prefix}`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.lunarLink?.webgl);
  assert.equal(await page.evaluate(()=>window.lunarLink.result.modelVersion),'1.4.1');
  await page.locator('[data-tab="radio"]').click();await page.waitForFunction(()=>window.lunarLink.rfWebgl);
  await page.locator('[data-tab="analysis"]').click();await page.locator('#batch-count').selectOption('50');await page.locator('#run-batch').click();
  await page.waitForFunction(()=>window.lunarLink.batch?.rows.length===50,null,{timeout:120000});
  if(!process.env.LIVE_URL)assert.ok(requested.some(p=>p.includes('analysis.worker-')));
  assert.deepEqual(errors,[]);
  console.log('PASS Pages: project subpath assets, mission and RF WebGL, version, and 50-trial module worker.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
