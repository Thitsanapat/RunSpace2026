import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULTS,validateConfig,runSimulation,presetConfig} from '../src/engine.js';
import {SURFACE,surfaceAssessment} from '../src/surface-payload.js';
import {engineeringReport} from '../src/engineering-ui.js';

test('top zone checks the project mass separately from the service limit',()=>{
  const a=surfaceAssessment(DEFAULTS);
  assert.equal(a.projectMassPass,true);assert.equal(a.serviceMarginKg,2.5);assert.equal(a.projectMarginKg,0);
  assert.equal(a.candidateFit,true);assert.equal(a.hardwareVerified,false);assert.equal(a.verticalAllowanceMm,0);
  assert.deepEqual(a.lateralClearanceMm,[50,50]);
  const over=surfaceAssessment({...DEFAULTS,payloadMassKg:1.51});assert.equal(over.projectMassPass,false);assert.equal(over.serviceMassPass,true);assert.equal(over.candidateFit,false);
  assert.equal(surfaceAssessment({...DEFAULTS,payloadMassKg:4.01}).serviceMassPass,false);
  assert.throws(()=>validateConfig({...DEFAULTS,payloadMassKg:-1}),/payloadMassKg/);
});
test('moving mass is a subset of total mass and shock interface load uses total mass',()=>{
  const c={...DEFAULTS,shockG:12},a=surfaceAssessment(c);
  assert.ok(Math.abs(a.peakInterfaceForceN-176.5197)<1e-8);assert.equal(a.lunarWeightN,2.43);
  assert.equal(surfaceAssessment({...c,movingMass:1.6}).massConsistent,false);
  assert.equal(surfaceAssessment({...c,movingMass:0.02}).massConsistent,false);
  assert.equal(surfaceAssessment({...c,payloadMassKg:1.2}).peakInterfaceForceN,1.2*12*9.80665);
});
test('service envelope includes mount offsets and requires contact with the assumed deck',()=>{
  assert.equal(surfaceAssessment({...DEFAULTS,mountX:SURFACE.mount[0]+0.05}).envelopeFits,true);
  assert.equal(surfaceAssessment({...DEFAULTS,mountX:SURFACE.mount[0]+0.051}).envelopeFits,false);
  assert.equal(surfaceAssessment({...DEFAULTS,mountY:SURFACE.mount[1]+0.005}).mountOnDeck,false);
  assert.equal(surfaceAssessment({...DEFAULTS,mountZ:0.73}).candidateFit,false);
});
test('simulation and engineering report preserve the surface interface assessment',()=>{
  const c={...presetConfig('nominal'),duration:5,shockG:12,payloadMassKg:1.4},r=runSimulation(c);
  assert.deepEqual(r.summary.surfaceInterface,surfaceAssessment(c));
  const report=engineeringReport(c,r,{});assert.match(report,/Surface payload interface/);assert.match(report,/Entered total mass 1.4 kg/);assert.match(report,/not provider|not the total|not stress/);
  assert.equal(validateConfig({frequencyGHz:2.205}).payloadMassKg,1.5);
});
test('top-zone fit does not imply a recoverable RF link after a 65 degree tip',()=>{
  const r=runSimulation(DEFAULTS),f=r.frames.at(-1);
  assert.equal(r.summary.surfaceInterface.candidateFit,true);
  assert.ok(f.error<0.5);assert.equal(f.blockedReason,'LANDER HULL');assert.equal(f.link.available,false);assert.equal(f.link.margin,null);
});
