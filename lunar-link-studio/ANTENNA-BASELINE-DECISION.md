# Antenna baseline decision — 2U surface payload

อัปเดต 23 กันยายน 2026 สำหรับ Lunar Link Studio v1.5.0

## ข้อสรุปการเลือก

ไม่มีงานวิจัยชิ้นเดียวที่ให้ทั้ง RF evidence ที่ 2.205 GHz, qualification, ขนาดที่กวาดกิมบอลได้ครบภายใน cavity 2U และข้อมูลติดตั้งบน lunar lander พร้อมใช้ทันที จึงใช้หลักฐานสองชั้น:

1. **Mission-fit baseline — AAC Clyde Space AC-2000 compact S-band patch** ใช้สำหรับ geometry, link budget และ radiation cut ในซิมหลัก เพราะ footprint ประมาณ 50.8 × 50.8 mm ผ่าน concept gimbal sweep ปัจจุบัน
2. **Research benchmark — Sánchez-Sevilleja et al., Sensors 2025 (ANSER)** ใช้ยืนยันแนวทาง stacked CP patch ที่ 2.205 GHz, S-parameters, gain, mounted interaction และ environmental qualification แต่แผ่น 80 × 80 mm ไม่ผ่าน full internal sweep ของกลไกเรา

แนวทางนี้ไม่คัดงานจาก gain สูงสุดเพียงค่าเดียว แต่คัดด้วยความถี่, ขนาด, mass, pattern evidence, qualification และความเข้ากันได้กับหัวข้อ “กู้ลิงก์หลัง off-nominal landing ด้วยกิมบอลใน 2U”.

## Requirement gates

| Gate | Project requirement | Mission-fit baseline | สถานะ |
|---|---:|---:|---|
| Frequency | 2.205 GHz downlink study | AC-2000 covers 2.0–2.3 GHz | PASS for study; mission assignment pending |
| Payload envelope | 100 × 100 × 200 mm including gimbal | 50.8 × 50.8 × 15 mm antenna allocation | PASS in concept model |
| Gimbal sweep | az ±180°, el −85°…+85° | 100% of 5° sampled bounding-box grid; minimum clearance >5 mm | PASS screening only |
| Total mass | ≤1.5 kg | antenna ≈100 g; total payload input 1.5 kg | PASS input limit; CAD mass roll-up pending |
| Link | 384,400 km, 4 kbps, ≥3 dB reserve | 7.26 dB raw margin, 4.26 dB above reserve at 5 W RF and G/T 22 dB/K | PASS under stated assumptions |
| Polarization | circular | RHCP or LHCP option | PASS after ground-station handedness is fixed |
| Thermal | payload kept within −40…+80°C while lunar boundary is stressed to ±170°C | antenna operating range −40…+80°C; host heater/interface model | CONDITIONAL; integrated TVAC required |
| RF power | 5 W RF study | public AC-2000 datasheet does not state power handling | OPEN — vendor confirmation required |
| Installed RF | S11, AR, gain and 3D pattern on lander | isolated/vendor evidence only | OPEN — mounted EM/VNA/chamber test required |

`PASS screening only` หมายถึงผ่านสมการและ bounding-box proxies ในซอฟต์แวร์ ไม่ใช่ flight qualification.

## Candidate screen

| Candidate | Evidence | Frequency / gain | Envelope | Decision |
|---|---|---|---|---|
| **AC-2000** | manufacturer datasheet, space-qualified, flight-proven, three pattern cuts | 2.0–2.3 GHz; 5.2 dBic typical | approx. 2 × 2 in; ≈100 g; thickness not public | **Mission-fit baseline** |
| **ANSER 2025** | peer-reviewed measured S11/AR/gain, integrated structure, vibration/shock/TVAC, flown | 2.205 GHz; 6.5–7 dBi isolated | 80 × 80 × 7 mm physical; 30 g | **Research benchmark; full sweep fails** |
| **SLSP 2026** | recent peer-reviewed mounted measurements, wide impedance/AR bandwidth, vibration/TVAC | measured max 7.24 dBic at 2.18 GHz; 2.00–2.34 GHz matching | 100 × 100 × 15 mm enclosure, Ø94 mm radiator | Reject for internal gimbal packaging |
| Tigrisat | measured beamwidth; useful historical comparison | 2.45 GHz; 7.3 dBi simulated | 96 × 96 × 7 mm | Reject: wrong study frequency and sweep |
| Rather & Suganthi 2017 | compact CP patch simulation | about 2.43 GHz; 5.01 dBi simulated | 68.58 × 59.48 × 3.2 mm substrate | Reject: wrong frequency, no measured/qualification evidence |
| Planar phased array | architecture option, no selected qualified unit | footprint-dependent | several RF channels/phase control/calibration | Reject for PoC baseline; retain as trade option |

