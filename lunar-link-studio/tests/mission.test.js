import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULTS,bodyAt,runSimulation,presetConfig,applyAntennaProfile,linkBudget} from '../src/engine.js';
import {packaging,thermalRates} from '../src/mission.js';
import {beamMetrics} from '../src/research.js';
import {RAD} from '../src/math.js';
test('touchdown vibration terminates exactly and lock prevents motion before release',()=>{
  const c={...DEFAULTS},end=c.eventTime+Math.max(c.jitterDuration,c.rampTime);
  assert.deepEqual(bodyAt(end,c).q,bodyAt(end+10,c).q);assert.equal(bodyAt(end+1,c).vibration,0);
  const r=runSimulation(c),first=r.frames[0];assert.ok(r.summary.releaseTime>=c.eventTime+c.rampTime+c.restHold-0.005);
  for(const f of r.frames.filter(f=>f.locked)){assert.equal(f.az,first.az);assert.equal(f.el,first.el);assert.deepEqual(f.torque,[0,0]);}
});
test('2U accepts a stowed 80 mm plate but rejects its diagonal sweep',()=>{
  const c={...DEFAULTS};assert.equal(packaging(0,0,c).fits,true);
  assert.equal(packaging(45*RAD,90*RAD,c).fits,false);
  assert.ok(Math.abs(packaging(0,0,c).sweptDiameterMm-113.325)<0.01);
  const r=runSimulation(presetConfig('nose'));assert.ok(r.frames.some(f=>f.packagingLimited));
  assert.ok(r.frames.every(f=>f.packaging.fits));
});
test('burial, hull obstruction and host loss cannot be cured by perfect pointing',()=>{
  const inverted=runSimulation(presetConfig('inverted')).frames.at(-1);
  assert.match(inverted.blockedReason,/GROUND/);assert.equal(inverted.link.margin,null);
  const nose=runSimulation(presetConfig('nose')).frames.at(-1);assert.match(nose.blockedReason,/HULL/);assert.equal(nose.link.available,false);
  const loss=runSimulation(presetConfig('blackout')).frames.at(-1);assert.equal(loss.hostPowered,false);assert.equal(loss.rfPowered,false);assert.equal(loss.heater,false);
});
test('thermal interface transfers heat conservatively and can be disconnected',()=>{
  const c={...DEFAULTS},on=thermalRates(-20,20,c,{connected:true}),off=thermalRates(-20,20,c,{connected:false});
  assert.equal(on.conduction,8);assert.equal(off.conduction,0);
  assert.ok(Math.abs((on.derivative-off.derivative)*c.heatCapacity+(on.landerDerivative-off.landerDerivative)*c.landerHeatCapacity)<1e-12);
});
test('host radio remains on after payload allocation expires, while controller stops',()=>{
  const r=runSimulation({...presetConfig('nominal'),roll:0,pitch:0,jitter:0,batteryWh:0.001,cgOffset:0,hostRadio:1});
  const f=r.frames.at(-1);assert.equal(f.powered,false);assert.equal(f.rfPowered,true);assert.equal(f.link.available,true);assert.equal(f.power,0);
});
test('paper profiles retain provenance and cosine approximation has physical gain',()=>{
  const c=applyAntennaProfile(DEFAULTS,'anser'),b=beamMetrics(c,linkBudget(0,c).rawMargin);
  assert.equal(c.frequencyGHz,2.205);assert.equal(c.antennaWidthMm,80);assert.ok(Math.abs(b.impliedEfficiency-0.65)<0.001);
  assert.ok(b.lossAtHalfDegree<0.001);assert.ok(b.maxMispoint>c.beamwidth/2);
  const t=applyAntennaProfile(c,'tigrisat');assert.equal(t.frequencyGHz,2.45);assert.equal(t.beamwidth,60);assert.equal(packaging(0,0,t).fits,false);
});
