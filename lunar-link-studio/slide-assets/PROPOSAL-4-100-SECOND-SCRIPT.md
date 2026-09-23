# Proposal 4 — สคริปต์ 90 วินาที + เว็บซิม 10 วินาที

สคริปต์นี้ใช้กับสามสไลด์ใน `Ultra Smooth Landing - Proposal (4)` แล้วสลับไปหน้า **Mission** ของเว็บในช่วง 10 วินาทีสุดท้าย

## เตรียมเว็บก่อนพูด

1. เปิดแท็บ **Mission** และเลือก preset **Off-nominal landing**
2. ตั้งความเร็ว **4×** แล้วกด **Rewind**
3. เลือกมุมที่เห็น lander และ gimbal ชัด แต่ยังไม่กดเล่น

## 0–25 วินาที — Slide 1: Lunar Landers Don’t Always Land Upright

> ปัญหาที่เราแก้เกิดขึ้นหลัง touchdown ครับ ภารกิจดวงจันทร์จริงแสดงให้เห็นว่ายานอาจลงแรง เอียง หรือลงจอดในท่าที่ไม่ได้ออกแบบไว้ แม้อุปกรณ์ภายในยังทำงาน แต่เสาอากาศแบบ fixed จะหมุนไปพร้อมลำตัวยาน ทำให้มุมชี้โลกผิดและ link margin ลดลง ดังนั้น landing success อย่างเดียวจึงยังไม่รับประกันว่าจะส่งข้อมูลภารกิจกลับมาได้

**Cue:** ชี้ภาพภารกิจทั้งสาม แล้วจบที่ภาพเสา body-fixed ด้านล่าง

## 25–48 วินาที — Slide 2: Communication is Inherited by Chance

> ความเสียหายต่อเนื่องเป็นสี่ขั้นครับ: landing anomaly เปลี่ยน attitude ของยาน เสาเสีย Earth pointing จากนั้น antenna gain ในทิศโลกและ link margin จึงลดลง จุดอ่อนคือระบบสื่อสารรับความเสี่ยงจากท่าลงจอดมาทั้งหมด เราจึงตั้งโจทย์ว่า หลังยานหยุดนิ่งแล้ว จะทำอย่างไรให้เสาชี้โลกได้โดยไม่ต้องทำให้ทั้งยานกลับมาตั้งตรง

**Cue:** ไล่นิ้วตามหมายเลข 1 ถึง 4 แล้วชี้คำว่า communication vulnerability

## 48–90 วินาที — Slide 3: Decouple Tracking from Lander Attitude

> คำตอบของเราคือ surface payload ขนาดรวมไม่เกิน 2U และ 1.5 กิโลกรัม ใช้กิมบอลสองแกนชี้ circularly polarized S-band patch ที่ 2.205 กิกะเฮิรตซ์ ระหว่างลงจอดกลไกจะล็อกไว้ และเริ่ม repoint หลังยานนิ่งเท่านั้น เราเลือก single patch แทน phased array เพราะใช้ RF chain เดียว ลด phase shifter การคาลิเบรต กำลังไฟ และความร้อนในพื้นที่ 2U ตัว lander จ่ายเฉพาะไฟฟ้า ส่วน RF chain กิมบอล และฮีตเตอร์ที่แยกทางความร้อนติดอยู่บน payload ซิมของเราตรวจทั้งการชนและระยะหมุน control response, hull blockage, power, thermal และ Earth–Moon link budget ดังนั้นข้อสรุปของเราคือระบบกู้การชี้เสาได้ภายใน recovery envelope ที่ยังมี line of sight ไฟเลี้ยง และกลไกไม่ติดขัด

**Cue:** ชี้ `TODAY` ไป `OUR SOLUTION`; เน้นคำว่า **ภายใน recovery envelope**

## 90–100 วินาที — Live web simulation

**Action:** สลับเข้าเว็บและกดเล่น preset **Off-nominal landing** ที่ 4×

> ในซิมนี้ เมื่อยานล้ม เสา fixed จะเสียมุมชี้ครับ หลังยานนิ่ง กิมบอลจึงปลดล็อกและหมุนกลับหาโลก พร้อมตรวจด้วยว่าแนวสัญญาณไม่ถูกตัวยานบัง

หยุดพูดเมื่อกิมบอลเริ่มหมุน แล้วปล่อยภาพกับค่าบนเว็บยืนยันผลต่อ

## ประโยคสำรองสำหรับ Q&A

- **ทำไมไม่ใช้ phased array:** ในกรอบ 2U และไม่เกิน 1.5 kg เราใช้ single CP patch กับ mechanical pointing เพื่อลด RF chains, phase shifters, calibration และ DC/thermal load โดยยอมรับความเสี่ยงของชิ้นส่วนเคลื่อนที่
- **ส่งถึงโลกได้หรือไม่:** กรณีวิเคราะห์ clear path ที่ 2.205 GHz, ระยะ 384,400 km, กำลัง RF 5 W, 4 kbps และสมมติ ground G/T 22 dB/K ให้ link reserve ประมาณ +4.26 dB; ground service, installed pattern และ frequency assignment ยังต้องยืนยัน
- **ไฟและความร้อน:** lander bus จ่ายไฟให้ payload ทั้งชุด แต่ฮีตเตอร์ 30 W อยู่บน payload/gimbal และควบคุมจากอุณหภูมิ payload; กรณีเลวร้าย functional load 5.31 W รวมฮีตเตอร์เป็น 35.31 W ซึ่งเกิน allocation 0.5 A ที่ตั้งไว้และถูกแสดงเป็น interface gap ในเว็บ

## ข้อความที่ต้องแก้บนสไลด์ก่อนใช้

- HAKUTO-R M1: เปลี่ยน `Tipped during descent` เป็น `Lost during final descent / no soft landing` เพราะรายงานระบุว่ายานยังตั้งตรงที่ราว 5 km ก่อนเชื้อเพลิงหมดและตกสู่พื้น
- SLIM ติดต่อโลกได้หลังลงผิดท่า และปัญหาหลักที่ JAXA ระบุคือ solar power generation ไม่เป็นไปตามแผน จึงไม่ควรใช้เป็นหลักฐานว่า antenna orientation ทำให้ขาดการสื่อสาร
- เปลี่ยน `frictionless` เป็น `low-backlash direct drive`
- เปลี่ยนคำอ้าง `no matter how the lander lands`, `any landing outcome` และ `continuous communication` เป็น `within the verified recovery envelope` และ `restores pointing when LOS, host power and mechanism are available`

แหล่งตรวจข้อเท็จจริง: [ispace HAKUTO-R M1 landing analysis](https://2022.ispace-inc.com/news-en/?p=4691), [JAXA SLIM landing outcome](https://global.jaxa.jp/press/2024/01/20240125-1_e.html), [Intuitive Machines IM-2 mission update](https://www.intuitivemachines.com/missions/lunar/im-2-mission)
