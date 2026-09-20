# Ultra Smooth Landing — แผนเตรียม Final Review
**RunSpace Innovation Challenge 2026** | Deck due: 24 ก.ย. | Live Demo: 3 ต.ค.

---

## 1. สรุป Feedback จาก Preliminary Judging Panel

### จุดแข็ง (รักษาไว้ในเวอร์ชันใหม่)
- แนวคิด decouple การสื่อสารออกจาก attitude ของยาน — panel มองว่าเป็น design insight ที่ดีเด่น
- อ้างอิงจาก 3 เคสจริง (Hakuto-R, IM-2, SLIM) แน่นและน่าเชื่อถือ
- ระบุ failure mode ที่เกิดซ้ำและ mission-critical ได้ชัดเจน
- TAM/SAM/SOM คำนวณมาดี มีตัวเลขรองรับ
- Direct-drive gear-free design (<1.5kg) ที่ทำหน้าที่เป็น passive read-only telemetry backup — โดนใจกรรมการ

### สิ่งที่ต้องแก้/เติม (priority สูงสุด — panel ถามตรงชื่อ)
1. **Regolith ingress protection** — ฝุ่นดวงจันทร์เข้าไปติดขัดกลไก gimbal ได้ ต้องมีแผนป้องกัน (seal, labyrinth seal, dust mitigation coating)
2. **Thermal survival plan สำหรับ actuator ช่วงกลางคืนบนดวงจันทร์** — ต้องมี survival heater budget, thermal isolation, หรือขยายเรื่อง MoS₂ dry lubricant ที่มีอยู่แล้ว
3. **Mechanical shock tolerance ตอน touchdown แรง-g สูง** — ต้องมีตัวเลข g-load ที่ออกแบบรองรับ + วิธีทดสอบ
4. **อธิบายว่าทำไม gimbal-mounted antenna (ซึ่งเป็นเทคโนโลยีที่มีอยู่แล้วบนพื้น/อากาศยาน) ยังไม่เคยถูกใช้กับ lander** — ต้องเทียบ terrestrial gimbal vs space-qualified (mass, vacuum lubrication, radiation, launch vibration spec) และอธิบายความยากในการ apply

> ข้อ 4 คือจุดที่เปลี่ยนภาพจาก "เอาของเก่ามาใช้ใหม่" เป็น "เรา engineer เพื่อให้ mature tech ใช้งานได้จริงในบริบทที่ไม่เคยมีใครทำได้" — ควรเป็น theme หลักของ deck ใหม่

---

## 2. โครงสร้าง 20 สไลด์ (เพิ่มจาก 10 เดิม)

**Section 1-5 เดิม** (Background, Key Concept, Influence, Business, Annex) — คงไว้ตามเดิม แต่แทรกสไลด์ตอบ feedback เข้าไปใน Section 2

**สไลด์ที่เพิ่มใหม่ (10 หน้า):**

| # | หัวข้อ | เนื้อหา |
|---|--------|---------|
| 1 | Dust & Thermal Protection Plan | seal design, MoS₂ lubricant + survival heater power budget, lunar-night power draw |
| 2 | Mechanical Shock Analysis | target g-load, structural margin, การคำนวณ/FEA เบื้องต้น |
| 3 | Why Gimbal Hasn't Been Used on Landers Before | เทียบ terrestrial gimbal vs space-qualified: mass, vacuum lubrication, radiation, vibration spec |
| 4-5 | 3D CAD Design | exploded view, cross-section ที่ชี้ seal/dust protection, render ติดตั้งบน lander, mass budget จาก CAD จริง |
| 6-7 | Control/Dynamics Simulation | MATLAB/Simulink: step response, settling time, overshoot ที่พิสูจน์ ±0.5° และ <50ms |
| 8 | Structural/Thermal Simulation | FEA shock load (ANSYS/SolidWorks Sim) + thermal simulation ช่วง lunar night |
| 9 | Verification & Test Plan (Flight Model) | ตาราง environmental test ที่วางแผนไว้ (vibration, thermal-vacuum, dust chamber) — pathway จาก PoC ไป flight-qualified |
| 10 | Risk Register + Development Roadmap | technical/schedule/supply-chain risk พร้อม mitigation + timeline |

*(หมายเหตุ: เดิมมีหน้า Prototype Test Data แยกต่างหาก — ถ้าตัดออกตามที่คุยกัน ให้เพิ่ม weight ให้ simulation/FEA/CAD ในหน้าที่ 6-8 แทน และเตรียมคำตอบสำหรับ Q&A ว่าทำไมยังไม่มี prototype ทดสอบจริง เก็บเวลาไปทุ่มกับ live demonstration วันที่ 3 ต.ค. แทน)*

---

## 3. ลำดับความสำคัญถ้าเวลาไม่พอ

1. ตอบ feedback ทั้ง 3 ข้อให้ชัด (dust/thermal, shock, why-not-before) — พลาดไม่ได้
2. PID simulation กราฟจริงจาก MATLAB/Simulink — เลข ±0.5°/<50ms ต้องมีหลักฐานรองรับ ไม่งั้นจะโดนจี้ใน Q&A
3. 3D CAD ที่แสดงกลไก seal/dust protection จริง
4. ที่เหลือ (FEA, test plan, risk register) เติมตามเวลาที่มี

---

## 4. เครื่องมือแนะนำ

- **3D Design:** Fusion 360 (ฟรีสำหรับนักศึกษา, มี simulation ในตัว) หรือ SolidWorks
- **Control loop simulation:** MATLAB/Simulink — ใช้ทำ step response ของ PID ตรงตามที่วางไว้ในสไลด์เดิม
- **FEA/Thermal:** ANSYS Student (ฟรี) หรือ SolidWorks Simulation
