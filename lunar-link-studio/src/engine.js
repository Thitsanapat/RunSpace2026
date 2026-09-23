import { RAD, DEG, clamp, attitude, rotate, qInv, direction, angles, separation, cross, dot, rayBox, seededRandom } from './math.js';
import {packaging,visibility,thermalRates} from './mission.js';
import {ANTENNA_PROFILES} from './research.js';
import {SURFACE,surfaceAssessment} from './surface-payload.js';
import {DESIGN_DEFAULTS,DESIGN_BOUNDS} from './payload-design.js';
import {RF_DEFAULTS,RF_BOUNDS,validateGrid,validateResponse,directionalGain,rfState,antennaCoordinates} from './antenna-rf.js';

export const MODEL_VERSION = '1.5.2';
export const DEFAULTS = Object.freeze({
  ...RF_DEFAULTS,
  ...DESIGN_DEFAULTS,
  scenario: 'tilt', duration: 18, eventTime: 2, rampTime: 1.5,
  roll: 12, pitch: -65, yaw: 8, jitter: 1, jitterHz: 3, jitterDuration:3, jitterDecay:0.7, restRate:0.5, restHold:0.5, landingLock:1,
  targetAz: 12, targetEl: 25, distanceKm: 384400, horizon: 0,
  azLimit: 180, elMin: -85, elMax: 85, speedLimit: 90,
  inertia: 0.00015, movingMass: 0.15, cgOffset: 0.002, torqueLimit: 0.012,
  kp: 0.08, ki: 0.01, kd: 0.006, friction: 0.0001, damping: 0.0003,
  encoderBits: 14, sensorBias: 0.05, sensorNoise: 0.025,
  controlHz: 100, delayMs: 10, torqueConstant: 0.025, resistance: 8,
  frequencyGHz: 2.205, txPowerW: 5, peakGain: 5.2, beamwidth: 90,
  cableLoss: 1, polLoss: 0.5, otherLoss: 1, receiverGT: 22,
  bitrateKbps: 4, requiredEbNo: 4.5, implementationLoss: 1.5, reserveDb: 3,
  ...ANTENNA_PROFILES.compact.values,antennaProfile:'compact',clearanceMm:2,
  mountX:SURFACE.mount[0],mountY:SURFACE.mount[1],mountZ:SURFACE.mount[2],burialDepth:0,payloadMassKg:1.5,
  initialTemp: 15, baseTemp: 15, groundTemp: -40, sunlight: 0.65,
  solarIncidence: 0.5, emissivity: 0.65, absorptivity: 0.3, thermalArea: 0.018,
  heatCapacity: 240, conductance: 0.2, groundView: 0.25,
  heaterW: 30, heaterSetpoint: 0, operatingMin: -40, operatingMax: 80,
  landerHeatCapacity:3000,landerArea:0.2,landerEmissivity:0.1,landerAbsorptivity:0.15,landerBatteryWh:300,
  heaterConnected:1,hostPower:1,hostRadio:0,busVoltage:28,regulatorEfficiency:0.85,
  dust: 0, sealFactor: 0.25, shockG: 0, shockMs: 30,
  batteryWh: 30, electronicsW: 0.79, rfEfficiency: 0.35,
  jamAxis: 'none', pointingRequirement: 0.5, seed: 2026,
  pattern: null
});

