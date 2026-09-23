# Slide-ready simulation evidence

ชุดนี้ export จาก Lunar Link Studio v1.5.0 สำหรับ `Ultra Smooth Landing - Proposal (3).pdf` โดยใช้เลขหน้าตาม PDF ปัจจุบัน ภาพ PNG พร้อมวางในสไลด์ ส่วน SVG ใช้เมื่อต้องการแก้สี ข้อความ หรือส่งออกความละเอียดสูง หน้า antenna ที่พิมพ์เลข **14** บนสไลด์ตรงกับหน้า **16** ของไฟล์ PDF เพราะมีหน้าปก/สารบัญนำหน้า. ผลของทีมใช้ proposed compact target 5.2 dBic; ค่า 6.5–7 dBi ใช้ได้เฉพาะเมื่อระบุว่าเป็น ANSER research benchmark.

กราฟ thermal −170/+170°C และชุดข้อจำกัดทั้งหมดแยกอยู่ที่ [`../limitation-assets/README.md`](../limitation-assets/README.md)

กราฟ S-band gain, frequency evidence และรายการ RF test gaps แยกอยู่ที่ [`../sband-evidence-assets/README.md`](../sband-evidence-assets/README.md)

## รูป antenna ที่ใช้ในสไลด์ 14

ผังวางรูป, speaker script 75–90 วินาที, คำตอบเรื่อง S11 และรายการ full-wave outputs อยู่ที่ [`PAGE14-PRESENTATION-SCRIPT.md`](PAGE14-PRESENTATION-SCRIPT.md).

ไฟล์แนะนำสำหรับสร้างหน้า 14 ใหม่ทั้งหน้า: **`p14-final-literature-to-link-evidence.png`** / `.svg`. ภาพ 16:9 นี้รวม ANSER reference, เหตุผลที่เลือก, ขอบเขตที่ต้อง re-optimize, Earth–Moon FSPL และ fixed-vs-gimballed link-headroom-vs-tilt ไว้ในหน้าเดียว.

ใช้ **`p14-anser-reference-antenna-figure5d.png`** เป็นรูปหลักฝั่งงานวิจัย เพราะเห็น assembled stacked dual-CP patch ชัดและไม่แน่นเกินไป. ใต้ภาพใช้ข้อความ:

> Literature reference — assembled dual-circular-polarized stacked S-band patch, 80 × 80 × 6.53 mm nominal stack; adapted from Sánchez-Sevilleja et al. [1], Fig. 5(d). The proposed 60 × 60 × 7 mm payload antenna is a packaging target and requires a new full-wave EM design and measurement.

ใช้ `p14-anser-reference-antenna-figure5.png` เมื่ออยากแสดงชิ้นส่วนครบ และ `p14-anser-reference-stackup-figure3.png` เป็น inset/appendix. ฝั่งแบบของทีมให้ใช้ `p08-complete-2u-payload.png` หรือ `p08-green-zone-installed-payload.png` พร้อม label **Our proposed integration · EM unverified**. รายละเอียดคำอ้างอิงพร้อมคัดลอกอยู่ที่ [`ANTENNA-IMAGE-CITATION.md`](ANTENNA-IMAGE-CITATION.md).

อ้างอิงท้ายสไลด์:

> [1] S. Sánchez-Sevilleja, D. Poyatos-Martínez, J. L. Masa-Campos, and A. Santiago, “Design, Development, and Qualification of a Broadband Compact S-Band Antenna for a CubeSat Constellation,” *Sensors*, vol. 25, no. 4, Art. no. 1237, 2025, doi: 10.3390/s25041237.

## ชุดขั้นต่ำสำหรับรอบนำเสนอ

