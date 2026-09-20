# Validation — v1.3.0 — 2026-09-20

Windows / Node.js22.17.1 / Chrome headless. ผลทั้งหมดคือผลจำลอง ไม่ใช่การวัด flight hardware

## Software checks

- `npm.cmd test`: 37/37 ผ่าน รวม quaternion, known FSPL, gain/HPBW, energy depletion, seeded reproduction, PID step, timestep refinement2→1ms
- เพิ่ม lock sequence, vibration cutoff, 2U plate sweep, ground burial/hull obstruction, host blackout, host RF หลัง payload budget หมด, heat-transfer conservation และ paper profile consistency
- Production build v1.3.0 ผ่าน; Three.js vendor chunk≈548kB uncompressed ทำให้ Vite แจ้ง size advisory
- Chrome production workflow ของ v1.3 ผ่านเมื่อ 20 ก.ย. 2026: WebGL, playback, payload view, exploded view, numeric inputs, paper profile switching, pattern import, thermal, motor step, 50-trial worker, report/CSV, invalid/valid config imports, inverted ground blockage
- Desktop1512×1120 และ mobile390×844; ไม่พบ horizontal overflow หรือ browser runtime errors
- รูป `test-results/desktop.png`, `payload-2u.png`, `mobile.png`

## RF laboratory checks

- Two-plane half-power widths, antenna-frame transforms and live link coupling
- Theta/phi interpolation, phi wrap, pole validation and isotropic solid-angle normalization
- Accepted vs realized gain: mismatch loss applied exactly once
- Ideal matched/opposite CP, received-power/noise/CN consistency, independent bandwidth failure
- Frequency response interpolation, no extrapolation, thermal lookup shift and integer modulation input
- `npm.cmd run test:rf-browser` ผ่านบน production v1.3.0: 3D WebGL, time selection, two-plane controls, frequency/grid imports, unsupported-frequency masking/export rejection, bandwidth failure, study/grid exports, bad-data rejection and mobile layout. ใช้ Nominal ใน bandwidth test เพื่อแยกจาก hull blockage ของตำแหน่งใหม่.
- เพิ่ม unit tests ตรวจ evaluated pattern integral หลัง loss/frequency shift, unsupported metrics, CSV round-trip ของ gain/link/polarization และการตรวจ snapshot metadata
- เพิ่ม browser tests เปลี่ยน input/time แล้ว export ทันที และนำ evaluated grid กลับเข้าโดยไม่หัก installation/mismatch loss ซ้ำ
- Original browser workflow including 50-trial worker also passed on the v1.3 production build
- RF screenshots: `test-results/radio-laboratory.png`, `radiation-3d.png`, `radio-mobile.png`; study data: `examples/antenna-rf-study.json`

## Surface payload checks (v1.3)

- เพิ่ม 5 unit tests: project/service mass limits แยกกัน, mass hierarchy, total-mass interface force, mount/envelope screening, report/JSON assessment และกรณี 65° tip ที่ชี้ตรงแต่ hull บัง.
- `node tests/surface-browser.mjs` ผ่าน: lander WebGL, Mount, isolated 2U, optional service zones, mass editing, interface force, restore mount, report/JSON export, buried antenna และ mobile layout.
- ตรวจภาพจริงและแก้ผิวดาดฟ้าซ้อนกัน รวมถึงซ่อนป้ายภาพรวมเมื่อ zoom เข้า Mount. ภาพล่าสุด `test-results/surface-lander.png`, `surface-mount.png`, `surface-zones.png`, `surface-2u.png`, `surface-mobile.png`.
- Service limits มาจากรูปแผ่นข้อมูลที่ผู้ใช้ส่ง; geometry/coordinates เป็น concept assumptions. ไม่ได้ยืนยัน provider ICD, measured total mass หรือ clearance ของ full assembly.

## Reproducible results

Defaults/seed2026; 18s; integration2ms; RF2.205GHz,5W,6.5dBi,82.44°HPBW approximation,4kbps, reserve3dB. Mount XYZ = 0.65, 0.76, 0.45 m ในโซนบนที่สมมติ. Availability นับทั้ง run รวมก่อน touchdown

| Preset | Final error ° | Gimbal margin dB | Fixed margin dB | Gimbal / fixed availability % |
|---|---:|---:|---:|---:|
| Nominal | 0.0417 | 8.5566 | 8.5069 | 100 / 100 |
| Off-nominal65° | 0.0926 | Blocked: hull | Blocked | 16.94 / 16.94 |
| Hard touchdown | 0.0746 | 8.5566 | 4.9691 | 100 / 100 |
| Dust & cold | 0.1810 | 8.5566 | 6.4489 | 100 / 100 |
| Actuator jam | 64.7865 | Blocked: hull | Blocked | 16.93 / 16.93 |
| Beyond travel | 36.2458 | 6.2832 | 3.2047 | 100 / 100 |
| Sideways90° | 0.0916 | 8.5566 | 6.0097 | 100 / 100 |
| Nose-down105° | 36.0642 | Blocked: hull | Blocked | 15.22 / 15.22 |
| Inverted180° | 0.0986 | Blocked: ground | Blocked | 16.76 / 16.76 |
| Hot surface | 0.0925 | Blocked: hull | Blocked | 16.94 / 16.94 |
| Host blackout | 66.7729 | No power | No power | 11.10 / 11.10 |

Broad beam ทำให้ beyond-travel ยังมี link ได้ แต่ไม่ผ่าน pointing. Inverted errorต่ำยังไม่มี link เพราะพื้นบัง. Default65° ปลด lock ที่4.340s แต่ไม่มี usable link หลังปลดที่ตำแหน่งใหม่นี้ เพราะ hull proxy บัง. ผลที่เคยกู้ได้ใน v1.2.1 ใช้ mountZ = 0.73 m; คงเป็น regression test แยกสำหรับ clear-path edge mount และไม่อ้างว่าอยู่ใน green zone ปัจจุบัน.

## Command response / step

Default100Hz + configured delay10ms ให้ latency bound20ms ใน scheduler model ไม่รวมเซนเซอร์/CPUจริง. Separate5° azimuth step,±0.5° band,5s observation: settling154ms, rise10–90%=124ms, overshoot0.612%. จึงไม่ผ่าน50ms physical settling; ห้ามสับสนกับ command latency

## Thermal24h

Cold preset: payload−30 ถึง−11.42°C; heater206.55Wh; host total228.86Wh. Hot preset: payload30 ถึง108.12°C, heater0Wh; เกิน motor limit80°C. RF/motors OFF; default thermal/contact/energy assumptions; no recharge

## Physical validation still required

37 tests ยืนยัน implementation เฉพาะขอบเขตที่ทดสอบ ไม่ยืนยัน hardware. Envelope ตรวจแผ่นเสา ไม่ตรวจสาย/yoke/motorครบ; attitude prescribed; obstacle hull box/plane; gain cosine approximation; thermal lumped nodes; dust uncalibrated. ดู ENGINEERING-NOTES.md สำหรับแผน CAD, EM, bench และ qualification. รายละเอียด service limits จากภาพและ geometry ที่สมมติอยู่ใน SURFACE-MODEL.md.
