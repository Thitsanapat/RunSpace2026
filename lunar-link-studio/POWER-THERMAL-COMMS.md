# Earth link, lander power and high-temperature RF plan

อัปเดต 23 กันยายน 2026 สำหรับ Lunar Link Studio v1.5.2

## คำตอบเรื่องส่งถึงโลก

**Downlink ปัจจุบันปิด link budget ได้แบบมีเงื่อนไข** ที่ 2.205 GHz, ระยะ 384,400 km, 4 kbps, RF output 5 W, realized antenna gain target 5.2 dBic และ assumed ground-station G/T 22 dB/K:

| Quantity | Result |
|---|---:|
| EIRP | 11.19 dBW |
| Free-space path loss | 211.01 dB |
| C/N0 | 49.28 dB-Hz |
| Eb/N0 | 13.26 dB |
| Raw margin after threshold and implementation loss | 7.26 dB |
| Required design reserve | 3.00 dB |
| Headroom above reserve | **+4.26 dB** |

ผลนี้ผ่านเมื่อทุกเงื่อนไขต่อไปนี้จริงพร้อมกัน:

- Earth อยู่เหนือ local horizon
- antenna มี clear line of sight
- gimbal ไม่ติดขัดและ target อยู่ใน travel/packaging envelope
- lander DC bus ยังทำงาน และ transceiver/modem/PA บน payload ยังอยู่ในอุณหภูมิใช้งาน
- ground station มี G/T ใกล้ค่าที่สมมติและรองรับ waveform/frequency assignment
- mounted antenna ยังให้ gain, S11 และ axial ratio ใกล้ค่าที่ใช้

ตำแหน่ง Green Zone ปัจจุบันในเคส lander tilt 65° ถูก hull proxy บัง ดังนั้นผล +4.26 dB คือ **clear-path RF capability** ไม่ใช่หลักฐานว่า installed configuration ติดต่อโลกได้ทุกท่าลงจอด ต้องย้าย/ยก mount, จำกัด field of regard หรือเพิ่ม aperture อีกด้านก่อนอ้าง recovery coverage

NASA ระบุ S-band return 2200–2290 MHz และแสดงว่า G/T แตกต่างตาม ground asset เช่นประมาณ 12.8, 17, 18, 19–21 และสูงกว่านั้น การจองสถานีและ mission frequency assignment เป็นเงื่อนไขแยกจาก antenna design: <https://www.nasa.gov/smallsat-institute/sst-soa/ground-data-systems-and-mission-operations/>

## Downlink กับ uplink ต้องแยกกัน

ซิมปัจจุบันคำนวณ **2.205 GHz downlink** เท่านั้น จึงยังห้ามสรุปว่า command uplink ผ่านแล้ว

Uplink สำหรับรับคำสั่งต้องเพิ่มชุดคำนวณอย่างน้อย:

- assigned uplink frequency; NASA examples อยู่แถว 2025–2120 MHz แต่ต้องใช้ค่าของ service/mission จริง
- ground-station uplink EIRP และ polarization
- lander receive antenna gain ตามมุม
- feed/cable/rotary-joint loss
- receiver/LNA noise figure หรือ receive G/T
- command data rate, modulation/coding, required Eb/N0 และ acquisition threshold
- Doppler, frequency stability และ maximum allowable frequency error

Reference ANSER มี dual-frequency ports แถว 2.03/2.205 GHz จึงเป็นแนวทางทางกายภาพได้ แต่ไม่ใช่หลักฐานว่า uplink chain ของเราปิดแล้ว

## Power ที่ต้องขอจาก lander

แยก interface เป็นสาม branch เพื่อไม่รวม RF watts กับ DC watts:

| Operating item | Current model | Interpretation |
|---|---:|---|
| Controller/electronics idle | 0.79 W load / 0.85 efficiency = **0.93 W bus** | ไม่รวม onboard receiver/modem/PA |
| Payload functional peak | **22.11 W bus** | onboard RF/PA + controller + motor electrical/mechanical losses |
| Entered inrush | **0.8 A for 20 ms** | เกิน current allocation 0.5 A; FAIL |
| Downlink RF output | **5.00 W RF** | กำลังออกจาก onboard payload PA ไม่ใช่ DC input |
| Onboard PA DC input | **≈14.29 W DC** | ใช้ assumed PA efficiency 35%; ก่อน payload converter loss และยังไม่รวม modem/baseband overhead |
| Local payload/gimbal heater peak | **30 W** | ติดบน payload/gimbal, thermostat อ่าน payload temperature และรับไฟจาก lander |
| Payload service worst case | **≈52.11 W** | functional peak 22.11 W + heater 30 W |
| Cold-study heater energy | **164.7 Wh / 24 h** | average heater power ≈6.86 W ใน reduced-order cold case |
| Cold-study total modeled lander energy | **187.0 Wh / 24 h** | payload electronics + local heater; RF/motors OFF |

Current modeled sums:

- **Receive/standby, no motion:** อย่างน้อยประมาณ 0.93 W สำหรับ controller ก่อน receiver/LNA/modem ที่ยังไม่มีสเปก
- **Acquisition/TX functional peak:** **22.11 W bus** ใน trajectory ปัจจุบัน ซึ่งรวม onboard PA จากสมมติฐาน 5 W RF / efficiency 35%
- **Cold simultaneous heater + TX/motion peak:** **52.11 W bus**; ควรจัด operating modes ไม่ให้ heater, full-speed gimbal และ TX peak เกิดพร้อมกันถ้า bus ไม่รองรับ
- **Cold survival:** thermal study ปิด RF/motors และใช้ประมาณ 30.93 W เมื่อ heater ON; heater cycle ทำให้ค่าเฉลี่ยต่ำลง
- **Payload power interface sizing:** functional peak + heater = **52.11 W**, หรือประมาณ **2.51 A** ที่ terminal ≈20.74 V จึงไม่ผ่านสมมติฐาน 0.5 A ปัจจุบัน; 470 µF ให้ ideal hold-up เพียง ≈0.48 ms ก่อน 18 V

ตัวเลขที่ควรขอใน host ICD:

1. 22–32 V payload rail และ allowed steady/peak current
2. inrush envelope และ protection behavior
3. payload branch รองรับ onboard transceiver/PA 5 W RF พร้อม DC/duty-cycle allocation
4. local heater peak/energy allocation, thermostat/control authority และ parasitic thermal interface
5. data connector, onboard RF cable loss, allowable bend/twist และ receive/transmit switching
6. temperature telemetry และ permission สำหรับ TX inhibit/safe mode

## ผล hot case ปัจจุบัน

ที่ NASA table reference ground boundary +110°C (+230°F), full sunlight, initial payload 30°C และ lander node 45°C:

- payload หลัง 24 h: **88.5°C**
- lander node หลัง 24 h: **105.1°C**
- current payload operating range: −40…+80°C
- heater: OFF
- result: **FAIL hot operating limit**

ตาราง NASA NTRS ชุดที่ผู้ใช้กล่าวถึงระบุ minimum −170°C/−274°F และ maximum +110°C/+230°F; `+230` เป็น Fahrenheit ไม่ใช่ Celsius. ค่าเหล่านี้เป็น surface boundary ไม่ใช่อุณหภูมิของ electronics โดยตรง และผลปัจจุบันเป็น two-node screening model ไม่ใช่ thermal qualification: <https://ntrs.nasa.gov/api/citations/20150003498/downloads/20150003498.pdf>

## Thermal architecture สำหรับรับและส่ง

### แยกแหล่งความร้อน

Baseline ล่าสุดวาง transceiver, modem, LNA และ PA บน payload 2U; lander ให้เฉพาะ DC bus และ data interface. จึงต้องระบายความร้อน PA ภายใน payload และคิด peak bus load ของ PA รวมกับกิมบอลและฮีตเตอร์. สาย RF เป็น service loop ภายใน payload จาก PA/LNA ไปยัง patch ไม่ใช่ RF coax จาก lander

### ลดความร้อนขาเข้าและเพิ่มทางระบาย

