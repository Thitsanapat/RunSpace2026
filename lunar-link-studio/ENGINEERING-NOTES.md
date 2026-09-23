# ข้อเสนอปรับ Ultra Smooth Landing — รอบแก้ไข

อัปเดต v1.3: ใช้ top green surface payload ตามภาพแผ่นข้อมูลที่ส่งภายหลัง โดยคง 2U รวม gimbal และมวลรวม ≤1.5 kg. ดู [SURFACE-MODEL.md](SURFACE-MODEL.md) สำหรับ service envelope, ตำแหน่งใหม่ และผล hull blockage ที่เปลี่ยนไป. ตารางที่กล่าวถึงสไลด์ด้านล่างเป็นบริบทเดิม ไม่ใช่ข้อกำหนด interface ของ ispace.

อ้างอิงสไลด์ `Ultra Smooth Landing - Proposal (1).pdf` และข้อกำหนดล่าสุด: **payload รวม antenna และ gimbal ทั้งหมดอยู่ใน 2U**. เลขหน้านับตามหน้า PDF. เอกสารนี้เป็นข้อเสนอและผลจำลอง ไม่ใช่หลักฐานว่าฮาร์ดแวร์ผ่านการรับรองแล้ว

## สิ่งที่ควรแก้ในสไลด์

| ประเด็น | ข้อเสนอที่ตรวจสอบได้ |
|---|---|
| หน้า 6/27: 1–2U | ระบุ 100 × 100 × 200 mm รวมทุกส่วน และตรวจ swept volume ไม่ใช่เฉพาะท่าเก็บ |
| หน้า 6/27: lock ระหว่าง impact | คงแนวทางนี้; ปลดหลังยืนยันหยุดนิ่ง พลังรับแรงต้องพิสูจน์ที่ lock/bearing ไม่ใช่ใช้ PID รับแรงกระแทก |
| หน้า 6/27: response ≤50 ms | ระบุว่าเป็น command latency; motor settling ต้องระบุ step และ settling band แยกกัน |
| หน้า 7/28: frictionless direct drive | ใช้คำว่าไม่มี gear backlash หากเป็น direct drive จริง; bearing, seal และ cable ยังมีแรงเสียดทาน |
| หน้า 7/28: spring return แล้วเป็น omni | เปลี่ยนเป็นกลับสู่ท่าที่กำหนด; patch ยังคง directional หากต้องการ fallback ต้องมีเสา/ช่องทางแยกและทำ link budget ของมัน |
| หน้า 8/29: power 2.55 W | ระบุขอบเขต controller/sensors/motors และ duty cycle; ยังไม่รวม RF PA และ heater ของ lander |
| หน้า 9/30: S-band 7–8 dBi | เลือก reference มี pattern และขนาดจริง; ห้ามใช้ directivity แทน gain หรือ axial-ratio coverage แทน HPBW |
| 3-axis gimbal | สำหรับชี้ boresight ของ CP patch เริ่มจากสองแกนได้; แกนที่สามเพิ่มมวล/สาย/การชน ต้องมีเหตุผลเฉพาะ |
| star tracker + IMU | ต้องมี field of view, Sun exclusion และ alignment error; IMU นิ่งอย่างเดียวไม่ให้ absolute yaw โปรแกรมปัจจุบันรับ attitude เป็น input |
| Al–Li 7075 / มวล <1.5 kg | 7075 ไม่ใช่การระบุ Al–Li alloy; ทำ BOM/CAD mass พร้อม margin และ actuator/lock/cable จริง |