export const PRESETS = {
  nominal: { label: 'Nominal landing', thai: 'ลงจอดปกติ', note: 'A gentle touchdown. Both antennas should retain the link.', values: { roll: 3, pitch: -5, yaw: 0, jitter: 0.1, dust: 0, shockG: 0, jamAxis: 'none' } },
  tilt: { label: 'Off-nominal landing', thai: 'ยานเอียงหลังลงจอด', note: 'A 65° tip. Gimbal remains locked during touchdown and acquires after rest confirmation.', values: { roll: 12, pitch: -65, yaw: 8, jitter: 1, dust: 0, shockG: 0, jamAxis: 'none' } },
  shock: { label: 'Hard touchdown', thai: 'ลงจอดกระแทก', note: 'A half-sine acceleration pulse applies a load to the offset payload.', values: { roll: 18, pitch: -42, yaw: -5, jitter: 1.1, shockG: 12, shockMs: 30, dust: 0.15, jamAxis: 'none' } },
  dust: { label: 'Dust & cold', thai: 'ฝุ่นและความเย็น', note: 'NASA table reference: −170°C (−274°F) surface boundary. The lander bus powers a local payload/gimbal heater.', values: { roll: 10, pitch: -32, yaw: 15, jitter: 0.5, dust: 0.8, initialTemp: -30, sunlight: 0, baseTemp: 0, groundTemp: -170, shockG: 0, jamAxis: 'none' } },
  jam: { label: 'Actuator fault', thai: 'แกน elevation ติดขัด', note: 'The elevation axis locks at touchdown. Recovery is not guaranteed.', values: { roll: 12, pitch: -65, yaw: 8, jitter: 0.3, jamAxis: 'elevation', dust: 0, shockG: 0 } },
  limit: { label: 'Beyond travel', thai: 'เป้าหมายเกินระยะหมุน', note: 'Restricted mechanical travel exposes an unreachable target.', values: { roll: 25, pitch: 55, yaw: 20, elMax: 45, elMin: -10, azLimit: 90, jitter: 0.2, shockG: 0, jamAxis: 'none' } },
  side: {label:'Sideways landing',thai:'ยานตะแคง 90°',note:'Tests a side-resting lander; mounting position and hull obstruction determine recovery.',values:{roll:90,pitch:0,yaw:0,jitter:1.5,shockG:8}},
  nose: {label:'Nose-down impact',thai:'ยานปักหัว 105°',note:'A nose-down geometry study, not a reconstruction of any specific mission.',values:{roll:10,pitch:-105,yaw:15,jitter:2,shockG:15,burialDepth:0.15}},
  inverted: {label:'Inverted / buried',thai:'ยานคว่ำและจมพื้น',note:'180° inversion and ground penetration expose cases that repointing cannot rescue.',values:{roll:180,pitch:0,yaw:0,jitter:1.5,burialDepth:0.15}},
  hot: {label:'Hot surface reference',thai:'พื้นผิว +110°C',note:'NASA table reference: +110°C equals +230°F. The value +230 is Fahrenheit, not Celsius.',values:{groundTemp:110,sunlight:1,baseTemp:45,initialTemp:30,roll:12,pitch:-65}},
  blackout: {label:'Host power lost',thai:'ไฟ lander หาย',note:'At touchdown the host bus, transmitter and heater lose power. A gimbal cannot restore them.',values:{hostPower:0,roll:12,pitch:-65}}
};

export const BOUNDS = {
  ...RF_BOUNDS,
  ...DESIGN_BOUNDS,
  payloadMassKg:[0.01,10],
  duration: [5,120], eventTime: [0,10], rampTime:[0.2,10], roll:[-180,180], pitch:[-180,180], yaw:[-180,180], jitter:[0,10], jitterHz:[0.1,20],jitterDuration:[0.1,10],jitterDecay:[0.05,5],restRate:[0.05,5],restHold:[0.1,3],landingLock:[0,1],
  targetAz:[-180,180], targetEl:[-10,90], distanceKm:[100,500000], horizon:[0,30], azLimit:[10,180], elMin:[-90,0], elMax:[5,90], speedLimit:[5,360],
  inertia:[0.00001,0.2], movingMass:[0.01,3], cgOffset:[0,0.2], torqueLimit:[0.001,2], kp:[0.001,20], ki:[0,5], kd:[0.0001,2], friction:[0,0.1], damping:[0,0.2],
  encoderBits:[8,20], sensorBias:[-2,2], sensorNoise:[0,1], controlHz:[10,500], delayMs:[0,200], torqueConstant:[0.005,1], resistance:[0.1,20],
  frequencyGHz:[0.1,40], txPowerW:[0.01,100], peakGain:[0,35], beamwidth:[5,160], cableLoss:[0,10], polLoss:[0,30], otherLoss:[0,30], receiverGT:[-10,60],
  bitrateKbps:[0.01,10000], requiredEbNo:[-3,20], implementationLoss:[0,10], reserveDb:[0,15], initialTemp:[-200,200], baseTemp:[-200,200], groundTemp:[-200,200], sunlight:[0,1],
  solarIncidence:[0,1], emissivity:[0.01,1], absorptivity:[0.01,1], thermalArea:[0.001,0.2], heatCapacity:[10,2000], conductance:[0,1], groundView:[0,1],
  heaterW:[0,50], heaterSetpoint:[-60,30], operatingMin:[-100,0], operatingMax:[30,150], dust:[0,1], sealFactor:[0,1], shockG:[0,100], shockMs:[10,200],
  batteryWh:[0.001,500], electronicsW:[0.1,20], rfEfficiency:[0.1,0.8], pointingRequirement:[0.1,5], seed:[1,2147483647],
  antennaWidthMm:[20,120],antennaHeightMm:[20,120],antennaThicknessMm:[0.5,20],antennaMassG:[5,500],clearanceMm:[0,10],
  mountX:[-1.5,1.5],mountY:[-0.6,1.5],mountZ:[-1.5,1.5],burialDepth:[0,1],
  landerHeatCapacity:[100,100000],landerArea:[0.01,5],landerEmissivity:[0.01,1],landerAbsorptivity:[0.01,1],landerBatteryWh:[0.001,10000],
  heaterConnected:[0,1],hostPower:[0,1],hostRadio:[0,1],busVoltage:[5,50],regulatorEfficiency:[0.3,1]
};