- ทำ sunshade ให้ electronics, motor และ feed area
- ใช้ผิว low solar absorptivity / high IR emissivity สำหรับ radiator ที่มองเห็น deep space
- ไม่ให้ radiator มอง hot lunar ground มากเกินไป
- ใช้ MLI/low-emissivity barrier รอบ electronics ในตำแหน่งที่ไม่กีดขวาง antenna, radiator หรือ mechanism
- ลด thermal conductance จาก hot deck ไป payload ในช่วงกลางวัน
- ติด heater pad และ temperature sensor บน payload/gimbal ใกล้ชิ้นส่วน cold-critical พร้อม heat spreader; ใช้ thermal isolator ลด heat leak สู่ lander และออกแบบสายไฟให้ผ่านช่วงหมุนโดยไม่เพิ่ม torque มากเกินไป

NASA ระบุว่า SmallSat thermal design มักใช้ coatings, tapes/MLI, thermal straps, interface conductance, sunshades และ radiator surfacesร่วมกับ heater โดย radiator ต้องมี high IR emissivity และ low solar absorptivity: <https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/>

### Operational thermal control

กำหนด state machine:

1. **Survival:** radio/PA OFF, motors OFF, heater thermostat active
2. **Acquire:** receiver + controller + gimbal ON, transmitter OFF
3. **RX/standby:** gimbal hold; receiver and command decoder ON
4. **Burst TX:** transmitterเปิดเป็นช่วงสั้นตาม thermal/duty-cycle allowance
5. **Hot inhibit:** หยุด TX และการหมุนที่ไม่จำเป็นเมื่อ component temperature เกิน verified threshold
6. **Emergency beacon:** data rate ต่ำและ duty cycle ต่ำ เพื่อจำกัด average PA heat

ถ้าใช้ operating max +80°C ชั่วคราว ควรเริ่มลด duty/inhibit ก่อนถึงค่านี้ด้วย engineering margin เช่น threshold ที่ `Tmax − verified margin`; ห้ามล็อกตัวเลข threshold สุดท้ายก่อนเลือก component และผ่าน thermal-vac test

Average PA dissipation โดยประมาณ:

```
P_PA,DC = P_RF / efficiency = 5 / 0.35 = 14.29 W
P_average = duty_cycle × P_PA,DC
```

ตัวอย่าง 10% TX duty cycle ทำให้ average PA input ประมาณ 1.43 W ก่อน radio overhead แต่ instantaneous bus capacity ยังต้องรองรับ peak

## RF performance ที่อุณหภูมิสูง

ปัจจุบัน simulator ใช้ RF temperature coefficient = 0 และไม่มี measured frequency response จึงยังไม่รวม:

- resonance shift
- S11/VSWR degradation
- realized-gain change
- axial-ratio/polarization degradation
- cable/connector/rotary-joint loss change
- LNA gain/noise-figure change
- PA gain, efficiency, output-power backoff และ frequency stability

แผนพิสูจน์ขั้นต่ำ:

1. VNA วัด S11/S21 ของ antenna + feed + rotary path ที่อุณหภูมิหลายจุด
2. วัด gain/pattern/axial ratio ใน chamber ก่อนและหลังติดกับ representative lander deck
3. thermal-vac RF test โดยวัด component temperature จริง ไม่ใช้ surface boundary −170/+110°C เป็น test temperature ของ electronics โดยตรง
4. PA output/efficiency/EVM หรือ modulation quality เทียบอุณหภูมิและ duty cycle
5. receiver sensitivity/noise figure/BER เทียบอุณหภูมิ
6. ใส่ measured curves กลับเข้า simulator แล้วทำ downlink และ uplink Monte Carlo ใหม่

## Decision ปัจจุบัน

- **Downlink clear-path:** feasible ภายใต้สมมติฐานปัจจุบัน
- **Installed 65° bad-landing case:** not feasible ที่ mount ปัจจุบันเพราะ hull blockage
- **Uplink reception:** not yet demonstrated; separate budget required
- **Payload functional power:** 22.11 W peak in current model with onboard PA; present 0.5 A allocation fails
- **Worst-case payload branch:** 52.11 W with 30 W local heater; about 2.51 A at the modeled 20.74 V loaded terminal
- **Cold thermal:** model passesใน 24 h ด้วย lander-powered local heater แต่ใช้พลังงานมากและยังต้องยืนยัน heater placement/spreading
- **Hot thermal:** fails current +80°C limit; passive design, thermal isolation/radiation and TX duty control are required before claiming operation
