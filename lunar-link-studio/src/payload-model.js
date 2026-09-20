import * as THREE from 'three';
import {BOARD_LAYOUT} from './payload-design.js';

// Component-level visual allocation only: no selected flight parts or routed ECAD.
export function buildPayloadInternals(view) {
  const base=view.base;
  const mat=color=>new THREE.MeshStandardMaterial({color,roughness:0.65,metalness:0.15});
  const black=mat('#202a2f'),metal=mat('#c1c6c6'),gold=mat('#d6b163');
  view.box([0.094,0.004,0.094],'white',base,[0,0.002,0]);
  view.payloadCover=new THREE.Group();base.add(view.payloadCover);
  const cover=new THREE.MeshStandardMaterial({color:'#12b9c2',transparent:true,opacity:0.19,metalness:0.2,roughness:0.4,depthWrite:false});
  for(const sign of [-1,1]){
    view.box([0.002,0.10,0.094],cover,view.payloadCover,[sign*0.047,0.054,0]);
    view.box([0.094,0.10,0.002],cover,view.payloadCover,[0,0.054,sign*0.047]);
  }
  for(const x of [-0.044,0.044])for(const z of [-0.044,0.044]){
    view.box([0.004,0.10,0.004],'ours',base,[x,0.054,z]);
    view.mesh(new THREE.CylinderGeometry(0.0015,0.0015,0.093,8),gold,base,[x,0.050,z]);
  }
  view.pcbGroups=[];
  for(const [index,layout] of BOARD_LAYOUT.entries()){
    const group=new THREE.Group();group.name=layout.id;group.position.y=layout.y;base.add(group);view.pcbGroups.push(group);
    view.box([0.080,0.0016,0.078],mat(layout.color),group,[0,0,0]);
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d');
    ctx.fillStyle=layout.color;ctx.fillRect(0,0,512,512);ctx.strokeStyle='#baab68';ctx.lineWidth=2;
    for(let i=0;i<14;i++){const a=25+i*31;ctx.beginPath();ctx.moveTo(10,a);ctx.lineTo(70+(i%4)*30,a);ctx.lineTo(150+(i%4)*30,a+18);ctx.lineTo(500,a+18);ctx.stroke();}
    ctx.fillStyle='#cce5d5';ctx.font='bold 25px monospace';ctx.fillText(['HOST BUS / DC-DC','AZ + EL DRIVERS','MCU / IMU / I-O'][index],18,39);ctx.font='18px monospace';ctx.fillText('CONCEPT PCB · NOT ROUTED',18,486);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const top=view.mesh(new THREE.PlaneGeometry(0.078,0.076),new THREE.MeshStandardMaterial({map:texture,roughness:0.8}),group,[0,0.00085,0]);top.rotation.x=-Math.PI/2;
    function chip(x,z,w,d,h=0.003){view.box([w,h,d],black,group,[x,h/2+0.001,z]);for(const side of [-1,1])for(let n=0;n<6;n++)view.box([0.002,0.0007,0.0008],metal,group,[x+side*(w/2+0.0008),0.0018,z-d/2+0.001+n*(d-0.002)/5]);}
    if(index===0){chip(-0.014,-0.006,0.019,0.019,0.006);chip(0.015,0.011,0.012,0.014);view.box([0.010,0.007,0.010],metal,group,[0.016,0.0045,-0.017]);}
    else if(index===1){chip(-0.016,0,0.017,0.022,0.004);chip(0.016,0,0.017,0.022,0.004);}
    else {chip(-0.004,0,0.021,0.021,0.002);chip(0.022,-0.020,0.008,0.009,0.002);chip(-0.024,0.021,0.012,0.008,0.002);}
    for(let i=0;i<7;i++){view.box([0.003,0.0015,0.0018],i%2?gold:metal,group,[-0.027+i*0.008,0.0023,0.026]);view.box([0.003,0.0015,0.0018],metal,group,[-0.027+i*0.008,0.0023,-0.028]);}
    view.box([0.029,0.006,0.007],black,group,[0,0.004,-0.034]);
    for(let i=0;i<10;i++)view.box([0.0008,0.005,0.0008],gold,group,[-0.012+i*0.0026,0.007,-0.034]);
  }
  const hostConnector=view.box([0.024,0.008,0.010],metal,base,[0.014,0.010,-0.039]);hostConnector.name='Lander power / data input';
  view.box([0.008,0.008,0.008],gold,base,[-0.022,0.010,-0.039]).name='Host RF coax interface';
  // Conductive base/strap, not an onboard heater.
  view.box([0.012,0.003,0.048],gold,base,[-0.027,0.007,0.009]).name='Thermal strap to lander interface';
  const wire=(points,color,radius=0.001)=>view.mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),24,radius,6,false),mat(color),base);
  wire([[0.014,0.014,-0.039],[0.03,0.020,-0.03],[0.033,0.049,-0.033],[0.028,0.080,-0.029]],'#c65b53');
  wire([[-0.022,0.014,-0.039],[-0.03,0.08,-0.033],[-0.027,0.12,-0.03],[0,0.143,-0.026],[0,0.1525,-0.009]],'#d5a84c',0.0012).name='Illustrative RF service loop; not cable dynamics';
}
