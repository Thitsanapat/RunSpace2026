# Validation — v1.5.0 — 2026-09-23

v1.5.0 ใช้ proposed compact stacked CP patch target และเก็บ ANSER เป็น research benchmark. `npm.cmd test` ผ่าน 43/43 กรณี รวม explicit RF-evidence reset, compact 2U sampled sweep pass และ ANSER sweep fail. ค่า baseline ที่ทำซ้ำได้: on-axis raw margin 7.2566 dB, excess above 3 dB reserve 4.2566 dB, compact 60 mm assembly 100% ของ sampled 5° grid และ minimum concept clearance 3.075 mm. ANSER assembly sampled passประมาณ3.05% และ minimum signed clearance −10.68 mm.

ข้อจำกัดของผลผ่าน: 60 × 60 × 7 mm, 5.2 dBic, HPBW 90° และ S11 −10 dB เป็น design targets. Geometry เป็น bounding boxes ไม่ใช่ exact CAD และ pattern เป็น analytical cosine model ไม่ใช่ mounted 3D measurement.

v1.4.2 เพิ่ม browser regression สำหรับ migration จาก mount รุ่นเก่าไป `[0.92, 0.76, 0.62]` และซ่อน selected green envelope รวมถึงแผ่น placeholder ที่ถูก cyan payload ครอบครองแล้ว เพื่อไม่แสดงเป็น payload สองก้อน.

## Multi-view model / Pages revision (v1.4.1)

- 41/41 unit tests and production build pass. Geometry/detail/camera changes only; numerical hull/mount and payload constraints stay at v1.4 values. Historical numeric examples retain their recorded version.
- Brochure browser workflow passes with two real perforated equipment faces, external X braces, White studio, orthographic Side/Top/Bottom, perspective Isometric, mobile and GLB export.
- `node tests/pages-browser.mjs` passes: assets under `/RunSpace2026/`, mission and RF WebGL, model version and a 50-trial module worker. This local path test does not by itself prove the public deployment is live.
- Reference screenshots: `test-results/reference-isometric.png`, `reference-top.png`, `reference-side.png`, `reference-bottom.png`. These are views of the same mesh, not independent AI images.

Windows / Node.js22.17.1 / Chrome headless. ผลทั้งหมดคือผลจำลอง ไม่ใช่การวัด flight hardware

## Software checks

- `npm.cmd test`: 41/41 ผ่าน รวม quaternion, known FSPL, gain/HPBW, energy depletion, seeded reproduction, PID step, timestep refinement2→1ms; เพิ่ม full mechanism proxy, cable allocation, independent capacitor energy/drop/inrush checks และ voltage validation
- เพิ่ม lock sequence, vibration cutoff, 2U plate sweep, ground burial/hull obstruction, host blackout, host RF หลัง payload budget หมด, heat-transfer conservation และ paper profile consistency
- Production build v1.4.0 ผ่าน; Three.js vendor chunk≈558kB uncompressed ทำให้ Vite แจ้ง size advisory
- Chrome production workflow ผ่านซ้ำบน v1.4 เมื่อ 21 ก.ย. 2026: WebGL, playback, payload view, exploded view, numeric inputs, paper profile switching, pattern import, thermal, motor step, 50-trial worker, report/CSV, invalid/valid config imports, inverted ground blockage
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

## Payload detail and proportion checks (v1.4)

- `test:brochure-browser` ผ่านบน v1.4: บอร์ด 3 ชั้น/thermal strap/host connector อยู่ใน GLB, cover toggle, exploded view, fit/bus diagnostics, design JSON export และ mount XYZ ใหม่. ตรวจ overview/underside/top/mount/mobile และ export/visibility invariants ด้วย.
- Example design study ใช้ Nominal: grid 5° ผ่าน 3.0528% (ไม่ใช่ reliability), min clearance −10.6621 mm; P 0.9671 W, Vload 21.9780 V, ideal hold-up 38.6430 ms, current allocation/outage ไม่ผ่านตาม input assumptions.
- ปรับ hull และ green-bay mount ตามภาพล่าสุด จึงเปลี่ยน blockage timing. Clear-path regression แยกใช้ mountZ=1.01 m นอก selected bay; ไม่แอบปรับ default ให้ link ผ่าน.
- ไฟล์ `payload-circuit-detail.png`, `payload-circuit-exploded.png`, `payload-assembly-study.png`, `payload-power-study.png` และ `examples/payload-design-study.json`.
- `test:surface-browser` ผ่านซ้ำบน v1.4: mass limits, load estimate, updated mount restoration, report/JSON export, burial และ mobile layout.

## Brochure reconstruction checks (historical v1.3.1)

- Unit tests 37/37 ผ่านซ้ำใน v1.3.1; ไม่มีการเปลี่ยน solver หรือ mount coordinates ใน revision นี้.
- `npm.cmd run test:brochure-browser` ผ่าน: overview, underside, top, mount, GLB binary/header/scene-node checks, 12 coloured service allocations, cyan material, export จาก isolated 2U view, ซ่อน allocations ใน GLB และ mobile layout.
- เปิด/ปิด brochure payloads ไม่เปลี่ยน numerical summary; นี่เป็น visualization ไม่ใช่การเพิ่ม manifest หรือ EM obstacles.
- ตรวจภาพจริงใน `test-results/brochure-*.png`; กล้องใต้ยานซ่อน ground และเพิ่ม inspection light. รูปทรงที่มองไม่เห็นยังเป็นสมมติฐาน.
- `examples/ispace-photo-concept-with-our-2u.glb` เป็น glTF 2.0 binary, units metres, normalized body pose และมี provenance/รายการ allocation ใน extras. ไม่รวม labels, rays, ground หรือ RF lobe.
- RF และ full-workflow tests ด้านบนเป็นผล v1.3.0; revision นี้ทดสอบ geometry/export โดยเฉพาะ ไม่อ้างว่า rerun full Monte Carlo UI อีกครั้ง.

