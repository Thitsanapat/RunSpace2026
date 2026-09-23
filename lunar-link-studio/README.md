# Lunar Link Studio 1.5.0

รุ่น 1.5.0 เปลี่ยน antenna baseline เป็น compact S-band CP patch profile ที่ใช้ข้อมูล flight-proven AC-2000: 2.0–2.3 GHz, gain 5.2 dBic, footprint ประมาณ 50.8 × 50.8 mm และ conservative radiation cut จาก datasheet. ANSER 2025 ยังคงเป็น research benchmark ที่ 2.205 GHz สำหรับ S11/AR/gain/qualification แต่แผ่น 80 mm ไม่ผ่าน full gimbal sweep ปัจจุบัน. อ่านเหตุผลและ requirement gates ที่ [ANTENNA-BASELINE-DECISION.md](ANTENNA-BASELINE-DECISION.md).

โปรแกรมจำลองเสาอากาศบน lunar lander พร้อม 3D และการคำนวณ เปิดใช้งานในเครื่องได้ มี source code และ production build ครบ

## Multi-view reference และ GitHub Pages

รุ่น 1.4.1 เพิ่ม folded equipment panels พร้อมช่องทะลุ 6 ช่อง, side X-braces, deck access plates, น็อตและปลอกขา ตามภาพหลายมุมล่าสุด. Payload cyan ยังแทน green bay เดิมพร้อมวงจร 3 ชั้น; ไม่เปลี่ยน numerical hull/mount/2U constraints. รูปทรงที่ไม่เห็นยังประมาณ ไม่ใช่ ispace CAD.

เปิด **White studio** เพื่อดูพื้นขาวแบบภาพอ้างอิง. **Side / Top / Bottom** ใช้ orthographic projection; **Isometric** เป็นมุม perspective ที่หมุนตรวจได้. ภาพ `test-results/reference-*.png` และ GLB ใน `examples` อัปเดตจากโมเดลนี้.

GitHub Pages: https://Thitsanapat.github.io/RunSpace2026/ — workflow build/test/deploy เมื่อ push `main`. ดู [PAGES.md](PAGES.md) สำหรับการตั้งค่าและการทดสอบ project subpath.

## เปิดโปรแกรม

ดับเบิลคลิก `START.cmd` (ต้องมี Node.js 22 ขึ้นไป) แล้วเปิด http://127.0.0.1:4173 หากมี server เปิดอยู่แล้ว ใช้หน้าต่างเดิมและ refresh ได้เลย ไม่ต้องติดตั้ง dependencies เพื่อเปิด production build ที่ให้มา

## ใหม่ในรุ่น 1.4: สัดส่วนจากภาพล่าสุดและวงจรภายใน 2U

ขยายสัดส่วนดาดฟ้า/ลดความสูงแผงข้างตามภาพที่ส่งเพิ่ม และย้ายโมดูล cyan ไป **แทน green surface-payload block หนึ่งตำแหน่ง**. เพิ่ม PCB 3 ชั้น (power protection/DC-DC, motor drivers, MCU/sensor interfaces), connectors, thermal strap และสายประกอบภาพ. ใช้ไฟ/ความร้อนจาก lander ไม่มีแบตเตอรี่หรือฮีตเตอร์ในโมดูล. นี่คือ component allocation ไม่ใช่วงจร ECAD ที่ออกแบบหรือผ่าน qualification แล้ว.

กด **Payload 2U**, ปิด **Payload cover**, เปิด **Exploded view** เพื่อดูภายใน. ด้านล่างมี **2U assembly screening**: แผนที่ azimuth/elevation รวมกรอบ มอเตอร์ หัวต่อและพื้นที่โค้งสาย; **Lander bus interface**: current/inrush allocation, harness drop และ capacitor hold-up. ปรับพารามิเตอร์ใน sidebar และส่งออกด้วย **Export design study**.

**2U รวม gimbal ผ่านเฉพาะ concept screening:** compact baseline ผ่าน 100% ของ sampled 5° bounding-box grid โดยมี concept clearance มากกว่า 5 mm. ผลนี้ยังไม่ใช่ exact CAD/tolerance/cable qualification. เมื่อเลือก ANSER 80 × 80 × 7 mm ซิมจะแสดง interference ตามจริง. อ่าน [PAYLOAD-DESIGN.md](PAYLOAD-DESIGN.md) และ [ANTENNA-BASELINE-DECISION.md](ANTENNA-BASELINE-DECISION.md).

## โมเดลจากรูปขยายสองมุม

ปรับตามภาพ oblique และ underside ที่ผู้ใช้ส่งเพิ่ม: กล่องแดงด้านบน, โซนเขียว, กล่องน้ำเงิน/เหลืองด้านล่าง, แผงสีเทาและหน้าช่องกลมหกช่อง, โครงใต้ยานวงกลมพร้อม lattice/ชิ้นส่วนกลมสามตำแหน่ง, ขาค้ำและฐานรองสี่ขา. **โมดูลของเราใช้สีฟ้าอมเขียว** ในโซนเขียว. กล่องสีน้ำเงินเป็น service payload blocks ตาม legend ในแผ่นข้อมูล; แก้การตีความเป็นแผงโซลาร์ในรุ่นก่อน.

แสดงทุกกลุ่ม payload ตั้งแต่เปิดซิม. กด **Underside** เพื่อดูใต้ยานโดยซ่อนพื้นและเพิ่มแสงสำหรับตรวจโมเดล; กลับ Orbit เพื่อคืนฉาก. ปุ่ม **Download 3D .glb** ส่งออก mesh หน่วยเมตรสำหรับเปิดในโปรแกรม 3D. มีไฟล์ตัวอย่าง [ispace-photo-concept-with-our-2u.glb](examples/ispace-photo-concept-with-our-2u.glb).