| หน้า | ไฟล์หลัก | ตำแหน่ง/ขนาดที่แนะนำ | คำบรรยายใต้ภาพ |
|---|---|---|---|
| 8 — 3D prototype | `p08-green-zone-installed-payload.png` | แทนภาพโมเดลเดิมหรือวางเต็มครึ่งขวา | **Concept installation:** โมดูล 2U ติดตั้งแทน top surface payload allocation สีเขียว; รูปร่าง lander สร้างจากภาพอ้างอิงและไม่ใช่ CAD/ICD ของผู้ให้บริการ |
| 10 — Mass & power | `p10-power-and-rf-boundary.png` | เต็มความกว้างใต้ตาราง หรือแทนตาราง power เดิม | **Power boundary:** payload motion branch สูงสุด 5.31 W ในซิม; 5 W RF เป็นกำลังขาออกของ host PA และเทียบเป็นประมาณ 14.29 W DC เมื่อสมมติประสิทธิภาพ 35% |
| 14 — Control/Dynamics | `p14-controller-step-response.png` + `p14-pointing-error-time-history.png` | วางคู่กัน โดยให้ step response ใหญ่กว่า | **Current controller result:** settling 154 ms, rise 124 ms, overshoot 0.61%; ยังไม่ผ่านเป้าหมาย 50 ms. หลัง transient ช่วง 3 s สุดท้ายมี RMS error ประมาณ 0.12° |
| สไลด์ 14 / PDF 16 — Antenna & Earth–Moon link | `p14-rf-evidence-final.png` | แทนกรอบม่วงด้านขวาตามภาพล่าสุด; จัดลำดับ Our Analysis → FSPL → fixed/gimballed → margin-vs-tilt ไว้แล้ว | **Clear-LOS DTE study:** ที่ lander tilt 65° fixed patch เหลือ −3.22 dB ขณะที่ gimbal on-axisมี +4.26 dB หลัง reserve 3 dB; installed green-zone case ปัจจุบันยังถูก hull บัง |
| 17 — Verification/Risks | `p17-monte-carlo-attitude-map.png` + `p17-link-failure-gates.png` | แผนที่ 60% ของหน้า; failure gates 40% | **Seeded reduced-order screening:** gimbal 53/100 เทียบ fixed antenna 18/100 สำหรับตัวอย่าง uniform Euler-angle attitudes; ใช้เปรียบเทียบสถาปัตยกรรม ไม่ใช่ค่าความน่าเชื่อถือของภารกิจ |

## หน้า 8 — Packaging และตำแหน่งติดตั้ง

- `p08-complete-2u-payload.png` — ภาพ 2U พร้อม antenna, gimbal และ electronics. ใช้เป็นภาพรวมก่อนแสดงการติดตั้ง
- `p08-green-zone-installed-payload.png` — ภาพหลักที่ตอบว่า payload แทนบล็อกเขียวตรงไหน
- `p08-electronics-exploded-view.png` — ใส่ appendix เมื่อถูกถามว่าภายใน 2U มีอะไรบ้าง
- `p08-assembly-clearance-study.png` — ใส่หน้า risk/appendix พร้อมระบุว่า **current sampled full sweep ยังไม่ผ่าน**: sampled fit 3.1% และ worst signed clearance −10.66 mm. ห้ามใช้ภาพนี้อ้างว่า mechanism fit แล้ว

ข้อความพูดประกอบ: envelope 100 × 100 × 181 mm และ mass ≤1.5 kg เป็น design target. การยืนยันต้องใช้ host CAD/keep-out, fastener interface, harness routing, coax bend radius และ swept-volume check ที่ละเอียดกว่า geometry proxy ปัจจุบัน

## หน้า 10 — Power

- `p10-power-and-rf-boundary.png` — ภาพหลัก
- แก้แถว transmission เดิมที่ประมาณ 1.67 W เพราะไม่สามารถแทน 5 W RF output ได้
- ระบุให้ชัดว่า lander ต้องให้บริการอะไร: DC bus, heater, radio/modem/PA, attitude/ephemeris, data interface และ RF coax/port
- ค่าที่ยังไม่ผ่านใน model ปัจจุบัน: entered inrush 0.8 A สูงกว่า allocation 0.5 A และ ideal hold-up 6.85 ms ต่ำกว่า requirement 100 ms

## หน้า 14 — Control และ pointing

