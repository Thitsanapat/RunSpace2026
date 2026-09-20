import {clamp,RAD,DEG,rotate,qInv,attitude} from './math.js';
export const RF_DEFAULTS={patternShape:'symmetric',beamwidthV:82.44,backlobeFloorDb:40,gainConvention:'realized',s11Db:-15,axialRatioDb:3,polarizationMode:'fixed',installationLossDb:0,receiverTempK:100,receiverBandwidthKHz:100,codingRate:0.5,modulationBits:2,rolloff:0.35,rfTempCoeffPpm:0,rfReferenceTemp:20,patternGrid:null,frequencyResponse:null};
export const RF_BOUNDS={beamwidthV:[5,160],backlobeFloorDb:[10,80],s11Db:[-80,-0.01],axialRatioDb:[0,40],installationLossDb:[0,30],receiverTempK:[3,3000],receiverBandwidthKHz:[0.1,100000],codingRate:[0.05,1],modulationBits:[1,6],rolloff:[0,1],rfTempCoeffPpm:[-500,500],rfReferenceTemp:[-100,150]};
const interpolate=(a,b,t)=>a+(b-a)*t;
const polarAxes=new WeakMap(),frequencyAxes=new WeakMap(),gridAxes=new WeakMap();
function cachedAxis(rows,key,cache){let axis=cache.get(rows);if(!axis){axis=rows.map(r=>r[key]);cache.set(rows,axis);}return axis;}
function bracket(xs,x){let lo=0,hi=xs.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(xs[mid]>x)hi=mid;else lo=mid;}return [lo,hi,clamp((x-xs[lo])/(xs[hi]-xs[lo]),0,1)];}
function csvRows(text,header){const lines=text.trim().split(/\r?\n/).filter(l=>l.trim()&&!l.trim().startsWith('#'));if(lines.shift()?.trim()!==header)throw new Error(`Expected CSV header: ${header}`);return lines.map(line=>{const cells=line.split(',');if(cells.some(s=>!s.trim()))throw new Error('Missing CSV value');return cells.map(Number);});}
export function validateGrid(grid){
  if(!grid||!Number.isFinite(grid.frequencyGHz)||grid.frequencyGHz<0.1||grid.frequencyGHz>40||!Array.isArray(grid.rows)||grid.rows.length<12||grid.rows.length>40000)throw new Error('3D grid: 12–40,000 rows and frequency 0.1–40 GHz required');
  const rows=grid.rows.map(r=>[...r]);
  if(rows.some(r=>r.length!==3||r.some(v=>!Number.isFinite(v))||r[0]<0||r[0]>180||r[1]<0||r[1]>=360||r[2]<-150||r[2]>80))throw new Error('Grid values: theta 0–180, phi 0–<360, gain −150–80 dBi');
  const theta=[...new Set(rows.map(r=>r[0]))].sort((a,b)=>a-b),phi=[...new Set(rows.map(r=>r[1]))].sort((a,b)=>a-b);
  if(theta.length<3||theta[0]!==0||theta.at(-1)!==180||phi.length<4||phi[0]!==0||rows.length!==theta.length*phi.length)throw new Error('Complete theta × phi grid required; theta includes 0/180; phi starts 0 and excludes 360');
  const map=new Map(rows.map(r=>[`${r[0]},${r[1]}`,r[2]]));if(map.size!==rows.length)throw new Error('Duplicate grid point');
  const gains=theta.map(t=>phi.map(p=>map.get(`${t},${p}`)));
  if(gains.some(row=>row.some(v=>v===undefined)))throw new Error('Incomplete grid');
  for(const row of [gains[0],gains.at(-1)])if(Math.max(...row)-Math.min(...row)>0.05)throw new Error('Gain at either pole must agree across phi (within 0.05 dB)');
  let snapshot=null;
  if(grid.snapshot){const s=grid.snapshot;if(s.kind!=='lunar-link-evaluated-pattern'||s.version!==1||![s.temperatureC,s.s11Db,s.axialRatioDb].every(Number.isFinite)||s.temperatureC< -273.15||s.temperatureC>1000||s.s11Db>=0||s.s11Db< -100||s.axialRatioDb<0||s.axialRatioDb>60)throw new Error('Invalid evaluated-pattern metadata');snapshot={kind:s.kind,version:1,temperatureC:s.temperatureC,s11Db:s.s11Db,axialRatioDb:s.axialRatioDb};}
  return {frequencyGHz:grid.frequencyGHz,rows,theta,phi,gains,...(snapshot?{snapshot}:{})};
}
export function parseGridCSV(text){const metadata=text.split(/\r?\n/).filter(l=>l.startsWith('# lunar-link-metadata:'));if(metadata.length>1)throw new Error('Duplicate evaluated-pattern metadata');let snapshot=null;if(metadata.length){try{snapshot=JSON.parse(metadata[0].slice('# lunar-link-metadata:'.length));}catch{throw new Error('Invalid evaluated-pattern metadata JSON');}}const rows=csvRows(text,'frequency_ghz,theta_deg,phi_deg,gain_dbi');if(rows.some(r=>r.length!==4)||new Set(rows.map(r=>r[0])).size!==1)throw new Error('Import one frequency per 3D grid');return validateGrid({frequencyGHz:rows[0]?.[0],rows:rows.map(r=>r.slice(1)),snapshot});}
export function gridImportPatch(grid){return {patternGrid:grid,pattern:null,frequencyGHz:grid.frequencyGHz,antennaProfile:'custom',...(grid.snapshot?{gainConvention:'realized',installationLossDb:0,frequencyResponse:null,rfTempCoeffPpm:0}:{})};}
export function exportPatternCSV(c,temp){
  const rf=rfState(c,temp);if(!rf.supported)throw new Error('Cannot export a pattern outside supported frequency data');
  const snapshot={kind:'lunar-link-evaluated-pattern',version:1,temperatureC:temp,s11Db:rf.s11Db,axialRatioDb:rf.axialRatioDb};
  const rows=['# GENERATED EVALUATION; NOT A NEW MEASUREMENT. Gain includes applied mismatch and installation loss.','# lunar-link-metadata:'+JSON.stringify(snapshot),'frequency_ghz,theta_deg,phi_deg,gain_dbi'];
  for(let theta=0;theta<=180;theta+=5)for(let phi=0;phi<360;phi+=5)rows.push([c.frequencyGHz,theta,phi,directionalGain(theta,phi,c,temp)].join(','));
  return rows.join('\n');
}
export function validateResponse(rows){
  if(!Array.isArray(rows)||rows.length<2||rows.length>10000)throw new Error('Frequency response needs 2–10,000 samples');
  const data=rows.map(r=>({...r})).sort((a,b)=>a.frequencyGHz-b.frequencyGHz);
  if(data.some((r,i)=>![r.frequencyGHz,r.s11Db,r.gainDbi,r.axialRatioDb].every(Number.isFinite)||r.frequencyGHz<0.1||r.frequencyGHz>40||r.s11Db>=0||r.s11Db< -100||r.gainDbi< -100||r.gainDbi>80||r.axialRatioDb<0||r.axialRatioDb>60||(i&&r.frequencyGHz===data[i-1].frequencyGHz)))throw new Error('Invalid frequency response values or duplicate frequency');
  return data;
}
export function parseResponseCSV(text){return validateResponse(csvRows(text,'frequency_ghz,s11_db,gain_dbi,axial_ratio_db').map(r=>{if(r.length!==4)throw new Error('Expected 4 columns');return {frequencyGHz:r[0],s11Db:r[1],gainDbi:r[2],axialRatioDb:r[3]};}));}
export function patternGain(theta,phi,c){
  theta=clamp(theta,0,180);phi=((phi%360)+360)%360;
  if(c.patternGrid){const g=c.patternGrid,[a,b,t]=bracket(g.theta,theta);let ph=gridAxes.get(g);if(!ph){ph=[...g.phi,360];gridAxes.set(g,ph);}const [i,j,u]=bracket(ph,phi);return interpolate(interpolate(g.gains[a][i],g.gains[a][j%g.phi.length],u),interpolate(g.gains[b][i],g.gains[b][j%g.phi.length],u),t);}
  if(c.pattern){const [i,j,t]=bracket(cachedAxis(c.pattern,'angle',polarAxes),theta);return interpolate(c.pattern[i].gain,c.pattern[j].gain,t);}
  const nH=Math.log(0.5)/Math.log(Math.cos(c.beamwidth*RAD/2)),nV=c.patternShape==='elliptical'?Math.log(0.5)/Math.log(Math.cos(c.beamwidthV*RAD/2)):nH;
  const n=nH*Math.cos(phi*RAD)**2+nV*Math.sin(phi*RAD)**2;
  return c.peakGain+Math.max(-(c.backlobeFloorDb??40),theta<90?10*n*Math.log10(Math.max(1e-30,Math.cos(theta*RAD))):-Infinity);
}
export function rfState(c,temp=c.initialTemp){
  const query=c.frequencyGHz/(1+(c.rfTempCoeffPpm??0)*1e-6*(temp-(c.rfReferenceTemp??20)));
  let s11=c.patternGrid?.snapshot?.s11Db??c.s11Db??-15,ar=c.patternGrid?.snapshot?.axialRatioDb??c.axialRatioDb??3,gain=c.peakGain,supported=true;
  if(c.frequencyResponse){const rows=c.frequencyResponse,[i,j,u]=bracket(cachedAxis(rows,'frequencyGHz',frequencyAxes),query);supported=query>=rows[0].frequencyGHz&&query<=rows.at(-1).frequencyGHz;s11=interpolate(rows[i].s11Db,rows[j].s11Db,u);ar=interpolate(rows[i].axialRatioDb,rows[j].axialRatioDb,u);gain=interpolate(rows[i].gainDbi,rows[j].gainDbi,u);}
  else if(c.patternGrid)supported=Math.abs(c.frequencyGHz-c.patternGrid.frequencyGHz)<1e-6;
  const gamma=10**(s11/20),mismatchLoss=-10*Math.log10(1-gamma*gamma),a=10**(ar/20);
  const plf=c.polarizationMode==='opposite'?(a-1)**2/(2*(a*a+1)):(a+1)**2/(2*(a*a+1));
  const polarizationLoss=c.polarizationMode==='fixed'||!c.polarizationMode?c.polLoss:-10*Math.log10(Math.max(1e-12,plf));
  return {s11Db:s11,axialRatioDb:ar,boresightGain:gain,queryFrequencyGHz:query,supported,vswr:(1+gamma)/(1-gamma),mismatchLoss,appliedMismatchLoss:c.gainConvention==='accepted'?mismatchLoss:0,polarizationLoss};
}
export function directionalGain(theta,phi,c,temp=c.initialTemp){const rf=rfState(c,temp);return patternGain(theta,phi,c)+(c.frequencyResponse?rf.boresightGain-patternGain(0,0,c):0)-rf.appliedMismatchLoss-(c.installationLossDb??0);}
export function antennaCoordinates(bodyLocalTarget,az,el){const v=rotate(bodyLocalTarget,qInv(attitude(0,-el*DEG,az*DEG)));return {theta:Math.acos(clamp(v[2],-1,1))*DEG,phi:(Math.atan2(v[1],v[0])*DEG+360)%360,vector:v};}
// Integrates gain over solid angle. Diagnostic only; it is not EM validation.
export function patternMetrics(c,temp=c.initialTemp){if(!rfState(c,temp).supported)return {supported:false,integratedEfficiency:null,directivityDbi:null,peakGain:null,peakTheta:null,peakPhi:null};let integral=0,peak=-Infinity,peakTheta=0,peakPhi=0;const dt=3*RAD,dp=5*RAD;for(let theta=1.5;theta<180;theta+=3)for(let phi=2.5;phi<360;phi+=5){const gain=directionalGain(theta,phi,c,temp);integral+=10**(gain/10)*Math.sin(theta*RAD)*dt*dp;if(gain>peak){peak=gain;peakTheta=theta;peakPhi=phi;}}
  const on=directionalGain(0,0,c,temp);if(on>peak){peak=on;peakTheta=0;peakPhi=0;}
  return {supported:true,integratedEfficiency:integral/(4*Math.PI),directivityDbi:peak-10*Math.log10(integral/(4*Math.PI)),peakGain:peak,peakTheta,peakPhi};
}
