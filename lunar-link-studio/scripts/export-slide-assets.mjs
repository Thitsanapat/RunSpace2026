import {chromium} from '@playwright/test';
import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {DEFAULTS,linkBudget,runSimulation} from '../src/engine.js';
import {electricalStudy} from '../src/payload-design.js';

const root=process.cwd(),out=path.join(root,'slide-assets');
await mkdir(out,{recursive:true});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const baseStyle=`<style>
text{font-family:Arial,"Noto Sans Thai",sans-serif;fill:#17283b}.title{font-size:34px;font-weight:700}.sub{font-size:18px;fill:#526476}.label{font-size:18px;font-weight:700}.value{font-size:25px;font-weight:700}.small{font-size:15px;fill:#526476}.tag{font-size:13px;font-weight:700;letter-spacing:1px}.grid{stroke:#dce3e8;stroke-width:1}.axis{stroke:#71808e;stroke-width:1.5}.green{fill:#66a80f}.orange{fill:#e8590c}.red{fill:#c92a2a}.navy{fill:#17283b}.white{fill:#fff}.card{fill:#f8fafb;stroke:#d7dfe5;stroke-width:1.5}.warn{fill:#fff4e6;stroke:#ffa94d;stroke-width:1.5}</style>`;
const svg=(body,w=1200,h=700)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="white"/>${baseStyle}${body}</svg>`;
async function saveSvg(name,body,w=1200,h=700){const file=path.join(out,name+'.svg');await writeFile(file,svg(body,w,h));return file;}

const c={...DEFAULTS};
const electrical=electricalStudy(c,runSimulation(c));
const on=linkBudget(0,c,false,true,0,c.initialTemp);
const fixed65=linkBudget(65,c,false,true,0,c.initialTemp);
const headroom=on.rawMargin-c.reserveDb,fixedHeadroom=fixed65.rawMargin-c.reserveDb;
const signed=v=>`${v>=0?'+':''}${v.toFixed(2)}`;

await saveSvg('p16-antenna-research-vs-our-concept',`
<text x="38" y="52" class="title">Antenna evidence: literature benchmark vs our 2U concept</text>
<text x="38" y="83" class="sub">Keep measured/reference inputs separate from team simulation outputs</text>
<rect x="38" y="112" width="540" height="485" rx="12" class="card"/><rect x="622" y="112" width="540" height="485" rx="12" class="card"/>
<rect x="58" y="132" width="126" height="28" rx="14" fill="#fff0c2"/><text x="77" y="152" class="tag">LITERATURE</text>
<text x="58" y="198" class="value">Rashid rover DTE design</text>
<text x="58" y="236" class="label">2266 MHz downlink · 2101.2 MHz uplink</text>
<text x="58" y="270" class="label">CP patch · ≈6 dBi · few-kbps telemetry</text>
<text x="58" y="304" class="small">Lunar rover structure / terrain antenna study</text>
<text x="58" y="337" class="small">Designed for lunar operation; no surface link demonstration</text>
<line x1="58" y1="369" x2="558" y2="369" class="grid"/>
<text x="58" y="407" class="value">Sánchez-Sevilleja et al. 2025</text>
<text x="58" y="445" class="label">2.205 GHz · dual-CP stacked patch</text>
<text x="58" y="479" class="label">80 × 80 × 6.53 mm · 30 g</text>
<text x="58" y="513" class="label">Measured isolated gain: 6.5–7 dBi</text>
<text x="58" y="557" class="small">Hardware benchmark; not a validation of our mounted gimbal</text>
<rect x="642" y="132" width="142" height="28" rx="14" fill="#d3f9d8"/><text x="664" y="152" class="tag">OUR CONCEPT</text>
<text x="642" y="198" class="value">2U gimballed CP patch</text>
<text x="642" y="236" class="label">Study frequency</text><text x="1125" y="236" class="label" text-anchor="end">2.205 GHz</text>
<text x="642" y="275" class="label">Realized gain target</text><text x="1125" y="275" class="label" text-anchor="end">${c.peakGain.toFixed(1)} dBic</text>
<text x="642" y="314" class="label">Analytical HPBW</text><text x="1125" y="314" class="label" text-anchor="end">${c.beamwidth.toFixed(0)}°</text>
<text x="642" y="353" class="label">Pointing</text><text x="1125" y="353" class="label" text-anchor="end">2-axis gimbal</text>
<text x="642" y="392" class="label">Payload envelope</text><text x="1125" y="392" class="label" text-anchor="end">100 × 100 × 181 mm</text>
<text x="642" y="431" class="label">Payload mass target</text><text x="1125" y="431" class="label" text-anchor="end">≤1.5 kg</text>
<line x1="642" y1="458" x2="1142" y2="458" class="grid"/>
<text x="642" y="494" class="small">REFERENCE-BASED SIMULATION INPUTS</text>
<text x="642" y="526" class="small">Mounted pattern, S11, axial ratio and thermal shift: test pending</text>
<text x="642" y="558" class="small">Final channel and ground service: mission assignment pending</text>
<rect x="38" y="620" width="1124" height="52" rx="10" class="warn"/><text x="58" y="653" class="label">Use on page 16 · Research establishes feasibility; it does not certify our complete 2U payload.</text>`);

await saveSvg('p16-link-budget-chain',`
<text x="38" y="52" class="title">Direct-to-Earth link budget · auditable calculation chain</text>
<text x="38" y="83" class="sub">2.205 GHz · 384,400 km · 4 kbps · ground-station G/T 22 dB/K (assumed)</text>
<rect x="38" y="115" width="340" height="410" rx="12" class="card"/><rect x="430" y="115" width="340" height="410" rx="12" class="card"/><rect x="822" y="115" width="340" height="410" rx="12" class="card"/>
<text x="62" y="157" class="value">1 · Transmitter</text>
<text x="62" y="205" class="label">RF output</text><text x="350" y="205" class="label" text-anchor="end">+6.99 dBW</text>
<text x="62" y="245" class="label">Realized antenna gain target</text><text x="350" y="245" class="label" text-anchor="end">+${c.peakGain.toFixed(2)} dBic</text>
<text x="62" y="285" class="label">Feed loss</text><text x="350" y="285" class="label" text-anchor="end">−1.00 dB</text>
<line x1="62" y1="315" x2="350" y2="315" class="grid"/><text x="62" y="363" class="value">EIRP</text><text x="350" y="363" class="value" text-anchor="end">${on.eirp.toFixed(2)} dBW</text>
<text x="62" y="410" class="small">5 W is RF output, not DC input.</text><text x="62" y="440" class="small">At 35% PA efficiency: ≈14.29 W DC.</text>
<text x="454" y="157" class="value">2 · Channel / receiver</text>
<text x="454" y="205" class="label">Free-space path loss</text><text x="746" y="205" class="label" text-anchor="end">−211.01 dB</text>
<text x="454" y="245" class="label">Polarization + other</text><text x="746" y="245" class="label" text-anchor="end">−1.50 dB</text>
<text x="454" y="285" class="label">Receiver G/T</text><text x="746" y="285" class="label" text-anchor="end">+22.00 dB/K</text>
<text x="454" y="325" class="label">Boltzmann term</text><text x="746" y="325" class="label" text-anchor="end">+228.60 dB</text>
<line x1="454" y1="355" x2="746" y2="355" class="grid"/><text x="454" y="403" class="value">C/N₀</text><text x="746" y="403" class="value" text-anchor="end">${on.cn0.toFixed(2)} dB-Hz</text>
<text x="454" y="450" class="small">Station availability and frequency assignment</text><text x="454" y="478" class="small">remain mission/service constraints.</text>
<text x="846" y="157" class="value">3 · Service result</text>
<text x="846" y="205" class="label">Eb/N₀ @ 4 kbps</text><text x="1138" y="205" class="label" text-anchor="end">${on.ebno.toFixed(2)} dB</text>
<text x="846" y="245" class="label">Threshold + impl. loss</text><text x="1138" y="245" class="label" text-anchor="end">−6.00 dB</text>
<text x="846" y="285" class="label">Raw margin</text><text x="1138" y="285" class="label" text-anchor="end">${on.rawMargin.toFixed(2)} dB</text>
<text x="846" y="325" class="label">Required reserve</text><text x="1138" y="325" class="label" text-anchor="end">−3.00 dB</text>
<line x1="846" y1="355" x2="1138" y2="355" class="grid"/><text x="846" y="397" class="value">HEADROOM</text><text x="1138" y="397" class="value green" text-anchor="end">${signed(headroom)} dB</text>
<text x="846" y="446" class="small">PASS only under the stated clear-LOS, powered</text><text x="846" y="474" class="small">host-radio and ground-station assumptions.</text>
<rect x="38" y="555" width="1124" height="112" rx="10" class="warn"/><text x="58" y="591" class="label">Ground-station sensitivity at 4 kbps:</text><text x="58" y="626" class="small">G/T 12.8 → −4.94 dB · 17 → −0.74 dB · 21 → +3.26 dB · 22 → +4.26 dB after reserve</text><text x="58" y="653" class="small">Use on page 16 · Caption every result with frequency, range, rate, RF power, G/T and reserve.</text>`);

const pts=[];for(let a=0;a<=80;a+=2){const l=linkBudget(a,c,false,true,0,c.initialTemp);pts.push({a,f:l.rawMargin-c.reserveDb,g:on.rawMargin-c.reserveDb});}
const X=a=>95+a/80*1035,Y=v=>615-(v+14)/22*420;
const pathFor=k=>pts.map((p,i)=>`${i?'L':'M'}${X(p.a).toFixed(1)},${Y(p[k]).toFixed(1)}`).join(' ');
let grid='';for(const y of [-12,-9,-6,-3,0,3,6])grid+=`<line x1="95" y1="${Y(y)}" x2="1130" y2="${Y(y)}" class="grid"/><text x="78" y="${Y(y)+6}" class="small" text-anchor="end">${y}</text>`;for(const x of [0,20,40,60,80])grid+=`<line x1="${X(x)}" y1="195" x2="${X(x)}" y2="615" class="grid"/><text x="${X(x)}" y="645" class="small" text-anchor="middle">${x}°</text>`;
await saveSvg('p16-fixed-vs-gimbal-clear-los',`
<text x="38" y="52" class="title">Fixed vs gimballed patch · clear-line-of-sight sensitivity</text>
<text x="38" y="83" class="sub">Y-axis is headroom after the required 3 dB reserve; 0 dB is the pass/fail boundary</text>
<rect x="38" y="108" width="1124" height="558" rx="12" class="card"/>${grid}
<line x1="95" y1="${Y(0)}" x2="1130" y2="${Y(0)}" stroke="#c92a2a" stroke-width="2" stroke-dasharray="9 7"/><text x="1125" y="${Y(0)-10}" class="small" text-anchor="end">PASS / FAIL</text>
<path d="${pathFor('f')}" fill="none" stroke="#e8590c" stroke-width="6"/><path d="${pathFor('g')}" fill="none" stroke="#66a80f" stroke-width="6"/>
<circle cx="${X(65)}" cy="${Y(fixed65.rawMargin-c.reserveDb)}" r="7" fill="#e8590c"/><circle cx="${X(65)}" cy="${Y(on.rawMargin-c.reserveDb)}" r="7" fill="#66a80f"/>
<text x="790" y="147" class="label orange">● Fixed patch</text><text x="965" y="147" class="label green">● Gimballed, on-axis</text>
<text x="${X(65)-18}" y="${Y(headroom)-18}" class="label green" text-anchor="end">65°: ${signed(headroom)} dB</text><text x="${X(65)+15}" y="${Y(fixedHeadroom)+26}" class="label orange">65°: ${signed(fixedHeadroom)} dB</text>
<text x="612" y="684" class="label" text-anchor="middle">Lander tilt represented as fixed-antenna mispointing (deg)</text><text x="24" y="407" class="label" text-anchor="middle" transform="rotate(-90 24 407)">Headroom after reserve (dB)</text>
<rect x="113" y="535" width="620" height="62" rx="8" fill="#fff4e6" opacity="0.95"/><text x="132" y="560" class="small">Current installed 65° green-zone case is hull-blocked in the geometry proxy.</text><text x="132" y="584" class="small">Use this plot as clear-LOS potential; mount/FOV optimization is still required.</text>`);

const SX=a=>80+a/80*1050,SY=v=>620-(v+14)/22*230;
const compactPath=k=>pts.map((p,i)=>`${i?'L':'M'}${SX(p.a).toFixed(1)},${SY(p[k]).toFixed(1)}`).join(' ');
let compactGrid='';
for(const y of [-12,-6,0,6])compactGrid+=`<line x1="80" y1="${SY(y)}" x2="1130" y2="${SY(y)}" class="grid"/><text x="65" y="${SY(y)+5}" class="small" text-anchor="end">${y}</text>`;
for(const x of [0,20,40,60,80])compactGrid+=`<line x1="${SX(x)}" y1="390" x2="${SX(x)}" y2="620" class="grid"/><text x="${SX(x)}" y="644" class="small" text-anchor="middle">${x}°</text>`;
await saveSvg('p16-right-column-summary',`
<text x="38" y="48" class="title">Our 2U antenna concept · evidence summary</text>
<text x="38" y="78" class="sub">Reference-based inputs + auditable DTE calculation + current geometry finding</text>
<rect x="38" y="102" width="548" height="238" rx="12" class="card"/><rect x="614" y="102" width="548" height="238" rx="12" class="card"/>
<text x="60" y="143" class="value">Antenna / packaging</text>
<text x="60" y="181" class="label">Study frequency</text><text x="560" y="181" class="label" text-anchor="end">2.205 GHz</text>
<text x="60" y="215" class="label">Realized gain target</text><text x="560" y="215" class="label" text-anchor="end">${c.peakGain.toFixed(1)} dBic</text>
<text x="60" y="249" class="label">HPBW / pointing</text><text x="560" y="249" class="label" text-anchor="end">${c.beamwidth.toFixed(0)}° / 2-axis gimbal</text>
<text x="60" y="283" class="label">Envelope / mass target</text><text x="560" y="283" class="label" text-anchor="end">100×100×181 mm / ≤1.5 kg</text>
<text x="60" y="316" class="small">Mounted S11, axial ratio and pattern remain test items.</text>
<text x="636" y="143" class="value">Earth–Moon link @ 4 kbps</text>
<text x="636" y="181" class="label">EIRP / FSPL</text><text x="1136" y="181" class="label" text-anchor="end">${on.eirp.toFixed(2)} / ${on.pathLoss.toFixed(2)} dB</text>
<text x="636" y="215" class="label">Ground G/T</text><text x="1136" y="215" class="label" text-anchor="end">22 dB/K · assumed</text>
<text x="636" y="249" class="label">C/N₀ / Eb/N₀</text><text x="1136" y="249" class="label" text-anchor="end">${on.cn0.toFixed(2)} dB-Hz / ${on.ebno.toFixed(2)} dB</text>
<text x="636" y="283" class="label">After 3 dB reserve</text><text x="1136" y="283" class="value green" text-anchor="end">${signed(headroom)} dB</text>
<text x="636" y="316" class="small">5 W RF requires ≈14.29 W PA DC at 35% efficiency.</text>
<text x="38" y="377" class="label">CLEAR-LOS TILT SENSITIVITY · HEADROOM AFTER 3 dB RESERVE</text>${compactGrid}
<line x1="80" y1="${SY(0)}" x2="1130" y2="${SY(0)}" stroke="#c92a2a" stroke-width="2" stroke-dasharray="8 6"/>
<path d="${compactPath('f')}" fill="none" stroke="#e8590c" stroke-width="5"/><path d="${compactPath('g')}" fill="none" stroke="#66a80f" stroke-width="5"/>
<circle cx="${SX(65)}" cy="${SY(fixed65.rawMargin-c.reserveDb)}" r="6" fill="#e8590c"/><circle cx="${SX(65)}" cy="${SY(on.rawMargin-c.reserveDb)}" r="6" fill="#66a80f"/>
<text x="720" y="421" class="label orange">Fixed: 65° = ${signed(fixedHeadroom)} dB</text><text x="930" y="421" class="label green">Gimbal: ${signed(headroom)} dB</text>
<rect x="470" y="548" width="646" height="55" rx="8" fill="#fff4e6" opacity="0.96"/><text x="488" y="571" class="small">Installed 65° green-zone case is hull-blocked.</text><text x="488" y="592" class="small">Graph shows clear-LOS potential; mount/FOV optimization is required.</text>
<text x="605" y="680" class="small" text-anchor="middle">Source tags: Sánchez-Sevilleja et al. (2025) antenna benchmark · team reduced-order simulation</text>`);

const CX=a=>78+a/80*790,CY=v=>445-(v+14)/22*300;
const cropPath=k=>pts.map((p,i)=>`${i?'L':'M'}${CX(p.a).toFixed(1)},${CY(p[k]).toFixed(1)}`).join(' ');
let cropGrid='';
for(const y of [-12,-6,0,6])cropGrid+=`<line x1="78" y1="${CY(y)}" x2="868" y2="${CY(y)}" class="grid"/><text x="62" y="${CY(y)+5}" class="small" text-anchor="end">${y}</text>`;
for(const x of [0,20,40,60,80])cropGrid+=`<line x1="${CX(x)}" y1="145" x2="${CX(x)}" y2="445" class="grid"/><text x="${CX(x)}" y="472" class="small" text-anchor="middle">${x}°</text>`;
await saveSvg('p14-compact-link-margin-vs-tilt',`
<rect x="28" y="24" width="1144" height="512" rx="14" class="card"/>
<text x="52" y="64" class="label">OUR ANALYSIS · CLEAR LINE OF SIGHT</text>
<text x="52" y="95" class="small">2.205 GHz · 384,400 km · 4 kbps · 5 W RF · ${c.peakGain.toFixed(1)} dBic target · G/T 22 dB/K assumed · 3 dB reserve</text>
${cropGrid}<line x1="78" y1="${CY(0)}" x2="868" y2="${CY(0)}" stroke="#c92a2a" stroke-width="2" stroke-dasharray="8 6"/>
<path d="${cropPath('f')}" fill="none" stroke="#e8590c" stroke-width="6"/><path d="${cropPath('g')}" fill="none" stroke="#66a80f" stroke-width="6"/>
<circle cx="${CX(65)}" cy="${CY(fixed65.rawMargin-c.reserveDb)}" r="7" fill="#e8590c"/><circle cx="${CX(65)}" cy="${CY(on.rawMargin-c.reserveDb)}" r="7" fill="#66a80f"/>
<text x="720" y="130" class="small" text-anchor="end">Headroom after reserve (dB)</text><text x="473" y="503" class="small" text-anchor="middle">Lander tilt / fixed-antenna mispointing</text>
<rect x="900" y="119" width="240" height="326" rx="10" fill="#fff" stroke="#d7dfe5" stroke-width="1.5"/>
<text x="922" y="160" class="label orange">FIXED PATCH</text><text x="922" y="199" class="value orange">${signed(fixedHeadroom)} dB</text><text x="922" y="226" class="small">at 65° · FAIL</text>
<line x1="922" y1="254" x2="1118" y2="254" class="grid"/>
<text x="922" y="294" class="label green">GIMBAL ON-AXIS</text><text x="922" y="333" class="value green">${signed(headroom)} dB</text><text x="922" y="360" class="small">at 65° · PASS*</text>
<text x="922" y="405" class="small">*RF budget only</text><text x="922" y="429" class="small">with clear LOS</text>
<rect x="28" y="552" width="1144" height="90" rx="12" class="warn"/><text x="52" y="588" class="label orange">Installed 65° green-zone case: hull-blocked</text><text x="52" y="617" class="small">Gimbal restores pointing gain, but cannot see through the lander. Mount/FOV optimization remains required.</text>`,1200,670);

await saveSvg('p10-power-and-rf-boundary',`
<text x="38" y="52" class="title">Power boundary · payload motion vs host RF service</text>
<text x="38" y="83" class="sub">Do not mix RF output watts with DC input watts in the proposal table</text>
<rect x="38" y="112" width="540" height="420" rx="12" class="card"/><rect x="622" y="112" width="540" height="420" rx="12" class="card"/>
<text x="62" y="158" class="value">Lander-powered payload branch</text><text x="62" y="202" class="label">Functional peak</text><text x="548" y="202" class="label" text-anchor="end">${electrical.peakFunctionalLoadW.toFixed(2)} W</text><text x="62" y="239" class="label">Local payload/gimbal heater</text><text x="548" y="239" class="label" text-anchor="end">${electrical.heaterLoadW.toFixed(1)} W</text><text x="62" y="276" class="label">Worst-case simultaneous total</text><text x="548" y="276" class="value orange" text-anchor="end">${electrical.peakLoadW.toFixed(2)} W</text><text x="62" y="319" class="label">Current / allocation</text><text x="548" y="319" class="label orange" text-anchor="end">${electrical.steadyA.toFixed(2)} / ${c.busCurrentLimitA.toFixed(1)} A</text><text x="62" y="362" class="label">Entered inrush</text><text x="548" y="362" class="label orange" text-anchor="end">${electrical.inrushA.toFixed(1)} A · FAIL</text><text x="62" y="405" class="label">Ideal hold-up</text><text x="548" y="405" class="label orange" text-anchor="end">${electrical.holdUpMs.toFixed(2)} / ${c.outageMs} ms</text><text x="62" y="468" class="small">Requires heater/motor sizing, operating modes and real bus ICD.</text>
<text x="646" y="158" class="value">Host radio / PA branch</text><text x="646" y="202" class="label">RF output used by link budget</text><text x="1132" y="202" class="value" text-anchor="end">5.00 W RF</text><text x="646" y="245" class="label">Assumed PA efficiency</text><text x="1132" y="245" class="label" text-anchor="end">35%</text><text x="646" y="288" class="label">PA DC input alone</text><text x="1132" y="288" class="value orange" text-anchor="end">≈14.29 W DC</text><text x="646" y="331" class="label">Feed/cable loss</text><text x="1132" y="331" class="label" text-anchor="end">1.00 dB</text><text x="646" y="374" class="label">Required interface</text><text x="1132" y="374" class="label" text-anchor="end">RF port + coax + duty cycle</text><text x="646" y="435" class="small">If host radio is unavailable, the proposed gimbal cannot close the link.</text><text x="646" y="468" class="small">Standalone backup requires its own transceiver/PA/modem budget.</text>
<rect x="38" y="560" width="1124" height="104" rx="10" class="warn"/><text x="58" y="598" class="label">Use on page 10 · Current slide's ≈1.67 W transmission row cannot represent a 5 W RF transmitter.</text><text x="58" y="632" class="small">Recommended wording: “independently pointed antenna path using host lander RF/power service,” unless onboard radio hardware is added.</text>`);

