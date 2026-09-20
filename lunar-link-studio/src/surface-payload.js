// Service limits transcribed from the user's ispace leaflet photo (July 2026).
// Coordinates and lander dimensions are concept assumptions, not provider CAD/ICD.
export const SURFACE = Object.freeze({
  id:'ispace-top-concept', name:'Top-mounted surface payload',
  source:'User-provided ispace Lunar Transportation Service leaflet photo, as of July 2026',
  serviceMassKg:4, projectMassKg:1.5, serviceSizeM:0.2,
  mount:Object.freeze([0.92,0.76,0.62]),
  payloadSizeM:Object.freeze([0.1,0.2,0.1]),
  mountingToleranceM:0.001,
});

export function surfaceAssessment(c) {
  const mass=c.payloadMassKg??SURFACE.projectMassKg;
  const footprintClearance=[0,2].map((axis,i)=>(SURFACE.serviceSizeM-SURFACE.payloadSizeM[axis])/2-Math.abs([c.mountX,c.mountZ][i]-SURFACE.mount[axis]));
  const envelopeFits=footprintClearance.every(v=>v>=-1e-9)&&SURFACE.payloadSizeM[1]<=SURFACE.serviceSizeM;
  const mountOnDeck=Math.abs(c.mountY-SURFACE.mount[1])<=SURFACE.mountingToleranceM;
  const massConsistent=c.movingMass<=mass&&c.antennaMassG/1000<=c.movingMass;
  const projectMassPass=mass<=SURFACE.projectMassKg,serviceMassPass=mass<=SURFACE.serviceMassKg;
  return {
    service:SURFACE.id,source:SURFACE.source,massKg:mass,
    projectLimitKg:SURFACE.projectMassKg,serviceLimitKg:SURFACE.serviceMassKg,
    projectMarginKg:SURFACE.projectMassKg-mass,serviceMarginKg:SURFACE.serviceMassKg-mass,
    projectMassPass,serviceMassPass,massConsistent,envelopeFits,mountOnDeck,
    candidateFit:projectMassPass&&serviceMassPass&&massConsistent&&envelopeFits&&mountOnDeck,
    lateralClearanceMm:footprintClearance.map(v=>v*1000),verticalAllowanceMm:0,
    lunarWeightN:mass*1.62,peakInterfaceForceN:mass*c.shockG*9.80665,
    hardwareVerified:false,
  };
}

export const surfaceHTML=`<article class="card surface-card"><div class="card-heading"><div><span class="section-index">HOST</span><h2>Surface payload · top green zone</h2></div><span class="tag green">ATTACHED TO LANDER</span></div><div class="card-padding"><div id="surface-summary" aria-live="polite"></div><div class="surface-actions"><button class="button" id="surface-mount">Restore top-zone mount</button><span>Payload 2U = 100 × 100 × 200 mm · Service envelope = 200 × 200 × 200 mm</span></div><p class="small-note">อ้างอิงภาพแผ่นข้อมูล ispace เดือน ก.ค. 2026: โซนบนสีเขียว ≈4 kg / 0.2 m cube. โมดูลนี้ติดอยู่กับยาน ไม่มีกลไกปล่อยลงพื้น. ตัวถัง จุดยึด และแผงอุปกรณ์ในภาพ 3D เป็นสัดส่วนสมมติจากภาพ ต้องยืนยัน CAD และ interface กับผู้ให้บริการ.</p><p class="small-note">กรอบ 2U สูงเท่ากรอบบริการพอดี จึงยังไม่มีระยะเผื่อด้านสูงสำหรับฐานยึดหรือหัวต่อภายนอก. มวลรวมต้องรวมโครง มอเตอร์ อิเล็กทรอนิกส์ สาย และอะแดปเตอร์; มวลหมุนใช้คำนวณมอเตอร์แยกต่างหาก. ผ่านการตรวจค่าที่กรอกยังไม่ใช่การรับรองฮาร์ดแวร์.</p></div></article>`;

export function renderSurface(c) {
  const a=surfaceAssessment(c),n=(x,d=2)=>x.toFixed(d);
  document.querySelector('#surface-summary').innerHTML=`<div class="surface-metrics"><div><small>ENTERED TOTAL MASS</small><b>${n(a.massKg)} <em>kg</em></b><span>Project ≤1.50 kg · ${a.projectMassPass?'WITHIN LIMIT':'OVER LIMIT'} · reserve ${n(a.projectMarginKg)} kg</span></div><div><small>TOP SERVICE MARGIN</small><b>${n(a.serviceMarginKg)} <em>kg</em></b><span>Leaflet limit ≈4 kg</span></div><div><small>2U IN TOP ZONE</small><b>${a.envelopeFits&&a.mountOnDeck?'INSIDE':'OUTSIDE'}</b><span>Height allowance: 0 mm</span></div><div><small>PEAK INTERFACE LOAD</small><b>${n(a.peakInterfaceForceN,1)} <em>N</em></b><span>m × ${n(c.shockG,1)} g₀ · force estimate</span></div></div><p class="${a.candidateFit?'green-text':'orange-text'}"><b>${a.candidateFit?'CANDIDATE FIT — INPUT CHECK ONLY':'CHECK PAYLOAD INTERFACE'}</b>${!a.massConsistent?' · Antenna mass ≤ moving mass ≤ total mass required.':''}${!a.mountOnDeck?' · Mount Y is off the assumed deck plane.':''}${!a.envelopeFits?' · The 2U envelope extends outside the selected 20 cm zone.':''}</p><p class="small-note">Other service envelopes: red = orbiter (≈150 kg, 1.2 m cube); blue/yellow = bottom surface service (≈50 kg; size options 0.7 × 0.7 × 0.7, 0.2 × 0.4 × 0.3, 0.2 × 0.2 × 0.2 m). These are alternative allocation guides with assumed locations, not installed cargo or RF obstacles.</p>`;
}

export function surfaceReport(c) {
  const a=surfaceAssessment(c);
  return `\n## Surface payload interface\nBasis: ${SURFACE.source}. Top green zone: approximately 4 kg, 200 x 200 x 200 mm. Candidate remains attached to the lander; no deployment mechanism.\nEntered total mass ${a.massKg} kg; project limit 1.5 kg (pass: ${a.projectMassPass}); service mass margin ${a.serviceMarginKg} kg. Moving mass ${c.movingMass} kg is a subset, not the total. Mass hierarchy consistent: ${a.massConsistent}.\n2U lateral fit: ${a.envelopeFits}; on assumed deck: ${a.mountOnDeck}; vertical allowance: 0 mm. External adapters/connectors need their own allocation. Concept mount [${[c.mountX,c.mountY,c.mountZ].join(', ')}] m.\nLunar weight m*1.62 = ${a.lunarWeightN.toFixed(3)} N. Peak interface force m*shockG*9.80665 = ${a.peakInterfaceForceN.toFixed(3)} N; not stress, strength, modal response or qualification.\nLander geometry is reconstructed conceptually from the photograph. Hull LOS/contact retains the conservative box/foot proxy; equipment panels, legs, illustrated payload allocations and labels are not RF obstacles. A nominal clear field of view is not guaranteed after tipping. Host electrical/thermal parameters remain assumptions pending an interface control document.\n\n\`\`\`json\n${JSON.stringify(a,null,2)}\n\`\`\`\n`;
}
