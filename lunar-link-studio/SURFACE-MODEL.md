# Surface payload concept — v1.3.0

ใช้ภาพแผ่นข้อมูล “Lunar Transportation Service” ของ ispace ที่ผู้ใช้ส่งในบทสนทนา ระบุ “As of July 2026”. ไม่ได้ใช้ไฟล์ CAD ของผู้ให้บริการ และไม่สามารถระบุรุ่น lander หรือมิติจริงจากภาพเพียงอย่างเดียว. ข้อมูลบริการในเอกสารนี้ถอดจากภาพ ไม่ใช่ข้อยืนยันจากการจองบริการหรือ interface control document (ICD).

## เลือกตำแหน่งใด

| ทางเลือกจากภาพ | ข้อความในแผ่นข้อมูล | ใช้กับงานนี้ |
|---|---|---|
| Top / green surface payload | ประมาณ 4 kg, 0.2 m cube; เหมาะกับ communication systems และ antennas | ใช้เป็น candidate ติดอยู่บน lander |
| Top / red orbiter payload | ประมาณ 150 kg, 1.2 m cube; deploy ก่อน landing sequence | แสดงกรอบทางเลือกได้ แต่ไม่ได้ติดตั้ง orbiter จริงในซิม |
| Bottom / blue-yellow surface payload | ประมาณ 50 kg; มี size options; การปล่อยลงพื้นต้องมีกลไกของผู้ใช้ | แสดงกรอบทางเลือกได้ ไม่มีกลไก deployment ในซิม |

มวลต่ำกว่า 1.5 kg อยู่ภายในเพดานมวลของทั้งบริการบนและล่าง การเลือกด้านบนจึงขึ้นกับการติดอยู่กับยานและทิศมองของเสา ไม่ใช่มวลอย่างเดียว. คำว่า clear field of view ในแผ่นข้อมูลไม่รับประกัน Earth LOS ทุกมุมหลังยานล้ม.

## มวลและขนาด

- `payloadMassKg = 1.5` เป็นขอบบนตามที่ผู้ใช้ระบุ ไม่ใช่ผลชั่งหรือมวลที่คำนวณจาก mesh. รวม antenna, gimbal, โครง, electronics, harness และ mount adapter ทั้งหมด.
- Project limit ≤1.5 kg; top service ≈4 kg. ที่ 1.5 kg มี project reserve 0 kg และ service margin 2.5 kg. ยังต้องเผื่อมวลจาก BOM จริง.
- ตรวจ antenna reference mass ≤ moving mass ≤ total mass. `movingMass = 0.15 kg` และ inertia ยังเป็น input สำหรับ motor dynamics โดยเฉพาะ; ไม่แทนด้วยมวลรวมทั้งกล่อง.
- Payload รวมทั้งหมด 100 × 100 × 200 mm = 2 L (2U). Service envelope 200 × 200 × 200 mm = 8 L. ใช้ 25% ของปริมาตร แต่ด้านสูงใช้เต็ม 100% จึงไม่มี height allowance. ฐานยึด/หัวต่อที่เพิ่มด้านสูงอาจทำให้ไม่ผ่าน.
- กรอบในพิกัด Y-up: payload X/Y/Z = 0.1/0.2/0.1 m. ติดตรงกลาง service cube จะเหลือแนวข้าง 50 mm ต่อด้าน; ไม่ใช้ระยะนี้ขยาย gimbal นอกข้อกำหนด 2U.

## Geometry และขอบเขตการคำนวณ

ใหม่: ตัวถังทรงแปดเหลี่ยม หน้าครอบอุปกรณ์ วงโครงบนดาดฟ้า ขารับแรงสี่ขา แผงโซลาร์เอียง และ green mounting pad. สีและสัดส่วนสร้างจากภาพเชิงแนวคิด. Optional service envelopes แสดงขนาดตามภาพแต่ตำแหน่งเป็นสมมติฐาน; ไม่ใช่ manifest ที่บรรทุกทุกกล่องพร้อมกัน.

