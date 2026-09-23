# Proposal (3): communication and antenna review

ตรวจเมื่อ 23 กันยายน 2026 จาก `Ultra Smooth Landing - Proposal (3).pdf` และ Lunar Link Studio v1.5.0

ภาพพร้อมวางสไลด์ คำบรรยาย และตำแหน่งใช้งานอยู่ที่ [`slide-assets/README.md`](slide-assets/README.md) โดยมีภาพสรุปหน้า 16 ที่จัดสัดส่วนสำหรับพื้นที่ว่างด้านขวาไว้แล้ว

ชุดกราฟข้อจำกัด thermal −170/+170°C, RF, mechanism, power, controller และ failure gates อยู่ที่ [`limitation-assets/README.md`](limitation-assets/README.md)

## ข้อสรุปที่ควรใช้เป็นแกนเรื่อง

ผลิตภัณฑ์ควรถูกนิยามเป็น **secondary, independently pointed S-band antenna front-end** สำหรับกู้ลิงก์หลังยานเอียง โดยใช้ power, heater, attitude/ephemeris, data interface และ RF transponder/PA ของ lander ตาม interface ที่ตกลงกัน ไม่ควรเรียกว่า independent communication system จนกว่าจะรวม modem, receiver, transmitter, PA, diplexer, RF switch และ autonomous acquisition chain ไว้ใน 2U จริง

สิ่งที่ระบบแก้ได้คือความเสียหายเชิงเรขาคณิต: body-fixed antenna ชี้ผิดทิศหลัง touchdown. ระบบไม่สามารถแก้ Earth ต่ำกว่าขอบฟ้า, terrain/hull blockage, host radio หรือ host power เสีย, สาย RF ขาด, gimbal jam หรือ antenna burial ได้

## ตำแหน่งที่ควรวางผลซิมในสไลด์

| หน้า PDF ปัจจุบัน | สิ่งที่ควรวาง | หลักฐานจากซิม |
|---|---|---|
| 6 — System architecture | วาดขอบเขตให้ชัด: lander bus/attitude/ephemeris/RF port → controller → gimbal → CP patch. แยก DC, data และ RF coax | block diagram และสถานะ host power / host radio gate |
| 8 — 3D prototype | แสดง stowed envelope 100 × 100 × 181 mm และ **swept envelope**; ระบุ coax bend radius, cable twist, hard stop และ keep-out | 2U fit/clearance view; sampled assembly collision result |
| 10 — Mass & power | แยก `payload DC branch` ออกจาก `host RF/PA branch`; ห้ามรวม 5 W RF output เป็น 5 W DC | power/current/inrush/hold-up result |
| 14 — Control/Dynamics | ใส่ error-vs-time และ step response พร้อมนิยาม settling band; แยก command latency ออกจาก motor settling | pointing error chart + step response table |
| 15 — 100 km relay | ถ้าจะเก็บหน้านี้ ต้องเป็น scenario คนละชุดกับ DTE: range, relay G/T, frequency, data rate, visibility และ ephemeris คนละค่า | relay preset ที่ยังต้องเพิ่ม; ห้ามใช้ผล Earth–Moon เดิม |
| **16 — Antenna & Earth–Moon link** | หน้าหลักของ communication proof: 3D radiation + principal cuts + auditable link budget + fixed/gimbal result | RF laboratory และ link-budget table |
| 17 — Verification/Risks | ใส่ Monte Carlo attitude map และ failure gates: horizon, hull, travel, collision, power, thermal, jam | Monte Carlo + blockage/packaging/power diagnostics |
| 20–21 — Gimbal vs phased array | ใช้ trade table ที่มีตัวเลขขอบเขต 2U และ physics ของ scan แทนคำว่า phased array ซับซ้อนเฉย ๆ | architecture trade study ที่ยังต้องเพิ่ม |

ถ้าจำกัดจำนวนหน้า ให้แบ่งหน้า 16 เป็นสองหน้า:

1. **Why this antenna / why not a planar phased array?** — ขนาด, gain, CP, beam, field of regard, mass/power และข้อจำกัด
2. **Does the link close after a bad landing?** — link budget, tilt/blockage sweep, Monte Carlo และ pass/fail conditions

## เนื้อหาที่ต้องมีในหน้า antenna

### Design baseline