export function validateConfig(input) {
  const c = { ...DEFAULTS }, errors = [];
  for (const [key, [min,max]] of Object.entries(BOUNDS)) {
    if (input[key] === undefined) continue;
    if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < min || input[key] > max) errors.push(`${key}: expected ${min} … ${max}`);
    else c[key] = input[key];
  }
  if (input.scenario !== undefined && !PRESETS[input.scenario]) errors.push('Unknown scenario');
  else c.scenario = input.scenario || c.scenario;
  if (input.jamAxis !== undefined && !['none','azimuth','elevation'].includes(input.jamAxis)) errors.push('Invalid jam axis');
  else c.jamAxis = input.jamAxis || 'none';
  if(input.pattern===null)c.pattern=null;else if(input.pattern!==undefined){try{c.pattern=validatePattern(input.pattern);}catch(e){errors.push(e.message);}}
  for(const [key,values] of Object.entries({patternShape:['symmetric','elliptical'],gainConvention:['realized','accepted'],polarizationMode:['fixed','same','opposite']})){if(input[key]!==undefined){if(!values.includes(input[key]))errors.push(`Invalid ${key}`);else c[key]=input[key];}}
  if(input.patternGrid===null)c.patternGrid=null;else if(input.patternGrid!==undefined)try{c.patternGrid=validateGrid(input.patternGrid);}catch(e){errors.push(e.message);}
  if(input.frequencyResponse===null)c.frequencyResponse=null;else if(input.frequencyResponse!==undefined)try{c.frequencyResponse=validateResponse(input.frequencyResponse);}catch(e){errors.push(e.message);}
  if(input.antennaProfile!==undefined && ![...Object.keys(ANTENNA_PROFILES),'custom'].includes(input.antennaProfile))errors.push('Invalid antenna profile');else c.antennaProfile=input.antennaProfile||c.antennaProfile;
  for (const key of ['encoderBits','controlHz','seed','landingLock','heaterConnected','hostPower','hostRadio','modulationBits']) if (!Number.isInteger(c[key])) errors.push(`${key}: expected an integer`);
  if (c.eventTime >= c.duration) errors.push('Event must occur before simulation ends');
  if(c.busMinV>c.busMaxV)errors.push('Bus minimum must not exceed bus maximum');
  if(c.brownoutV>=c.busMinV)errors.push('Brownout threshold must be below minimum bus voltage');
  if (errors.length) throw new Error(errors.join('\n'));
  return c;
}

export function presetConfig(id) { return { ...DEFAULTS, ...PRESETS[id].values, scenario: id }; }
export function applyAntennaProfile(config,id){if(!ANTENNA_PROFILES[id])throw new Error('Unknown antenna reference');const p=ANTENNA_PROFILES[id];return validateConfig({...config,...p.values,beamwidthV:p.values.beamwidth,antennaProfile:id,patternShape:'symmetric',pattern:p.values.pattern??null,patternGrid:null,frequencyResponse:null});}

export function validatePattern(rows) {
  if (!Array.isArray(rows) || rows.length < 3 || rows.length > 10000) throw new Error('Pattern requires 3–10,000 angle/gain rows');
  const data = rows.map(r => ({ angle: Number(r.angle), gain: Number(r.gain) })).sort((a,b) => a.angle-b.angle);
  if (data.some(r => !Number.isFinite(r.angle) || !Number.isFinite(r.gain) || r.angle<0 || r.angle>180 || r.gain < -150 || r.gain > 80)) throw new Error('Invalid pattern: angle 0–180°, gain −150–80 dBi');
  if (data[0].angle !== 0 || data.at(-1).angle !== 180 || data.some((r,i) => i && r.angle === data[i-1].angle)) throw new Error('Pattern must cover 0–180° with unique angles');
  return data;
}
export function parsePatternCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
  if (/angle/i.test(lines[0])) lines.shift();
  return validatePattern(lines.map(l => { const [angle,gain,...extra] = l.split(','); if (extra.length || gain === undefined || !angle.trim() || !gain.trim()) throw new Error('Use two CSV columns: angle_deg,gain_dbi'); return { angle, gain }; }));
}
export function antennaGain(errorDeg, c) {
  return directionalGain(errorDeg,0,c);
}
export const fspl = (ghz, km) => 20*Math.log10(4*Math.PI*km*1000*ghz*1e9/299792458);
export function linkBudget(error, c, blocked = false, powered = true, phi=0, temp=c.initialTemp) {
  const rf=rfState(c,temp),gain = directionalGain(error,phi,c,temp), pathLoss = fspl(c.frequencyGHz,c.distanceKm);
  const eirp = 10*Math.log10(c.txPowerW)+gain-c.cableLoss;
  const cn0 = eirp-pathLoss+c.receiverGT+228.599167-rf.polarizationLoss-c.otherLoss;
  const ebno = cn0-10*Math.log10(c.bitrateKbps*1000);
  const rawMargin = ebno-c.requiredEbNo-c.implementationLoss;
  const margin = blocked || !powered || !rf.supported ? null : rawMargin;
  const symbolRate=c.bitrateKbps*1000/(c.codingRate*c.modulationBits),occupiedBandwidthKHz=symbolRate*(1+c.rolloff)/1000,bandwidthPass=occupiedBandwidthKHz<=c.receiverBandwidthKHz;
  const receiverGain=c.receiverGT+10*Math.log10(c.receiverTempK),receivedDbw=eirp-pathLoss+receiverGain-rf.polarizationLoss-c.otherLoss,noiseDbw=-228.599167+10*Math.log10(c.receiverTempK)+10*Math.log10(c.receiverBandwidthKHz*1000);
  const powerLimitedRate=10**((cn0-c.requiredEbNo-c.implementationLoss-c.reserveDb)/10)/1000,bwLimitedRate=c.receiverBandwidthKHz*c.codingRate*c.modulationBits/(1+c.rolloff);
  return { gain, pathLoss, eirp, cn0, ebno, margin, rawMargin,rf,phi,receivedDbm:margin===null?null:receivedDbw+30,noiseDbm:noiseDbw+30,cnDb:margin===null?null:receivedDbw-noiseDbw,receiverGain,occupiedBandwidthKHz,bandwidthPass,symbolRate,powerLimitedRate,bwLimitedRate,
    available: margin !== null && margin >= c.reserveDb && bandwidthPass,
    maxRateKbps: margin===null?0:Math.min(powerLimitedRate,bwLimitedRate),
    pointingLoss: directionalGain(0,0,c,temp)-gain };
}

