# Surface payload concept — v1.4.0

ภาพล่าสุด `S__86360066/67/68.jpg` ใช้ปรับตัวถังให้กว้างขึ้นและแผงข้างเตี้ยลงเทียบกับ red 1.2 m allocation. โมดูล cyan แทนกล่องเขียวหนึ่งตำแหน่ง ไม่วางซ้อนบนกล่องเขียว. ปรับทั้งโมเดลและ hull/mount proxy ด้านล่างให้สอดคล้องกัน; ขนาด lander ยังคงเป็นสมมติฐานจาก perspective ไม่ใช่มิติจากผู้ให้บริการ. รายละเอียด PCB/2U/host bus อยู่ใน [PAYLOAD-DESIGN.md](PAYLOAD-DESIGN.md).

## รายละเอียดจากภาพขยายที่เพิ่มใน v1.3.1

รูปขยายสองมุมชัดพอสำหรับสร้างภาพ silhouette, สีและตำแหน่งโดยประมาณของชิ้นส่วนที่เห็น แต่ไม่แสดง hidden geometry, fasteners ทั้งหมด หรือ dimensions ของ lander. จึงไม่เรียกโมเดลนี้ว่า exact replica / provider CAD.

เพิ่มกล่องแดง 1 กล่องขนาดอ้างอิง 1.2 m, กล่องน้ำเงินด้านล่าง 2 กล่องขนาดอ้างอิง 0.7 m, ชุดเหลืองด้านล่าง 8 กล่อง (6 กล่อง 0.2 m cube และ 2 กล่อง 0.2 × 0.4 × 0.3 m), กล่องเขียวอีก 1 กล่อง และ green bay ที่ใส่โมดูล cyan ของเรา. จำนวน/การกระจายกล่องเหลืองด้านที่บังเป็นสมมาตรที่สมมติ ไม่ใช่ bill of materials ที่ถอดจากภาพครบทุกชิ้น. ขนาดเลือกจากตัวเลือกใน leaflet ไม่ได้ยืนยันทุกกล่องในภาพมีขนาดนั้น.

ตัวถังมีแผงสีเทาพร้อมรอยต่อ/โครงขอบ, เสาอุปกรณ์ยกสูงสองชุดพร้อมหน้าช่องกลมหกช่อง, ขาลงจอดสี่ชุดพร้อม sleeve/joint/braces และ footpad มีขอบ. ใต้ยานเพิ่มวงแหวน lattice คานไขว้ และชิ้นส่วนกลมสามตำแหน่ง. ไม่ระบุชิ้นส่วนกลมว่าเป็น thruster ชนิดใด เพราะภาพไม่ยืนยันหน้าที่. กล่องสีน้ำเงินแก้เป็น payload blocks ตาม legend ไม่ใช่แผงโซลาร์.

**Brochure payloads · visual only** เปิดทุกกลุ่มสีตั้งต้นเพื่อเทียบภาพ. กล่องเหล่านี้ไม่เพิ่มมวล ไม่เพิ่ม rigid-body contacts และไม่เข้า RF intersection. แผงอุปกรณ์ส่วนบนก็ยังไม่เข้า proxy. การคำนวณ RF เป็นของ payload ทีมบน hull proxy เดิม ไม่ใช่ผลจำลอง installed configuration ที่บรรทุกกล่องแดง/น้ำเงิน/เหลืองทั้งหมด. รายการนี้แสดงบนหน้าจอใกล้โมเดลเพื่อไม่สับสน.

**Underside** ซ่อน terrain และเพิ่ม inspection light เพื่อดูใต้ยาน ไม่ใช่การพลิกยานใน physics. **Download 3D .glb** ส่งออกโมเดลครบแม้อยู่ในมุมมองแยก 2U; checkbox ของ brochure payloads กำหนดว่าจะรวมกล่องบริการหรือไม่. ไฟล์หน่วยเมตร ตั้ง body origin/attitude กลับศูนย์; antenna และ exploded transforms ตามภาพที่เลือก. ไม่ส่งออกพื้น ป้าย ลูกศร และ RF lobe. Metadata เก็บที่มา หน่วย และรายการ allocation; ไม่ใช่ STEP/solid CAD หรือข้อมูลชั่งมวล.

ไฟล์พร้อมใช้ `examples/ispace-photo-concept-with-our-2u.glb`; ภาพล่าสุด `test-results/brochure-overview.png`, `brochure-underside.png`, `brochure-top.png`, `brochure-our-payload.png`, `brochure-mobile.png`.

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