## Surface payload checks (v1.3)

- เพิ่ม 5 unit tests: project/service mass limits แยกกัน, mass hierarchy, total-mass interface force, mount/envelope screening, report/JSON assessment และกรณี 65° tip ที่ชี้ตรงแต่ hull บัง.
- `node tests/surface-browser.mjs` ผ่าน: lander WebGL, Mount, isolated 2U, optional service zones, mass editing, interface force, restore mount, report/JSON export, buried antenna และ mobile layout.
- ตรวจภาพจริงและแก้ผิวดาดฟ้าซ้อนกัน รวมถึงซ่อนป้ายภาพรวมเมื่อ zoom เข้า Mount. ภาพล่าสุด `test-results/surface-lander.png`, `surface-mount.png`, `surface-zones.png`, `surface-2u.png`, `surface-mobile.png`.
- Service limits มาจากรูปแผ่นข้อมูลที่ผู้ใช้ส่ง; geometry/coordinates เป็น concept assumptions. ไม่ได้ยืนยัน provider ICD, measured total mass หรือ clearance ของ full assembly.

## Reproducible results

Defaults/seed2026; 18s; integration2ms; RF2.205GHz,5W,6.5dBi,82.44°HPBW approximation,4kbps, reserve3dB. Mount XYZ = 0.92, 0.76, 0.62 m ในโซนบนที่สมมติ. Availability นับทั้ง run รวมก่อน touchdown; ผล v1.4 จาก `scripts/export-examples.mjs` ไม่ใช้ full-assembly diagnostic เป็น mission gate.

| Preset | Final error ° | Gimbal margin dB | Fixed margin dB | Gimbal / fixed availability % |
|---|---:|---:|---:|---:|
| Nominal | 0.0417 | 8.5566 | 8.5069 | 100 / 100 |
| Off-nominal65° | 0.0926 | Blocked: hull | Blocked | 16.49 / 16.49 |
| Hard touchdown | 0.0746 | 8.5566 | 4.9691 | 100 / 100 |
| Dust & cold | 0.1810 | 8.5566 | 6.4489 | 100 / 100 |
| Actuator jam | 64.7865 | Blocked: hull | Blocked | 16.50 / 16.50 |
| Beyond travel | 36.2458 | 6.2832 | 3.2047 | 100 / 100 |
| Sideways90° | 0.0916 | 8.5566 | 6.0097 | 100 / 100 |
| Nose-down105° | 36.0642 | Blocked: hull | Blocked | 14.98 / 14.98 |
| Inverted180° | 0.0986 | Blocked: ground | Blocked | 16.12 / 16.12 |
| Hot surface | 0.0925 | Blocked: hull | Blocked | 16.49 / 16.49 |
| Host blackout | 66.7729 | No power | No power | 11.10 / 11.10 |

Broad beam ทำให้ beyond-travel ยังมี link ได้ แต่ไม่ผ่าน pointing. Inverted errorต่ำยังไม่มี link เพราะพื้นบัง. Default65° ปลด lock ที่4.340s แต่ไม่มี usable link หลังปลดที่ตำแหน่งใหม่นี้ เพราะ hull proxy บัง. ผลที่เคยกู้ได้ใน v1.2.1 ใช้ mountZ = 0.73 m; v1.4 clear-path regression ใช้ 1.01 m ตาม hull ใหม่ และไม่อ้างว่าอยู่ใน green zone ปัจจุบัน.

## Command response / step

Default100Hz + configured delay10ms ให้ latency bound20ms ใน scheduler model ไม่รวมเซนเซอร์/CPUจริง. Separate5° azimuth step,±0.5° band,5s observation: settling154ms, rise10–90%=124ms, overshoot0.612%. จึงไม่ผ่าน50ms physical settling; ห้ามสับสนกับ command latency

## Thermal24h

Cold preset: payload−30 ถึง−11.42°C; heater206.55Wh; host total228.86Wh. Hot preset: payload30 ถึง108.12°C, heater0Wh; เกิน motor limit80°C. RF/motors OFF; default thermal/contact/energy assumptions; no recharge

## Physical validation still required

41 tests ยืนยัน implementation เฉพาะขอบเขตที่ทดสอบ ไม่ยืนยัน hardware. Mission envelope gate ตรวจแผ่นเสา; diagnostics ใหม่ตรวจ bounding geometry ของ yoke/motor/connector และพื้นที่โค้งสายแยก ไม่ใช่ full CAD collision. Attitude prescribed; obstacle hull box/plane; gain cosine approximation; thermal lumped nodes; dust uncalibrated. ดู PAYLOAD-DESIGN.md และ ENGINEERING-NOTES.md สำหรับแผน CAD, EM, bench และ qualification. รายละเอียด service limits จากภาพและ geometry ที่สมมติอยู่ใน SURFACE-MODEL.md.