export function bodyAt(t,c) {
  const u = clamp((t-c.eventTime)/c.rampTime,0,1), s = u*u*(3-2*u);
  const tau=t-c.eventTime,active=tau>=0&&tau<c.jitterDuration,w=2*Math.PI*c.jitterHz;
  const taper=active?(1+Math.cos(Math.PI*tau/c.jitterDuration))/2:0,decay=active?Math.exp(-tau/c.jitterDecay):0;
  const vibration=active?c.jitter*Math.sin(w*tau)*decay*taper:0;
  const vRate=active?c.jitter*decay*(w*Math.cos(w*tau)*taper-Math.sin(w*tau)*(taper/c.jitterDecay+Math.PI/(2*c.jitterDuration)*Math.sin(Math.PI*tau/c.jitterDuration))):0;
  const sd=u>0&&u<1?6*u*(1-u)/c.rampTime:0;
  const angularSpeed=Math.hypot(c.roll*sd+vRate*0.6,c.pitch*sd+vRate,c.yaw*sd);
  return { roll:c.roll*s+vibration*0.6, pitch:c.pitch*s+vibration, yaw:c.yaw*s,vibration,angularSpeed,
    q: attitude(c.roll*s+vibration*0.6,c.pitch*s+vibration,c.yaw*s) };
}
export function solvePointing(q,c,t=0,az=null,el=null) {
  const target = direction(c.targetAz*RAD,c.targetEl*RAD), local = rotate(target,qInv(q));
  const desired = angles(local), command = [clamp(desired[0],-c.azLimit*RAD,c.azLimit*RAD),clamp(desired[1],c.elMin*RAD,c.elMax*RAD)];
  const view=visibility(q,c,t,az??command[0],el??command[1]);
  const travelReachable=separation(direction(...command),local)<1e-4,fit=packaging(...command,c);
  return { target,local,desired,command,...view,travelReachable,packagingReachable:fit.fits,reachable:travelReachable&&fit.fits };
}
export function thermalDerivative(temp,c,motorHeat=0,heaterOn=false,landerTemp=c.baseTemp) {
  return thermalRates(temp,landerTemp,c,{motorHeat,heaterOn,connected:Boolean(c.heaterConnected)});
}