ตัวถังทรงแปดเหลี่ยม หน้าครอบอุปกรณ์ วงโครงบนดาดฟ้า ขารับแรงสี่ขา และ green mounting pad ใช้สัดส่วนเชิงแนวคิด. รายละเอียดรุ่นปัจจุบันอยู่ด้านบน; กล่องที่แสดงพร้อมกันไม่ใช่ manifest ภารกิจ.

ปรับ physics proxy ตามสัดส่วน v1.4: hull box X = ±1.10 m, Y = −0.30…0.76 m, Z = ±1.00 m; foot centers X = ±1.8 m, Z = ±1.65 m; contact points ที่ Y = −1.155 m. แผงข้างสูงประมาณ 0.68 m. ตัวถังที่ตัดมุมอยู่ใน box จึงเป็นการตรวจ LOS แบบ conservative เฉพาะบริเวณมุมของตัวถัง. ขนาดเหล่านี้ไม่ใช่ ispace specification. ขา แผงอุปกรณ์ส่วนบน หิน และกล่องทางเลือกไม่เข้า RF ray intersection; จึงไม่ใช่ conservative guarantee ของยานทั้งลำ และยังต้องวิเคราะห์ installed antenna ด้วย CAD/EM.

Selected zone center/bottom = `[0.92, 0.76, 0.62]` m ใน body frame. ค่าเก่ายัง import ได้ แต่การตรวจ service zone ใช้ศูนย์ใหม่นี้. `Restore top-zone mount` เปลี่ยนเฉพาะ mount XYZ. ตรวจฐานอยู่บนระนาบดาดฟ้าด้วย tolerance 1 mm ซึ่งเป็นเกณฑ์ numerical screening ไม่ใช่ tolerance ของชิ้นส่วนจริง.

มวลรวมเปลี่ยน interface load estimate และการตรวจมวล แต่ไม่เปลี่ยน attitude trajectory หรือ motor inertia โดยอัตโนมัติ. ท่ายานเป็น prescribed motion; ซิมไม่ได้แก้ rigid-body impact/contact.

## ผลที่เปลี่ยนจริง

Nominal ยังมี final margin 8.5566 dB. ที่ตำแหน่งใหม่ preset 65° tip มี final pointing error ประมาณ 0.0926° แต่ hull box บัง LOS: margin ว่าง / link unavailable. Availability ทั้ง run ประมาณ 16.94% มาจากช่วงก่อนถูกบัง ไม่ใช่การกู้ลิงก์หลังลงจอด. Nose-down และ inverted ยังทดสอบข้อจำกัด hull/ground เช่นเดิม. ดูผลทั้ง 11 presets ใน `examples/preset-comparison.csv`.

การเลือกตำแหน่งจริงต้องขอ geometry ของ green zones, bolt pattern, keep-out, CG/inertia limits และ allowable loads. ตำแหน่งภายใน zone นี้เป็นเพียงจุดเริ่มต้น ไม่ใช่ optimization หรือจุดที่ provider อนุมัติแล้ว.

## สมการและ interface ที่ต้องยืนยัน

Lunar static weight `W = m × 1.62`. Peak base acceleration force estimate `F = m × shockG × 9.80665`; เช่น 1.5 kg และ 12 g₀ ให้ 176.5197 N. นี่คือแรงเฉื่อยโดยประมาณ ไม่รวม structural amplification, modal response, gravity vector summation, load factors หรือ stress และไม่ใช่ shock qualification.

Lander จ่ายไฟ 28 V ตามสมมติฐาน แต่ heater ติดอยู่บน payload/gimbal และถ่ายความร้อนเข้า payload node โดยตรง; conductance เดิมแทน parasitic thermal path กลับไปยัง lander interface. ค่า bus, power allocation, thermal node และ heater เป็นสมมติฐานของงานเรา ไม่ได้ถอดจากภาพผู้ให้บริการ. Surface payload ไม่ได้หมายความว่าได้รับ power allocation ตามค่านี้โดยอัตโนมัติ.

## เปิดดูและทำซ้ำ

รัน `START.cmd`, เลือก Nominal และ rewind เพื่อดูท่าก่อนลงจอด. กด Mount ดูตำแหน่งบนยาน; Payload 2U แยกโมดูล; Brochure payloads แสดงกล่องบริการจากแผ่นข้อมูล. เปลี่ยน Total delivered payload mass หรือ mount XYZ เพื่อดู input checks. Export report / scenario JSON มี surface interface assessment และที่มาจากภาพ.

ทดสอบด้วย `npm.cmd test`, `npm.cmd run build`, และ `npm.cmd run test:surface-browser` (ใช้ server ที่ port 4173; เปลี่ยนได้ด้วย `TEST_URL`). ภาพตัวอย่าง: `test-results/surface-lander.png`, `surface-mount.png`, `surface-2u.png`, `surface-zones.png`, `surface-mobile.png`.
