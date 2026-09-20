import {runSimulation,validateConfig} from './engine.js';
import {seededRandom} from './math.js';
self.onmessage=({data})=>{
  try {
    const base=validateConfig(data.config),rng=seededRandom(data.seed||2026),rows=[];
    const assessmentStart=base.eventTime+Math.max(base.rampTime,base.jitterDuration)+base.restHold+2;
    if(base.duration<=assessmentStart+1)throw new Error('Increase scenario duration: batch requires at least 1 s after vibration + rest hold + 2 s acquisition allowance.');
    for(let i=0;i<data.count;i++) {
      const c={...base,roll:(rng()*2-1)*180,pitch:(rng()*2-1)*180,yaw:(rng()*2-1)*180,sensorBias:(rng()*2-1)*0.3,dust:rng(),seed:1+Math.floor(rng()*1000000)};
      const r=runSimulation(c,0.2),post=r.frames.filter(f=>f.t>=assessmentStart),last=r.frames.at(-1);
      const good=post.filter(f=>f.link.available).length/Math.max(post.length,1),fixed=post.filter(f=>f.fixedLink.available).length/Math.max(post.length,1);
      rows.push({roll:c.roll,pitch:c.pitch,yaw:c.yaw,dust:c.dust,sensorBias:c.sensorBias,seed:c.seed,assessmentStart,gimbalAvailability:good*100,fixedAvailability:fixed*100,pass:good>=0.95,fixedPass:fixed>=0.95,tailRms:r.summary.tailRms,blockedReason:last.blockedReason||'',targetFits:last.packagingReachable,hostPowered:last.hostPowered});
      if(i%5===0) self.postMessage({type:'progress',done:i+1,count:data.count});
    }
    self.postMessage({type:'done',rows,config:base,seed:data.seed||2026,count:data.count});
  } catch(e) {self.postMessage({type:'error',message:e.message});}
};
