const COLORS={text:'#82909c',grid:'#26313b',green:'#cced9c',orange:'#e9a278',blue:'#8ab9e6'};
function surface(canvas){const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);if(!rect.width||!rect.height)return null;canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);const ctx=canvas.getContext('2d');ctx.scale(ratio,ratio);ctx.font='10px system-ui';return {ctx,w:rect.width,h:rect.height};}
export function lineChart(canvas,series,options={}) {
  const s=surface(canvas);if(!s)return;const {ctx,w,h}=s,p={l:42,r:16,t:16,b:27},pw=w-p.l-p.r,ph=h-p.t-p.b;
  const points=series.flatMap(a=>a.data).filter(a=>a.y!==null&&Number.isFinite(a.y));if(!points.length)return;
  const xmax=options.xmax??Math.max(...points.map(p=>p.x)),xmin=options.xmin??0;
  let ymin=options.ymin??Math.min(0,...points.map(p=>p.y)),ymax=options.ymax??Math.max(...points.map(p=>p.y));
  if(options.threshold!==undefined){ymin=Math.min(ymin,options.threshold);ymax=Math.max(ymax,options.threshold);}
  if(ymax-ymin<0.1){ymin-=1;ymax+=1;}else{const pad=(ymax-ymin)*0.1;ymin-=pad;ymax+=pad;}
  const x=v=>p.l+(v-xmin)/Math.max(1e-9,xmax-xmin)*pw,y=v=>p.t+(ymax-v)/(ymax-ymin)*ph;
  ctx.lineWidth=1;ctx.textAlign='right';ctx.fillStyle=COLORS.text;
  for(let i=0;i<=4;i++){const val=ymin+(ymax-ymin)*i/4,yy=y(val);ctx.strokeStyle=COLORS.grid;ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(w-p.r,yy);ctx.stroke();ctx.fillText(Math.abs(val)>=100?val.toFixed(0):val.toFixed(1),p.l-8,yy+3);}
  ctx.textAlign='center';for(let i=0;i<=4;i++){const val=xmin+(xmax-xmin)*i/4;ctx.fillText(`${val.toFixed(xmax>20?0:1)}${options.xunit||'s'}`,x(val),h-8);}
  if(options.event!==undefined){ctx.strokeStyle='#76828a';ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(x(options.event),p.t);ctx.lineTo(x(options.event),h-p.b);ctx.stroke();ctx.setLineDash([]);}
  if(options.threshold!==undefined){ctx.strokeStyle='#8e9d77';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(p.l,y(options.threshold));ctx.lineTo(w-p.r,y(options.threshold));ctx.stroke();ctx.setLineDash([]);}
  ctx.save();ctx.beginPath();ctx.rect(p.l,p.t,pw,ph);ctx.clip();
  for(const item of series){ctx.strokeStyle=item.color;ctx.lineWidth=item.width||1.7;ctx.beginPath();let down=false;for(const v of item.data){if(v.y===null||!Number.isFinite(v.y)){down=false;continue;}if(down)ctx.lineTo(x(v.x),y(v.y));else {ctx.moveTo(x(v.x),y(v.y));down=true;}}ctx.stroke();}
  if(options.cursor!==undefined){ctx.strokeStyle='#e3e8ed';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x(options.cursor),p.t);ctx.lineTo(x(options.cursor),h-p.b);ctx.stroke();}
  ctx.restore();
}
export function patternChart(canvas,gainAt,peak){const s=surface(canvas);if(!s)return;const{ctx,w,h}=s,cx=w/2,cy=h/2+9,r=Math.min(w*0.39,h*0.43);ctx.textAlign='center';ctx.fillStyle=COLORS.text;
  for(let j=1;j<=4;j++){ctx.strokeStyle=COLORS.grid;ctx.beginPath();ctx.arc(cx,cy,r*j/4,0,Math.PI*2);ctx.stroke();ctx.fillText(`${(-40+j*10).toFixed(0)} dB`,cx+22,cy-r*j/4-3);}
  for(let a=0;a<360;a+=30){const t=a*Math.PI/180;ctx.strokeStyle=COLORS.grid;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(t)*r,cy-Math.cos(t)*r);ctx.stroke();if(a%90===0)ctx.fillText(`${a}°`,cx+Math.sin(t)*(r+17),cy-Math.cos(t)*(r+17)+3);}
  ctx.beginPath();for(let a=0;a<=360;a++){const err=a>180?360-a:a,value=gainAt(err),rr=r*Math.max(0,(value-peak+40)/40),t=a*Math.PI/180;const xx=cx+Math.sin(t)*rr,yy=cy-Math.cos(t)*rr;if(!a)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.closePath();ctx.fillStyle='#cced9c12';ctx.fill();ctx.strokeStyle=COLORS.green;ctx.lineWidth=2;ctx.stroke();
}
export function scatterChart(canvas,rows){const s=surface(canvas);if(!s)return;const{ctx,w,h}=s,p=36,ww=w-p*2,hh=h-p*2;ctx.strokeStyle=COLORS.grid;ctx.fillStyle=COLORS.text;ctx.textAlign='center';
  for(let i=0;i<=4;i++){const xx=p+ww*i/4,yy=p+hh*i/4;ctx.beginPath();ctx.moveTo(xx,p);ctx.lineTo(xx,h-p);ctx.moveTo(p,yy);ctx.lineTo(w-p,yy);ctx.stroke();ctx.fillText(`${-180+i*90}°`,xx,h-14);ctx.fillText(`${180-i*90}°`,18,yy+3);}
  for(const row of rows){ctx.fillStyle=row.pass?COLORS.green:COLORS.orange;ctx.globalAlpha=0.72;ctx.beginPath();ctx.arc(p+(row.pitch+180)/360*ww,p+(180-row.roll)/360*hh,4,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
