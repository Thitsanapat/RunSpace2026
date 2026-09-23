# Limitation evidence pack

โฟลเดอร์นี้รวมกราฟข้อจำกัดของ Lunar Link Studio v1.5.1 แยกจากภาพผลลัพธ์สำหรับสไลด์หลัก ทุกภาพมีทั้ง PNG พร้อมวางและ SVG สำหรับแก้ไข ข้อมูลตัวเลขที่ใช้สร้างภาพอยู่ใน `limitation-data.json`

## อ่านกราฟอุณหภูมิให้ถูกต้อง

ค่า **−170°C/−274°F และ +110°C/+230°F เป็น surface-boundary references จากตาราง NASA** ไม่ใช่อุณหภูมิของ payload และไม่ใช่คำอ้างว่าทุกพื้นที่บนดวงจันทร์มีอุณหภูมินี้ตลอดเวลา. `+230` เป็น Fahrenheit ไม่ใช่ Celsius.

โมเดล thermal เป็น lumped two-node model:

- node 1: payload
- node 2: lander interface
- heater 30 W ติดบน payload/gimbal และรับไฟจาก lander bus
- heater deposits heat เข้า payload node; thermal conductance 0.2 W/K เป็น parasitic path ระหว่าง payload กับ lander interface
- RF และมอเตอร์ปิดระหว่าง long-duration study
- sunlight และ ground boundary คงที่ตลอด 24 ชั่วโมง
- ไม่มี orbital/day-night cycle, shadow transition, detailed conduction network, MLI, contact resistance, internal component gradients หรือ thermal-vacuum correlation

ดังนั้นผลใช้คัดกรองและหา design driver ได้ แต่ยังใช้ยืนยัน flight survival/qualification ไม่ได้

## รายการภาพ

### 01 — Thermal extremes

ไฟล์: `01-thermal-24h-minus170-plus110.png`

ผลปัจจุบัน:

- Cold/no sunlight, ground −170°C: payload จาก −30°C ไปจบประมาณ −0.25°C หลัง 24 h; ช่วงอุณหภูมิ −30…+1.11°C, heater ใช้ประมาณ 164.7 Wh และยังอยู่ใน operating band −40…+80°C ของโมเดล
- Hot/full sunlight, ground +110°C/+230°F: payload ขึ้นถึงประมาณ +88.5°C หลัง 24 h จึง **เกิน operating maximum +80°C**
- ผล cold ที่ผ่านขึ้นกับ local heater, lander energy allocation, parasitic thermal path และค่าการแผ่รังสีที่สมมติไว้ทั้งหมด

ตำแหน่งแนะนำ: หน้า Environment/Thermal หรือ risk slide หลัก ถ้ามีพื้นที่สำหรับ thermal เพียงรูปเดียวให้ใช้รูปนี้

คำบรรยาย:

> 24-hour two-node thermal sensitivity with a lander-powered heater mounted on the payload/gimbal. Under the entered assumptions, the −170°C case remains within the payload operating band, while the +110°C/+230°F full-sun case reaches 88.5°C and fails the +80°C limit. This is reduced-order screening, not thermal qualification.

### 02 — Thermal boundary sweep

ไฟล์: `02-thermal-boundary-sweep.png`

แสดง final payload temperature หลัง 24 h เมื่อ sweep ground boundary จาก −170 ถึง +110°C ทั้ง no-sunlight และ full-sunlight ใช้สำหรับตอบว่าผลไวต่อ environment แค่ไหน ไม่ควรเรียกเส้นนี้ว่า lunar temperature profile

ตำแหน่งแนะนำ: appendix ต่อจากภาพ 01

### 03 — RF headroom limits

ไฟล์: `03-rf-link-headroom-limits.png`

แสดง headroom หลัง reserve 3 dB เทียบ data rate และ ground-station G/T สำหรับ 2.205 GHz, 384,400 km, 5 W RF และ 6.5 dBic ภายใต้ on-axis clear LOS

- Default 4 kbps และ G/T 22 dB/K: +5.56 dB
- 4 kbps ต้องการ G/T ประมาณ 16.44 dB/K เพื่อแตะ 0 dB หลัง reserve
- G/T, station availability, coding และ frequency assignment ยังเป็น mission/service inputs

ตำแหน่งแนะนำ: หน้า antenna/link-budget appendix

### 04 — Tilt, pointing and blockage

ไฟล์: `04-tilt-pointing-and-blockage-limits.png`

แยกสามสิ่งที่มักถูกพูดรวมกัน:

- fixed patch เสีย gain เมื่อ lander tilt
- gimbal clear-path รักษา on-axis link headroom ได้
- installed payload ยังต้องผ่าน hull, travel และ packaging gates

ตำแหน่งแนะนำ: ต่อจากกราฟหน้า antenna หลัก หรือหน้า Verification/Risks

### 05 — Mechanism clearance map

