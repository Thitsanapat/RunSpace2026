import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULTS,validateConfig,applyAntennaProfile} from '../src/engine.js';
import {assemblyFit,assemblyStudy,electricalStudy} from '../src/payload-design.js';

test('compact mission allocation passes the sampled sweep; 80 mm benchmark fails',()=>{
  const mission=assemblyStudy(DEFAULTS,15);
  assert.equal(mission.allSampledFit,true);assert.equal(mission.sampledPassPercent,100);assert.ok(mission.minimumClearanceMm>0);
  const anser=applyAntennaProfile(DEFAULTS,'anser'),fit=assemblyFit(anser,0,0);
  assert.equal(fit.fits,false);
  const motor=fit.failures.find(f=>f.part==='Pitch motor allocation');
  assert.ok(Math.abs(motor.clearanceMm+6)<1e-9);
  const study=assemblyStudy(anser,15);
  assert.ok(study.plateDiagonalMm>113);
  assert.equal(study.allSampledFit,false);
  assert.ok(study.sampledPassPercent>=0&&study.sampledPassPercent<100);
});
test('small plate proxy can fit, but yaw cable allocation still limits travel',()=>{
  const c={...DEFAULTS,antennaWidthMm:60,antennaHeightMm:60,rfBendRadiusMm:2};
  assert.equal(assemblyFit(c,0,0).fits,true);
  assert.equal(assemblyFit({...c,cableTwistLimitDeg:30},40,0).cablePass,false);
});
test('host capacitor outage screening matches independent energy balance',()=>{
  const c={...DEFAULTS,heaterW:0,electronicsW:9,regulatorEfficiency:0.9,busMinV:20,harnessOhm:0,brownoutV:10,holdCapUf:1000,inrushA:0,busCurrentLimitA:0.6,outageMs:10};
  const e=electricalStudy(c,{frames:[{power:10}]});
  assert.equal(e.loadedV,20);assert.equal(e.steadyA,0.5);
  assert.equal(e.holdUpMs,15);assert.equal(e.outagePass,true);
  assert.equal(e.currentPass,true);
  assert.equal(electricalStudy({...c,inrushA:0.8},{frames:[{power:10}]}).currentPass,false);
  const drop=electricalStudy({...c,harnessOhm:1},{frames:[{power:10}]});
  assert.ok(drop.loadedV<20);assert.ok(drop.holdUpMs<15);
  const collapse=electricalStudy({...c,harnessOhm:20},{frames:[{power:10}]});
  assert.equal(collapse.loadedV,null);assert.equal(collapse.voltagePass,false);assert.equal(collapse.outagePass,false);
});
test('lander bus sizing includes the local payload heater',()=>{
  const r={frames:[{power:5}]},off=electricalStudy({...DEFAULTS,heaterW:0},r),on=electricalStudy({...DEFAULTS,heaterW:30},r);
  assert.equal(on.peakFunctionalLoadW,5);assert.equal(on.heaterLoadW,30);assert.equal(on.peakLoadW,35);
  assert.ok(on.steadyA>off.steadyA);assert.equal(on.currentPass,false);
});
test('interface input validation rejects contradictory voltage thresholds',()=>{
  assert.throws(()=>validateConfig({busMinV:30,busMaxV:20}));
  assert.throws(()=>validateConfig({busMinV:20,brownoutV:21}));
});
