# S-band antenna evidence

ใช่—baseline ปัจจุบันเป็น **S-band downlink study ที่ 2.205 GHz** โดยใช้ realized-gain input 6.5 dBic จาก compact dual-CP patch reference และ analytical HPBW 82.44°

## กราฟที่ควรมี

### 1. Gain vs off-axis angle

ไฟล์: `01-gain-vs-off-axis-angle.png`

นี่คือกราฟ gain ที่ควรใส่ เพราะตอบได้ตรง ๆ ว่าเสาชี้คลาดแล้ว gain ลดเท่าไร:

- peak input: 6.5 dBic
- analytical −3 dB points: ±41.22°
- analytical HPBW: 82.44°
- control error ±0.5° ทำให้ gain ลดเพียงประมาณ 0.0004 dB ในโมเดลนี้

ดังนั้นเหตุผลของ ±0.5° control target ต้องมาจาก acquisition/mechanical/system requirement ไม่ควรอ้างว่า beam แคบจน RF บังคับให้ต้องแม่นระดับนี้

กราฟนี้เป็น axisymmetric cosine model ไม่ใช่ measured mounted pattern

### 2. S-band frequency evidence

ไฟล์: `02-sband-frequency-evidence.png`

แสดงว่า 2.205 GHz อยู่ตรงไหนเมื่อเทียบกับ:

- NASA S-band return 2.200–2.290 GHz
- SLSP reference measured S11 band 2.00–2.34 GHz
- SLSP reference measured axial-ratio band 2.04–2.25 GHz
- SLSP maximum measured gain 7.24 dBic ที่ 2.18 GHz
- ANSER reference ports 2.03/2.205 GHz และ isolated gain 6.5–7 dBi

แถบเหล่านี้เป็น literature evidence ไม่ใช่ frequency response ที่วัดจาก payload ของทีม และ mission frequency assignment ยังต้องได้รับการยืนยัน

### 3. RF evidence gaps

ไฟล์: `03-rf-evidence-gap-matrix.png`

ใช้ตอบกรรมการว่าทีมมีกราฟอะไรแล้วและอะไรยังต้องทดสอบ โดยเฉพาะ gain/S11/axial ratio เทียบ frequency และ temperature

## ใช้ในสไลด์อย่างไร

- หน้าหลักที่เปรียบเทียบ fixed กับ gimbal: ใช้ `01-gain-vs-off-axis-angle.png` เป็น inset ขนาดเล็ก หรือเก็บกราฟ compact link margin เดิมไว้เป็นภาพหลัก
- หน้าเลือกความถี่/งานวิจัย: ใช้ `02-sband-frequency-evidence.png`
- appendix/verification plan: ใช้ `03-rf-evidence-gap-matrix.png`
- ภาพ 3D radiation และ principal-plane cuts เดิมยังอยู่ใน `../slide-assets/`

หากมีพื้นที่เพียงรูปเดียวในหน้า antenna ให้ใช้กราฟ **link margin vs lander tilt** เดิม เพราะเชื่อมกับโจทย์ bad landing โดยตรง แล้วนำ gain-vs-angle ไป appendix

## กราฟที่ยังห้ามสร้างเป็นผลจริง

ยังไม่มีข้อมูลของ hardware ทีมสำหรับ:

- gain vs frequency
- S11 vs frequency
- axial ratio vs frequency
- gain/S11/AR vs −170…+170°C
- installed antenna pattern บน lander

ควรแสดงเป็น test requirement จนกว่าจะมี VNA, chamber, EM หรือ thermal-vacuum data ห้ามลากเส้น smooth curve จากจุดตัวเลขใน paper คนละงาน

## Reproduce

```powershell
npm.cmd run export:sband-evidence
```
