import {RAD,DEG,rotate,qInv,attitude,rayBox} from './math.js';

export const PAYLOAD = Object.freeze({width:0.1,height:0.2,depth:0.1,electronicsHeight:0.105,pivotHeight:0.1525,cavityHeight:0.095});
export const HULL = Object.freeze({min:[-0.86,-0.55,-0.76],max:[0.86,0.76,0.76]});
export const CONTACT_POINTS=[];
for(const x of [-0.86,0.86])for(const y of [-0.55,0.76])for(const z of [-0.76,0.76])CONTACT_POINTS.push([x,y,z]);
for(const x of [-1.8,1.8])for(const z of [-1.65,1.65])CONTACT_POINTS.push([x,-1.155,z]);

export function antennaCorners(az,el,c) {
  const q=attitude(0,-el*DEG,az*DEG),corners=[];
  for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])corners.push(rotate([x*c.antennaWidthMm/2000,y*c.antennaHeightMm/2000,z*c.antennaThicknessMm/2000],q));
  return corners;
}
export function packaging(az,el,c) {
  const corners=antennaCorners(az,el,c),limits=[0.05-c.clearanceMm/1000,PAYLOAD.cavityHeight/2-c.clearanceMm/1000,0.05-c.clearanceMm/1000];
  const extent=[0,1,2].map(i=>Math.max(...corners.map(p=>Math.abs(p[i]))));
  return {fits:extent.every((v,i)=>v<=limits[i]+1e-9),extentMm:extent.map(v=>v*2000),clearanceMm:Math.min(...extent.map((v,i)=>(limits[i]-v)*1000)),sweptDiameterMm:Math.hypot(c.antennaWidthMm,c.antennaHeightMm,c.antennaThicknessMm),volumeU:2};
}
export function mountOrigin(c) {return [c.mountX,c.mountY+PAYLOAD.pivotHeight,c.mountZ];}
export function landerPose(q,c,t) {
  const u=Math.max(0,Math.min(1,(t-c.eventTime)/c.rampTime));
  const sink=c.burialDepth*u*u*(3-2*u);
  return [0,-Math.min(...CONTACT_POINTS.map(p=>rotate(p,q)[1]))-sink,0];
}
export function visibility(q,c,t,az=0,el=0) {
  const target=[Math.sin(c.targetAz*RAD)*Math.cos(c.targetEl*RAD),Math.sin(c.targetEl*RAD),Math.cos(c.targetAz*RAD)*Math.cos(c.targetEl*RAD)];
  const local=rotate(target,qInv(q)),origin=mountOrigin(c),position=landerPose(q,c,t),worldOrigin=rotate(origin,q).map((v,i)=>v+position[i]);
  const corners=antennaCorners(az,el,c).map(p=>rotate(p.map((v,i)=>v+origin[i]),q).map((v,i)=>v+position[i]));
  const minClearance=Math.min(...corners.map(p=>p[1]));
  let reason=null;
  if(minClearance<=0)reason='GROUND CONTACT / BURIED';
  else if(c.targetEl<=c.horizon)reason='TERRAIN HORIZON';
  else if(rayBox(origin,local,HULL.min,HULL.max))reason='LANDER HULL';
  return {blocked:reason!==null,reason,groundClearance:minClearance,worldOrigin,position};
}

// Two thermal nodes: lander interface and payload. The heater belongs to the lander.
export function thermalRates(payloadC,landerC,c,{motorHeat=0,payloadHeat=0,heaterOn=false,connected=true}={}) {
  const sigma=5.670374419e-8,tp=payloadC+273.15,tl=landerC+273.15,tg=c.groundTemp+273.15;
  const sink=c.groundView*tg**4+(1-c.groundView)*3**4;
  const solar=1361*c.sunlight*c.solarIncidence*Math.min(1,c.absorptivity+0.18*c.dust)*c.thermalArea;
  const radiation=c.emissivity*sigma*c.thermalArea*(tp**4-sink);
  const conduction=connected?c.conductance*(landerC-payloadC):0;
  const landerRadiation=c.landerEmissivity*sigma*c.landerArea*(tl**4-sink);
  const landerSolar=1361*c.sunlight*c.solarIncidence*c.landerAbsorptivity*c.landerArea;
  const heater=heaterOn?c.heaterW:0;
  return {derivative:(solar+motorHeat+payloadHeat+conduction-radiation)/c.heatCapacity,
    landerDerivative:(landerSolar+heater-conduction-landerRadiation)/c.landerHeatCapacity,
    solar,radiation,conduction,heater,landerRadiation,landerSolar};
}