export class Simulator {
  constructor(config) {
    this.c=validateConfig(config); const c=this.c;
    this.t=0; this.axes=[{angle:clamp(c.targetAz,-c.azLimit,c.azLimit)*RAD,velocity:0,integral:0,torque:0},{angle:clamp(c.targetEl,c.elMin,c.elMax)*RAD,velocity:0,integral:0,torque:0}];
    this.temp=c.initialTemp; this.landerTemp=c.baseTemp;this.landerEnergy=0;this.heaterEnergy=0;this.energy=0; this.fixedEnergy=0; this.heater=false;
    this.released=!c.landingLock;this.releaseTime=this.released?0:null;this.restElapsed=0;this.packagingLimited=false;
    this.random=seededRandom(c.seed); this.nextControl=0; this.queue=[]; this.command=[this.axes[0].angle,this.axes[1].angle];
    this.stats={samples:0,errorSq:0,peakError:0,peakTorque:0,peakCurrent:0,goodTime:0,fixedGoodTime:0,saturationTime:0,dataKbit:0,fixedDataKbit:0};
  }
  step(dt=0.002) {
    const c=this.c, body=bodyAt(this.t,c), hostPowered=(c.hostPower===1||this.t<c.eventTime)&&this.landerEnergy<c.landerBatteryWh,powered=hostPowered&&this.energy<c.batteryWh;
    if(!this.released&&this.t>=c.eventTime+c.rampTime){this.restElapsed=body.angularSpeed<=c.restRate?this.restElapsed+dt:0;if(this.restElapsed>=c.restHold){this.released=true;this.releaseTime=this.t;}}
    if (this.t+1e-9 >= this.nextControl) {
      const biased=bodyAt(this.t,c); biased.q=attitude(biased.roll+c.sensorBias,biased.pitch+c.sensorBias,biased.yaw);
      const measured=solvePointing(biased.q,c,this.t).command.map(x=>x+(this.random()*2-1)*c.sensorNoise*RAD);
      this.queue.push({time:this.t+c.delayMs/1000,command:measured}); this.nextControl+=1/c.controlHz;
      while(this.queue.length && this.queue[0].time <= this.t+1e-9) this.command=this.queue.shift().command;
      this.axes.forEach((axis,i)=>{
        const quantum=2*Math.PI/(2**Math.round(c.encoderBits)), measuredAngle=Math.round(axis.angle/quantum)*quantum;
        const e=this.command[i]-measuredAngle, candidate=clamp(axis.integral+e/c.controlHz,-2,2);
        const raw=c.kp*e+c.ki*candidate-c.kd*axis.velocity;
        if(Math.abs(raw)<=c.torqueLimit || e*raw<0) axis.integral=candidate;
        axis.torque=clamp(c.kp*e+c.ki*axis.integral-c.kd*axis.velocity,-c.torqueLimit,c.torqueLimit);
      });
    }
    const coldMultiplier=1+Math.max(0,20-this.temp)*0.012;
    const friction=c.friction*(1+8*c.dust*c.sealFactor)*coldMultiplier;
    const normal=direction(this.axes[0].angle,this.axes[1].angle), lever=normal.map(x=>x*c.cgOffset);
    const grav=rotate([0,-1.625*c.movingMass,0],qInv(body.q));
    const shockU=(this.t-c.eventTime)/(c.shockMs/1000), accel=shockU>=0&&shockU<=1 ? c.shockG*9.80665*Math.sin(Math.PI*shockU) : 0;
    const load=cross(lever,[grav[0],grav[1]-c.movingMass*accel,grav[2]]);
    const azAxis=[0,1,0], elAxis=[-Math.cos(this.axes[0].angle),0,Math.sin(this.axes[0].angle)];
    const disturbance=[dot(load,azAxis),dot(load,elAxis)];
    const operational=this.temp>=c.operatingMin && this.temp<=c.operatingMax;
    let copperHeat=0,mechanicalPower=0,maxTorque=0,saturated=false;
    const previousAngles=this.axes.map(a=>a.angle);this.packagingLimited=false;
    this.axes.forEach((axis,i)=>{
      const jammed=this.t>=c.eventTime && c.jamAxis===(i===0?'azimuth':'elevation');
      const torque=powered&&operational&&this.released ? axis.torque : 0;
      axis.appliedTorque=torque; axis.jammed=jammed;
      const current=torque/c.torqueConstant;
      copperHeat+=current*current*c.resistance; mechanicalPower+=Math.abs(torque*axis.velocity);
      maxTorque=Math.max(maxTorque,Math.abs(torque));
      this.stats.peakCurrent=Math.max(this.stats.peakCurrent,Math.abs(current));
      saturated ||= Math.abs(torque)>=c.torqueLimit-1e-8;
      if(jammed||!this.released) { axis.velocity=0;if(!this.released)axis.integral=0;return; }
      let net=torque+disturbance[i]-c.damping*axis.velocity;
      if(Math.abs(axis.velocity)<1e-4 && Math.abs(net)<=friction) { axis.velocity=0; return; }
      net-=friction*Math.sign(Math.abs(axis.velocity)>1e-4?axis.velocity:net);
      axis.velocity=clamp(axis.velocity+net/c.inertia*dt,-c.speedLimit*RAD,c.speedLimit*RAD);
      axis.angle+=axis.velocity*dt;
      const min=i===0?-c.azLimit*RAD:c.elMin*RAD, max=i===0?c.azLimit*RAD:c.elMax*RAD;
      if(axis.angle<min||axis.angle>max) { axis.angle=clamp(axis.angle,min,max); axis.velocity=0; }
    });
    if(!packaging(this.axes[0].angle,this.axes[1].angle,c).fits){this.axes.forEach((a,i)=>{a.angle=previousAngles[i];a.velocity=0;a.integral=0;});this.packagingLimited=true;}
    if(this.temp<c.heaterSetpoint-1) this.heater=true;
    if(this.temp>c.heaterSetpoint+1) this.heater=false;
    const heaterPowered=this.heater&&hostPowered;
    const thermal=thermalRates(this.temp,this.landerTemp,c,{motorHeat:copperHeat,payloadHeat:powered?c.electronicsW:0,heaterOn:heaterPowered,connected:Boolean(c.heaterConnected)});
    this.temp+=thermal.derivative*dt;
    this.landerTemp+=thermal.landerDerivative*dt;
    this.rfPower=hostPowered&&(c.hostRadio===1||powered)?c.txPowerW/c.rfEfficiency:0;
    this.power=powered ? (c.electronicsW+copperHeat+mechanicalPower+(c.hostRadio?0:this.rfPower))/c.regulatorEfficiency : 0;
    const fixedPower=this.fixedEnergy<c.batteryWh&&hostPowered ? (c.electronicsW+(c.hostRadio?0:this.rfPower))/c.regulatorEfficiency : 0;
    const hostDraw=this.power+(c.hostRadio?this.rfPower:0)+(heaterPowered?c.heaterW:0);
    const consumed=Math.min(Math.max(0,c.landerBatteryWh-this.landerEnergy),hostDraw*dt/3600);
    this.landerEnergy+=consumed;this.heaterEnergy+=hostDraw?consumed*thermal.heater/hostDraw:0;
    this.energy=Math.min(c.batteryWh,this.energy+this.power*dt/3600);
    this.fixedEnergy=Math.min(c.batteryWh,this.fixedEnergy+fixedPower*dt/3600);
    this.t=Math.min(c.duration,this.t+dt);
    const frame=this.snapshot();
    this.stats.samples++; this.stats.errorSq+=frame.error**2; this.stats.peakError=Math.max(this.stats.peakError,frame.error);
    this.stats.peakTorque=Math.max(this.stats.peakTorque,maxTorque);
    if(saturated) this.stats.saturationTime+=dt;
    if(frame.link.available) { this.stats.goodTime+=dt; this.stats.dataKbit+=c.bitrateKbps*dt; }
    if(frame.fixedLink.available) { this.stats.fixedGoodTime+=dt; this.stats.fixedDataKbit+=c.bitrateKbps*dt; }
    return frame;
  }
  snapshot() {
    const c=this.c,body=bodyAt(this.t,c),sol=solvePointing(body.q,c,this.t,this.axes[0].angle,this.axes[1].angle);
    const bore=rotate(direction(this.axes[0].angle,this.axes[1].angle),body.q);
    const fixedBore=rotate(direction(c.targetAz*RAD,c.targetEl*RAD),body.q);
    const error=separation(bore,sol.target),fixedError=separation(fixedBore,sol.target);
    const rfAngles=antennaCoordinates(sol.local,this.axes[0].angle,this.axes[1].angle),fixedRfAngles=antennaCoordinates(sol.local,c.targetAz*RAD,c.targetEl*RAD);
    const fixedView=visibility(body.q,c,this.t,c.targetAz*RAD,c.targetEl*RAD),hostPowered=(c.hostPower===1||this.t<c.eventTime)&&this.landerEnergy<c.landerBatteryWh;
    const payloadPowered=hostPowered&&this.energy<c.batteryWh,payloadOperational=this.temp>=c.operatingMin&&this.temp<=c.operatingMax;
    const rfPowered=hostPowered&&(c.hostRadio===1||(payloadPowered&&payloadOperational));
    return {t:this.t,body,desired:sol.desired,command:sol.command,az:this.axes[0].angle,el:this.axes[1].angle,bore,fixedBore,target:sol.target,error,fixedError,
      rfAngles,fixedRfAngles,link:linkBudget(error,c,sol.blocked,rfPowered,rfAngles.phi,this.temp),fixedLink:linkBudget(fixedError,c,fixedView.blocked,hostPowered&&(c.hostRadio===1||(this.fixedEnergy<c.batteryWh&&payloadOperational)),fixedRfAngles.phi,this.temp),
      blocked:sol.blocked,reachable:sol.reachable,temp:this.temp,energy:this.energy,fixedEnergy:this.fixedEnergy,power:this.power||0,
      blockedReason:sol.reason,fixedBlocked:fixedView.blocked,groundClearance:sol.groundClearance,position:sol.position,origin:sol.worldOrigin,
      packaging:packaging(this.axes[0].angle,this.axes[1].angle,c),packagingLimited:this.packagingLimited,packagingReachable:sol.packagingReachable,
      locked:!this.released,releaseTime:this.releaseTime,restElapsed:this.restElapsed,landerTemp:this.landerTemp,landerEnergy:this.landerEnergy,heaterEnergy:this.heaterEnergy,rfPower:this.rfPower||0,hostPowered,rfPowered,
      torque:this.axes.map(a=>a.appliedTorque||0),heater:this.heater&&hostPowered,
      jammed:this.axes.some(a=>a.jammed),motorOperational:this.temp>=c.operatingMin&&this.temp<=c.operatingMax,
      powered:payloadPowered};
  }
  summary() { const s=this.stats,t=Math.max(this.t,1e-9); return {...s,rmsError:Math.sqrt(s.errorSq/Math.max(s.samples,1)),availability:clamp(s.goodTime/t*100,0,100),fixedAvailability:clamp(s.fixedGoodTime/t*100,0,100),energyWh:this.energy}; }
}