- `p14-controller-step-response.png` — หลักฐานหลัก; เปลี่ยนข้อความเดิมที่อ้างประมาณ 47 ms เป็นผลปัจจุบัน 154 ms และติดป้าย **FAIL 50 ms target**
- `p14-pointing-error-time-history.png` — แสดง recovery หลัง initial disturbance
- ห้ามพูดว่า error อยู่ใน ±0.5° ตลอดการ landing. ค่า whole-run RMS สูงเพราะ initial transient; ค่า 0.12° เป็น final-window RMS เท่านั้น
- แยก acquisition time, command latency, motor settling และ Earth ephemeris accuracy ออกจากกันในการตอบกรรมการ

## หน้า 15 — 100 km relay

**ยังไม่มีภาพที่พร้อมใช้.** Model ปัจจุบันเป็น Earth–Moon DTE และยังไม่มี relay preset ที่กำหนด relay G/T, frequency, data rate, antenna orientation, visibility และ ephemeris ครบ ห้ามนำรูป DTE หน้า 16 ไปติดป้ายว่าเป็นผล 100 km relay

## สไลด์ 14 / หน้า PDF 16 — Antenna และ link budget

### สำหรับพื้นที่กรอบม่วงด้านขวา

- `p14-patch-dimension-detail.png` / `.svg` — dimensioned concept ของ stacked dual-CP patch: board, patch radii, notch sizes, probe offset และ multilayer stack; ใช้เมื่อต้องตอบว่า antenna เป็นแบบไหนและขนาดเท่าไร
- `p14-s11-reference-vs-frequency.png` / `.svg` — S11/S22 simulation และ measurement ของ ANSER reference จาก Figure 10 พร้อม operating bands และเส้น requirement −12 dB; เป็น visual digitization จาก paper ไม่ใช่ผลวัดบน lander ของทีม
- `p14-paper-comparable-rf.png` / `.svg` — เวอร์ชันแนะนำเมื่อจะเทียบกับ Figure 18 ของ Gadhafi et al. โดยตรง: จัดรูปแบบเป็น (a) S11–frequency, (b) XZ polar cut, (c) YZ polar cut และยังเก็บ link-headroom-vs-tilt ไว้ในภาพเดียวกัน
- `p14-rf-evidence-final.png` / `.svg` — เวอร์ชันสุดท้ายสำหรับแทนกรอบม่วงโดยตรง มี Earth–Moon FSPL, EIRP, fixed/gimballed result และ link-margin-vs-tilt ในภาพเดียว
- `p14-compact-link-margin-vs-tilt.png` / `.svg` — เวอร์ชันก่อนหน้าที่มีกราฟใหญ่กว่า แต่ไม่มี FSPL card
- ให้ภาพ paper ฝั่งซ้ายเหลือเพียงรูป antenna และ measured/simulated pattern ที่อ่านได้ พร้อม citation เต็ม
- คงหัวเรื่องด้านขวาเดิม **Fixed Antenna vs Gimballed Antenna — Link Margin vs Lander Tilt**
- `p16-right-column-summary.png` / `.svg` เป็นทางเลือกเมื่อมีพื้นที่มากกว่ากรอบในภาพล่าสุด

### เมื่อแยกเป็นสองหน้าหรือใส่ appendix

- `p16-antenna-research-vs-our-concept.png` — แยก literature evidence ออกจากค่าของทีม
- `p16-link-budget-chain.png` — calculation chain ที่ตรวจย้อนกลับได้
- `p16-fixed-vs-gimbal-clear-los.png` — เหตุผลเชิงตัวเลขว่าทำไม gimbal ช่วยเมื่อ lander เอียง
- `p16-radiation-pattern-3d.png` — แสดงทิศทาง beam; ต้องคงป้าย **ASSUMED COSINE MODEL**
- `p16-principal-plane-cuts.png` — plane cuts สำหรับ appendix; รูปทรงสมมาตรเพราะใช้ reduced-order cosine model
- `p16-rf-operating-point.png` — รายละเอียด S11, axial ratio, gain, beamwidth, frequency และ margin สำหรับกรรมการสาย RF