ไฟล์: `05-mechanism-assembly-clearance-map.png`

แผนที่ azimuth/elevation ของ patch, yoke, motor allocation, connector, RF bend keep-out และ cable-twist limit สำหรับ 80 mm patch ปัจจุบัน

- sampled fit: 3.1%
- worst signed clearance: −10.66 mm
- full sampled sweep: FAIL

นี่คือ bounding-box screening ไม่ใช่ exact CAD collision, cable stress หรือ path-planning verification

ตำแหน่งแนะนำ: หน้า 3D packaging หรือ appendix กลไก

### 06 — Antenna size vs packaging

ไฟล์: `06-antenna-size-vs-packaging-limit.png`

แสดงว่าลดขนาด patch ช่วย packaging อย่างไร แต่ผลสูงสุดยังถูกจำกัดด้วย ±90° cable-twist allocation การลด patch เปลี่ยน gain, bandwidth และ beamwidth จึงห้ามเลือกขนาดจากกราฟนี้อย่างเดียว

ตำแหน่งแนะนำ: appendix สำหรับตอบคำถามว่า “ทำไมไม่ย่อ antenna”

### 07 — Electrical interface

ไฟล์: `07-electrical-power-and-holdup-limits.png`

ข้อจำกัดปัจจุบัน:

- functional branch peak 5.31 W + local heater 30 W = worst-case payload service 35.31 W
- steady current ประมาณ 1.67 A และ entered inrush 0.8 A เทียบ bus allocation 0.5 A: FAIL
- 470 µF ให้ ideal hold-up ประมาณ 0.83 ms เทียบ requirement 100 ms: FAIL
- 5 W RF output ของ host PA ต้องการประมาณ 14.29 W DC ที่ assumed 35% efficiency

ต้องยืนยันด้วย lander ICD, converter selection, inrush waveform, ESR/derating และ hardware test

ตำแหน่งแนะนำ: หน้า Mass & Power

### 08 — Controller response

ไฟล์: `08-controller-response-limit.png`

- settling time 154 ms เทียบเป้า 50 ms: FAIL
- rise time 124 ms
- overshoot 0.61%
- เป็น static-base model test ไม่ใช่ bench result

ตำแหน่งแนะนำ: หน้า Control/Dynamics

### 09 — Failure-gate matrix

ไฟล์: `09-scenario-failure-gate-matrix.png`

แสดงว่า link ต้องผ่าน Earth visibility, LOS, travel/fit, mechanism, host RF และ RF closure พร้อมกัน Gimbal แก้ host power loss, actuator jam, burial, terrain/hull blockage หรือ target นอก travel ไม่ได้

ตำแหน่งแนะนำ: หน้า Verification/Risks

### 10 — Master limitation register

ไฟล์: `10-master-limitation-register.png`

ตารางสรุปข้อจำกัดทั้งหมดในภาพเดียว เหมาะเป็นหน้าเปิด appendix หรือใช้ตอบกรรมการว่าทีมรู้ gap อะไรและจะพิสูจน์อย่างไร

## Limitations ที่ยังไม่มีกราฟยืนยัน

หัวข้อต่อไปนี้ถูกระบุใน master register แต่ไม่ควรสร้างเส้นผลลัพธ์ปลอมจนกว่าจะมีข้อมูลจริง:

- S11, gain, axial ratio และ resonance เทียบอุณหภูมิ: ไม่มี measured/EM-solved data ตามอุณหภูมิ; default RF temperature coefficient เป็นศูนย์
- shock strength, modal response และ fastener stress: ไม่มี structural FEA หรือ test correlation
- regolith/dust torque and wear: dust–friction law ในซิมยังไม่ calibrate
- cold welding, lubrication, bearing life, backlash และ cable fatigue: ไม่มี component model/test data
- terrain diffraction/reflection และ local horizon: current model ใช้ plane/box proxy
- antenna–lander coupling: ไม่มี installed full-wave EM model
- landing probability: presets และ Monte Carlo เป็น synthetic cases ไม่ใช่ mission probability distribution
- total mass reserve: entered mass เท่ากับ project target 1.5 kg จึงยังไม่มี reserve และไม่มี detailed BOM
- host interface: power, RF port, heater, attitude/ephemeris, data rate และ duty cycle ยังต้องยืนยันใน ICD

## ชุดสั้นสำหรับนำเสนอ

ถ้าเพิ่มได้เพียง 3 รูป:

1. `01-thermal-24h-minus170-plus110.png`
2. `07-electrical-power-and-holdup-limits.png`
3. `10-master-limitation-register.png`

ถ้ามี appendix ให้ใส่ 02–09 ต่อท้ายตามหมวด

## Reproduce

```powershell
npm.cmd run export:limitations
```

สคริปต์ทำงานจาก calculation engine โดยตรง ไม่ต้องเปิด local web server