await saveSvg('p17-link-failure-gates',`
<text x="38" y="52" class="title">A successful link requires every gate to pass</text><text x="38" y="83" class="sub">Pointing recovery is one gate in an end-to-end communications chain</text>
${[['1','Earth visible','Above local horizon'],['2','Line of sight','No hull / terrain / burial'],['3','Mechanism','Travel + 2U clearance + no jam'],['4','Host services','Power + radio + data available'],['5','RF closure','Margin ≥ reserve + bandwidth']].map((x,i)=>{const xx=38+i*229;return `<rect x="${xx}" y="145" width="205" height="260" rx="12" class="card"/><circle cx="${xx+35}" cy="180" r="19" fill="#17283b"/><text x="${xx+35}" y="187" text-anchor="middle" class="white" style="font:700 18px Arial">${x[0]}</text><text x="${xx+18}" y="235" class="value">${x[1]}</text><text x="${xx+18}" y="275" class="small">${x[2]}</text><text x="${xx+18}" y="332" class="label">Required</text><text x="${xx+18}" y="368" class="small">Fail → no usable link</text>${i<4?`<line x1="${xx+209}" y1="286" x2="${xx+224}" y2="286" stroke="#17283b" stroke-width="3"/><polygon points="${xx+224},280 ${xx+224},292 ${xx+231},286" fill="#17283b"/>`:''}`}).join('')}
<rect x="38" y="444" width="1124" height="145" rx="12" class="warn"/><text x="62" y="486" class="value orange">Current 65° installed case: FAIL at Gate 2 — LANDER HULL</text><text x="62" y="526" class="label">The gimbal reaches the target and the clear-path RF budget closes, but the current green-zone mount has no clear ray.</text><text x="62" y="560" class="small">Use on page 17 · This is a design finding: optimize mount/FOV or add another aperture; do not hide the obstruction result.</text><text x="38" y="645" class="small">Reduced-order geometry and RF model; not terrain propagation, EM, mechanism or qualification evidence.</text>`);

