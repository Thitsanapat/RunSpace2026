# Lunar Link Studio 1.3.0

โปรแกรมจำลองเสาอากาศบน lunar lander พร้อม 3D และการคำนวณ เปิดใช้งานในเครื่องได้ มี source code และ production build ครบ

## เปิดโปรแกรม

ดับเบิลคลิก `START.cmd` (ต้องมี Node.js 22 ขึ้นไป) แล้วเปิด http://127.0.0.1:4173 หากมี server เปิดอยู่แล้ว ใช้หน้าต่างเดิมและ refresh ได้เลย ไม่ต้องติดตั้ง dependencies เพื่อเปิด production build ที่ให้มา

## ใหม่ในรุ่น 1.3: Top-mounted surface payload

โมเดล lander ทรงหลายเหลี่ยม แผงโซลาร์เอียง และโซน payload ตามภาพแผ่นข้อมูล ispace ที่ผู้ใช้ส่งมา (ก.ค. 2026). เลือก **Surface Payload ด้านบนโซนสีเขียว**: service limit ≈4 kg / 200 mm cube; งานเราคงกรอบรวม **2U และ ≤1.5 kg**. เพิ่ม total mass, service/project margin, mount/envelope check และแรงกระแทกที่ interface. ดู [SURFACE-MODEL.md](SURFACE-MODEL.md) สำหรับสมมติฐานและผลที่เปลี่ยน.

กด **Mount** เพื่อดูโมดูลบนยาน หรือ **Payload 2U** เพื่อแยกดูโมดูล. **Other service envelopes** แสดงกรอบทางเลือกสีแดง/น้ำเงิน/เหลือง. ค่าเดิมที่บันทึกไว้ยังโหลดได้; กด **Restore top-zone mount** เพื่อใช้ตำแหน่งใหม่โดยคง RF และค่าที่แก้เองไว้.

ตำแหน่งใหม่ในกรณีเอียง 65° ถูก hull proxy บังสัญญาณ แม้ pointing error <0.5°. ผลนี้ตั้งใจแสดงตาม geometry ไม่ใช่ทำให้ทุกกรณีผ่าน. เปิด preset Nominal เพื่อดูตำแหน่งก่อนยานเอียง.

## แก้ไขในรุ่น 1.2.1

ค่ารวมของ pattern ใช้ gain หลังผลของความถี่ อุณหภูมิ และ loss เช่นเดียวกับภาพ 3D และ link budget. เมื่อความถี่อยู่นอกข้อมูล ซ่อน pattern และไม่อนุญาตให้ส่งออก grid. การส่งออก RF จะคำนวณจากค่ากับเวลาที่เลือกล่าสุดทันที และ CSV ที่ส่งออกมี metadata เพื่อให้นำกลับเข้าได้โดยไม่หัก loss ซ้ำ. ผ่าน unit tests 32 กรณีและ RF browser workflow; ดู [VALIDATION.md](VALIDATION.md).

## ใหม่ในรุ่น 1.2: Antenna & RF laboratory

อ่าน [ANTENNA-LAB.md](ANTENNA-LAB.md) สำหรับรายละเอียดกราฟ พารามิเตอร์ สมการ การนำเข้าข้อมูล และ mapping กับ Proposal (2). เพิ่ม 3D radiation, θ–φ grid import, frequency response import, S11/AR, received power/noise, bandwidth gate และ sensitivity sweeps

เข้าหน้า **Antenna & RF** แล้วใช้ **Inspect mission time** เพื่อดู Earth LOS ใน antenna frame. ไฟล์ตัวอย่าง CSV ใน `public` เป็นข้อมูลสังเคราะห์สำหรับทดสอบเท่านั้น. ผลตัวอย่าง `examples/antenna-rf-study.json` มีกราฟทุกชุดในรูปข้อมูล

ทดสอบ RF UI เพิ่มด้วย `node tests/rf-browser.mjs`

## สิ่งที่เปลี่ยนจากรุ่นแรก

- แยก payload จาก lander; **100 × 100 × 200 mm รวม antenna และ gimbal ทั้งหมด** ปุ่ม **Payload 2U** แสดงโมดูลแยกในขนาดจริง
- จำลอง landing lock → rest confirmation → acquisition; vibration เป็น transient หลัง touchdown แล้วหยุด
- เพิ่มลงตะแคง ลงปัก คว่ำ/จมพื้น ไฟ lander หาย และพื้นผิว +170°C รวม 11 presets
- ตรวจมุมแผ่นเสากับกรอบ 2U ทุก timestep; หยุดเมื่อชนกรอบ ไม่ได้ถือว่าเสาขนาด 80 mm หมุนได้ครบทุกทิศ
- Antenna & RF มี reference profiles จากงานวิจัย, สูตร beam/link budget แทนค่าจริง, gain pattern CSV และเครื่องคำนวณ patch
- Heater อยู่ที่ lander; คำนวณอุณหภูมิ lander และ payload แยกกันผ่าน thermal conductance
- แยก payload power, RF DC power และ heater power รวมถึงกรณี thermal contact หรือ host power ขาด
- 50 ms command latency แยกจาก motor settling time

