import {attitude,rotate,RAD} from './math.js';
import {PAYLOAD} from './mission.js';

export const DESIGN_DEFAULTS={wallMm:2,pitchMotorWidthMm:6,rfBendRadiusMm:8,cableTwistLimitDeg:90,busMinV:22,busMaxV:32,busCurrentLimitA:0.5,harnessOhm:0.5,inrushA:0.8,inrushMs:20,holdCapUf:470,brownoutV:18,outageMs:100};
export const DESIGN_BOUNDS={wallMm:[0.5,4],pitchMotorWidthMm:[2,20],rfBendRadiusMm:[2,25],cableTwistLimitDeg:[5,180],busMinV:[5,50],busMaxV:[5,50],busCurrentLimitA:[0.05,5],harnessOhm:[0,5],inrushA:[0,5],inrushMs:[1,1000],holdCapUf:[10,10000],brownoutV:[3,48],outageMs:[0,5000]};

// Concept allocations; dimensions are not selected components or an ECAD design.
export const BOARD_LAYOUT=Object.freeze([
  {id:'Power input / DC-DC',y:0.020,height:0.010,color:'#235745'},
  {id:'Motor drivers / current sense',y:0.048,height:0.012,color:'#254a72'},
  {id:'MCU / attitude / encoder interface',y:0.076,height:0.010,color:'#225f52'},
]);

export function mechanismParts(c) {
  const w=c.antennaWidthMm/1000,h=c.antennaHeightMm/1000,t=c.antennaThicknessMm/1000,m=c.pitchMotorWidthMm/1000;
  return [
    {id:'Patch antenna',size:[w,h,t],center:[0,0,0],frame:'pitch'},
    ...[-1,1].map(s=>({id:`Yoke ${s}`,size:[0.004,0.050,0.012],center:[s*(w/2+0.004),-0.017,0],frame:'yaw'})),
    {id:'Pitch motor allocation',size:[m,0.014,0.018],center:[w/2+0.006+m/2,0,0],frame:'yaw'},
    {id:'RF connector allocation',size:[0.008,0.008,0.008],center:[0,0,-t/2-0.006],frame:'pitch'},
  ];
}

export function assemblyFit(c,azDeg=0,elDeg=0) {
  const pad=(c.wallMm+c.clearanceMm)/1000,limits=[0.05-pad,0.05-pad];
  const ymin=PAYLOAD.electronicsHeight+c.clearanceMm/1000,ymax=PAYLOAD.height-pad;
  const yaw=attitude(0,0,azDeg),pitch=attitude(0,-elDeg,azDeg),failures=[];let clearance=Infinity;
  const assess=(id,points,lower=ymin)=>{
    let d=Infinity;for(const p of points)d=Math.min(d,limits[0]-Math.abs(p[0]),limits[1]-Math.abs(p[2]),p[1]-lower,ymax-p[1]);
    clearance=Math.min(clearance,d);if(d< -1e-9)failures.push({part:id,clearanceMm:d*1000});
  };
  for(const p of mechanismParts(c)){
    const q=p.frame==='pitch'?pitch:yaw,points=[];
    for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){const v=rotate([p.center[0]+x*p.size[0]/2,p.center[1]+y*p.size[1]/2,p.center[2]+z*p.size[2]/2],q);v[1]+=PAYLOAD.pivotHeight;points.push(v);}
    assess(p.id,points,p.frame==='yaw'?PAYLOAD.electronicsHeight:ymin);
  }
  const radius=c.rfBendRadiusMm/1000,center=rotate([0,0,-c.antennaThicknessMm/2000-0.010-radius],pitch);center[1]+=PAYLOAD.pivotHeight;
  const keepout=[];for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){const p=[...center];p[axis]+=sign*radius;keepout.push(p);}assess('RF bend keep-out sphere',keepout);
  const cablePass=Math.abs(azDeg)<=c.cableTwistLimitDeg+1e-9;
  return {fits:failures.length===0&&cablePass,geometryFits:failures.length===0,cablePass,minClearanceMm:clearance*1000,failures,azDeg,elDeg,scope:'Concept bounding-box / bend-space screening; not exact collision or cable stress',qualified:false};
}

export function assemblyStudy(c,step=5) {
  const rows=[],azValues=[],elValues=[];
  for(let a=-c.azLimit;a<c.azLimit-1e-8;a+=step)azValues.push(a);azValues.push(c.azLimit);
  for(let e=c.elMin;e<c.elMax-1e-8;e+=step)elValues.push(e);elValues.push(c.elMax);
  let fits=0,min=Infinity;
  for(const el of elValues)for(const az of azValues){const a=assemblyFit(c,az,el);fits+=Number(a.fits);min=Math.min(min,a.minClearanceMm);rows.push({az,el,pass:a.fits,clearanceMm:a.minClearanceMm,reason:a.failures[0]?.part||(!a.cablePass?'Cable twist allocation':'')});}
  const internalSide=100-2*(c.wallMm+c.clearanceMm),internalHeight=95-c.wallMm-2*c.clearanceMm;
  return {rows,azValues,elValues,stepDeg:step,sampledPassPercent:100*fits/rows.length,allSampledFit:fits===rows.length,minimumClearanceMm:min,internalSideMm:internalSide,internalCavityHeightMm:internalHeight,plateDiagonalMm:Math.hypot(c.antennaWidthMm,c.antennaHeightMm,c.antennaThicknessMm),unrestrictedSquarePlateBoundMm:Math.sqrt(Math.max(0,Math.min(internalSide,internalHeight)**2-c.antennaThicknessMm**2)/2),note:'Sample grid fraction, not mission success probability. No trajectory path planning or interpolated collision guarantee.'};
}

export function electricalStudy(c,r) {
  const peakFunctionalLoadW=Math.max(c.electronicsW/c.regulatorEfficiency,...r.frames.map(f=>f.power));
  // Worst-case interface sizing assumes the local survival heater and functional
  // branch can be on together. Both are supplied by the lander power service.
  const heaterLoadW=c.heaterW;
  const peakLoadW=peakFunctionalLoadW+heaterLoadW;
  const discriminant=c.busMinV*c.busMinV-4*c.harnessOhm*peakLoadW;
  const loadedV=discriminant<0?null:(c.busMinV+Math.sqrt(discriminant))/2;
  const steadyA=loadedV?peakLoadW/loadedV:null;
  const startV=loadedV??0,holdMs=Math.max(0,0.5*c.holdCapUf*1e-6*(startV*startV-c.brownoutV*c.brownoutV)/peakLoadW*1000);
  const rows=Array.from({length:101},(_,i)=>{const ms=i*Math.max(c.outageMs,100)/100;return {x:ms,y:Math.sqrt(Math.max(0,startV*startV-2*peakLoadW*(ms/1000)/(c.holdCapUf*1e-6)))};});
  return {peakLoadW,peakFunctionalLoadW,heaterLoadW,loadedV,steadyA,peakBusDemandA:Math.max(steadyA??Infinity,c.inrushA),currentPass:steadyA!==null&&Math.max(steadyA,c.inrushA)<=c.busCurrentLimitA,voltagePass:loadedV!==null&&loadedV>c.brownoutV,holdUpMs:holdMs,outagePass:loadedV>c.brownoutV&&holdMs>=c.outageMs,inrushA:c.inrushA,inrushMs:c.inrushMs,rows,source:'Lander bus; no payload battery; local payload/gimbal heater; capacitor hold-up screening only',scope:'Constant-power harness/drop and ideal capacitor discharge. Not a switching/inrush circuit simulation; does not gate the mission solver.'};
}