export function runSimulation(config, sampleInterval=0.04) {
  const sim=new Simulator(config), frames=[sim.snapshot()]; let next=sampleInterval;
  while(sim.t<sim.c.duration-1e-9) {
    const f=sim.step(Math.min(0.002,sim.c.duration-sim.t));
    if(sim.t+1e-9>=next || sim.t>=sim.c.duration-1e-9) { frames.push(f); next+=sampleInterval; }
  }
  const tail=frames.filter(f=>f.t>=Math.max(sim.c.eventTime+sim.c.rampTime,sim.c.duration-3));
  // Settling is only reported for a stationary final command (no continuing vibration).
  let settlingMs=null;
  if(sim.c.jitter===0) {
    const end=sim.c.eventTime+sim.c.rampTime;
    const post=frames.filter(f=>f.t>=end); let lastBad=-1;
    post.forEach((f,i)=>{if(f.error>sim.c.pointingRequirement) lastBad=i;});
    if(post.length && lastBad<post.length-1) settlingMs=Math.max(0,(post[lastBad+1].t-end)*1000);
  }
  const acquired=sim.releaseTime===null?null:frames.find(f=>f.t>=sim.releaseTime&&f.link.available);
  return {frames,summary:{...sim.summary(),surfaceInterface:surfaceAssessment(sim.c),tailRms:Math.sqrt(tail.reduce((s,f)=>s+f.error**2,0)/Math.max(tail.length,1)),settlingMs,releaseTime:sim.releaseTime,acquisitionAfterRelease:acquired?acquired.t-sim.releaseTime:null,landerEnergyWh:sim.landerEnergy,heaterEnergyWh:sim.heaterEnergy,commandLatencyBoundMs:(Math.ceil(sim.c.delayMs/1000*sim.c.controlHz)+1)/sim.c.controlHz*1000},config:sim.c,modelVersion:MODEL_VERSION};
}

