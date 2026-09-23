# Antenna baseline decision — 2U surface payload

อัปเดต 23 กันยายน 2026 สำหรับ Lunar Link Studio v1.5.2

## ข้อสรุปการเลือก

ยังไม่มีเสาอากาศที่เผยแพร่ซึ่งให้ทั้ง RF evidence ที่ 2.205 GHz, qualification และขนาดที่หมุนได้ครบในกลไก 2U ของเรา จึงแยกสิ่งที่ “เสนอ” ออกจากสิ่งที่ “วัดแล้ว” ให้ชัด:

1. **Mission geometry — proposed compact stacked CP patch target:** 60 × 60 × 7 mm, mass allocation 100 g, gain target 5.2 dBic, analytical HPBW 90° และ S11 target −10 dB. ใช้ทำ packaging/link sensitivity เท่านั้น; ต้องออกแบบ EM และทดสอบจริง
2. **Research benchmark — Sánchez-Sevilleja et al., Sensors 2025 (ANSER):** stacked dual-CP patch 80 × 80 × 6.53 mm nominal, 30 g, measured/qualified at 2.205 GHz. ใช้เป็น topology, S-parameter, gain และ qualification precedent; geometry 80 mm ไม่ผ่าน full internal sweep ของเรา
3. **Commercial comparator — AAC Clyde Space AC-2000:** มี flight heritage และตัวเลข RF ที่เป็นประโยชน์ แต่รูปผลิตภัณฑ์จริงไม่ใช่ planar stacked patch geometry ที่ทีมเสนอ จึงไม่ใช้ภาพหรือ pattern ของรุ่นนี้แทนฮาร์ดแวร์ของทีม

## Requirement gates

| Gate | Project requirement | Current baseline | สถานะ |
|---|---:|---:|---|
| Frequency | 2.205 GHz downlink study | design point 2.205 GHz | PASS for study; assignment pending |
| Payload envelope | 100 × 100 × 200 mm including gimbal | proposed antenna 60 × 60 × 7 mm | PASS in concept model |
| Gimbal sweep | az ±180°, el −85°…+85° | 100% of 5° sampled grid; minimum clearance 3.075 mm | PASS screening only |
| Total mass | ≤1.5 kg | antenna allocation 100 g; total input 1.5 kg | PASS input limit; CAD roll-up pending |
| Link | 384,400 km, 4 kbps, ≥3 dB reserve | 7.26 dB raw margin at 5 W RF and G/T 22 dB/K | PASS under assumptions |
| Polarization | circular | AR target ≤3 dB; handedness TBD | OPEN until EM/measurement |
| Thermal | payload −40…+80°C under −170°C / +110°C surface references | lander-powered local payload/gimbal heater model | CONDITIONAL; integrated TVAC required |
| RF power | 5 W RF study | radiator/feed power handling not proven | OPEN |
| Installed RF | S11, AR, gain and 3D pattern on lander | analytical model only | OPEN — installed EM/VNA/chamber test |

`PASS screening only` หมายถึงผ่านสมการและ bounding-box proxies ในซอฟต์แวร์ ไม่ใช่ flight qualification.

## Candidate screen

| Candidate | Evidence | Frequency / gain | Envelope | Decision |
|---|---|---|---|---|
| **Proposed compact target** | project geometry informed by ANSER | 2.205 GHz; 5.2 dBic target | 60 × 60 × 7 mm; 100 g allocation | **Mission geometry; EM unverified** |
| **ANSER 2025** | measured S11/AR/gain, integrated structure, vibration/shock/TVAC, flown | 2.205 GHz; 6.5–7 dBi isolated | 80 × 80 × 7 mm physical; 30 g | **Research benchmark; full sweep fails** |
| **AC-2000** | manufacturer datasheet, space-qualified, flight-proven | 2.0–2.3 GHz; 5.2 dBic typical | approx. 2 × 2 in; ≈100 g | Commercial comparator; architecture mismatch |
| **SLSP 2026** | mounted measurements, impedance/AR bandwidth, vibration/TVAC | max 7.24 dBic at 2.18 GHz | 100 × 100 × 15 mm enclosure | Reject for internal gimbal packaging |
| Tigrisat | measured beamwidth; historical comparison | 2.45 GHz; 7.3 dBi simulated | 96 × 96 × 7 mm | Reject: frequency and sweep |
| Planar phased array | architecture option, no selected qualified unit | footprint-dependent | multiple RF channels and calibration | Retain as trade option |

## Values used by the simulator

| Parameter | Value | Provenance |
|---|---:|---|
| Frequency | 2.205 GHz | project DTE study point |
| Peak realized gain | 5.2 dBic | design target / sensitivity input |
| S11 | −10 dB | matching requirement, not a result |
| HPBW | 90° symmetric | analytical trade-study assumption |
| Footprint / thickness | 60 × 60 × 7 mm | packaging target |
| Antenna mass | 100 g | mass allocation |
| Cable travel | ±180° | project allocation; cable/rotary joint unproven |

ซิมใช้ analytical cosine pattern. ห้ามเรียกกราฟนี้ว่า measured radiation pattern หรือผล CST/HFSS.

## Link calculation

At 2.205 GHz and 384,400 km:

- `FSPL = 20 log10(4πRf/c) = 211.01 dB`
- `Ptx = 5 W = 6.99 dBW`
- `EIRP = 6.99 + 5.20 − 1.00 = 11.19 dBW`
- `C/N0 = 11.19 − 211.01 + 22 + 228.599 − 0.5 − 1.0 = 49.28 dB-Hz`
- `Eb/N0 = 49.28 − 10 log10(4000) = 13.26 dB`
- `raw margin = 13.26 − 4.5 − 1.5 = 7.26 dB`
- after 3 dB reserve, remaining headroom is **4.26 dB**

ผลนี้ขึ้นกับ 5 W RF, receiver G/T 22 dB/K, coding threshold, losses, clear LOS และ host availability. ที่ G/T 17 dB/K raw margin ลดเหลือประมาณ 2.26 dBและไม่ผ่าน reserve.

## Work required before design release

1. Re-optimize the 60 mm stacked patch in CST/HFSS with the gimbal, coax and representative lander deck.
2. Produce S11, axial ratio, efficiency, realized gain and 3D co/cross-polarized patterns across frequency and temperature.
3. Complete CAD for bearings, motors, fasteners, harness, connector keep-out, RF bend radius and tolerance stack.
4. Confirm frequency/channel, polarization handedness, 5 W RF interface and ground G/T with the provider.
5. Measure VNA and chamber performance before/after vibration, shock and TVAC.

## Primary sources

- [Sánchez-Sevilleja et al., Sensors 2025, DOI 10.3390/s25041237](https://doi.org/10.3390/s25041237)
- [Jirawattanaphol et al., Technologies 2026, DOI 10.3390/technologies14050263](https://doi.org/10.3390/technologies14050263)
- [AAC Clyde Space AC-2000 datasheet](https://www.aac-clyde.space/wp-content/uploads/2021/11/AC-2000-1.pdf)
- [NASA Small Spacecraft Communications](https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/)