const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
async function svgToPng(file){const page=await browser.newPage({viewport:{width:1200,height:700},deviceScaleFactor:2});await page.goto(pathToFileURL(file).href);await page.locator('svg').screenshot({path:file.replace(/\.svg$/,'.png')});await page.close();}
for(const name of ['p14-compact-link-margin-vs-tilt','p16-antenna-research-vs-our-concept','p16-link-budget-chain','p16-fixed-vs-gimbal-clear-los','p16-right-column-summary','p10-power-and-rf-boundary','p17-link-failure-gates'])await svgToPng(path.join(out,name+'.svg'));

const page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:2});
await page.goto(process.env.TEST_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});
await page.addStyleTag({content:'*{animation:none!important;transition:none!important}.toast{display:none!important}'});
await page.waitForFunction(()=>window.lunarLink?.webgl);
const shot=async(sel,name)=>{const el=page.locator(sel);await el.scrollIntoViewIfNeeded();await page.waitForTimeout(250);await el.screenshot({path:path.join(out,name+'.png')});};
const article=sel=>`${sel} >> xpath=ancestor::article[1]`;

await page.locator('[data-preset="nominal"]').click();await page.locator('#show-beam').uncheck();await page.locator('[data-view="detail"]').click();await shot('.viewport-card','p08-complete-2u-payload');
await page.locator('[data-view="mount"]').click();await shot('.viewport-card','p08-green-zone-installed-payload');