export function patchEstimate(fGHz,er,hMm) {
  if(![fGHz,er,hMm].every(Number.isFinite)||fGHz<=0||er<=1||hMm<=0) throw new Error('Frequency and thickness must be positive; εr must exceed 1');
  const wavelength=299792458/(fGHz*1e9),h=hMm/1000;
  const width=wavelength/2*Math.sqrt(2/(er+1));
  const effectiveEr=(er+1)/2+(er-1)/2/Math.sqrt(1+12*h/width);
  const delta=0.412*h*((effectiveEr+0.3)*(width/h+0.264))/((effectiveEr-0.258)*(width/h+0.8));
  const length=wavelength/(2*Math.sqrt(effectiveEr))-2*delta;
  return {widthMm:width*1000,lengthMm:length*1000,effectiveEr,groundWidthMm:(width+6*h)*1000,groundLengthMm:(length+6*h)*1000,wavelengthMm:wavelength*1000,extensionMm:delta*1000,effectiveLengthMm:wavelength/(2*Math.sqrt(effectiveEr))*1000};
}

export function runStepResponse(config,stepDeg=5) {
  if(!Number.isFinite(stepDeg)||stepDeg<=0||stepDeg>30)throw new Error('Azimuth step must be greater than 0 and at most 30°');
  const c=validateConfig({...config,duration:5,eventTime:0,roll:0,pitch:0,yaw:0,jitter:0,shockG:0,jamAxis:'none',landingLock:0,burialDepth:0});
  const start=c.targetAz-stepDeg;
  if(start < -c.azLimit || c.targetAz > c.azLimit || c.targetAz < -c.azLimit || c.targetEl<c.elMin || c.targetEl>c.elMax)throw new Error('Step initial/target angles must be inside mechanical travel');
  const sim=new Simulator(c);sim.axes[0].angle=start*RAD;sim.command[0]=start*RAD;
  const frames=[{t:0,angle:start,error:stepDeg,torque:0}],goal=c.targetAz;
  let maxAngle=start,t10=null,t90=null,lastOutside=0;
  while(sim.t<5-1e-9){const f=sim.step(Math.min(0.002,5-sim.t)),angle=f.az*DEG,error=Math.abs(goal-angle);frames.push({t:f.t,angle,error,torque:f.torque[0]});maxAngle=Math.max(maxAngle,angle);
    if(t10===null&&angle>=start+stepDeg*0.1)t10=f.t;
    if(t90===null&&angle>=start+stepDeg*0.9)t90=f.t;
    if(error>c.pointingRequirement)lastOutside=f.t;
  }
  const settled=frames.at(-1).error<=c.pointingRequirement,settlingMs=settled?(lastOutside+0.002)*1000:null;
  return {frames,stepDeg,initialAz:start,targetAz:goal,bandDeg:c.pointingRequirement,observationSeconds:5,
    settlingMs,riseMs:t90!==null&&t10!==null?(t90-t10)*1000:null,overshootPercent:Math.max(0,(maxAngle-goal)/stepDeg*100),
    finalError:frames.at(-1).error,passes50ms:settlingMs!==null&&settlingMs<=50,config:c};
}

