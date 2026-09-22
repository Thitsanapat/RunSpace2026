# Earth link, lander power and high-temperature RF plan

อัปเดต 22 กันยายน 2026 สำหรับ Lunar Link Studio v1.4.2

## คำตอบเรื่องส่งถึงโลก

**Downlink ปัจจุบันปิด link budget ได้แบบมีเงื่อนไข** ที่ 2.205 GHz, ระยะ 384,400 km, 4 kbps, RF output 5 W, realized antenna gain 6.5 dBic และ assumed ground-station G/T 22 dB/K:

| Quantity | Result |
|---|---:|
| EIRP | 12.49 dBW |
| Free-space path loss | 211.01 dB |
| C/N0 | 50.58 dB-Hz |
| Eb/N0 | 14.56 dB |
| Raw margin after threshold and implementation loss | 8.56 dB |
| Required design reserve | 3.00 dB |
| Headroom above reserve | **+5.56 dB** |

ผลนี้ผ่านเมื่อทุกเงื่อนไขต่อไปนี้จริงพร้อมกัน:

- Earth อยู่เหนือ local horizon
- antenna มี clear line of sight
- gimbal ไม่ติดขัดและ target อยู่ใน travel/packaging envelope
- lander power, radio/modem/PA และ RF port ยังทำงาน
- ground station มี G/T ใกล้ค่าที่สมมติและรองรับ waveform/frequency assignment
- mounted antenna ยังให้ gain, S11 และ axial ratio ใกล้ค่าที่ใช้

ตำแหน่ง Green Zone ปัจจุบันในเคส lander tilt 65° ถูก hull proxy บัง ดังนั้นผล +5.56 dB คือ **clear-path RF capability** ไม่ใช่หลักฐานว่า installed configuration ติดต่อโลกได้ทุกท่าลงจอด ต้องย้าย/ยก mount, จำกัด field of regard หรือเพิ่ม aperture อีกด้านก่อนอ้าง recovery coverage

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
| Controller/electronics idle | 0.79 W load / 0.85 efficiency = **0.93 W bus** | ไม่รวม host receiver/modem |
| Payload branch worst simulated | **5.31 W bus** | controller + motor electrical/mechanical losses |
| Entered inrush | **0.8 A for 20 ms** | เกิน current allocation 0.5 A; FAIL |
| Downlink RF output | **5.00 W RF** | กำลังออกจาก host PA ไม่ใช่ DC input |
| Host PA DC input | **≈14.29 W DC** | ใช้ assumed PA efficiency 35%; ยังไม่รวม modem/baseband/standby overhead |
| Lander heater peak | **30 W** | heater อยู่บน lander และถูก thermostat ควบคุม |
| Cold-study heater energy | **206.5 Wh / 24 h** | average heater power ≈8.61 W ใน reduced-order cold case |
| Cold-study total modeled lander energy | **228.9 Wh / 24 h** | payload electronics + heater; RF/motors OFF |

Current modeled sums:

- **Receive/standby, no motion:** อย่างน้อยประมาณ 0.93 W สำหรับ payload controller บวก host receiver/LNA/modem ที่ยังไม่มีสเปก
- **Acquisition/motion:** สูงสุดประมาณ 5.31 W จาก payload branch
- **Transmit:** ประมาณ 5.31 + 14.29 = **19.60 W DC** ใน conservative simultaneous peak บวก host radio/modem overhead
- **Cold simultaneous heater + transmit peak:** อาจแตะประมาณ **49.6 W DC** บวก radio overhead; ควรจัด operating modes ไม่ให้ heater peak, full-speed gimbal และ TX peakเกิดพร้อมกันถ้า bus ไม่รองรับ
- **Cold survival:** thermal study ปิด RF/motors และใช้ประมาณ 30.93 W เมื่อ heater ON; heater cycle ทำให้ค่าเฉลี่ยต่ำลง

ตัวเลขที่ควรขอใน host ICD:

1. 22–32 V payload rail และ allowed steady/peak current
2. inrush envelope และ protection behavior
3. host radio/PA 5 W RF service พร้อม DC/duty-cycle allocation
4. heater peak/energy allocation และตำแหน่ง thermal interface
5. RF connector, cable loss, allowable bend/twist และ receive/transmit switching
6. temperature telemetry และ permission สำหรับ TX inhibit/safe mode

## ผล hot case ปัจจุบัน

ที่ ground boundary +170°C, full sunlight, initial payload 30°C และ lander node 45°C:

- payload หลัง 24 h: **108.1°C**
- lander node หลัง 24 h: **123.9°C**
- current payload operating range: −40…+80°C
- heater: OFF
- result: **FAIL hot operating limit**

±170°C เป็น boundary stress input ไม่ใช่อุณหภูมิของ electronics โดยตรง และ current result เป็น two-node screening model ไม่ใช่ thermal qualification

## Thermal architecture สำหรับรับและส่ง

### แยกแหล่งความร้อน

ให้เก็บ transceiver, modem, LNA และโดยเฉพาะ PA ไว้ใน thermal bay ของ lander หาก host interface อนุญาต ส่วนโมดูล 2U มี passive patch, gimbal, encoder และ controller เท่าที่จำเป็น การทำเช่นนี้ย้ายความร้อน PA ประมาณ 14.29 W DC ออกจากกล่อง 2U

ข้อแลกเปลี่ยนคือ coax จาก antenna ไป lander เพิ่ม feed loss โดยเฉพาะ receive path ต้องกำหนด cable length/loss และตัดสินใจว่าจะวาง LNA ใกล้ feed หรือเก็บไว้ใน lander หากวาง LNA ใกล้ feed จะลด receive noise penalty แต่เพิ่ม power/thermal/component exposure บน gimbal

### ลดความร้อนขาเข้าและเพิ่มทางระบาย

- ทำ sunshade ให้ electronics, motor และ feed area
- ใช้ผิว low solar absorptivity / high IR emissivity สำหรับ radiator ที่มองเห็น deep space
- ไม่ให้ radiator มอง hot lunar ground มากเกินไป
- ใช้ MLI/low-emissivity barrier รอบ electronics ในตำแหน่งที่ไม่กีดขวาง antenna, radiator หรือ mechanism
- ลด thermal conductance จาก hot deck ไป payload ในช่วงกลางวัน
- ถ้าต้องรับความร้อนจาก lander heaterในช่วงเย็น ให้พิจารณา controlled thermal switch หรือแยก heater feed จาก structural hot path แทน fixed high-conductance strap

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
3. thermal-vac RF test โดยวัด component temperature จริง ไม่ใช้ ground boundary ±170°C เป็น test temperature ของ electronics โดยตรง
4. PA output/efficiency/EVM หรือ modulation quality เทียบอุณหภูมิและ duty cycle
5. receiver sensitivity/noise figure/BER เทียบอุณหภูมิ
6. ใส่ measured curves กลับเข้า simulator แล้วทำ downlink และ uplink Monte Carlo ใหม่

## Decision ปัจจุบัน

- **Downlink clear-path:** feasible ภายใต้สมมติฐานปัจจุบัน
- **Installed 65° bad-landing case:** not feasible ที่ mount ปัจจุบันเพราะ hull blockage
- **Uplink reception:** not yet demonstrated; separate budget required
- **Payload/motor power:** 5.31 W peak in current model, but inrush fails present 0.5 A allocation
- **Host TX power:** at least 14.29 W DC for the assumed 5 W RF PA, plus radio overhead
- **Cold thermal:** model passes only with lander heater/contact and large energy use
- **Hot thermal:** fails current +80°C limit; passive design, thermal isolation/radiation and TX duty control are required before claiming operation
