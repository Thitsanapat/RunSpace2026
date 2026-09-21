import * as THREE from 'three';
import {HULL} from './mission.js';
import {SURFACE} from './surface-payload.js';

// Visible features reconstructed from brochure photos and the user's multi-view sheet, not provider CAD.
// Coloured blocks represent service allocations, not a confirmed manifest.
export function buildSurfaceLander(view) {
  const {lander}=view;
  const material=(color,metalness=0.15,roughness=0.65)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
  const silver=material('#c9ccca',0.55,0.42),ivory=material('#e5e5dc'),blanket=material('#555752',0.25,0.86),seam=material('#343936');
  const red=material('#dd3438'),blue=material('#2854ba'),yellow=material('#e2ce23'),green=material('#70d638'),black=material('#242926');
  const box=(size,mat,parent,pos)=>view.box(size,mat,parent,pos);
  const rod=(a,b,r=0.012,mat=silver,parent=lander)=>view.rod(a,b,r,mat,parent);
  const mesh=(geo,mat,parent,pos)=>view.mesh(geo,mat,parent,pos);
  const edge=(object)=>{object.add(new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry,28),new THREE.LineBasicMaterial({color:'#454a46',transparent:true,opacity:0.65})));return object;};
  const block=(size,mat,parent,pos)=>edge(box(size,mat,parent,pos));
  const boltGeometry=new THREE.CylinderGeometry(0.006,0.006,0.005,6);
  const bolt=(parent,pos,face=false)=>{const m=mesh(boltGeometry,silver,parent,pos);if(face)m.rotation.x=Math.PI/2;return m;};
  const top=HULL.max[1],x=HULL.max[0],z=HULL.max[2],cut=0.25;
  const outline=[[-x+cut,-z],[x-cut,-z],[x,-z+cut],[x,z-cut],[x-cut,z],[-x+cut,z],[-x,z-cut],[-x,-z+cut]];
  const prism=(y,h,mat,scale=1)=>{
    const shape=new THREE.Shape();outline.forEach(([a,b],i)=>i?shape.lineTo(a*scale,-b*scale):shape.moveTo(a*scale,-b*scale));shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});geo.rotateX(-Math.PI/2);
    return edge(mesh(geo,mat,lander,[0,y,0]));
  };
  // Octagonal deck and grey equipment skirts; blue blocks are payload allocations.
  prism(top-0.035,0.035,ivory);prism(-0.30,0.045,silver,0.96);prism(-0.27,0.96,black,0.91);
  for(let i=0;i<outline.length;i++){
    const a=outline[i],b=outline[(i+1)%outline.length],dx=b[0]-a[0],dz=b[1]-a[1],width=Math.hypot(dx,dz);
    const wall=new THREE.Group();wall.position.set((a[0]+b[0])/2,0.30,(a[1]+b[1])/2);wall.rotation.y=Math.PI-Math.atan2(dz,dx);lander.add(wall);
    block([width-0.025,0.68,0.035],i%2?silver:blanket,wall,[0,0,0]);
    for(const yy of [-0.35,0.35])rod([-width/2,yy,0.028],[width/2,yy,0.028],0.012,silver,wall);
    for(const xx of [-width/2,width/2])rod([xx,-0.35,0.028],[xx,0.35,0.028],0.012,silver,wall);
    if(i%2===0){
      for(const xx of [-width/6,width/6])box([0.005,0.65,0.008],seam,wall,[xx,0,0.024]);
      for(const xx of [-0.42,0,0.42].filter(v=>Math.abs(v)<width/2))for(const yy of [-0.29,0.29])mesh(new THREE.SphereGeometry(0.008,6,4),silver,wall,[xx,yy,0.034]);
    }else for(const xx of [-width/2+0.035,width/2-0.035])for(const yy of [-0.29,0.29])mesh(new THREE.SphereGeometry(0.012,8,6),black,wall,[xx,yy,0.032]);
    for(let xx=-width/2+0.055;xx<width/2;xx+=0.17)for(const yy of [-0.31,0.31])bolt(wall,[xx,yy,0.026],true);
    for(const xx of [-width/2+0.025,width/2-0.025])for(const yy of [-0.18,0,0.18])bolt(wall,[xx,yy,0.026],true);
    rod([a[0],-0.32,a[1]],[a[0],top,a[1]],0.018,silver);
  }
  for(const side of [-1,1]){
    rod([side*0.1,top+0.002,-0.68],[side*0.1,top+0.002,0.68],0.0025,seam);
    rod([-0.68,top+0.002,side*0.3],[0.68,top+0.002,side*0.3],0.0025,seam);
  }
  // Thin inset deck seams and access plates follow the multi-view reference.
  for(const sx of [-1,1])for(const sz of [-1,1]){
    const plate=block([0.25,0.006,0.23],ivory,lander,[sx*0.76,top+0.004,sz*0.39]);plate.name='Deck access plate';
    for(const dx of [-0.105,0.105])for(const dz of [-0.095,0.095])bolt(lander,[sx*0.76+dx,top+0.01,sz*0.39+dz]);
    rod([sx*0.66,top+0.007,sz*0.57],[sx*0.94,top+0.007,sz*0.83],0.0025,seam);
  }
  for(const side of [-1,1]){
    // Raised external side frame; it remains visual geometry, not an RF collision mesh.
    const xframe=side*(x+0.045),y0=0.02,y1=0.68,z0=-0.52,z1=0.35;
    for(const zz of [z0,z1])rod([xframe,y0,zz],[xframe,y1,zz],0.018,silver);
    for(const yy of [y0,y1])rod([xframe,yy,z0],[xframe,yy,z1],0.018,silver);
    rod([xframe,y0,z0],[xframe,y1,z1],0.012,silver).name='External X brace';
    rod([xframe,y0,z1],[xframe,y1,z0],0.012,silver);
    rod([side*0.96,top+0.04,-0.72],[side*0.96,top+0.56,-0.28],0.014,silver);
  }
  const torus=(radius,tube,y,parent=lander)=>{const r=mesh(new THREE.TorusGeometry(radius,tube,8,80),silver,parent,[0,y,0]);r.rotation.x=Math.PI/2;return r;};
  torus(0.69,0.018,top+0.022);
  // Folded raised equipment panels; holes are cut through the plate geometry.
  function tower(sx,sz){
    const group=new THREE.Group();group.name='Raised equipment panel assembly';group.position.set(sx*0.72,top+0.41,sz*0.68);group.rotation.y=Math.atan2(sx,sz);group.scale.y=1.28;lander.add(group);
    const panel=new THREE.Shape();panel.moveTo(-0.21,-0.31);panel.lineTo(0.21,-0.31);panel.lineTo(0.21,0.31);panel.lineTo(-0.21,0.31);panel.closePath();
    for(const xx of [-0.098,0.098])for(const yy of [-0.198,0,0.198]){const hole=new THREE.Path();hole.absarc(xx,yy,0.066,0,Math.PI*2,true);panel.holes.push(hole);mesh(new THREE.TorusGeometry(0.067,0.006,8,24),silver,group,[xx,yy,0.018]);}
    const face=edge(mesh(new THREE.ExtrudeGeometry(panel,{depth:0.015,bevelEnabled:false,curveSegments:20}),silver,group,[0,0,0]));face.name='Six through-hole equipment face';
    for(const yy of [-0.32,0.32])rod([-0.22,yy,0.025],[0.22,yy,0.025],0.012,silver,group);
    for(const xx of [-0.22,0.22])rod([xx,-0.32,0.025],[xx,0.32,0.025],0.012,silver,group);
    for(const side of [-1,1]){
      const flap=new THREE.Group();flap.position.set(side*0.22,0,0);flap.rotation.y=side*0.58;group.add(flap);
      block([0.34,0.62,0.018],blanket,flap,[side*0.17,0,0]);
      for(const yy of [-0.31,0.31])rod([0,yy,0.015],[side*0.34,yy,0.015],0.009,silver,flap);
      rod([side*0.34,-0.31,0.015],[side*0.34,0.31,0.015],0.009,silver,flap);
      for(const xx of [side*0.025,side*0.31])for(const yy of [-0.28,0,0.28])bolt(flap,[xx,yy,0.014],true);
    }
  }
  tower(1,-1);tower(-1,1);
  for(const sx of [-1,1]){
    block([0.12,0.43,0.12],ivory,lander,[sx*0.92,top+0.21,sx*0.24]);
    for(const yy of [-0.06,0.30,0.65]){
      rod([sx*1.10,yy,-0.32],[sx*1.28,yy+0.1,-0.32],0.009,silver);
      mesh(new THREE.SphereGeometry(0.02,8,6),ivory,lander,[sx*1.28,yy+0.1,-0.32]);
    }
  }
  // Four leg assemblies with sleeves, joints, braces and dished footpads.
  view.feet=[];
  for(const sx of [-1,1])for(const sz of [-1,1]){
    const foot=[sx*1.8,-1.12,sz*1.65],knee=[sx*1.35,-0.60,sz*1.20];view.feet.push(new THREE.Vector3(...foot));
    const upper=[sx*0.92,0.40,sz*0.75];rod(upper,foot,0.040,silver);rod([sx*0.88,0.35,sz*0.72],knee,0.062,black);
    for(const u of [0.16,0.58,0.86]){const v=u+0.065;rod(upper.map((a,i)=>a+(foot[i]-a)*u),upper.map((a,i)=>a+(foot[i]-a)*v),0.065,silver);}
    rod([sx*0.52,-0.25,sz*0.47],knee,0.028,silver);rod([sx*0.72,-0.23,sz*0.30],knee,0.024,silver);
    rod([sx*0.79,0.14,sz*0.68],[sx*0.94,-0.05,sz*0.83],0.07,ivory);
    for(const p of [[sx*0.72,0.39,sz*0.62],knee]){const joint=mesh(new THREE.SphereGeometry(0.066,12,8),ivory,lander,p);joint.scale.set(1.2,0.8,1);}
    edge(mesh(new THREE.CylinderGeometry(0.24,0.28,0.07,40),ivory,lander,foot));
    const lip=torus(0.24,0.012,foot[1]+0.033);lip.position.x=foot[0];lip.position.z=foot[2];
    mesh(new THREE.CylinderGeometry(0.17,0.2,0.018,32),silver,lander,[foot[0],foot[1]+0.036,foot[2]]);
    for(const dx of [-1,1])rod([foot[0],foot[1]+0.12,foot[2]],[foot[0]+dx*0.14,foot[1]+0.045,foot[2]],0.018,ivory);
  }
  // Underside circular frame, lattice and three round units; functions unverified.
  torus(0.72,0.023,-0.45);torus(0.67,0.009,-0.485);
  mesh(new THREE.CylinderGeometry(0.63,0.63,0.018,64),silver,lander,[0,-0.43,0]);
  for(const sign of [-1,1])for(let offset=-0.65;offset<=0.65;offset+=0.13){
    const half=Math.sqrt(Math.max(0,0.6**2-(offset/Math.SQRT2)**2));
    const center=new THREE.Vector3(offset/2,0,sign*offset/2),d=new THREE.Vector3(1,0,-sign).normalize().multiplyScalar(half);
    rod([center.x-d.x,-0.466,center.z-d.z],[center.x+d.x,-0.466,center.z+d.z],0.0055,seam);
  }
  for(const a of [-0.13,0.13]){rod([-0.66,-0.52,a],[0.66,-0.52,a],0.018,silver);rod([a,-0.53,-0.66],[a,-0.53,0.66],0.018,silver);}
  for(const zz of [-0.38,0,0.38]){
    const unit=mesh(new THREE.SphereGeometry(0.13,24,16),ivory,lander,[0,-0.56,zz]);unit.scale.set(1,0.85,1);
    const rim=torus(0.125,0.008,-0.54);rim.position.z=zz;rod([0,-0.44,zz],[0,-0.30,zz],0.04,silver);
  }
  for(const side of [-1,1])rod([side*0.82,-0.27,-0.52],[side*0.48,-0.48,0.5],0.021,silver);
  // Brochure service allocations, visible as solids by default, can be hidden.
  view.otherZones=new THREE.Group();view.otherZones.name='Brochure allocations (visual only)';lander.add(view.otherZones);
  view.payloadInventory=[];
  const allocation=(id,size,position,mat)=>{const m=block(size,mat,view.otherZones,position);m.name=id;view.payloadInventory.push({id,sizeM:size,positionM:position,visualOnly:true});return m;};
  allocation('Orbiter / red',[1.2,1.2,1.2],[0,top+0.63,0],red);
  for(const zz of [-1,1])allocation('Bottom blue '+zz,[0.7,0.7,0.7],[0,-0.37,zz*1.15],blue);
  for(const sx of [-1,1]){
    for(const zz of [-0.18,0.06,0.30])allocation('Bottom yellow '+sx+'/'+zz,[0.2,0.2,0.2],[sx*0.85,-0.38,zz],yellow);
    allocation('Bottom yellow tall '+sx,[0.2,0.4,0.3],[sx*0.85,-0.34,-0.43],yellow);
  }
  allocation('Top green spare',[0.2,0.2,0.2],[-SURFACE.mount[0],top+0.1,-SURFACE.mount[2]],green);
  view.zones=new THREE.Group();lander.add(view.zones);
  const mount=SURFACE.mount;box([0.2,0.008,0.2],green,lander,[mount[0],top-0.004,mount[2]]);
  const geometry=new THREE.BoxGeometry(0.2,0.2,0.2);
  view.surfaceZone=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:'#70e138'}));view.surfaceZone.position.set(mount[0],top+0.1,mount[2]);view.zones.add(view.surfaceZone);
  view.surfaceLabels=new THREE.Group();view.zones.add(view.surfaceLabels);
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=112;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#103137';ctx.fillRect(0,0,640,112);ctx.strokeStyle='#43e6e3';ctx.lineWidth=4;ctx.strokeRect(2,2,636,108);ctx.fillStyle='#72ffff';ctx.font='bold 30px sans-serif';ctx.fillText('OUR PAYLOAD · 2U',20,44);ctx.fillStyle='#e0eeee';ctx.font='23px sans-serif';ctx.fillText('Cyan module / green service bay',20,82);
  const label=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),depthTest:false}));label.scale.set(1,0.175,1);label.position.set(mount[0]+0.76,top+0.59,mount[2]+0.15);view.surfaceLabels.add(label);
  const pointer=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(mount[0],top+0.2,mount[2]),new THREE.Vector3(mount[0]+0.76,top+0.5,mount[2]+0.15)]),new THREE.LineBasicMaterial({color:'#43e6e3'}));view.surfaceLabels.add(pointer);
}