- Study frequency: **2.205 GHz downlink**, อยู่ในช่วง S-band return 2200–2290 MHz ที่ NASA รวบรวมไว้ แต่ยังไม่ใช่ mission frequency assignment
- Mission-fit antenna profile: **AC-2000 compact circularly polarized S-band patch**, ขนาดที่ผู้ผลิตระบุแบบประมาณ 2 × 2 in หรือ **50.8 × 50.8 mm**, มวลประมาณ **100 g**, gain สูงสุดทั่วไป **5.2 dBic**, bandwidth 2.0–2.3 GHz และ VSWR 1.5:1
- Mechanical model จองความหนา **15 mm** สำหรับ antenna/connector interface; ตัวเลขนี้เป็น project allocation เพราะ public datasheet ไม่ให้ความหนา ต้องแทนด้วย vendor ICD/CAD ก่อน CDR
- Pattern ในซิมใช้ค่าที่ต่ำที่สุดจาก phi cuts สามระนาบใน datasheet ที่แต่ละมุม เพื่อเป็น conservative 1D cut; ไม่ใช่ mounted 3D pattern ของ lander
- Research benchmark: **ANSER 2025 dual-CP stacked patch, 80 × 80 × 7 mm physical, 30 g, 6.5–7 dBi** ที่ 2.205 GHz พร้อม vibration/shock/TVAC evidence แต่ไม่ผ่าน full gimbal sweep ภายใน cavity ปัจจุบัน
- Current matching input ของ mission profile: S11 ≈ **−13.98 dB** ซึ่งคำนวณจาก VSWR 1.5:1; axial ratio = 3 dB ยังเป็น assumption เพราะ public AC-2000 datasheet ไม่ให้ค่าตัวเลข AR
- Polarization: CP ลด sensitivity ต่อ rotation รอบแนว LOS แต่ต้องกำหนด RHCP/LHCP ให้ตรงกับ ground station
- Mechanical pointing target ±0.5° เป็น control target ไม่ใช่ข้อบังคับจาก beamwidth; เหตุผลหลักคือ acquisition repeatability, keep-out และ interface margin

### เหตุผลที่เลือก S-band CP patch + gimbal

- S-band มี component และ ground-segment ecosystem สำหรับ small spacecraft; NASA รวบรวม return band 2200–2290 MHz และ ground-station G/T หลายระดับ
- Patch แบน เบา และเข้ากับหน้ากว้าง 100 mm; mission-fit profile มี footprint ประมาณ 50.8 mm และใช้ RF chain เดียว ส่วน ANSER ยืนยันว่ารูปแบบ stacked patch ที่ 2.205 GHz สามารถผ่าน qualification ได้
- CP ลด polarization mismatch จากการหมุนของ lander เมื่อเทียบกับ linear polarization
- Gimbal หมุน aperture เดิมให้คง gain ใกล้ boresight จึงรักษา EIRP ได้ในมุมที่ planar array เริ่มเสีย scan gain
- กลไกหนึ่งชุดกับ RF chain หนึ่งทางตรวจ bench test ได้ตรงไปตรงมากว่าสถาปัตยกรรมหลาย element/หลาย channel ใน PoC

### ข้อจำกัดที่ต้องพูดตรง ๆ

- moving parts มีความเสี่ยงจาก shock, cold welding/lubrication, regolith, cable wrap, bearing play และ single-point jam
- gimbal ไม่ทะลุ lander hull/terrain และไม่แก้ Earth below local horizon
- Mission-fit 50.8 mm profile ผ่าน sampled bounding-box sweep 100% ที่ step 5° ใน model ปัจจุบันและมี minimum concept clearance มากกว่า 5 mm; ผลนี้ยังไม่แทน exact CAD collision, tolerance stack หรือ cable-stress analysis
- mounted radiation pattern อาจต่างจาก isolated antenna เพราะ deck, red payload, frame, cable และ lander structure
- S11, axial ratio, gain และ resonance ต้องวัดหลังติดตั้งและหลัง thermal-vacuum; temperature coefficient ในซิมยังเป็น user assumption
- final channel, RF port power, ground service, coding, BER/FER requirement และ availability ต้องอยู่ใน ICD/ground-service agreement

## คำตอบ “ทำไมไม่ใช้ phased array?”

