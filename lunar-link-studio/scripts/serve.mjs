import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT||4173);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PORT must be an integer from 1024 to 65535');
try{await stat(path.join(root,'index.html'));}catch{console.error('Built app missing. Run npm.cmd install, then npm.cmd run build.');process.exit(1);}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  try{
    const url=new URL(req.url,'http://localhost'),decoded=decodeURIComponent(url.pathname);
    if(decoded.includes('\0')||decoded.includes('\\')){res.writeHead(400);res.end('Invalid path');return;}
    let target=path.resolve(root,'.'+decoded);
    if(target!==path.resolve(root)&&!target.startsWith(path.resolve(root)+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
    if(decoded.endsWith('/'))target=path.join(target,'index.html');
    const data=await readFile(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:data);
  }catch(e){res.writeHead(e.code==='ENOENT'?404:400);res.end(e.code==='ENOENT'?'Not found':'Bad request');}
});
const url=`http://127.0.0.1:${port}`;
function openBrowser(){if(process.platform==='win32')spawn('explorer.exe',[url],{stdio:'ignore'});else console.log(`Open ${url} in your browser.`);}
server.on('error',e=>{if(e.code==='EADDRINUSE'){console.error(`Port ${port} is already in use. If Lunar Link is already running, open ${url}. Otherwise set PORT to another value.`);process.exitCode=1;}else{console.error(e.message);process.exitCode=1;}});
server.listen(port,'127.0.0.1',()=>{console.log(`\nLunar Link Studio\n${url}\n\nRuns locally. Keep this window open. Ctrl+C stops the server.\n`);if(process.argv.includes('--open'))openBrowser();});
