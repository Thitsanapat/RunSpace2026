import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {seededRandom} from './math.js';
import {radiationGeometry} from './radiation-scene.js';
import {buildSurfaceLander} from './brochure-model.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {buildPayloadInternals} from './payload-model.js';
import {mechanismParts} from './payload-design.js';

export class MissionScene {
  constructor(container) {
    this.container=container; this.scene=new THREE.Scene(); this.scene.background=new THREE.Color('#111923');
    this.scene.fog=new THREE.FogExp2('#111923',0.024);
    this.camera=new THREE.PerspectiveCamera(40,1,0.001,120);this.camera.position.set(5.4,4.3,6.6);
    this.renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
    this.renderer.domElement.setAttribute('aria-label','Interactive 3D lunar lander and antenna. Drag to orbit, scroll to zoom.');this.renderer.domElement.setAttribute('role','img');
    container.append(this.renderer.domElement);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,1.5,0);this.controls.enableDamping=true;this.controls.minDistance=2;this.controls.maxDistance=22;this.controls.maxPolarAngle=Math.PI*0.49;
    this.scene.add(new THREE.HemisphereLight('#c6d9f5','#494138',2));
    const sun=new THREE.DirectionalLight('#fff0d7',4);sun.position.set(-5,9,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8;sun.shadow.bias=-0.0005;this.scene.add(sun);
    const rim=new THREE.DirectionalLight('#849dcb',2);rim.position.set(5,3,-6);this.scene.add(rim);
    this.undersideLight=new THREE.DirectionalLight('#eaf4ff',3);this.undersideLight.position.set(0,-5,3);this.undersideLight.visible=false;this.scene.add(this.undersideLight);
    this.materials={
      white:new THREE.MeshStandardMaterial({color:'#ccd3d5',metalness:0.65,roughness:0.32}),
      dark:new THREE.MeshStandardMaterial({color:'#29353e',metalness:0.8,roughness:0.35}),
      gold:new THREE.MeshStandardMaterial({color:'#c49a51',metalness:0.7,roughness:0.46}),
      patch:new THREE.MeshStandardMaterial({color:'#e7bd76',metalness:0.75,roughness:0.25}),
      green:new THREE.MeshStandardMaterial({color:'#c4ee8a',emissive:'#526c23',emissiveIntensity:0.2,metalness:0.4,roughness:0.32}),
      blue:new THREE.MeshStandardMaterial({color:'#152b45',metalness:0.5,roughness:0.25}),
      ours:new THREE.MeshStandardMaterial({color:'#14babf',emissive:'#08696d',emissiveIntensity:0.25,metalness:0.25,roughness:0.45})
    };
    const beforeGround=new Set(this.scene.children);this.makeGround();this.groundParts=this.scene.children.filter(c=>!beforeGround.has(c));
    this.makeLander();this.makeGuides();this.exploded=false;this.beamVisible=false;this.brochureVisible=true;
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(container);this.resize();
  }
  mesh(geo,mat,parent,pos=[0,0,0]) {const m=new THREE.Mesh(geo,this.materials[mat]||mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  box(size,mat,parent,pos) {return this.mesh(new THREE.BoxGeometry(...size),mat,parent,pos);}
  rod(start,end,radius,mat,parent) {const a=new THREE.Vector3(...start),b=new THREE.Vector3(...end),m=this.mesh(new THREE.CylinderGeometry(radius,radius,a.distanceTo(b),12),mat,parent);m.position.copy(a.clone().add(b).multiplyScalar(0.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());return m;}
  makeGround() {
    const rng=seededRandom(124);const geo=new THREE.PlaneGeometry(55,55,100,100);geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position;
    for(let i=0;i<pos.count;i++) {const x=pos.getX(i),z=pos.getZ(i),r=Math.hypot(x,z),fade=THREE.MathUtils.smoothstep(r,3,7);pos.setY(i,fade*((rng()-0.5)*0.2+0.18*Math.sin(x*0.7)*Math.cos(z*0.45))-0.025);}
    geo.computeVertexNormals();this.mesh(geo,new THREE.MeshStandardMaterial({color:'#4b5155',roughness:1}),this.scene).castShadow=false;
    const grid=new THREE.GridHelper(20,40,'#6c7c83','#3f4a51');grid.position.y=0.005;grid.material.transparent=true;grid.material.opacity=0.25;this.scene.add(grid);
    const circle=new THREE.BufferGeometry().setFromPoints(Array.from({length:129},(_,i)=>new THREE.Vector3(3.3*Math.cos(i/128*2*Math.PI),0.02,3.3*Math.sin(i/128*2*Math.PI))));
    this.scene.add(new THREE.Line(circle,new THREE.LineBasicMaterial({color:'#9daf89',transparent:true,opacity:0.35})));
    for(let i=0;i<65;i++) {const x=(rng()-0.5)*35,z=(rng()-0.5)*35;if(Math.hypot(x,z)<4)continue;const r=0.08+rng()*0.3;const rock=this.mesh(new THREE.DodecahedronGeometry(r,0),new THREE.MeshStandardMaterial({color:'#545b60',roughness:1}),this.scene,[x,r*0.15,z]);rock.scale.set(1.4,0.7,1);rock.rotation.set(rng(),rng(),rng());}
    const stars=new Float32Array(450*3);for(let i=0;i<450;i++){const a=rng()*Math.PI*2,e=0.1+rng()*1.4;stars.set([45*Math.cos(a)*Math.cos(e),45*Math.sin(e),45*Math.sin(a)*Math.cos(e)],i*3);}
    const sgeo=new THREE.BufferGeometry();sgeo.setAttribute('position',new THREE.BufferAttribute(stars,3));this.scene.add(new THREE.Points(sgeo,new THREE.PointsMaterial({color:'#b3c0cb',size:0.035,transparent:true,opacity:0.55})));
  }
  makeLander() {
    this.lander=new THREE.Group();this.scene.add(this.lander);
    buildSurfaceLander(this);
    this.hostParts=[...this.lander.children];
    this.base=new THREE.Group();this.lander.add(this.base);
    buildPayloadInternals(this);
    const edges=new THREE.EdgesGeometry(new THREE.BoxGeometry(0.1,0.2,0.1));
    this.envelope=new THREE.LineSegments(edges,new THREE.LineBasicMaterial({color:'#8ebcf1'}));this.envelope.position.y=0.1;this.base.add(this.envelope);
    this.yawGroup=new THREE.Group();this.yawGroup.position.y=0.1525;this.base.add(this.yawGroup);
    this.mesh(new THREE.CylinderGeometry(0.017,0.017,0.012,24),'white',this.yawGroup,[0,-0.041,0]);
    this.mechanismMeshes=new Map();
    this.pitchGroup=new THREE.Group();this.yawGroup.add(this.pitchGroup);
    this.board=this.box([1,1,1],'ours',this.pitchGroup,[0,0,0]);
    this.patch=this.box([0.65,0.65,0.05],'patch',this.board,[0,0,0.51]);
    const bmat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0.16,side:THREE.DoubleSide,depthWrite:false});
    this.beam=this.mesh(new THREE.BufferGeometry(),bmat,this.pitchGroup);this.beam.castShadow=false;this.beam.userData.visualHelper=true;
    this.fixedMarker=this.mesh(new THREE.SphereGeometry(0.003,12,8),new THREE.MeshBasicMaterial({color:'#e7a477'}),this.base,[0,0.1525,0]);this.fixedMarker.userData.visualHelper=true;
  }
  makeGuides() {
    this.guides={};for(const [id,color] of [['target','#8ebcf1'],['gimbal','#c4ed90'],['fixed','#e7a477']]) {
      const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineDashedMaterial({color,dashSize:id==='gimbal'?100:0.12,gapSize:0.08,transparent:true,opacity:0.85}));this.scene.add(line);this.guides[id]=line;
    }
    this.targetMarker=this.mesh(new THREE.OctahedronGeometry(0.085),new THREE.MeshBasicMaterial({color:'#8ebcf1'}),this.scene);
  }
  update(frame,config) {
    this.lander.quaternion.fromArray(frame.body.q);
    this.lander.position.set(...frame.position);
    this.yawGroup.rotation.y=frame.az;this.pitchGroup.rotation.x=-frame.el;
    this.base.position.set(config.mountX,config.mountY,config.mountZ);
    this.yawGroup.position.y=this.exploded?0.24:0.1525;this.board.position.z=this.exploded?0.06:0;
    this.board.scale.set(config.antennaWidthMm/1000,config.antennaHeightMm/1000,config.antennaThicknessMm/1000);
    for(const p of mechanismParts(config).filter(p=>p.id!=='Patch antenna')){
      let m=this.mechanismMeshes.get(p.id);if(!m){m=this.box([1,1,1],p.id.includes('motor')?'ours':p.id.includes('RF')?'gold':'white',p.frame==='pitch'?this.pitchGroup:this.yawGroup);m.name=p.id;this.mechanismMeshes.set(p.id,m);}m.position.set(...p.center);m.scale.set(...p.size);
    }
    this.pcbGroups.forEach((p,i)=>p.position.y=[0.020,0.048,0.076][i]+(this.exploded?i*0.028:0));
    this.envelope.material.color.set(frame.packaging.fits&&!frame.packagingLimited?'#8ebcf1':'#df896f');
    this.lander.updateMatrixWorld(true);
    const origin=new THREE.Vector3(0,0,0);this.pitchGroup.getWorldPosition(origin);
    if(this.detail||this.mountView){const center=this.base.localToWorld(new THREE.Vector3(0,this.detail&&this.exploded?0.15:0.1,0)),delta=center.clone().sub(this.controls.target);this.camera.position.add(delta);this.controls.target.copy(center);}
    for(const [name,vector] of [['target',frame.target],['gimbal',frame.bore],['fixed',frame.fixedBore]]) {
      const endpoint=origin.clone().add(new THREE.Vector3(...vector).multiplyScalar(name==='target'?4.5:3.5));
      const line=this.guides[name];line.geometry.attributes.position.setXYZ(0,...origin.toArray());line.geometry.attributes.position.setXYZ(1,...endpoint.toArray());line.geometry.attributes.position.needsUpdate=true;line.geometry.computeBoundingSphere();line.computeLineDistances();
      if(name==='target')this.targetMarker.position.copy(endpoint);
    }
    if(this.patternConfig!==config||Math.abs(frame.temp-(this.patternTemp??Infinity))>0.5){const {geo}=radiationGeometry(config,frame.temp);this.beam.geometry.dispose();this.beam.geometry=geo;this.patternConfig=config;this.patternTemp=frame.temp;}
    this.beam.scale.setScalar(this.detail?0.13:1.8);this.beam.visible=this.beamVisible&&frame.link.rf.supported;
    this.lastFrame=frame;
  }
  setView(view) {
    this.surfaceLabels.visible=!['mount','detail','underside'].includes(view);
    this.groundParts.forEach(p=>p.visible=view!=='underside');
    this.undersideLight.visible=view==='underside';
    this.detail=view==='detail';this.mountView=view==='mount';this.controls.minDistance=this.detail?0.12:this.mountView?0.25:2;this.controls.maxPolarAngle=this.detail||this.mountView||view==='underside'?Math.PI:Math.PI*0.49;
    this.hostParts.forEach(p=>p.visible=!this.detail&&(p!==this.otherZones||this.brochureVisible));
    if(this.detail){const origin=this.base.localToWorld(new THREE.Vector3(0,this.exploded?0.15:0.1,0));this.controls.target.copy(origin);this.camera.position.copy(origin).add(new THREE.Vector3(0.28,0.17,0.32).multiplyScalar(this.exploded?1.35:1));this.controls.update();return;}
    if(this.mountView){const origin=this.base.localToWorld(new THREE.Vector3(0,0.1,0));this.controls.target.copy(origin);this.camera.position.copy(origin).add(new THREE.Vector3(0.64,0.52,0.7));this.controls.update();return;}
    const poses={orbit:[5.4,4.3,6.6],front:[0,3,8.5],top:[0.05,10,0.05],underside:[1.2,-8.2,1.8],detail:[2.1,3.7,3.2]};
    this.camera.position.set(...poses[view]);this.controls.target.set(0,view==='underside'?1.1:1.5,0);this.controls.update();
  }
  resize() {const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h)return;this.camera.aspect=w/h;this.camera.fov=2*Math.atan(Math.tan(20*Math.PI/180)/Math.min(1,Math.max(0.4,w/h)))*180/Math.PI;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);}
  render() {this.controls.update();this.renderer.render(this.scene,this.camera);}
  capture() {this.render();return this.renderer.domElement.toDataURL('image/png');}
  setBrochureVisible(visible){this.brochureVisible=visible;this.otherZones.visible=visible&&!this.detail;}
  async exportModel() {
    const model=this.lander.clone(true);model.position.set(0,0,0);model.quaternion.identity();
    // Export the complete physical-looking model even when viewing isolated 2U.
    for(let i=0;i<this.hostParts.length;i++)model.children[i].visible=this.hostParts[i]===this.otherZones?this.brochureVisible:true;
    const remove=[];model.traverse(o=>{if(o.isLine||o.isSprite||o.userData.visualHelper)remove.push(o);});remove.forEach(o=>o.removeFromParent());
    model.name='ispace brochure reconstruction with cyan team payload';
    model.userData={units:'metres',basis:'Two user-provided brochure crops; approximate geometry, not ispace CAD',payloadAllocations:this.payloadInventory,allocationsVisible:this.brochureVisible,numericalModel:'Conservative hull/foot proxy; illustrated allocations excluded',bodyPose:'Normalized; antenna/exploded transforms reflect current view'};
    model.updateMatrixWorld(true);return new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});
  }
}