ไม่ควรตอบว่า phased array บังคับได้ไม่ทุกทิศ เพราะคำตอบนั้นไม่แม่น ควรตอบดังนี้:

> Phased array steering เร็วและไม่มี moving parts แต่ planar array หนึ่งหน้า steer ได้ใน sector ของด้านหน้าเท่านั้น ไม่ได้มองผ่านตัว lander หรือด้านหลังแผง เมื่อ scan ออกจาก broadside จะเสีย projected aperture, element-pattern gain และ polarization performance พร้อมความเสี่ยง grating lobes และ mutual coupling. ภายใต้หน้าตัด 100 × 100 mm ที่ 2.205 GHz เราเลือกหมุน aperture เดียวด้วย gimbal เพื่อรักษา realized gain โดยใช้ RF chain เดียวและพิสูจน์ PoC ได้ภายในมวล/พลังงานที่กำหนด เราไม่ได้อ้างว่า gimbal เหนือกว่าเสมอ; phased array หรือ hybrid เป็นทางเลือกเมื่อ mission ต้องการ sub-millisecond steering, ไม่มี moving parts และยอมรับหลาย RF channels, calibration, thermal load และหลาย aperture เพื่อ coverage กว้างขึ้นได้.

ตัวเลขประกอบ:

- wavelength ที่ 2.205 GHz ≈ **136 mm**; spacing เพื่อควบคุม grating lobes สำหรับ wide scan มักต้องอยู่ราว `≤ λ/2 ≈ 68 mm`
- หน้าตัด 100 × 100 mm มี ideal aperture-directivity ceiling ประมาณ **8.3 dBi** ที่ broadside ก่อน efficiency/loss; phased array ใน footprint เดิมจึงไม่ได้เพิ่ม gain แบบไม่จำกัด
- projected-aperture loss อย่างเดียวประมาณ `10 log10(cos θ)`: **−3.0 dB ที่ 60°**, **−4.7 dB ที่ 70°** ก่อน element pattern, feed/phase-shifter loss และ mismatch
- planar face เดียวไม่ให้ near-spherical coverage; ต้องเพิ่มหลาย face หรือ beam switching ซึ่งเพิ่ม mass, RF switching, calibration และ power

ข้อดี phased array ที่ต้องยอมรับในสไลด์: ไม่มี bearing/cable motion, steering เร็ว, multi-beam/null steering ทำได้ และ graceful degradation เป็นไปได้เมื่อออกแบบ redundancy. ข้อเสีย gimbal: response ช้ากว่า, mechanism qualification ยาก และ jam แล้วเสียทั้ง aperture.

## Link budget ที่ตรวจย้อนกลับได้

Baseline ปัจจุบันเป็น **engineering assumption**, ไม่ใช่ flight guarantee:

| Term | Value |
|---|---:|
| Frequency | 2.205 GHz |
| Earth–Moon range | 384,400 km |
| RF power at antenna-chain input | 5 W = 6.99 dBW |
| Antenna realized gain, on axis | 5.20 dBic |
| Feed/cable loss | 1.00 dB |
| **EIRP** | **11.19 dBW** |
| Free-space path loss | 211.01 dB |
| Assumed receiver G/T | 22.00 dB/K |
| Polarization + other losses | 0.50 + 1.00 dB |
| **C/N0** | **49.28 dB-Hz** |
| Information rate | 4.00 kbps |
| Coding / modulation | rate 1/2, QPSK assumption, roll-off 0.35 |
| Occupied bandwidth | 5.40 kHz |
| **Eb/N0** | **13.26 dB** |
| Required Eb/N0 + implementation loss | 4.50 + 1.50 dB |
| **Raw margin** | **7.26 dB** |
| Required design reserve | 3.00 dB |
| **Excess above reserve** | **4.26 dB** |
| Maximum rate at the same threshold/reserve | 10.66 kbps |

Ground station sensitivity ต้องอยู่ข้างผลหลัก:

| Assumed G/T | Raw margin | Excess above 3 dB reserve | Result at 4 kbps |
|---:|---:|---:|---|
| 12.8 dB/K | −1.94 dB | −4.94 dB | FAIL |
| 17 dB/K | 2.26 dB | −0.74 dB | FAIL reserve gate |
| 18 dB/K | 3.26 dB | 0.26 dB | PASS, little headroom |
| 21 dB/K, NASA listed typical | 6.26 dB | 3.26 dB | PASS |
| 22 dB/K, current sim | 7.26 dB | 4.26 dB | PASS |

