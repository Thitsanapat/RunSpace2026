import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {directionalGain,rfState} from './antenna-rf.js';
// Display radius is a normalized plotting coordinate, never a physical RF range.
export function radiationGeometry(c,temp,floor=-30,linear=false){
  const positions=[],colors=[],indices=[],nt=60,np=96,values=[];let peak=-Infinity;
  for(let i=0;i<=nt;i++)for(let j=0;j<=np;j++){const gain=directionalGain(i*180/nt,j*360/np,c,temp);values.push(gain);peak=Math.max(peak,gain);}
  const color=new THREE.Color();let k=0;
  for(let i=0;i<=nt;i++)for(let j=0;j<=np;j++){const theta=i*Math.PI/nt,phi=j*2*Math.PI/np,gain=values[k++],u=THREE.MathUtils.clamp((gain-peak-floor)/(-floor),0,1),radius=linear?Math.pow(10,(gain-peak)/10):Math.max(0.025,u);positions.push(radius*Math.sin(theta)*Math.cos(phi),radius*Math.sin(theta)*Math.sin(phi),radius*Math.cos(theta));color.setHSL(0.65*(1-u),0.85,0.52);colors.push(color.r,color.g,color.b);if(i<nt&&j<np){const a=i*(np+1)+j,b=a+np+1;indices.push(a,b,a+1,b,b+1,a+1);}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();return {geo,peak};
}
export class RadiationScene{
  constructor(container){this.container=container;this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#101923');this.camera=new THREE.PerspectiveCamera(40,1,0.01,30);this.camera.position.set(2.7,1.8,3.1);this.renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));container.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','3D antenna radiation pattern; drag to rotate; radial scale is relative gain');this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.minDistance=1.3;this.controls.maxDistance=9;this.scene.add(new THREE.HemisphereLight(0xffffff,0x283447,3));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(3,4,4);this.scene.add(light);this.scene.add(new THREE.AxesHelper(1.3));
    this.target=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(),1.4,0xffffff,0.09,0.04);this.scene.add(this.target);
    this.mesh=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:0.6,metalness:0,transparent:true,opacity:0.92}));this.scene.add(this.mesh);
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(container);this.resize();
  }
  update(c,frame,linear=false){this.mesh.visible=rfState(c,frame.temp).supported;this.peak=null;if(this.mesh.visible){const {geo,peak}=radiationGeometry(c,frame.temp,-30,linear);this.mesh.geometry.dispose();this.mesh.geometry=geo;this.peak=peak;}this.target.setDirection(new THREE.Vector3(...frame.rfAngles.vector));this.resize();}
  resize(){const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
  render(){this.controls.update();this.renderer.render(this.scene,this.camera);}
  capture(){this.render();return this.renderer.domElement.toDataURL('image/png');}
}