ภาพนี้เป็นการสร้างรูปทรงจากภาพถ่าย ไม่ใช่ ispace CAD. ส่วนที่บังใช้รูปทรงสมมาตร/ตำแหน่งสมมติ และกล่องสีต่าง ๆ แสดงบริการทางเลือกพร้อมกันเพื่อเทียบภาพ ไม่ใช่ manifest ภารกิจจริง. ซิมมวล/LOS/contact ใช้ข้อกำหนด 2U ของเราและ hull/foot proxy; v1.4 ปรับ hull กับ mount ให้ตรงสัดส่วนใหม่ แต่ไม่เพิ่มผลของกล่องที่วาดโดยอัตโนมัติ. [รายละเอียด](SURFACE-MODEL.md)

## ใหม่ในรุ่น 1.3: Top-mounted surface payload

โมเดล lander ทรงหลายเหลี่ยม แผงอุปกรณ์และกล่องบริการตามภาพ และโซน payload ตามภาพแผ่นข้อมูล ispace ที่ผู้ใช้ส่งมา (ก.ค. 2026). เลือก **Surface Payload ด้านบนโซนสีเขียว**: service limit ≈4 kg / 200 mm cube; งานเราคงกรอบรวม **2U และ ≤1.5 kg**. เพิ่ม total mass, service/project margin, mount/envelope check และแรงกระแทกที่ interface. ดู [SURFACE-MODEL.md](SURFACE-MODEL.md) สำหรับสมมติฐานและผลที่เปลี่ยน.

กด **Mount** เพื่อดูโมดูลบนยาน หรือ **Payload 2U** เพื่อแยกดูโมดูล. **Brochure payloads · visual only** เปิด/ปิดกล่องบริการตามแผ่นข้อมูล. ค่าเดิมที่บันทึกไว้ยังโหลดได้; กด **Restore top-zone mount** เพื่อใช้ตำแหน่งใหม่โดยคง RF และค่าที่แก้เองไว้.

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
- ตรวจมุมแผ่นเสากับกรอบ 2U ทุก timestep; compact baseline ผ่าน plate sweep ส่วน ANSER 80 mm ถูกหยุดเมื่อชนกรอบ
- Antenna & RF มี reference profiles จากงานวิจัย, สูตร beam/link budget แทนค่าจริง, gain pattern CSV และเครื่องคำนวณ patch
- Heater อยู่ที่ lander; คำนวณอุณหภูมิ lander และ payload แยกกันผ่าน thermal conductance
- แยก payload power, RF DC power และ heater power รวมถึงกรณี thermal contact หรือ host power ขาด
- 50 ms command latency แยกจาก motor settling time

## ทดลองกรณีสำคัญ

1. เลือก **Off-nominal landing** → Run scenario: เสาจะค้างช่วงกระแทกก่อนเริ่มชี้เป้า
2. กด **Payload 2U** และเลื่อนเวลาเพื่อดู antenna sweep; กล่องเส้นคือกรอบ payload โดยรวม
3. เลือก **Nose-down impact**, **Inverted / buried** และ **Host power lost** เพื่อดูข้อจำกัดที่ gimbal แก้ไม่ได้
4. แท็บ **Antenna & RF** เลือก Mission-fit compact patch, INTA/ANSER หรือ Tigrisat; อ่านหมายเหตุ measured / simulated / assumed ก่อนใช้ตัวเลข
5. แท็บ **Environment** รัน 24 ชั่วโมงใน Dust & cold และ Hot surface stress; กราฟน้ำเงินคือ payload สีส้มคือ lander
6. แท็บ **Batch analysis** ทดสอบ motor step และ Monte Carlo; ต้องมีเวลาสังเกตอย่างน้อย 1 s หลัง vibration window + rest hold + 2 s acquisition allowance
7. Export run → JSON, CSV, report Markdown หรือภาพ 3D PNG เพื่อเก็บหลักฐาน

## เอกสารประกอบ

- [ANTENNA-BASELINE-DECISION.md](ANTENNA-BASELINE-DECISION.md): candidate screen, requirement gates, link calculation และช่องว่างที่ต้องปิดก่อน CDR

- [ENGINEERING-NOTES.md](ENGINEERING-NOTES.md): ข้อแก้ไขจาก proposal, คำนวณ antenna/beam/RF, thermal และแผนพิสูจน์ด้วยฮาร์ดแวร์
- [POWER-THERMAL-COMMS.md](POWER-THERMAL-COMMS.md): เงื่อนไข Earth link, power modes จาก lander และแผนจัดการ RF/thermal ในเคสร้อน
- [VALIDATION.md](VALIDATION.md): ผลทดสอบซอฟต์แวร์และตัวเลขที่ทำซ้ำได้
- `src/research.js`: แหล่งอ้างอิงและ provenance ของ antenna profiles
- `public/example-pattern.csv`: ตัวอย่างข้อมูลสังเคราะห์ ไม่ใช่ pattern วัดจริง

## ขอบเขต

เป็น reduced-order engineering simulator ไม่ใช่ electromagnetic solver, CAD/FEA หรือ flight qualification. ภาพ 3D เป็น concept geometry; การตรวจขอบเขตครอบคลุมแผ่นเสาเท่านั้น ยังไม่ได้พิสูจน์สาย RF, bearing, yoke และ actuator ทั้งชุด. ท่าของ lander เป็น input trajectory ไม่ได้คำนวณ rigid-body impact/contact. ตรวจ obstruction ด้วย hull box + ground plane + horizon mask; แผงอุปกรณ์ส่วนบน กล่องบริการ และก้อนหินในฉากยังไม่เข้าการคำนวณ

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
