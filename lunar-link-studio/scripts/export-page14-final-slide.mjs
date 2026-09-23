import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from '@playwright/test';
import {DEFAULTS,linkBudget} from '../src/engine.js';

const root=process.cwd();
const out=path.join(root,'slide-assets');
const antenna=await readFile(path.join(out,'p14-anser-reference-antenna-figure5d.png'));
const antennaData=`data:image/png;base64,${antenna.toString('base64')}`;
const c=DEFAULTS,on=linkBudget(0,c),fixed65=linkBudget(65,c);
const onHead=on.rawMargin-c.reserveDb,fixedHead=fixed65.rawMargin-c.reserveDb;
const signed=(v,d=2)=>`${v>=0?'+':''}${v.toFixed(d)}`;
const rows=[];
for(let tilt=0;tilt<=80;tilt+=2){const fixed=linkBudget(tilt,c);rows.push({tilt,fixed:fixed.rawMargin-c.reserveDb,gimbal:onHead});}
const X=v=>700+v/80*800,Y=v=>680-(v+12)/18*285;
const line=key=>rows.map((p,i)=>`${i?'L':'M'}${X(p.tilt).toFixed(1)},${Y(p[key]).toFixed(1)}`).join(' ');
let grid='';
for(const v of [-12,-6,0,6])grid+=`<line x1="700" y1="${Y(v)}" x2="1500" y2="${Y(v)}" class="grid"/><text x="683" y="${Y(v)+6}" class="axis" text-anchor="end">${v}</text>`;
for(const v of [0,20,40,60,80])grid+=`<line x1="${X(v)}" y1="395" x2="${X(v)}" y2="680" class="grid"/><text x="${X(v)}" y="710" class="axis" text-anchor="middle">${v}°</text>`;

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect width="1600" height="900" fill="#f7f9fb"/>
<style>
text{font-family:Arial,"Noto Sans Thai",sans-serif;fill:#17283b}.title{font-size:39px;font-weight:700}.subtitle{font-size:18px;fill:#586a7a}.tag{font-size:14px;font-weight:700;letter-spacing:1.5px}.head{font-size:25px;font-weight:700}.metric{font-size:31px;font-weight:700}.label{font-size:16px;font-weight:700}.body{font-size:15px}.small{font-size:13px;fill:#586a7a}.tiny{font-size:11px;fill:#586a7a}.axis{font-size:14px;fill:#586a7a}.card{fill:#fff;stroke:#d2dce3;stroke-width:1.5}.grid{stroke:#dce4e9;stroke-width:1}.orange{fill:#e8590c}.green{fill:#5c940d}.blue{fill:#1971c2}.white{fill:#fff}
</style>
<text x="42" y="57" class="title">ANTENNA SELECTION &amp; EARTH–MOON LINK EVIDENCE</text>
<text x="42" y="88" class="subtitle">Literature-qualified topology → mission-constrained 2U concept → fixed-versus-gimballed link result</text>

<rect x="38" y="118" width="560" height="720" rx="16" class="card"/>
<rect x="62" y="140" width="178" height="28" rx="14" fill="#fff0c2"/><text x="82" y="160" class="tag">LITERATURE BASIS</text>
<text x="62" y="204" class="head">ANSER stacked dual-CP patch</text>
<image href="${antennaData}" x="82" y="225" width="472" height="308" preserveAspectRatio="xMidYMid meet"/>
<text x="62" y="563" class="label">Published hardware evidence</text>
<text x="82" y="592" class="body">• 2.205 GHz circular-polarized port</text>
<text x="82" y="618" class="body">• 80 × 80 × 6.53 mm nominal stack · 30 g</text>
<text x="82" y="644" class="body">• 6.5–7 dBi isolated measured gain</text>
<text x="82" y="670" class="body">• Measured S-parameters / AR / pattern + environmental qualification</text>
<rect x="62" y="693" width="512" height="119" rx="11" fill="#eef7ff" stroke="#74c0fc"/>
<text x="82" y="720" class="label blue">WHY THIS REFERENCE?</text>
<text x="82" y="748" class="body">Exact study frequency · CP topology · measured RF data · qualification evidence</text>
<text x="82" y="777" class="small">Our antenna is not a copy: 60 × 60 × 7 mm is a new packaging target</text>
<text x="82" y="798" class="small">that requires full-wave re-optimization and hardware measurement.</text>

<rect x="624" y="118" width="938" height="720" rx="16" class="card"/>
<rect x="650" y="140" width="143" height="28" rx="14" fill="#d3f9d8"/><text x="671" y="160" class="tag">OUR ANALYSIS</text>
<text x="650" y="202" class="head">Clear-LOS direct-to-Earth study</text>
<text x="650" y="230" class="small">2.205 GHz · 384,400 km · 5 W RF · 5.2 dBic target · 4 kbps · G/T 22 dB/K assumed · 3 dB reserve</text>

<rect x="650" y="255" width="270" height="105" rx="12" fill="#f8fafb" stroke="#d2dce3"/>
<text x="674" y="285" class="small">EARTH–MOON FSPL</text><text x="896" y="332" class="metric" text-anchor="end">${on.pathLoss.toFixed(2)} dB</text>
<rect x="939" y="255" width="270" height="105" rx="12" fill="#f8fafb" stroke="#d2dce3"/>
<text x="963" y="285" class="small">EIRP</text><text x="1185" y="332" class="metric" text-anchor="end">${on.eirp.toFixed(2)} dBW</text>
<rect x="1228" y="255" width="304" height="105" rx="12" fill="#f1f8e9" stroke="#94d82d"/>
<text x="1252" y="285" class="small">ON-AXIS HEADROOM</text><text x="1508" y="332" class="metric green" text-anchor="end">${signed(onHead)} dB</text>

<text x="650" y="389" class="label">LINK HEADROOM AFTER REQUIRED 3 dB RESERVE</text>
${grid}
<line x1="700" y1="${Y(0)}" x2="1500" y2="${Y(0)}" stroke="#c92a2a" stroke-width="2" stroke-dasharray="8 6"/>
<path d="${line('fixed')}" fill="none" stroke="#e8590c" stroke-width="6"/>
<path d="${line('gimbal')}" fill="none" stroke="#5c940d" stroke-width="6"/>
<circle cx="${X(65)}" cy="${Y(fixedHead)}" r="7" fill="#e8590c"/><circle cx="${X(65)}" cy="${Y(onHead)}" r="7" fill="#5c940d"/>
<text x="${X(65)-14}" y="${Y(onHead)-14}" class="label green" text-anchor="end">Gimballed ${signed(onHead)} dB</text>
<text x="${X(65)+14}" y="${Y(fixedHead)+26}" class="label orange">Fixed ${signed(fixedHead)} dB</text>
<text x="700" y="735" class="small">Fixed antenna: boresight rotates with lander</text><text x="1125" y="735" class="small">Gimballed antenna: aperture remains Earth-pointed</text>
<rect x="650" y="759" width="882" height="54" rx="10" fill="#fff4e6" stroke="#ffa94d"/>
<text x="671" y="783" class="label orange">INSTALLED-GEOMETRY LIMIT</text><text x="671" y="804" class="small">Current 65° green-zone case is hull-blocked. Gimbal restores pointing gain; mount/FOV optimization is still required.</text>

<text x="42" y="868" class="tiny">[1] Sánchez-Sevilleja et al., Sensors 25(4), 1237, 2025, Fig. 5(d), doi:10.3390/s25041237. Image adapted from the cited work.</text>
<text x="1558" y="868" class="tiny" text-anchor="end">Team result: reduced-order link model · antenna EM/VNA/chamber validation pending</text>
</svg>`;

const svgPath=path.join(out,'p14-final-literature-to-link-evidence.svg');
const pngPath=path.join(out,'p14-final-literature-to-link-evidence.png');
await writeFile(svgPath,svg);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:2});
await page.goto(pathToFileURL(svgPath).href);
await page.locator('svg').screenshot({path:pngPath});
await browser.close();
console.log(`Exported ${path.relative(root,svgPath)} and PNG`);
