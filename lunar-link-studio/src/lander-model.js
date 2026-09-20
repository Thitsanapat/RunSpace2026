import * as THREE from 'three';
import {HULL} from './mission.js';
import {SURFACE} from './surface-payload.js';

// Photo-inspired concept at the existing physics-proxy scale, not ispace CAD.
export function buildSurfaceLander(view) {
  const {lander,materials}=view;
  const mat=(color,metalness=0.4,roughness=0.5)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
  const ivory=mat('#dde0d6'),foil=mat('#b6a477',0.7,0.45),cell=mat('#213f89',0.4,0.28);
  const x=HULL.max[0],z=HULL.max[2],cut=0.24,bottom=HULL.min[1],top=HULL.max[1];
  const outline=[[-x+cut,-z],[x-cut,-z],[x,-z+cut],[x,z-cut],[x-cut,z],[-x+cut,z],[-x,z-cut],[-x,-z+cut]];
  const prism=(y,h,material,inset=0)=>{
    const shape=new THREE.Shape();
    outline.forEach(([px,pz],i)=>{const a=px*(1-inset),b=-pz*(1-inset);if(i)shape.lineTo(a,b);else shape.moveTo(a,b);});shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});geo.rotateX(-Math.PI/2);
    return view.mesh(geo,material,lander,[0,y,0]);
  };
  prism(bottom+0.06,top-bottom-0.095,foil,0.015);
  prism(top-0.035,0.035,ivory);
  prism(bottom,0.06,materials.dark);
  // Flat equipment faces and exposed truss around an octagonal deck.
  for(let i=0;i<outline.length;i++){
    const a=outline[i],b=outline[(i+1)%outline.length],dx=b[0]-a[0],dz=b[1]-a[1];
    const panel=view.box([Math.hypot(dx,dz)-0.035,0.76,0.025],i%2?foil:ivory,lander,[(a[0]+b[0])/2,0.03,(a[1]+b[1])/2]);
    panel.rotation.y=-Math.atan2(dz,dx);
    for(const edgeY of [bottom+0.05,top-0.03])view.rod([a[0],edgeY,a[1]],[b[0],edgeY,b[1]],0.018,'white',lander);
    view.rod([a[0],bottom,a[1]],[a[0],top,a[1]],0.022,'white',lander);
  }
  // Circular top structure, kept below the selected payload's mounting plane.
  const ring=view.mesh(new THREE.TorusGeometry(0.48,0.025,10,64),'white',lander,[0,top-0.012,0]);ring.rotation.x=Math.PI/2;
  view.mesh(new THREE.CylinderGeometry(0.34,0.34,0.022,48),'dark',lander,[0,top-0.013,0]);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;view.rod([0.15*Math.cos(a),top,0.15*Math.sin(a)],[0.48*Math.cos(a),top,0.48*Math.sin(a)],0.011,'white',lander);}
  // Small side instruments, thermal panels and fasteners.
  for(const sx of [-1,1]){
    view.box([0.035,0.49,0.47],'dark',lander,[sx*(x+0.006),0.07,-0.03]);
    for(let i=0;i<4;i++){
      const cover=view.mesh(new THREE.CylinderGeometry(0.038,0.038,0.045,20),ivory,lander,[sx*(x+0.04),-0.08+(i%2)*0.19,-0.13+Math.floor(i/2)*0.2]);cover.rotation.z=Math.PI/2;
    }
  }
  view.feet=[];
  for(const sx of [-1,1])for(const sz of [-1,1]){
    const foot=[sx*1.8,-1.12,sz*1.65];view.feet.push(new THREE.Vector3(...foot));
    view.rod([sx*0.67,0.45,sz*0.55],foot,0.045,'white',lander);
    view.rod([sx*0.57,-0.42,sz*0.5],foot,0.027,'white',lander);
    view.rod([sx*0.85,0.19,sz*0.73],[sx*1.35,-0.58,sz*1.22],0.065,'dark',lander);
    view.mesh(new THREE.CylinderGeometry(0.24,0.28,0.07,32),ivory,lander,foot);
    view.mesh(new THREE.CylinderGeometry(0.11,0.16,0.025,24),'gold',lander,[foot[0],foot[1]+0.045,foot[2]]);
  }
  view.mesh(new THREE.CylinderGeometry(0.14,0.3,0.32,32,1,true),'dark',lander,[0,-0.7,0]);
  // Angled body-mounted solar wings echo the leaflet instead of horizontal trays.
  for(const side of [-1,1]){
    const group=new THREE.Group();group.position.set(0,0.23,side*0.94);group.rotation.x=side*0.42;lander.add(group);
    view.box([0.96,0.88,0.045],'white',group,[0,0,0]);
    for(let col=0;col<6;col++)for(let row=0;row<6;row++)view.box([0.143,0.128,0.006],cell,group,[-0.385+col*0.154,-0.342+row*0.137,side*0.026]);
    for(const sx of [-1,1])view.rod([sx*0.37,-0.37,side*0.64],[sx*0.37,-0.05,side*1.08],0.018,'white',lander);
  }
  const mount=SURFACE.mount;
  view.box([0.2,0.008,0.2],'green',lander,[mount[0],mount[1]-0.004,mount[2]]);
  for(const sx of [-1,1])for(const sz of [-1,1])view.mesh(new THREE.CylinderGeometry(0.004,0.004,0.005,8),'white',lander,[mount[0]+sx*0.086,top+0.002,mount[2]+sz*0.086]);
  view.zones=new THREE.Group();lander.add(view.zones);
  const wireBox=(size,color,pos,fill=false)=>{
    const g=new THREE.BoxGeometry(...size),edge=new THREE.LineSegments(new THREE.EdgesGeometry(g),new THREE.LineBasicMaterial({color,transparent:true,opacity:0.8}));edge.position.set(...pos);view.zones.add(edge);
    if(fill){const mesh=view.mesh(g,new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.08,depthWrite:false}),view.zones,pos);mesh.castShadow=false;}
    return edge;
  };
  view.surfaceZone=wireBox([0.2,0.2,0.2],'#a8ec78',[mount[0],top+0.1,mount[2]],true);
  // Other services are optional allocation guides, not manifest payloads/obstacles.
  view.otherZones=new THREE.Group();view.zones.add(view.otherZones);
  const before=[...view.zones.children];
  wireBox([0.7,0.7,0.7],'#729cf0',[-0.55,-0.51,0.55]);
  wireBox([0.2,0.4,0.3],'#eed47a',[0.65,-0.56,-0.43]);
  wireBox([0.2,0.2,0.2],'#eed47a',[0.58,-0.55,0.6]);
  wireBox([1.2,1.2,1.2],'#e87979',[0,top+0.6,0]);
  for(const child of [...view.zones.children])if(!before.includes(child))view.otherZones.add(child);
  view.otherZones.visible=false;
  // A label remains legible at overall lander scale; it is not a physical object.
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=112;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#142320';ctx.fillRect(0,0,640,112);ctx.strokeStyle='#a8ec78';ctx.lineWidth=4;ctx.strokeRect(2,2,636,108);ctx.fillStyle='#c4ed90';ctx.font='bold 29px sans-serif';ctx.fillText('SURFACE PAYLOAD · 2U',20,43);ctx.fillStyle='#ced8d8';ctx.font='23px sans-serif';ctx.fillText('Top green zone · total ≤1.5 kg target',20,83);
  view.surfaceLabels=new THREE.Group();view.zones.add(view.surfaceLabels);
  const label=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),depthTest:false}));label.scale.set(1.1,0.193,1);label.position.set(mount[0]+0.25,top+0.54,mount[2]);view.surfaceLabels.add(label);
  const pointer=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(mount[0],top+0.2,mount[2]),new THREE.Vector3(mount[0]+0.25,top+0.43,mount[2])]),new THREE.LineBasicMaterial({color:'#a8ec78'}));view.surfaceLabels.add(pointer);
}
