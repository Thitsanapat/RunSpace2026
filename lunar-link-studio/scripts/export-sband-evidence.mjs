import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from '@playwright/test';
import {DEFAULTS,linkBudget} from '../src/engine.js';
import {directionalGain} from '../src/antenna-rf.js';
import {beamMetrics} from '../src/research.js';

const root=process.cwd(),out=path.join(root,'sband-evidence-assets'),slideOut=path.join(root,'slide-assets');
await mkdir(out,{recursive:true});
await mkdir(slideOut,{recursive:true});
const f=(x,d=2)=>Number(x).toFixed(d);
const style=`<style>text{font-family:Arial,"Noto Sans Thai",sans-serif;fill:#17283b}.title{font-size:32px;font-weight:700}.sub{font-size:17px;fill:#526476}.h{font-size:23px;font-weight:700}.label{font-size:17px;font-weight:700}.small{font-size:14px;fill:#526476}.white{fill:#fff}.green{fill:#66a80f}.orange{fill:#e8590c}.red{fill:#c92a2a}.blue{fill:#1971c2}.grid{stroke:#dce3e8;stroke-width:1}.card{fill:#f8fafb;stroke:#d7dfe5;stroke-width:1.5}.warn{fill:#fff4e6;stroke:#ffa94d;stroke-width:1.5}</style>`;
const svg=(body,w=1200,h=700)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="white"/>${style}${body}</svg>`;
const save=async(name,body,w=1200,h=700)=>{const file=path.join(out,name+'.svg');await writeFile(file,svg(body,w,h));return file;};
const line=(rows,x,y,xk,yk)=>rows.map((p,i)=>`${i?'L':'M'}${x(p[xk]).toFixed(1)},${y(p[yk]).toFixed(1)}`).join(' ');

const on=linkBudget(0,DEFAULTS),beam=beamMetrics(DEFAULTS,on.rawMargin);
const angles=Array.from({length:181},(_,i)=>i-90).map(a=>({a,g:directionalGain(Math.abs(a),0,DEFAULTS),loss:DEFAULTS.peakGain-directionalGain(Math.abs(a),0,DEFAULTS)}));
{
  const X=a=>90+(a+90)/180*1040,Y=g=>590-(g+35)/45*410;let grid='';
  for(const g of [-30,-20,-10,0,3.5,6.5])grid+=`<line x1="90" y1="${Y(g)}" x2="1130" y2="${Y(g)}" class="grid"/><text x="74" y="${Y(g)+5}" class="small" text-anchor="end">${g}</text>`;
  for(const a of [-90,-60,-41.22,-30,0,30,41.22,60,90])grid+=`<line x1="${X(a)}" y1="180" x2="${X(a)}" y2="590" class="grid"/><text x="${X(a)}" y="618" class="small" text-anchor="middle">${f(a,a%1?1:0)}°</text>`;
  const half=DEFAULTS.peakGain-3.0103;
  await save('01-gain-vs-off-axis-angle',`<text x="38" y="50" class="title">S-band antenna gain vs off-axis angle</text><text x="38" y="80" class="sub">2.205 GHz · 6.5 dBic peak input · analytical axisymmetric cosine pattern · not measured mounted data</text><rect x="38" y="110" width="1124" height="540" rx="12" class="card"/><rect x="${X(-beam.halfAngle)}" y="180" width="${X(beam.halfAngle)-X(-beam.halfAngle)}" height="410" fill="#ebfbee" opacity=".65"/>${grid}<line x1="90" y1="${Y(half)}" x2="1130" y2="${Y(half)}" stroke="#66a80f" stroke-width="2" stroke-dasharray="8 6"/><path d="${line(angles,X,Y,'a','g')}" fill="none" stroke="#1971c2" stroke-width="6"/><circle cx="${X(0)}" cy="${Y(DEFAULTS.peakGain)}" r="7" fill="#1971c2"/><circle cx="${X(-beam.halfAngle)}" cy="${Y(half)}" r="7" fill="#66a80f"/><circle cx="${X(beam.halfAngle)}" cy="${Y(half)}" r="7" fill="#66a80f"/><text x="${X(0)-15}" y="${Y(DEFAULTS.peakGain)-15}" class="label blue" text-anchor="end">Peak 6.5 dBic</text><text x="${X(beam.halfAngle)+12}" y="${Y(half)-12}" class="label green">−3 dB at ±${f(beam.halfAngle,2)}°</text><rect x="695" y="126" width="430" height="76" rx="10" class="warn"/><text x="715" y="157" class="label orange">HPBW ≈ ${f(DEFAULTS.beamwidth,2)}°</text><text x="715" y="184" class="small">±0.5° control error → ≈${f(beam.lossAtHalfDegree,4)} dB loss</text><text x="610" y="686" class="label" text-anchor="middle">Signed off-axis angle from boresight (deg)</text><text x="25" y="410" class="label" text-anchor="middle" transform="rotate(-90 25 410)">Realized gain input model (dBic)</text>`);
}

{
  const rows=[];for(let a=0;a<=80;a+=2){const fixed=linkBudget(a,DEFAULTS);rows.push({a,f:fixed.rawMargin-DEFAULTS.reserveDb,g:on.rawMargin-DEFAULTS.reserveDb});}
  const X=a=>76+a/80*744,Y=m=>452-(m+14)/22*292;let grid='';
  for(const m of [-12,-6,0,6])grid+=`<line x1="76" y1="${Y(m)}" x2="820" y2="${Y(m)}" class="grid"/><text x="61" y="${Y(m)+5}" class="small" text-anchor="end">${m}</text>`;
  for(const a of [0,20,40,60,80])grid+=`<line x1="${X(a)}" y1="160" x2="${X(a)}" y2="452" class="grid"/><text x="${X(a)}" y="478" class="small" text-anchor="middle">${a}°</text>`;
  const fixed65=linkBudget(65,DEFAULTS).rawMargin-DEFAULTS.reserveDb,gimbal=on.rawMargin-DEFAULTS.reserveDb;
  const body=`<text x="34" y="39" class="title">OUR ANALYSIS · EARTH–MOON RF EVIDENCE</text><text x="34" y="68" class="sub">S-band 2.205 GHz · 384,400 km · 5 W RF · 6.5 dBic · 4 kbps · G/T 22 dB/K assumed</text>
  <rect x="34" y="88" width="250" height="56" rx="9" class="card"/><text x="51" y="111" class="small">EARTH–MOON FSPL</text><text x="266" y="128" class="h" text-anchor="end">211.01 dB</text>
  <rect x="296" y="88" width="250" height="56" rx="9" class="card"/><text x="313" y="111" class="small">EIRP</text><text x="528" y="128" class="h" text-anchor="end">12.49 dBW</text>
  <rect x="558" y="88" width="262" height="56" rx="9" class="card"/><text x="575" y="111" class="small">PASS BOUNDARY</text><text x="802" y="128" class="h" text-anchor="end">0 dB after reserve</text>
  ${grid}<line x1="76" y1="${Y(0)}" x2="820" y2="${Y(0)}" stroke="#c92a2a" stroke-width="2" stroke-dasharray="8 6"/><path d="${line(rows,X,Y,'a','f')}" fill="none" stroke="#e8590c" stroke-width="6"/><path d="${line(rows,X,Y,'a','g')}" fill="none" stroke="#66a80f" stroke-width="6"/><circle cx="${X(65)}" cy="${Y(fixed65)}" r="7" fill="#e8590c"/><circle cx="${X(65)}" cy="${Y(gimbal)}" r="7" fill="#66a80f"/><text x="85" y="181" class="small">Headroom after 3 dB reserve (dB)</text><text x="448" y="512" class="small" text-anchor="middle">Lander tilt / fixed-antenna mispointing</text>
  <rect x="850" y="88" width="316" height="424" rx="12" class="card"/><text x="876" y="128" class="h">FIXED vs GIMBALLED</text><text x="876" y="158" class="small">Concept comparison at 65° tilt</text><line x1="876" y1="181" x2="1140" y2="181" class="grid"/>
  <text x="876" y="219" class="label orange">FIXED PATCH</text><text x="876" y="260" class="h orange">−3.55 dB</text><text x="876" y="287" class="small">after reserve · FAIL</text><line x1="876" y1="311" x2="1140" y2="311" class="grid"/>
  <text x="876" y="350" class="label green">GIMBAL ON-AXIS</text><text x="876" y="391" class="h green">+5.56 dB</text><text x="876" y="418" class="small">after reserve · PASS*</text><text x="876" y="458" class="small">Recovered headroom: +9.11 dB</text><text x="876" y="488" class="small">*Clear-path RF budget only</text>
  <rect x="34" y="530" width="1132" height="38" rx="8" class="warn"/><text x="600" y="555" class="small" text-anchor="middle">Installed 65° green-zone case is HULL-BLOCKED · mount/FOV optimization is still required.</text>`;
  await writeFile(path.join(slideOut,'p14-rf-evidence-final.svg'),svg(body,1200,580));
}

{
  const X=v=>190+(v-1.98)/.39*920;
  const bar=(y,a,b,color,label,note='')=>`<text x="165" y="${y+21}" class="label" text-anchor="end">${label}</text><rect x="${X(a)}" y="${y}" width="${X(b)-X(a)}" height="34" rx="6" fill="${color}"/><text x="${(X(a)+X(b))/2}" y="${y+22}" class="small white" text-anchor="middle">${f(a,3)}–${f(b,3)} GHz</text>${note?`<text x="${X(b)+10}" y="${y+22}" class="small">${note}</text>`:''}`;
  let ticks='';for(const v of [2.0,2.05,2.1,2.15,2.2,2.25,2.3,2.35])ticks+=`<line x1="${X(v)}" y1="150" x2="${X(v)}" y2="560" class="grid"/><text x="${X(v)}" y="588" class="small" text-anchor="middle">${f(v,2)}</text>`;
  const op=X(2.205),gmax=X(2.18),anser1=X(2.03);
  await save('02-sband-frequency-evidence',`<text x="38" y="50" class="title">Why 2.205 GHz is an S-band study point</text><text x="38" y="80" class="sub">Literature and service-band evidence · bars do not constitute our measured antenna response</text><rect x="38" y="110" width="1124" height="530" rx="12" class="card"/>${ticks}${bar(180,2.20,2.29,'#17283b','NASA return','mission assignment still required')}${bar(260,2.00,2.34,'#1971c2','SLSP S11','measured reference')}${bar(340,2.04,2.25,'#66a80f','SLSP AR≤3 dB','measured reference')}<line x1="${gmax}" y1="410" x2="${gmax}" y2="478" stroke="#e8590c" stroke-width="5"/><circle cx="${gmax}" cy="430" r="8" fill="#e8590c"/><text x="${gmax+12}" y="435" class="label orange">SLSP max gain 7.24 dBic @ 2.18 GHz</text><line x1="${anser1}" y1="475" x2="${anser1}" y2="525" stroke="#868e96" stroke-width="4"/><line x1="${op}" y1="150" x2="${op}" y2="560" stroke="#c92a2a" stroke-width="4"/><text x="${op+10}" y="138" class="label red">OUR STUDY: 2.205 GHz</text><text x="${anser1+8}" y="516" class="small">ANSER 2.03 GHz port</text><text x="${op+8}" y="546" class="small">ANSER 2.205 GHz port · isolated gain 6.5–7 dBi</text><text x="610" y="625" class="label" text-anchor="middle">Frequency (GHz)</text><rect x="700" y="594" width="430" height="34" rx="7" class="warn"/><text x="915" y="616" class="small" text-anchor="middle">No raw gain/S11/AR curve has been imported for our payload.</text>`);
}

const evidence=[
  ['Gain vs angle','AVAILABLE','Analytical cosine; 6.5 dBic input','Replace with mounted chamber pattern'],
  ['3D radiation','AVAILABLE','Same assumed angular model','Import θ–φ measured/EM grid'],
  ['Gain vs frequency','MISSING','Literature points only','VNA/chamber or validated EM sweep'],
  ['S11 vs frequency','MISSING','Scalar −15 dB assumption','Mounted VNA sweep incl. feed/coax'],
  ['Axial ratio vs frequency','MISSING','Scalar 3 dB assumption','Dual-pol chamber measurement'],
  ['Gain/S11/AR vs temperature','MISSING','RF temperature coefficient = 0','Thermal-vacuum RF test'],
  ['Installed lander coupling','MISSING','Hull only blocks geometric ray','Full-wave mounted EM model/test'],
];
{
  const xs=[38,290,505,780],ws=[245,208,268,382],y0=135,ch=65;let body='';['Evidence item','Status','Current basis','What closes the gap'].forEach((v,i)=>body+=`<rect x="${xs[i]}" y="${y0}" width="${ws[i]}" height="44" fill="#17283b"/><text x="${xs[i]+13}" y="${y0+29}" class="label white">${v}</text>`);evidence.forEach((r,j)=>{const y=y0+47+j*ch,ok=r[1]==='AVAILABLE';for(let i=0;i<4;i++)body+=`<rect x="${xs[i]}" y="${y}" width="${ws[i]}" height="${ch-3}" fill="${i===1?(ok?'#ebfbee':'#fff4e6'):(j%2?'#f8fafb':'#fff')}" stroke="#d7dfe5"/><text x="${xs[i]+13}" y="${y+37}" class="${i===1?(ok?'label green':'label orange'):'small'}">${r[i]}</text>`;});
  await save('03-rf-evidence-gap-matrix',`<text x="38" y="50" class="title">S-band RF evidence matrix · what the slide may claim today</text><text x="38" y="80" class="sub">“Available” means the simulator can plot it; it does not mean measured or flight-qualified</text>${body}<rect x="38" y="655" width="1124" height="32" rx="7" class="warn"/><text x="600" y="677" class="small" text-anchor="middle">Do not draw a smooth gain/S11/AR-vs-frequency curve from isolated literature points.</text>`);
}

const browser=await chromium.launch({channel:'chrome',headless:true});
for(const name of ['01-gain-vs-off-axis-angle','02-sband-frequency-evidence','03-rf-evidence-gap-matrix']){const page=await browser.newPage({viewport:{width:1200,height:720},deviceScaleFactor:2});await page.goto(pathToFileURL(path.join(out,name+'.svg')).href);await page.locator('svg').screenshot({path:path.join(out,name+'.png')});await page.close();}
{
  const page=await browser.newPage({viewport:{width:1200,height:620},deviceScaleFactor:2});await page.goto(pathToFileURL(path.join(slideOut,'p14-rf-evidence-final.svg')).href);await page.locator('svg').screenshot({path:path.join(slideOut,'p14-rf-evidence-final.png')});await page.close();
}
await browser.close();
console.log(`Exported S-band evidence assets to ${out}`);