## Values now used by the simulator

| Parameter | Value | Provenance |
|---|---:|---|
| Frequency | 2.205 GHz | project DTE study point; inside public antenna band |
| Peak realized gain | 5.2 dBic | AC-2000 typical datasheet value |
| S11 input | −13.98 dB | converted from VSWR 1.5:1 |
| Radiation cut | 0° to 180° in 22.5° samples | minimum of the three published relative-gain cuts, shifted by 5.2 dBic |
| Footprint | 50.8 × 50.8 mm | nominal conversion of approximate 2 × 2 in public size |
| Thickness | 15 mm | conservative project allocation; not vendor data |
| Antenna mass | 100 g | approximate datasheet value |
| Cable travel | ±180° | project allocation; must be proven by cable routing or rotary joint |

The built-in conservative absolute-gain cut is:

| Off-boresight angle | Gain used |
|---:|---:|
| 0° | 5.2 dBic |
| 22.5° | 4.2 dBic |
| 45° | 2.1 dBic |
| 67.5° | −0.8 dBic |
| 90° | −1.9 dBic |
| 112.5° | −6.1 dBic |
| 135–180° | −24.8 dBic |

The datasheet pattern is sparse and is not a mounted lunar-lander pattern. Linear interpolation between samples is an analysis choice.

## Link calculation for the selected baseline

At 2.205 GHz and 384,400 km:

- `FSPL = 20 log10(4πRf/c) = 211.01 dB`
- `Ptx = 5 W = 6.99 dBW`
- `EIRP = 6.99 + 5.20 − 1.00 = 11.19 dBW`
- `C/N0 = 11.19 − 211.01 + 22 + 228.599 − 0.5 − 1.0 = 49.28 dB-Hz`
- `Eb/N0 = 49.28 − 10 log10(4000) = 13.26 dB`
- `raw margin = 13.26 − 4.5 − 1.5 = 7.26 dB`
- after the required 3 dB reserve, remaining headroom is **4.26 dB**

This closes only under the stated RF power, receiver G/T, coding threshold, losses, clear line of sight and host availability. At G/T 17 dB/K the raw margin falls to about 2.26 dB and fails the 3 dB reserve gate.

## What changed in v1.5.0

- Default antenna profile changed from the 80 mm ANSER plate to the compact mission-fit profile.
- The simulator now uses a conservative datasheet radiation cut instead of a synthetic cosine pattern for the default profile.
- ANSER physical height is represented as 7 mm while preserving 6.53 mm as its nominal stack dimension in documentation.
- The full concept assembly now passes the sampled 2U sweep for the mission-fit profile; switching to ANSER exposes the packaging failure.
- Unit tests now verify both the compact pass and the ANSER failure so future edits cannot silently erase the trade.

## Work that still requires hardware or external data

1. Obtain vendor ICD/CAD, exact height, connector keep-out, RF power rating, materials and outgassing data.
2. Confirm 2.205 GHz channel, duplex plan, polarization handedness, 5 W RF port and ground-service G/T with the lander/ground provider.
3. Build the complete CAD with bearings, motors, fasteners, harness, RF bend radius, tolerance stack and green-zone obstacles.
4. Run full-wave installed EM analysis for S11, axial ratio, realized gain, efficiency, lander coupling and 3D pattern.
5. Measure VNA and anechoic-chamber results before/after vibration, landing shock and TVAC. The ±170°C values remain lunar boundary stresses; the antenna itself must remain inside its operating range.

## Primary and authoritative sources

- [Sánchez-Sevilleja et al., Sensors 2025, DOI 10.3390/s25041237](https://pmc.ncbi.nlm.nih.gov/articles/PMC11860546/)
- [Jirawattanaphol et al., Technologies 2026, DOI 10.3390/technologies14050263](https://www.mdpi.com/2227-7080/14/5/263)
- [AAC Clyde Space AC-2000 datasheet](https://www.aac-clyde.space/wp-content/uploads/2021/11/AC-2000-1.pdf)
- [Rather and Suganthi, IEEE WiSPNET 2017, DOI 10.1109/WiSPNET.8300049](https://doi.org/10.1109/WiSPNET.8300049)
- [NASA Small Spacecraft Communications](https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/)