ค่าที่ต้องอยู่ใน caption ทุกครั้ง: frequency 2.205 GHz, range 384,400 km, rate 4 kbps, RF output 5 W, realized gain **target** 5.2 dBic, feed loss 1 dB, ground G/T 22 dB/K **assumed**, threshold 4.5 dB, implementation loss 1.5 dB และ reserve 3 dB

ที่ tilt 65° fixed antenna เหลือ −3.22 dB หลัง reserve ขณะที่ gimbal on-axis มี +4.26 dB ในกรณี clear LOS. แต่ตำแหน่งติดตั้ง green-zone ปัจจุบันถูก lander hull บัง จึงต้องเรียกกราฟนี้ว่า **clear-LOS potential** ไม่ใช่ installed-case success

กราฟแบบเทียบ paper ตั้งใจไม่สร้างเส้น S11 ปลอม: จุด −15 dB ที่ 2.205 GHz เป็น scalar input ของ link budget เท่านั้น ส่วน Figure 18 ของ Gadhafi et al. เป็น CST ที่ 2.42 GHz และรวม rover/regolith แล้ว จึงเทียบได้เฉพาะชนิดของหลักฐานและรูปแบบกราฟ ยังใช้จัดอันดับ performance โดยตรงไม่ได้

## หน้า 17 — Verification และ failure conditions

- `p17-monte-carlo-attitude-map.png` — ภาพหลักสำหรับเห็น attitude ที่ผ่าน/ไม่ผ่าน
- `p17-monte-carlo-results.png` — summary card: gimbal 53/100, fixed 18/100; Wilson 95% interval 43.3–62.5% และ 11.7–26.7%
- `p17-link-failure-gates.png` — ใช้ปิดท้ายว่า pointing เป็นเพียงหนึ่ง gate; current 65° installed case fail เพราะ hull blockage

Monte Carlo ชุดนี้ใช้ random seed คงที่และ uniform Euler-angle sampling 100 ครั้ง. distribution นี้ไม่ใช่ landing probability distribution และ 100 trials ยังไม่ใช่ reliability evidence

## หน้า 20–21 — Gimbal เทียบ phased array

ยังไม่มี validated phased-array EM/thermal/power simulation ในชุดนี้ จึงควรใช้ตาราง architecture trade จาก `PROPOSAL-3-COMMUNICATION-REVIEW.md` แทนกราฟที่ทำให้เข้าใจว่าได้จำลอง array แล้ว ประเด็นหลักคือ array steering ได้โดยไม่ใช้ moving parts แต่ยังต้องจ่าย scan loss, element/RF-chain/DC power, thermal load, calibration, radome/deck interaction และ aperture area ภายใน 2U

## Sources ที่ควรใส่ใน slide notes

- Rashid/Gadhafi et al., *Sensors* 2024, DOI: <https://doi.org/10.3390/s24165361>
- Sánchez-Sevilleja et al., *Sensors* 2025, DOI: <https://doi.org/10.3390/s25041237>
- Jirawattanaphol et al., *Technologies* 2026, DOI: <https://doi.org/10.3390/technologies14050263>
- NASA SmallSat Institute, Ground Data Systems: <https://www.nasa.gov/smallsat-institute/sst-soa/ground-data-systems-and-mission-operations/>
- NASA lunar surface propagation: <https://www.nasa.gov/glenn/glenn-expertise-space-exploration/scan/lunar-surface-propagation/>
- Astrobotic Lunar Landers PUG: <https://science.nasa.gov/wp-content/uploads/2023/11/astrobotic-lunar-landers-pug.pdf>

## Reproduce

เปิด local app ที่ `http://127.0.0.1:4173` แล้วรัน:

```powershell
node scripts/export-slide-assets.mjs
```

สคริปต์คำนวณ SVG จาก `src/engine.js`, เปิดหน้าเว็บด้วย Playwright, รัน step response และ seeded 100-case batch จากนั้นบันทึก PNG ทั้งหมดในโฟลเดอร์นี้