คง physics proxy เดิม: hull box X = ±0.86 m, Y = −0.55…0.76 m, Z = ±0.76 m; foot centers X = ±1.8 m, Z = ±1.65 m; contact points ที่ Y = −1.155 m. ตัวถังที่ตัดมุมอยู่ใน box จึงเป็นการตรวจ LOS แบบ conservative ในบริเวณมุม. ขนาดเหล่านี้ไม่ใช่ ispace specification. ขา แผงโซลาร์ หิน และกล่องทางเลือกไม่เข้า RF ray intersection; ยังต้องวิเคราะห์ installed antenna ด้วย CAD/EM.

Selected zone center/bottom = `[0.65, 0.76, 0.45]` m ใน body frame. ค่าเก่า mountZ = 0.73 m ยัง import ได้ แต่จะระบุว่าอยู่นอก service zone ที่สมมติ. `Restore top-zone mount` เปลี่ยนเฉพาะ mount XYZ. ตรวจฐานอยู่บนระนาบดาดฟ้าด้วย tolerance 1 mm ซึ่งเป็นเกณฑ์ numerical screening ไม่ใช่ tolerance ของชิ้นส่วนจริง.

มวลรวมเปลี่ยน interface load estimate และการตรวจมวล แต่ไม่เปลี่ยน attitude trajectory หรือ motor inertia โดยอัตโนมัติ. ท่ายานเป็น prescribed motion; ซิมไม่ได้แก้ rigid-body impact/contact.

## ผลที่เปลี่ยนจริง

Nominal ยังมี final margin 8.5566 dB. ที่ตำแหน่งใหม่ preset 65° tip มี final pointing error ประมาณ 0.0926° แต่ hull box บัง LOS: margin ว่าง / link unavailable. Availability ทั้ง run ประมาณ 16.94% มาจากช่วงก่อนถูกบัง ไม่ใช่การกู้ลิงก์หลังลงจอด. Nose-down และ inverted ยังทดสอบข้อจำกัด hull/ground เช่นเดิม. ดูผลทั้ง 11 presets ใน `examples/preset-comparison.csv`.

การเลือกตำแหน่งจริงต้องขอ geometry ของ green zones, bolt pattern, keep-out, CG/inertia limits และ allowable loads. ตำแหน่งภายใน zone นี้เป็นเพียงจุดเริ่มต้น ไม่ใช่ optimization หรือจุดที่ provider อนุมัติแล้ว.

## สมการและ interface ที่ต้องยืนยัน

Lunar static weight `W = m × 1.62`. Peak base acceleration force estimate `F = m × shockG × 9.80665`; เช่น 1.5 kg และ 12 g₀ ให้ 176.5197 N. นี่คือแรงเฉื่อยโดยประมาณ ไม่รวม structural amplification, modal response, gravity vector summation, load factors หรือ stress และไม่ใช่ shock qualification.

Heater ยังอยู่ฝั่ง lander และถ่ายความร้อนผ่าน conductance เดิม. ค่า bus 28 V, host power, thermal node และ heater เป็นสมมติฐานเดิมของงานเรา ไม่ได้ถอดจากภาพผู้ให้บริการ. Surface payload ไม่ได้หมายความว่าได้รับ heater หรือ power allocation ตามค่านี้โดยอัตโนมัติ.

## เปิดดูและทำซ้ำ

รัน `START.cmd`, เลือก Nominal และ rewind เพื่อดูท่าก่อนลงจอด. กด Mount ดูตำแหน่งจริงบนยาน; Payload 2U แยกโมดูล; Other service envelopes แสดงทางเลือกจากแผ่นข้อมูล. เปลี่ยน Total delivered payload mass หรือ mount XYZ เพื่อดู input checks. Export report / scenario JSON มี surface interface assessment และที่มาจากภาพ.

ทดสอบด้วย `npm.cmd test`, `npm.cmd run build`, และ `npm.cmd run test:surface-browser` (ใช้ server ที่ port 4173; เปลี่ยนได้ด้วย `TEST_URL`). ภาพตัวอย่าง: `test-results/surface-lander.png`, `surface-mount.png`, `surface-2u.png`, `surface-zones.png`, `surface-mobile.png`.
