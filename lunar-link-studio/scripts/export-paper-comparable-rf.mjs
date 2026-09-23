import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from '@playwright/test';
import {DEFAULTS,linkBudget} from '../src/engine.js';
import {directionalGain} from '../src/antenna-rf.js';

const root=process.cwd();
const out=path.join(root,'slide-assets');
await mkdir(out,{recursive:true});

const W=1200,H=580,c=DEFAULTS;
const on=linkBudget(0,c);
const fixed65=linkBudget(65,c).rawMargin-c.reserveDb;
const gimbal65=on.rawMargin-c.reserveDb;
const fmt=(v,n=2)=>Number(v).toFixed(n);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pathLine=points=>points.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

const style=`<style>
text{font-family:Arial,"Noto Sans Thai",sans-serif;fill:#17283b}.title{font-size:27px;font-weight:700}.sub{font-size:13px;fill:#536779}.panel{font-size:16px;font-weight:700}.axis{font-size:11px;fill:#536779}.tiny{font-size:10px;fill:#536779}.metric{font-size:13px;font-weight:700}.card{fill:#fff;stroke:#cfd8df;stroke-width:1.3}.grid{stroke:#dfe5ea;stroke-width:1}.fixed{stroke:#e03131;fill:none}.gimbal{stroke:#2f9e44;fill:none}.threshold{stroke:#7b8794;stroke-width:1.4;stroke-dasharray:6 5}</style>`;

