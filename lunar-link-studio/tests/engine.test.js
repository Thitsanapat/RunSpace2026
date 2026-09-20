import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULTS,Simulator,fspl,antennaGain,linkBudget,runSimulation,runStepResponse,presetConfig,validateConfig,parsePatternCSV,thermalDerivative,runThermal,patchEstimate,csvExport} from '../src/engine.js';
import {attitude,rotate,qInv,direction,separation,RAD,rayBox} from '../src/math.js';

test('quaternion transforms preserve vectors and match a known yaw rotation',()=>{
  const q=attitude(23,-42,110),v=direction(30*RAD,20*RAD),back=rotate(rotate(v,q),qInv(q));
  assert.ok(separation(v,back)<1e-5);const r=rotate([0,0,1],attitude(0,0,90));assert.ok(Math.abs(r[0]-1)<1e-12);assert.ok(Math.abs(r[2])<1e-12);
});
test('free-space loss agrees with known 1 GHz / 1 km result',()=>{
  assert.ok(Math.abs(fspl(1,1)-92.44778)<0.0001);
  assert.ok(Math.abs(fspl(2,1)-fspl(1,1)-6.0206)<0.0001);
});
test('half-power beamwidth and link budget do not count pointing loss twice',()=>{
  const c={...DEFAULTS},on=linkBudget(0,c),edge=linkBudget(c.beamwidth/2,c);
  assert.ok(Math.abs(antennaGain(c.beamwidth/2,c)-c.peakGain+3.010299956)<1e-8);
  assert.ok(Math.abs(on.margin-edge.margin-3.010299956)<1e-8);
  assert.ok(Math.abs(linkBudget(0,{...c,bitrateKbps:c.bitrateKbps*2}).margin-on.margin+3.010299956)<1e-8);
});
test('blocked and unpowered links cannot pass even with excess RF gain',()=>{
  const c={...DEFAULTS,receiverGT:60};for(const b of [linkBudget(0,c,true),linkBudget(0,c,false,false)]){assert.equal(b.available,false);assert.equal(b.margin,null);assert.equal(b.maxRateKbps,0);}
  const sim=new Simulator({...c,targetEl:-5});assert.equal(sim.snapshot().blocked,true);
});
test('ray-box obstruction distinguishes outward and inward rays',()=>{
  assert.equal(rayBox([0,2,0],[0,-1,0],[-1,-1,-1],[1,1,1]),true);
  assert.equal(rayBox([0,2,0],[0,1,0],[-1,-1,-1],[1,1,1]),false);
});
test('edge-mount comparison starts aligned and recovers when the tilted hull leaves LOS clear',()=>{
  // Independent clear-path case just beyond the photo-proportion hull, outside the selected bay.
  const r=runSimulation({...DEFAULTS,mountZ:1.01,jitter:0});const first=r.frames[0],last=r.frames.at(-1);
  assert.ok(first.error<1e-5);assert.ok(first.fixedError<1e-5);
  assert.equal(last.link.available,true);assert.equal(last.fixedLink.available,false);
  assert.ok(last.error<1);assert.ok(last.fixedError>30);assert.ok(r.summary.availability>r.summary.fixedAvailability);
  assert.ok(r.summary.peakTorque<=DEFAULTS.torqueLimit+1e-10);
});
test('seeded trajectories are deterministic; jam and travel limits remain visible',()=>{
  const c={...presetConfig('jam'),duration:6};const a=runSimulation(c),b=runSimulation(c);
  assert.deepEqual(a.summary,b.summary);assert.ok(a.frames.at(-1).jammed);assert.ok(a.frames.at(-1).error>20);
  const limited=runSimulation({...presetConfig('limit'),duration:6});assert.equal(limited.frames.at(-1).reachable,false);
});
test('energy cannot exceed budget and depletion disables RF',()=>{
  const r=runSimulation({...presetConfig('nominal'),hostRadio:0,batteryWh:0.001,duration:5});const f=r.frames.at(-1);
  assert.equal(f.energy,0.001);assert.equal(f.link.available,false);assert.equal(f.powered,false);assert.equal(f.power,0);
});
test('thermal energy balance and heater produce expected signs',()=>{
  const c={...DEFAULTS,sunlight:0,conductance:0,groundView:0};assert.ok(thermalDerivative(20,c).derivative<0);
  const off=thermalDerivative(-30,c,0,false),on=thermalDerivative(-30,c,0,true);
  assert.equal(on.derivative,off.derivative);
  assert.ok(Math.abs(on.landerDerivative-off.landerDerivative-c.heaterW/c.landerHeatCapacity)<1e-12);
  const r=runThermal({...c,batteryWh:0.001},6);assert.ok(r.energyWh<=0.001);assert.equal(r.frames.at(-1).powered,false);
});
test('input validation rejects non-finite and physically invalid configurations',()=>{
  assert.throws(()=>validateConfig({inertia:0}));assert.throws(()=>validateConfig({frequencyGHz:NaN}));assert.throws(()=>validateConfig({scenario:'unknown'}));assert.throws(()=>validateConfig({duration:5,eventTime:6}));
});
test('CSV patterns require complete coverage and interpolate gain',()=>{
  const p=parsePatternCSV('angle_deg,gain_dbi\n0,10\n90,-10\n180,-30');assert.equal(antennaGain(45,{...DEFAULTS,pattern:p}),0);
  assert.throws(()=>parsePatternCSV('0,10\n10,5\n10,0'));
  assert.throws(()=>parsePatternCSV('0,10\n90,\n180,-30'));
});
test('patch estimate produces plausible dimensions and scales with frequency',()=>{
  const p=patchEstimate(2.245,3.55,1.52);assert.ok(p.widthMm>40&&p.widthMm<50);assert.ok(p.lengthMm>30&&p.lengthMm<40);assert.ok(p.effectiveEr<3.55&&p.effectiveEr>1);
  assert.throws(()=>patchEstimate(0,3.55,1.52));
});
test('CSV has consistent columns with empty values for unavailable links',()=>{
  const r=runSimulation({...DEFAULTS,targetEl:-5,duration:5});const lines=csvExport(r).split('\n');const count=lines[0].split(',').length;
  assert.ok(lines.every(line=>line.split(',').length===count));assert.equal(lines[1].split(',')[8],'');
});
test('defined step response is measured and does not manufacture a 50 ms pass',()=>{
  const r=runStepResponse(DEFAULTS,5);assert.equal(r.frames[0].error,5);assert.ok(r.settlingMs>50);assert.equal(r.passes50ms,false);assert.ok(r.riseMs>0);assert.ok(r.finalError<DEFAULTS.pointingRequirement);
  assert.throws(()=>runStepResponse({...DEFAULTS,targetAz:-179},5));
});
test('default trajectory converges when integration timestep is halved',()=>{
  const c={...DEFAULTS,duration:6,jitter:0,sensorNoise:0};
  function solve(dt){const s=new Simulator(c);while(s.t<c.duration-1e-9)s.step(Math.min(dt,c.duration-s.t));return s.snapshot();}
  const a=solve(0.002),b=solve(0.001);assert.ok(Math.abs(a.error-b.error)<0.05);assert.ok(Math.abs(a.energy-b.energy)<0.0001);
});