ไม่ควรอ้างว่า steerable antenna บน lander ไม่เคยมีมาก่อน: คู่มือ Astrobotic อธิบาย actuated MGA/HGA หลัง touchdown ที่ PDF หน้า20. จุดเสนอผลงานที่เหมาะสมคือ **การหาขอบเขตกู้ลิงก์ภายใต้ envelope 2U และข้อจำกัดการลงจอดผิดท่า** พร้อมรายงานทั้งกรณีผ่านและไม่ผ่าน. [Astrobotic Payload User’s Guide](https://science.nasa.gov/wp-content/uploads/2023/11/astrobotic-lunar-landers-pug.pdf)

SLIM ไม่ใช่หลักฐานว่าผิดท่าแล้วสื่อสารไม่ได้เสมอ: JAXA รายงานว่าสื่อสารกับโลกได้ แต่ระบบผลิตไฟจากแสงอาทิตย์มีปัญหา ต้องแยก pointing failure จาก power failure. [JAXA, 25 January 2024](https://global.jaxa.jp/press/2024/01/20240125-1_e.html)

## Antenna ที่ใช้เป็นฐาน

**Sánchez-Sevilleja et al., 2025**, DOI10.3390/s25041237: stacked dual-CP patch ขนาด80×80×6.53mm, 30g, ช่วงใช้งาน2.03/2.205GHz; isolated measured peak gain ประมาณ6.5–7dBi. โปรแกรมเลือก2.205GHz และ6.5dBi. โครงสร้างใช้ dielectric/spacing/feed หลายส่วน; เครื่องคำนวณ single rectangular patch ไม่สามารถสร้างแบบนี้ครบได้. ค่า HPBW82.44° ในโปรแกรมเป็น **analytical approximation จาก assumed efficiency65%** ไม่ใช่ measured HPBW จาก paper และไม่ได้นำ axial-ratio coverage ±50° มาใช้เป็น HPBW. [บทความฉบับเต็ม](https://pmc.ncbi.nlm.nih.gov/articles/PMC11860546/)

**Nascetti et al., Tigrisat**, DOI10.1109/LAWP.2014.2366791: four-patch บนบอร์ด annular96mm มีช่องกลาง57mm ที่2.45GHz; simulated gain7.3dBi, directivity8.3dBi และ measured beamwidth ประมาณ60°. ใช้เป็น comparison profile; รุ่น1.2 ใช้ความหนารวม7mm ตาม Sensors2025 Table3 แทน allowance2.1mm ที่นับเฉพาะชั้นบอร์ด; มวล50g ยังเป็น allowance ไม่ใช่ measured mass. ความถี่นี้ไม่ใช่แบบสำเร็จสำหรับ downlink2.2–2.3GHz. [Paper DOI](https://doi.org/10.1109/LAWP.2014.2366791)

ทั้งสองงานไม่ได้รับรองว่าระบบของเราจะทำงานตลอดช่วง surface reference −170°C ถึง +110°C และ pattern ใกล้ lander อาจต่างจาก isolated measurement

## ตรวจ 2U ก่อนล็อกแบบ

Allocation ปัจจุบัน: electronics สูง105mm, gimbal cavity สูง95mm, pivot ที่152.5mm จากฐาน; clearance แผ่นเสา2mm แต่ละด้าน. ปริมาตรภายนอกเป็น2U ทั้งหมด ไม่มี gimbal เพิ่มอีก1U

```
แผ่น 80 × 80 × 6.53 mm:
D swept = sqrt(80² + 80² + 6.53²) = 113.325 mm
usable horizontal width = 100 − 2×2 = 96 mm
usable cavity height = 95 − 2×2 = 91 mm
```

**บาง orientation ใส่ได้ แต่ไม่สามารถสัญญาว่าหมุนได้ครบทุกทิศ**. โปรแกรมหมุนมุมทั้ง8 ของแผ่นเสาแล้วตรวจ bounding extents ทุกขั้นเวลา เมื่อออกนอกกรอบจะหยุดที่มุมเดิม. ยังไม่ใช่ collision solver ของ complete assembly หรือ path planner ที่หาทางอ้อมได้

ทางเลือก: คงแผ่น80mm และจำกัด recovery envelope ให้ชัด หรือออกแบบเสาใหม่ให้ swept diameter อยู่ใน cavity พร้อมกลไกและสาย. ตัวอย่างเชิงเรขาคณิต แผ่น64mm หนา6.53mm มี diagonal ประมาณ90.75mm; **ยังไม่มีหลักฐาน gain/efficiency/CP และยังไม่รวม yoke/cable** จึงห้ามย้าย gain6.5dBi ของ paper มาใส่ทันที

Placement ปัจจุบันอยู่ใกล้ขอบบน lander ปรับ mount X/Y/Z ได้. หากเสาถูกพื้นหรือ hull บัง ต่อให้ error ต่ำ link ก็ไม่ผ่าน. เสาสำรองคนละด้านอาจช่วย แต่ต้องทำ coverage, isolation, RF switching และ mass/power budget ใหม่ ไม่ใช่ผลที่พิสูจน์แล้วในรุ่นนี้

## Beam และ link budget แบบแทนค่า

ค่าตั้งต้นที่ยังต้องหาหลักฐาน: RF5W, range384400km, receiver G/T22dB/K, cable loss1dB, polarization loss0.5dB, other loss1dB, bitrate4kbps, required Eb/N0 4.5dB, implementation loss1.5dB, reserve3dB. G/T ไม่ได้หมายความว่าได้จอง ground station แล้ว และ threshold ต้องตรง modulation/coding/BER จริง

```
λ = c/f = 135.960 mm
P(θ)/P(0) = cosⁿ(θ)
n = ln(0.5) / ln(cos(82.44°/2)) = 2.43403
G(θ) = 6.5 + 10n log10(cos θ) dBi
Dideal = 2(n+1) = 8.368 dBi
ηimplied = 10^(6.5/10) / [2(n+1)] = 65.04%
Aeff = Glinear λ²/(4π) = 65.707 cm²
far-field first estimate = 2Dphysical²/λ = 0.188 m
```

Directivity มาจาก integrate cosine power บน forward hemisphere; โปรแกรมใช้ backlobe floor−40dB relative จึงเป็นค่าประมาณ ไม่ใช่ mounted3D pattern. เกณฑ์ far field ยังต้องตรวจขนาด setup/ปฏิสัมพันธ์กับ lander ไม่ใช่เลือกระยะทดสอบ0.188m ทันที

```
EIRP = 10log10(5) + 6.5 − 1 = 12.490 dBW
FSPL = 20log10(4πRf/c) = 211.012 dB
C/N0 = 12.490 − 211.012 + 22 + 228.599 − 0.5 − 1
     = 50.577 dB-Hz
Eb/N0 = 50.577 − 10log10(4000) = 14.557 dB
Margin = 14.557 − 4.5 − 1.5 = 8.557 dB
Allowed pointing loss = 8.557 − reserve 3 = 5.557 dB
```

Cosine approximation นี้ให้ allowable mispoint ประมาณ±53.76°; loss ที่0.5° เพียง0.000403dB. จึงควรอธิบายว่า±0.5° เป็นเป้าหมายควบคุม/เผื่ออนาคต ไม่ใช่ข้อจำเป็นจาก RF budget นี้เพียงอย่างเดียว. Max rate at3dB reserve ≈14.38kbps เฉพาะ on-axis, unblocked และมีไฟ. Margin ขณะ blocked/unpowered เป็น unavailable. [สมการ link budget](https://www.mathworks.com/help/satcom/gs/satellite-link-budget.html)

## Patch first-pass sizing

f=2.205GHz, εr=6.4, h=1.52mm เป็น **single-layer estimate** ไม่ใช่ reproduction ของ stacked CP paper:

```
W = c/(2f) sqrt[2/(εr+1)] = 35.341 mm
εeff = (εr+1)/2 + (εr−1)/[2 sqrt(1+12h/W)] = 5.89280
ΔL/h = 0.412[(εeff+0.3)(W/h+0.264)]/[(εeff−0.258)(W/h+0.8)]
ΔL = 0.67292 mm
Leff = c/(2f sqrt εeff) = 28.004 mm
L = Leff − 2ΔL = 26.658 mm
```

Ground plane heuristic W+6h, L+6h ≈44.461×35.778mm ไม่รับรอง gain/CP. ต้องทำ full-wave EM หา feed, S11, axial ratio, efficiency และ mounted pattern รวมวัสดุ/connector จริง. [Patch equations](https://www.mathworks.com/help/antenna/ug/impedance-analysis-of-2-by-2-patch-array.html)

## Thermal / power / landing

Thermal สองโหนด ไม่มี convection:

```
Cp dTp/dt = Qsolar,p + Qelectronics + Qmotor + Qheater + K(Tl−Tp) − Qrad,p
Cl dTl/dt = Qsolar,l − K(Tl−Tp) − Qrad,l
Qrad = εσA [T⁴ − Fground Tg⁴ − (1−Fground) Tspace⁴]
```

ใช้ Kelvin ใน radiation; deep-space3K, solar1361W/m², default K=0.2W/K, Cp=240J/K, Cl=3000J/K. Heater 30W ติดบน payload/gimbal, รับไฟจาก lander และใช้ payload setpoint0°C กับ ±1°C hysteresis; K แทน parasitic thermal path ไป lander. Cl/area คือ simplified allocated lander node ไม่ใช่โมเดลยานทั้งลำที่ทดสอบแล้ว. ยังไม่รวมความร้อนวิทยุ/housekeeping ของ host. [NASA thermal control](https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/)

NASA Moon Facts ยกตัวอย่างพื้นรับแสง≈+127°C และด้านมืด−173°C. ตาราง NASA NTRS อีกชุดระบุ −170°C/−274°F และ +110°C/+230°F; `+230` เป็น Fahrenheit ไม่ใช่ Celsius. Preset ใช้คู่ −170/+110°C เป็น surface boundary ไม่ใช่ ambient air หรืออุณหภูมิ electronics. [NASA Moon facts](https://science.nasa.gov/moon/facts/) · [NASA NTRS 20150003498](https://ntrs.nasa.gov/api/citations/20150003498/downloads/20150003498.pdf)

ผล24h ตาม presets/สมมติฐานปัจจุบัน:

- Cold −170°C/no sun: payload เริ่ม−30°C, อยู่ช่วง−30…+1.11°C และจบ−0.25°C; heater164.73Wh, host รวม187.04Wh จาก allocation300Wh; ไม่ได้แปลว่าอยู่ครบ lunar night336h ได้
- Hot +110°C/+230°F ground: payload88.52°C, lander105.08°C; เกิน motor maximum80°C. Heater ปิดและแก้ความร้อนไม่ได้ ต้องศึกษาผิว/radiator/view factor/thermal isolation และท่าคว่ำ
- RF5W ที่ PA efficiency35% ใช้ DC14.286W ก่อน overhead อื่น; default จ่ายจาก lander. Payload idle≈0.79/0.85=0.929W หรือ33.2mA ที่28V. จึงห้ามอ้างว่า RF+payload+heater ทั้งหมดใช้เพียง2.55W

Vibration ใช้ damped sinusoid พร้อม taper ช่วง3s หลัง touchdown จากนั้นท่าคงที่. Lock ปลดหลัง tilt transition และ angular-rate estimate <0.5°/s ต่อเนื่อง0.5s. เป็น sequencing model ไม่ใช่การพิสูจน์ว่า lock ทน15g ได้จริง

## หลักฐานที่ควรทำต่อ

1. CAD swept volume ใน2U รวมสาย RF, motor, lock, fasteners, tolerances; ทำ BOM/inertia แทนค่ามวลสมมติ
2. Host ICD: bus/current/energy, transmitter, local-heater allocation/control, parasitic thermal conductance และ attitude data หลังผิดท่า
3. EM/measurement บน lander mock-up: S11, gain, HPBW, axial ratio, efficiency, backlobes และ loss ที่อุณหภูมิใช้งาน
4. Bench lock–release และ angular step; timestamp command/encoder แยก latency, slew, settling และ steady error
5. วางยานเอียง/คว่ำจริง ตรวจ blocked LOS กับตำแหน่งติดตั้ง และเก็บ failed cases
6. Thermal vacuum และ shock/vibration ตามระดับภารกิจ; calibrate model แล้ว rerun/export JSON+CSV+report

สิ่งที่พร้อมเสนอคือซอฟต์แวร์ทำซ้ำได้และขอบเขตกู้ลิงก์พร้อมอ้างอิง ส่วนการยืนยัน hardware ต้องอาศัยหลักฐานข้างต้น