await page.locator('[data-preset="tilt"]').click();
await shot(article('#error-chart'),'p14-pointing-error-time-history');
await page.locator('[data-tab="analysis"]').click();await page.locator('#run-step').click();await page.waitForFunction(()=>window.lunarLink.stepResponse?.frames?.length>0);await shot(article('#step-chart'),'p14-controller-step-response');

await page.locator('[data-tab="radio"]').click();await page.locator('[data-preset="nominal"]').click();await page.waitForFunction(()=>window.lunarLink.rfStudy);await shot(article('#rf-scene'),'p16-radiation-pattern-3d');await shot(article('#rf-cuts'),'p16-principal-plane-cuts');await shot(article('#rf-metrics'),'p16-rf-operating-point');

await page.locator('[data-tab="analysis"]').click();await page.locator('[data-preset="tilt"]').click();await page.locator('#batch-count').selectOption('100');await page.locator('#run-batch').click();await page.waitForFunction(()=>window.lunarLink.batch?.rows?.length===100,{},{timeout:120000});await shot(article('#batch-chart'),'p17-monte-carlo-attitude-map');await shot(article('#batch-results'),'p17-monte-carlo-results');

await browser.close();

for(const [source,target] of [['test-results/payload-assembly-study.png','p08-assembly-clearance-study.png'],['test-results/payload-circuit-exploded.png','p08-electronics-exploded-view.png']]){
  try{await copyFile(path.join(root,source),path.join(out,target));}catch{}
}
console.log(`Exported slide assets to ${out}`);
