import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULTS,linkBudget,validateConfig,runSimulation,presetConfig} from '../src/engine.js';
import {patternGain,rfState,validateGrid,parseGridCSV,parseResponseCSV,antennaCoordinates,patternMetrics,exportPatternCSV,gridImportPatch,directionalGain} from '../src/antenna-rf.js';
const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} vs ${b}`);
const iso=()=>validateGrid({frequencyGHz:2.205,rows:[0,90,180].flatMap(t=>[0,90,180,270].map(p=>[t,p,0]))});
test('two-plane pattern has the requested half-power widths and enters link gain',()=>{
 const c={...DEFAULTS,pattern:null,patternShape:'elliptical',beamwidth:80,beamwidthV:40};near(patternGain(40,0,c),c.peakGain-3.0102999566);near(patternGain(20,90,c),c.peakGain-3.0102999566);
 assert.ok(linkBudget(30,c,false,true,90).margin<linkBudget(30,c,false,true,0).margin);
 const r=runSimulation({...presetConfig('tilt'),pattern:null,patternShape:'elliptical',beamwidthV:40}),f=r.frames.at(-1);near(f.link.gain,patternGain(f.error,f.rfAngles.phi,r.config));
});
test('antenna coordinates distinguish equal angular errors in orthogonal cuts',()=>{
 const s=Math.SQRT1_2,a=antennaCoordinates([s,0,s],0,0),b=antennaCoordinates([0,s,s],0,0);near(a.theta,45);near(b.theta,45);near(a.phi,0);near(b.phi,90);
 const aligned=antennaCoordinates([1,0,0],Math.PI/2,0);near(aligned.theta,0);
});
test('3D grid interpolation is cyclic in phi and validates physical pole consistency',()=>{
 const g=iso();g.rows=g.rows.map(([t,p,v])=>[t,p,t===90?p===0?4:0:v]);const c={...DEFAULTS,patternGrid:validateGrid(g)};
 near(patternGain(90,315,c),2);near(patternGain(90,-45,c),2);near(patternGain(45,0,c),2);
 assert.throws(()=>validateGrid({...g,rows:g.rows.slice(1)}));assert.throws(()=>validateGrid({...g,rows:g.rows.map((r,i)=>i===0?[0,0,9]:r)}));
 assert.throws(()=>parseGridCSV('frequency_ghz,theta_deg,phi_deg,gain_dbi\n2.2,0,0,1\n2.3,0,90,1'));
});
test('solid-angle integral of a 0 dBi isotropic grid equals unity',()=>{
 const m=patternMetrics({...DEFAULTS,patternGrid:iso()});near(m.integratedEfficiency,1,0.0002);near(m.directivityDbi,0,0.001);
});
test('mismatch loss is applied once only for accepted-power gain',()=>{
 const c={...DEFAULTS,s11Db:-10},realized=linkBudget(0,c),accepted=linkBudget(0,{...c,gainConvention:'accepted'});near(realized.margin-accepted.margin,-10*Math.log10(0.9));near(realized.rf.vswr,(1+Math.sqrt(0.1))/(1-Math.sqrt(0.1)));near(realized.rf.appliedMismatchLoss,0);
});
test('ideal CP match is lossless and opposite CP cannot pass via the same total gain',()=>{
 const same={...DEFAULTS,polarizationMode:'same',axialRatioDb:0},opposite={...same,polarizationMode:'opposite'};near(rfState(same).polarizationLoss,0);assert.ok(rfState(opposite).polarizationLoss>=100);assert.equal(linkBudget(0,opposite).available,false);
 near(rfState({...same,axialRatioDb:40}).polarizationLoss,3.0103,0.09);
});
test('receiver power and noise reproduce C/N and bandwidth can independently fail',()=>{
 const c={...DEFAULTS},l=linkBudget(0,c);near(l.receivedDbm-l.noiseDbm,l.cnDb);near(l.cnDb,l.cn0-10*Math.log10(c.receiverBandwidthKHz*1000));
 const hot=linkBudget(0,{...c,receiverTempK:200});near(hot.margin,l.margin);near(hot.noiseDbm-l.noiseDbm,3.0102999566);
 const narrow=linkBudget(0,{...c,receiverBandwidthKHz:1});assert.ok(narrow.margin>c.reserveDb);assert.equal(narrow.available,false);assert.ok(narrow.maxRateKbps<1);
});
test('frequency response interpolates without extrapolation and thermal shift changes lookup',()=>{
 const response=parseResponseCSV('frequency_ghz,s11_db,gain_dbi,axial_ratio_db\n2.0,-10,6,3\n2.1,-20,8,1\n2.2,-10,6,3');
 const c={...DEFAULTS,frequencyGHz:2.05,frequencyResponse:response};near(rfState(c).boresightGain,7);near(linkBudget(0,c).gain,7);
 assert.equal(linkBudget(0,{...c,frequencyGHz:2.3}).margin,null);
 const shifted=rfState({...c,frequencyGHz:2.205,rfTempCoeffPpm:500,rfReferenceTemp:0},100);near(shifted.queryFrequencyGHz,2.1);near(shifted.boresightGain,8);
 assert.equal(linkBudget(0,{...DEFAULTS,patternGrid:iso(),frequencyGHz:2.3}).margin,null);
 assert.throws(()=>parseResponseCSV('frequency_ghz,s11_db,gain_dbi,axial_ratio_db\n2.0,-10,6,3\n2.0,-20,8,1'));
 assert.throws(()=>validateConfig({...DEFAULTS,modulationBits:1.5}));
});
test('validated profile changes can explicitly clear prior RF evidence',()=>{
 const cleared=validateConfig({...DEFAULTS,pattern:null,patternGrid:null,frequencyResponse:null});
 assert.equal(cleared.pattern,null);assert.equal(cleared.patternGrid,null);assert.equal(cleared.frequencyResponse,null);
});
test('evaluated pattern integral follows frequency gain and losses while directivity is unchanged',()=>{
 const base=patternMetrics(DEFAULTS),c={...DEFAULTS,gainConvention:'accepted',s11Db:-10,installationLossDb:3,frequencyResponse:[{frequencyGHz:2,s11Db:-10,gainDbi:8.5,axialRatioDb:2},{frequencyGHz:2.4,s11Db:-10,gainDbi:8.5,axialRatioDb:2}]},m=patternMetrics(c,40);
 const delta=8.5-base.peakGain-3+10*Math.log10(0.9);near(m.peakGain-base.peakGain,delta);near(m.integratedEfficiency/base.integratedEfficiency,10**(delta/10));near(m.directivityDbi,base.directivityDbi);
 assert.equal(patternMetrics({...c,frequencyGHz:3}).supported,false);assert.equal(patternMetrics({...c,frequencyGHz:3}).peakGain,null);
});
test('evaluated CSV round-trip preserves directional gain and CP loss without double subtraction',()=>{
 const c={...DEFAULTS,patternShape:'elliptical',beamwidthV:45,installationLossDb:2,gainConvention:'accepted',polarizationMode:'same',frequencyResponse:[{frequencyGHz:2,s11Db:-10,gainDbi:6,axialRatioDb:2},{frequencyGHz:2.4,s11Db:-20,gainDbi:8,axialRatioDb:4}]};
 const csv=exportPatternCSV(c,35),grid=parseGridCSV(csv),restored=validateConfig({...c,...gridImportPatch(grid)});
 assert.equal(restored.gainConvention,'realized');assert.equal(restored.installationLossDb,0);assert.equal(restored.frequencyResponse,null);assert.equal(restored.patternGrid.snapshot.temperatureC,35);
 for(const theta of [0,30,60,180])for(const phi of [0,45,90,315]){near(directionalGain(theta,phi,c,35),directionalGain(theta,phi,restored,35));near(linkBudget(theta,c,false,true,phi,35).margin,linkBudget(theta,restored,false,true,phi,35).margin);}
 assert.equal(validateConfig(restored).patternGrid.snapshot.kind,'lunar-link-evaluated-pattern');
});
test('unsupported export and malformed snapshot metadata fail explicitly',()=>{
 assert.throws(()=>exportPatternCSV({...DEFAULTS,patternGrid:iso(),frequencyGHz:3},20),/supported/);
 const csv=exportPatternCSV(DEFAULTS,20);assert.throws(()=>parseGridCSV(csv.replace('"version":1','"version":9')),/metadata/);
 assert.throws(()=>parseGridCSV(csv.replace('"s11Db":-13.98','"s11Db":1')),/metadata/);
 const generic=parseGridCSV(csv.split('\n').filter(l=>!l.startsWith('# lunar-link-metadata:')).join('\n'));assert.equal(gridImportPatch(generic).gainConvention,undefined);
});