## ทดลองกรณีสำคัญ

1. เลือก **Off-nominal landing** → Run scenario: เสาจะค้างช่วงกระแทกก่อนเริ่มชี้เป้า
2. กด **Payload 2U** และเลื่อนเวลาเพื่อดู antenna sweep; กล่องเส้นคือกรอบ payload โดยรวม
3. เลือก **Nose-down impact**, **Inverted / buried** และ **Host power lost** เพื่อดูข้อจำกัดที่ gimbal แก้ไม่ได้
4. แท็บ **Antenna & RF** เลือก INTA/ANSER หรือ Tigrisat; อ่านหมายเหตุ measured / simulated / assumed ก่อนใช้ตัวเลข
5. แท็บ **Environment** รัน 24 ชั่วโมงใน Dust & cold และ Hot surface stress; กราฟน้ำเงินคือ payload สีส้มคือ lander
6. แท็บ **Batch analysis** ทดสอบ motor step และ Monte Carlo; ต้องมีเวลาสังเกตอย่างน้อย 1 s หลัง vibration window + rest hold + 2 s acquisition allowance
7. Export run → JSON, CSV, report Markdown หรือภาพ 3D PNG เพื่อเก็บหลักฐาน

## เอกสารประกอบ

- [ENGINEERING-NOTES.md](ENGINEERING-NOTES.md): ข้อแก้ไขจาก proposal, คำนวณ antenna/beam/RF, thermal และแผนพิสูจน์ด้วยฮาร์ดแวร์
- [VALIDATION.md](VALIDATION.md): ผลทดสอบซอฟต์แวร์และตัวเลขที่ทำซ้ำได้
- `src/research.js`: แหล่งอ้างอิงและ provenance ของ antenna profiles
- `public/example-pattern.csv`: ตัวอย่างข้อมูลสังเคราะห์ ไม่ใช่ pattern วัดจริง

## ขอบเขต

เป็น reduced-order engineering simulator ไม่ใช่ electromagnetic solver, CAD/FEA หรือ flight qualification. ภาพ 3D เป็น concept geometry; การตรวจขอบเขตครอบคลุมแผ่นเสาเท่านั้น ยังไม่ได้พิสูจน์สาย RF, bearing, yoke และ actuator ทั้งชุด. ท่าของ lander เป็น input trajectory ไม่ได้คำนวณ rigid-body impact/contact. ตรวจ obstruction ด้วย hull box + ground plane + horizon mask; แผงโซลาร์/ก้อนหินในฉากยังไม่เข้าการคำนวณ

ระบบรับ attitude ที่ทราบแล้วและเติม bias/noise; ยังไม่มี star tracker, ephemeris หรือ IMU fusion จริง. ช่วงชี้เป้า, ±0.5°, พลังงาน, และ link reserve เป็นคนละเกณฑ์. Link ผ่านไม่ได้แปลว่าผ่านทุกข้อ

RF ตั้งต้นใช้ host transmitter; หาก payload allocation หมด controller หยุด แต่ RF ของ host อาจยังเปิดได้. Fixed baseline มี payload allocation แยกแต่ใช้สถานะ host เดียวกันจาก paired study. Heater เป็นส่วนหนึ่งของ host energy; อย่านำ host + payload + heater มาบวกซ้ำ. ไม่มี battery recharge และไม่ได้รวม housekeeping ทั้ง lander

Thermal study ใช้สอง lumped nodes, timestep ≤1 s, constant sunlight/ground boundary; RF/motors OFF. ±170°C คือ ground boundary ไม่ใช่อุณหภูมิ payload. ฝุ่นเป็น sensitivity law ที่ยังไม่ได้ calibrate. ไม่มี convection ใน vacuum

Monte Carlo สุ่ม Euler roll/pitch/yaw อย่างละ ±180°, bias ±0.3°, dust 0–1; ไม่ใช่การสุ่ม orientation อย่างสม่ำเสมอบนทรงกลม และไม่ใช่อัตราความสำเร็จของภารกิจจริง

## พัฒนาต่อ

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd test
npm.cmd run build
$env:TEST_URL='http://127.0.0.1:4173'
npm.cmd run test:browser
```

Browser tests ใช้ Chrome ที่ติดตั้งในเครื่อง. เปิด server ก่อนทดสอบ (`npm.cmd start` สำหรับ port 4173 หรือ `npm.cmd run dev` สำหรับ 5173)

โครงสร้างหลัก: `engine.js` dynamics/control/RF, `mission.js` geometry/thermal, `research.js` references, `scene.js` Three.js, `main.js` UI, `engineering-ui.js` calculations/report, `analysis.worker.js` batch. Integrator 2 ms; telemetry 40 ms; controller default 100 Hz. ใช้แกน +Y ขึ้น, +Z หน้า, q = yaw(Y) × pitch(X) × roll(Z)