export function runThermal(config,hours=24,step=5) {
  const c=validateConfig(config);let temp=c.initialTemp,landerTemp=c.baseTemp,heater=false,energy=0,landerEnergy=0,heaterEnergy=0,minTemp=temp,maxTemp=temp;const frames=[];
  const seconds=hours*3600,dt=Math.min(step,1);
  const interval=Math.max(dt,Math.round(seconds/180/dt)*dt);
  for(let t=0;t<=seconds;t+=dt){
    const hostPowered=c.hostPower===1&&landerEnergy<c.landerBatteryWh,powered=hostPowered&&energy<c.batteryWh;
    if(t%interval===0||t===seconds)frames.push({hours:t/3600,temp,landerTemp,energy,landerEnergy,heaterEnergy,powered,hostPowered});
    if(t===seconds)break;
    if(temp<c.heaterSetpoint-1)heater=true;if(temp>c.heaterSetpoint+1)heater=false;
    const heat=heater&&hostPowered?c.heaterW:0,power=powered?c.electronicsW/c.regulatorEfficiency:0;
    const d=thermalRates(temp,landerTemp,c,{payloadHeat:powered?c.electronicsW:0,heaterOn:heat>0,connected:Boolean(c.heaterConnected)});
    temp+=d.derivative*dt;landerTemp+=d.landerDerivative*dt;minTemp=Math.min(minTemp,temp);maxTemp=Math.max(maxTemp,temp);
    const used=Math.min(Math.max(0,c.landerBatteryWh-landerEnergy),(power+heat)*dt/3600);landerEnergy+=used;heaterEnergy+=(power+heat)>0?used*heat/(power+heat):0;
    energy=Math.min(c.batteryWh,energy+power*dt/3600);
  }
  return {frames,minTemp,maxTemp,energyWh:energy,landerEnergyWh:landerEnergy,heaterWh:heaterEnergy};
}

export function csvExport(result) {
  const header='time_s,roll_deg,pitch_deg,yaw_deg,az_deg,el_deg,pointing_error_deg,fixed_error_deg,gimbal_margin_db,fixed_margin_db,gimbal_link_ok,fixed_link_ok,blocked,reachable,payload_temp_c,payload_bus_w,payload_energy_wh,az_torque_nm,el_torque_nm,landing_locked,lander_temp_c,lander_energy_wh,host_rf_dc_w,ground_clearance_m,packaging_fits,blocked_reason,touchdown_vibration_deg,rf_theta_deg,rf_phi_deg,directional_gain_dbi,s11_db,vswr,axial_ratio_db,polarization_loss_db,received_dbm,noise_dbm,cn_db,occupied_bandwidth_khz,bandwidth_pass,frequency_supported';
  const rows=result.frames.map(f=>[f.t,f.body.roll,f.body.pitch,f.body.yaw,f.az*DEG,f.el*DEG,f.error,f.fixedError,f.link.margin,f.fixedLink.margin,Number(f.link.available),Number(f.fixedLink.available),Number(f.blocked),Number(f.reachable),f.temp,f.power,f.energy,...f.torque,Number(f.locked),f.landerTemp,f.landerEnergy,f.rfPower,f.groundClearance,Number(f.packaging.fits),f.blockedReason||'',f.body.vibration,f.rfAngles.theta,f.rfAngles.phi,f.link.gain,f.link.rf.s11Db,f.link.rf.vswr,f.link.rf.axialRatioDb,f.link.rf.polarizationLoss,f.link.receivedDbm,f.link.noiseDbm,f.link.cnDb,f.link.occupiedBandwidthKHz,Number(f.link.bandwidthPass),Number(f.link.rf.supported)].map(v=>v===null?'':typeof v==='number'?Number(v.toFixed(6)):v).join(','));
  return header+'\n'+rows.join('\n');
}