ดังนั้นข้อความบนสไลด์ควรเป็น “closes under the stated 5 W / 4 kbps / G/T assumption” ไม่ใช่ “communication guaranteed.”

## Power boundary ที่ต้องแก้ในหน้า 10

5 W ใน link budget คือ **RF output**, ไม่ใช่ DC input. ที่ PA efficiency 35% ต้องใช้ไฟประมาณ `5/0.35 = 14.29 W DC` ก่อน motor/controller และก่อน regulator margin.

- ถ้าใช้ **host lander radio/PA**: ตาราง payload ควรแสดง controller/motor ≈ 1–3 W และบรรทัดแยก `Host RF service: 5 W RF, ≈14.3 W DC at assumed 35%`; ต้องยืนยัน RF connector, band, power, duty cycle และ thermal allocation
- ถ้าเป็น **standalone backup radio**: ต้องใส่ transceiver/PA/modem/Rx/diplexer/filter/RF switch, mass, peak power และ thermal rejection ใน 2U; ตาราง 1.67 W ปัจจุบันไม่พอ
- การใช้ power/heater/radio จาก lander ทำให้ระบบเป็น geometry-resilient แต่ไม่ independent จาก host failure

## สิ่งที่ซิมทำได้แล้ว

- 3D radiation pattern, θ–φ map, two principal-plane cuts
- import measured 3D gain grid และ frequency response/S11/AR CSV
- EIRP, FSPL, received power, noise, C/N, C/N0, Eb/N0, bandwidth และ max supported rate
- frequency/rate/range/pointing sweeps และ one-variable sensitivity
- fixed vs gimbal time history, gimbal travel, 2U packaging, lander/ground blockage
- power/energy, host radio/power gates, thermal two-node model และ Monte Carlo landing attitudes

## สิ่งที่ควรแก้ในซิมก่อน capture ใส่รอบชิง

ลำดับเร่งด่วน:

1. เพิ่ม **ground-station profiles** อย่างน้อย 12.8, 17, 18, 21 และ 22 dB/K พร้อมสถานะ `reference / assumed / contracted`
2. เพิ่มกราฟ **final lander tilt sweep** สำหรับ fixed, gimbal-clear และ gimbal-with-blockage โดยใช้ geometry/travel/packaging gate จริง ไม่ใช้ mispoint angle แทน tilt เฉย ๆ
3. แยก preset `Direct-to-Earth 384,400 km` และ `100 km lunar relay`; แต่ละ preset ต้องมี frequency, Rx G/T, rate, waveform และ visibility ของตัวเอง
4. เพิ่ม selector `host RF service` / `onboard radio` และแสดง DC power ที่ boundary ถูกต้อง
5. เพิ่ม **uncertainty sweep** ของ G/T, Tx power, feed/installation loss, antenna gain, pointing bias และ temperature; รายงาน P5/P50/P95 margin หรือ pass probability
6. ทำ mount field-of-view sweep เพื่อหาตำแหน่งที่ไม่ถูก hull บังใน attitude envelope. Current 65° case ที่ green-zone concept mount ถูก hull proxy บัง จึงไม่ควรนำกราฟนั้นไปอ้างว่า gimbal กู้ลิงก์สำเร็จ
7. เพิ่ม architecture trade model สำหรับ fixed patch / gimballed patch / planar phased array โดยเปิด assumptions ของ scan limit, scan loss, insertion loss, mass, DC power และ number of faces; ห้ามใส่ phased-array ตัวเลขเป็น fact หากไม่มี component/CAD source
8. เมื่อมี hardware ให้ import measured mounted pattern, S11 และ AR; จนกว่าจะมี ให้ติดป้ายทุกกราฟว่า `analytical/reference—not measured`

## ภาพที่ควร export ไปใช้จริง

- หน้า 14: angular error vs time และ step-response metrics
- หน้า 16A: 3D radiation + θ–φ map + principal cuts พร้อมลูกศร Earth LOS
- หน้า 16B: link-budget waterfall/table + G/T sensitivity + tilt sweep fixed/gimbal/blockage
- หน้า 17: Monte Carlo roll/pitch map พร้อมสาเหตุ fail แยกสี
- Annex: full parameter/provenance table และสมการ เพื่อให้กรรมการตรวจย้อนกลับ