function polar(cx,cy,R,label,steer){
  let grid='';
  for(const rel of [-30,-20,-10,0]){
    const r=R*(rel+30)/30;
    grid+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" class="grid"/>`;
    if(rel<0)grid+=`<text x="${cx+4}" y="${cy-r+11}" class="tiny">${rel}</text>`;
  }
  for(const a of [0,30,60,90,120,150,180,210,240,270,300,330]){
    const rad=a*Math.PI/180;
    const x=cx+R*Math.sin(rad),y=cy-R*Math.cos(rad);
    grid+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="grid"/>`;
    if(a%30===0){const tx=cx+(R+15)*Math.sin(rad),ty=cy-(R+15)*Math.cos(rad)+4;grid+=`<text x="${tx}" y="${ty}" class="tiny" text-anchor="middle">${a<=180?a:360-a}</text>`;}
  }
  const curve=offset=>{
    const pts=[];
    for(let a=0;a<=360;a+=2){
      const sep=Math.acos(Math.cos((a-offset)*Math.PI/180))*180/Math.PI;
      const gain=directionalGain(sep,0,c);
      const rel=clamp(gain-c.peakGain,-30,0),r=R*(rel+30)/30,rad=a*Math.PI/180;
      pts.push([cx+r*Math.sin(rad),cy-r*Math.cos(rad)]);
    }
    return pathLine(pts);
  };
  return `${grid}<path d="${curve(0)}" class="fixed" stroke-width="3"/><path d="${curve(steer)}" class="gimbal" stroke-width="3"/><text x="${cx}" y="${cy+R+34}" text-anchor="middle" class="panel">${label}</text><text x="${cx}" y="${cy+R+50}" text-anchor="middle" class="tiny">Gain relative to ${c.peakGain.toFixed(1)} dBic target (dB)</text>`;
}

// (a) S11 evidence status. A single scalar assumption is drawn as a point only;
// drawing a resonance curve here would invent bandwidth that the model does not contain.
const sx=58,sy=100,sw=420,sh=170;
const sX=f=>sx+(f-2.0)/0.8*sw;
const sY=db=>sy+(-db)/45*sh;
let sGrid='';
for(const f of [2.0,2.2,2.4,2.6,2.8])sGrid+=`<line x1="${sX(f)}" y1="${sy}" x2="${sX(f)}" y2="${sy+sh}" class="grid"/><text x="${sX(f)}" y="${sy+sh+15}" text-anchor="middle" class="axis">${f.toFixed(1)}</text>`;
for(const db of [0,-10,-20,-30,-40])sGrid+=`<line x1="${sx}" y1="${sY(db)}" x2="${sx+sw}" y2="${sY(db)}" class="grid"/><text x="${sx-9}" y="${sY(db)+4}" text-anchor="end" class="axis">${db}</text>`;
const s11=`<rect x="28" y="77" width="470" height="226" rx="8" class="card"/><text x="45" y="97" class="panel">(a) S11 vs frequency · evidence status</text>${sGrid}<line x1="${sx}" y1="${sY(-10)}" x2="${sx+sw}" y2="${sY(-10)}" class="threshold"/><line x1="${sX(c.frequencyGHz)}" y1="${sy}" x2="${sX(c.frequencyGHz)}" y2="${sy+sh}" stroke="#1971c2" stroke-width="1.6" stroke-dasharray="4 4"/><path d="M${sX(c.frequencyGHz)},${sY(c.s11Db)-7} l7,7 l-7,7 l-7,-7 z" fill="#1971c2"/><text x="${sX(c.frequencyGHz)+10}" y="${sY(c.s11Db)-7}" class="metric" fill="#1971c2">2.205 GHz, ${c.s11Db.toFixed(0)} dB target*</text><text x="${sx+sw/2}" y="${sy+68}" text-anchor="middle" class="sub">NO S11 SWEEP IMPORTED</text><text x="${sx+sw/2}" y="${sy+87}" text-anchor="middle" class="tiny">*matching requirement · not a predicted resonance or bandwidth</text><text x="${sx+sw/2}" y="${sy+sh+34}" text-anchor="middle" class="axis">Frequency (GHz)</text><text x="16" y="${sy+sh/2}" text-anchor="middle" class="axis" transform="rotate(-90 16 ${sy+sh/2})">S11 (dB)</text>`;

// System-level evidence retained from the page-14 link budget.
const rows=[];
for(let a=0;a<=80;a+=2)rows.push({a,f:linkBudget(a,c).rawMargin-c.reserveDb,g:gimbal65});
const lx=545,ly=119,lw=600,lh=131;
const lX=a=>lx+a/80*lw,lY=m=>ly+(8-m)/22*lh;
let lGrid='';
for(const m of [-12,-6,0,6])lGrid+=`<line x1="${lx}" y1="${lY(m)}" x2="${lx+lw}" y2="${lY(m)}" class="grid"/><text x="${lx-8}" y="${lY(m)+4}" text-anchor="end" class="axis">${m}</text>`;
for(const a of [0,20,40,60,80])lGrid+=`<line x1="${lX(a)}" y1="${ly}" x2="${lX(a)}" y2="${ly+lh}" class="grid"/><text x="${lX(a)}" y="${ly+lh+15}" text-anchor="middle" class="axis">${a}°</text>`;
const margin=`<rect x="518" y="77" width="654" height="226" rx="8" class="card"/><text x="535" y="97" class="panel">System evidence · link headroom vs lander tilt</text><text x="1150" y="97" text-anchor="end" class="tiny">FSPL ${fmt(on.pathLoss)} dB · EIRP ${fmt(on.eirp)} dBW</text>${lGrid}<line x1="${lx}" y1="${lY(0)}" x2="${lx+lw}" y2="${lY(0)}" class="threshold"/><path d="${pathLine(rows.map(r=>[lX(r.a),lY(r.f)]))}" class="fixed" stroke-width="3.5"/><path d="${pathLine(rows.map(r=>[lX(r.a),lY(r.g)]))}" class="gimbal" stroke-width="3.5"/><circle cx="${lX(65)}" cy="${lY(fixed65)}" r="4.5" fill="#e03131"/><circle cx="${lX(65)}" cy="${lY(gimbal65)}" r="4.5" fill="#2f9e44"/><text x="${lX(65)-7}" y="${lY(fixed65)+16}" text-anchor="end" class="metric" fill="#e03131">${fmt(fixed65)} dB</text><text x="${lX(65)-7}" y="${lY(gimbal65)-7}" text-anchor="end" class="metric" fill="#2f9e44">+${fmt(gimbal65)} dB</text><text x="${lx+lw/2}" y="${ly+lh+34}" text-anchor="middle" class="axis">Lander tilt / fixed-antenna mispointing</text>`;

const legend=`<line x1="500" y1="332" x2="540" y2="332" class="fixed" stroke-width="4"/><text x="548" y="336" class="axis">Fixed to lander</text><line x1="690" y1="332" x2="730" y2="332" class="gimbal" stroke-width="4"/><text x="738" y="336" class="axis">Gimbal aligned to Earth (65° plane case)</text>`;
const polarPanels=`<rect x="28" y="315" width="1144" height="231" rx="8" class="card"/>${legend}${polar(335,430,76,'(b) XZ-plane cut',65)}${polar(855,430,76,'(c) YZ-plane cut',65)}<text x="1128" y="372" text-anchor="end" class="tiny">Paper-style polar coordinates</text><text x="1128" y="388" text-anchor="end" class="tiny">Analytical axisymmetric pattern</text><text x="1128" y="404" text-anchor="end" class="tiny">No rover/regolith coupling</text>`;

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#fff"/>${style}<text x="28" y="35" class="title">OUR ANALYSIS · PAPER-COMPARABLE RF EVIDENCE</text><text x="28" y="58" class="sub">S-band 2.205 GHz · ${c.peakGain.toFixed(1)} dBic target · 5 W RF · 384,400 km · 4 kbps · reduced-order model, not CST or measured data</text>${s11}${margin}${polarPanels}<text x="600" y="568" text-anchor="middle" class="tiny">Comparable layout: Gadhafi et al., Sensors 2024, Fig. 18 (2.42 GHz CST). Frequencies and evidence levels differ; direct performance ranking is not valid.</text></svg>`;

const svgPath=path.join(out,'p14-paper-comparable-rf.svg');
await writeFile(svgPath,svg);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
await page.goto(pathToFileURL(svgPath).href);
await page.locator('svg').screenshot({path:path.join(out,'p14-paper-comparable-rf.png')});
await browser.close();
console.log(`Exported ${path.relative(root,svgPath)} and PNG`);