สำหรับสไลด์ที่พิมพ์เลข 14 เรื่อง antenna ให้ใช้ `slide-assets/p14-paper-comparable-rf.png` เมื่อต้องการเทียบกับ Gadhafi et al. Figure 18 แบบอ่านข้ามฝั่งได้ทันที ภาพของทีมใช้ลำดับ S11–frequency, XZ cut และ YZ cut เหมือน paper พร้อมแทรก link-headroom-vs-tilt ของระบบ อย่างไรก็ตาม จุด S11 ของทีมเป็น scalar assumption และ polar cuts เป็น reduced-order cosine model; ยังไม่ใช่ผล CST, mounted full-wave simulation หรือ chamber measurement

อย่าใช้ screenshot ยาวทั้งหน้าเว็บ. ให้ crop เป็น panel, ใส่ชื่อ scenario/version/วันที่และ assumptions สำคัญใต้ภาพทุกครั้ง

## จุดใน PDF ที่ต้องเก็บก่อนส่ง

- ไฟล์มี deck ใหม่หน้า 1–27 แล้วมี deck รุ่นเก่าซ้ำหน้า 28–42 และหน้าว่าง 43; ต้องลบชุดเก่าก่อน export final
- หน้า 10 ตารางซ้อนกันและมีหัวตาราง/หน่วยแตก; ทำใหม่ก่อนใช้
- หน้า 14 ข้อความ requirement/result ซ้อนกัน (`R47 msl`, `±0.5°`, phase/gain margin) และต้องแยก command latency จาก settling time
- หน้า 15 ยังไม่มีสมมติฐาน relay ที่ตรวจได้
- หน้า 16 มี literature precedent แต่ยังไม่บอกว่าค่าไหนเป็นของ paper และค่าไหนเป็น design ของทีม
- หน้า 18 แก้ `raliable`; หน้า 23 แก้ `Stackholder` และ `Intergation`
- ลดแหล่ง Wikipedia/market blog ใน technical claims และเพิ่ม primary paper, provider guide, spectrum/network source

## Sources to cite in the final deck

- [NASA Small Spacecraft Ground Data Systems and Mission Operations](https://www.nasa.gov/smallsat-institute/sst-soa/ground-data-systems-and-mission-operations/) — S-band return 2200–2290 MHz, asset-dependent G/T, bandwidth, modulation and coding
- [NASA Small Spacecraft Communications](https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/) — current small-spacecraft antenna/radio examples
- [Sánchez-Sevilleja et al., Sensors 2025, DOI 10.3390/s25041237](https://doi.org/10.3390/s25041237) — compact dual-CP S-band antenna, 80 × 80 × 6.53 mm, 30 g, 6.5–7 dBi reference
- [Jirawattanaphol et al., Technologies 2026, DOI 10.3390/technologies14050263](https://doi.org/10.3390/technologies14050263) — measured S11/AR bands and 7.24 dBic maximum at 2.18 GHz; do not transplant that peak to 2.205 GHz without data
- [Gadhafi and Serria, Sensors 2024, DOI 10.3390/s24165361](https://doi.org/10.3390/s24165361) — mounted lunar-rover/terrain antenna effects; precedent, not validation of this payload
- [Astrobotic Lunar Landers Payload User’s Guide](https://science.nasa.gov/wp-content/uploads/2023/11/astrobotic-lunar-landers-pug.pdf) — actuated medium/high-gain antennas after touchdown and payload interface context; gimballed lander antennas are not unprecedented
- [NASA NTRS: electronically steered antenna design factors](https://ntrs.nasa.gov/api/citations/19690011734/downloads/19690011734.pdf) — scan gain decrease, spacing, grating lobes, mutual coupling and polarization effects
- [NASA Lunar Surface Propagation](https://www.nasa.gov/glenn/glenn-expertise-space-exploration/scan/lunar-surface-propagation/) — south-pole horizon, terrain reflection and DTE limitations
- [NASA LunaNet Interoperability Specification](https://www.nasa.gov/directorates/somd/space-communications-navigation-program/lunanet-interoperability-specification/) — distinguish DTE and lunar relay service concepts
