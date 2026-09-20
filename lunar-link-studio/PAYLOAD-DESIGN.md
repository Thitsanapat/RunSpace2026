# Payload 2U — packaging and host interface study, v1.4

## ข้อสรุปที่ใช้คุยกับกรรมการได้

โมดูลทีมแทน green surface-payload block หนึ่งตำแหน่งบน lander. ภาพผู้ใช้ระบุบริการประมาณ 4 kg และ 200 mm cube; โครงการยังจำกัด **รวมทุกชิ้น 100 × 100 × 200 mm และ ≤1.5 kg**. 2U ในซิมหมายถึงกรอบโครงการ 2 ลิตร ไม่ใช่การรับรอง CubeSat rail/dispenser dimensions หรือ provider ICD. ตัวถัง lander ถูกปรับสัดส่วนจากภาพล่าสุด แต่ยังไม่มี CAD มิติจริง.

**ยังยืนยันไม่ได้ว่า 2U รวม gimbal พอสำหรับช่วงการหมุนที่ต้องการ.** การใช้ไฟ/ฮีตเตอร์จาก lander ช่วยลดอุปกรณ์ใน payload แต่ไม่แก้พื้นที่กวาดของ antenna/motor/harness. แบบปัจจุบันเป็นแนวคิดที่ตั้งใจแสดงข้อขัดข้องจริง ไม่ใช่แบบพร้อมผลิต.

## สิ่งที่เพิ่มใน 3D

| ชั้น/อุปกรณ์ | พื้นที่จัดไว้ | หน้าที่ที่ต้องออกแบบจริง |
|---|---|---|
| ฐาน + thermal strap | ฐาน 94 × 94 × 4 mm | จุดยึด, thermal interface material, การนำความร้อนจาก heated lander |
| Power PCB | PCB 80 × 78 × 1.6 mm, ระดับ 20 mm | input protection, current limiting/inrush, EMI filter, DC/DC, voltage/current telemetry |
| Driver PCB | ขนาดเดียวกัน, ระดับ 48 mm | motor driver 2 แกน, current sense, stall detection, driver protection |
| Control PCB | ขนาดเดียวกัน, ระดับ 76 mm | MCU, watchdog, attitude/encoder interfaces, temperature sensors, host data link |
| กลไกด้านบน | 105–200 mm, pivot 152.5 mm | yaw stage, yoke, pitch motor, antenna, RF connector และ service loop |

ภาพชิป/pins/traces ช่วยสื่อสารการจัดวาง ไม่ใช่ schematic, PCB routing, datasheet footprint หรือ flight BOM. สายที่วาดเป็น illustrative routing ไม่ได้ตาม deformation ขณะหมุน. ไม่มีแบตเตอรี่และไม่มี local heater. การใช้ host RF เป็นสมมติฐานเดิมของซิมที่ต้องยืนยันแยกจากการใช้ host power/heater; ถ้าต้องมี transceiver/PA ของเราเอง ต้องเพิ่มพื้นที่ กำลังไฟ และความร้อนใหม่.

เปิด **Payload 2U → ปิด Payload cover → เปิด Exploded view**; exploded view แยกชิ้นส่วนออกนอกกรอบเพื่อดูรายละเอียด ไม่ใช่สภาพใช้งานจริง. ส่งออก GLB ได้พร้อมบอร์ดและ material; pose/exploded state ตามภาพที่เลือก.

## ตรวจพื้นที่อย่างไร

ค่าตั้งต้น wall 2 mm และ clearance 2 mm ทำให้ horizontal cavity `100 − 2(2+2) = 92 mm`, vertical cavity `95 − 2 − 2×2 = 89 mm`. แผ่น antenna 80 × 80 × 6.53 mm มี spatial diagonal `sqrt(80² + 80² + 6.53²) = 113.33 mm`.

แผ่นสี่เหลี่ยมที่ต้องรองรับ orientation อิสระในช่องว่างนี้ มี geometric upper bound ประมาณ `sqrt((89² − 6.53²)/2) = 62.76 mm` ต่อด้าน ก่อนเพิ่มกรอบ มอเตอร์และสาย. นี่ไม่ใช่ข้อสรุปว่าต้องใช้เสา 62.76 mm หรือว่าขนาดนั้นหมุนได้จริง: ช่วงมุมที่จำกัดและ topology ของ gimbal อาจให้ผลต่างกัน.

`assemblyFit` หมุน corner ของ antenna, yokes, pitch motor allocation และ RF connector ตาม yaw/pitch; ตรวจ boundary และ lower electronics keep-out. RF bend ใช้ sphere keep-out รอบจุดสมมติ ไม่ใช่การแก้รูปสายจริง. yaw เกิน cable twist allocation จะไม่ผ่าน. ตรวจเป็น grid ทุก 5° และแสดง signed clearance; ค่าติดลบคือ proxy ล้ำกรอบ. ตัวอย่างมุม 0°/0° มอเตอร์ 6 mm ของแบบนี้ล้ำพื้นที่ 6 mm.

ผล grid ปัจจุบันผ่านประมาณ 3.05% ของจุดมุมที่สุ่มเป็นตาราง; **ไม่ใช่โอกาสภารกิจสำเร็จ 3.05%** และไม่รับรองการเคลื่อนต่อเนื่องระหว่างจุด. ไม่มี detailed part-to-part collision, bearing/runout, fastener/tolerance, cable torque, PCB structural deformation หรือ static-board harness clearance certification. Physics trajectory เดิมตรวจเฉพาะ plate envelope; diagnostics ใหม่แสดงแยก ไม่ได้ทำให้ตัวเลข link/pointing เดิมกลายเป็น hardware-feasible result.

ตารางเทียบ 60/70/80 mm เปลี่ยนเฉพาะ geometry. ห้ามลดขนาด antenna แล้วคง gain/beam/S11 จาก paper โดยถือว่ายังถูกต้อง. ทางเลือกต่อไปคือจำกัดช่วงหมุนตาม recovery requirement, จัดมอเตอร์/ระบบส่งกำลังใหม่ หรือออกแบบเสาเล็กลงแล้วทำ EM/measurement ใหม่. ยังไม่ขยายกรอบเป็น 3U.

## ไฟจาก lander: ทำไมยังต้องมีวงจรของเรา

แหล่งจ่าย host → protection/inrush/filter → DC/DC → logic + drivers. Host heater → heated base → contact/strap → payload. แผ่นข้อมูลที่ส่งมายังไม่ได้ระบุ bus voltage, current, timing หรือ thermal interface ที่รับรองสำหรับงานเรา.

ค่าที่ปรับได้เพิ่ม: bus min/max (ตั้งสมมติ 22/32 V), branch allocation 0.5 A, harness resistance 0.5 Ω, entered inrush 0.8 A/20 ms, input capacitor 470 µF, brownout 18 V และ outage 100 ms. ทั้งหมดเป็น **design assumptions ไม่ใช่ ispace specification**.

ใช้ peak payload branch power จาก simulation คำนวณ constant-power load:

`Vload = (Vbus,min + sqrt(Vbus,min² − 4 R P))/2`, `I = P/Vload`.

ถ้า discriminant ติดลบ ไม่มี steady solution ในโมเดลนี้. ตรวจ `max(I, Iinrush)` กับ current allocation; ไม่ได้จำลอง current-limit time curve. ค่า bus max เก็บไว้ใน config เพื่อออกแบบ component ratings แต่ยังไม่ตรวจ overvoltage/transients อัตโนมัติ.

Ideal capacitor hold-up: `t = C(Vstart² − Vbrownout²)/(2P)`; กราฟ `V(t) = sqrt(max(0,Vstart² − 2Pt/C))`. ไม่รวม ESR, capacitor tolerance/derating, converter UVLO hysteresis, switching หรือ host foldback. Inrush เป็นค่าที่ผู้ใช้ป้อน ไม่ใช่ waveform ที่วงจรซิมได้.

ตัวอย่าง Nominal ใน `examples/payload-design-study.json`: P≈0.967 W, Vload≈21.978 V, I≈0.044 A; entered inrush 0.8 A เกิน branch 0.5 A. Ideal hold-up≈38.64 ms จึงไม่ผ่าน outage 100 ms. ต้องอัปเดต load จากอุปกรณ์จริง โดยเฉพาะ motor start/stall; ผลนี้ไม่ใช่ flight power budget. Host RF/heater เป็น branch แยก ไม่บวกซ้ำใน payload branch.

## หลักฐานที่ยังต้องเพิ่มก่อนเรียกว่าสมบูรณ์

| ลำดับ | งาน/กราฟที่ต้องมี | ผลที่ต้องใช้ตัดสิน |
|---|---|---|
| 1 | ICD + CAD: bolt pattern, complete assembly, tolerance stack, cable bend/twist, mass/BOM/CG/inertia | minimum clearance ตลอด trajectory; mass reserve; mount load ทุกแกน |
| 2 | Installed RF/EM + bench: frequency sweep, S11/VSWR, axial ratio, efficiency, gain และ 3D pattern เมื่ออยู่บนยาน | link margin / available data rate vs attitude, frequency และ temperature; VNA/pattern measurement; host RF compatibility |
| 3 | Thermal network/FE model ของ base/PCB/motor/antenna พร้อม hot/cold case, shadow, contact degradation | temperature/time ของทุกชิ้น, heater duty/energy, cold start; thermal-vacuum และ thermal-cycle correlation |
| 4 | Structural FE + test: modal, launch random vibration และ shock ตอน landing แยกกัน | natural frequencies, stress/displacement, fastener loads, alignment shift; ใช้ load spectrum จากผู้ให้บริการ |
| 5 | Electrical SPICE/bench: start/stall/inrush, converter efficiency, brownout/restart, EMI/EMC | V/I waveforms, peak current, temperatures, reset/recovery; source interruption test |
| 6 | Control/HIL และ fault injection: sensor bias/noise, encoder error/backlash, cable torque, jam, timeout, power loss | error/settling/acquisition time และ success criteria; watchdog/safe state; communication chain end-to-end |

การสั่นตอนปฏิบัติงานหลัง touchdown อาจเป็น transient แต่ยังต้องตรวจ vibration ระหว่าง launch และอายุการหมุนของกลไก. NASA อธิบายความสำคัญของ structural environment, mechanism reliability, lubrication และการทดสอบใน [Structures, Materials, and Mechanisms](https://www.nasa.gov/smallsat-institute/sst-soa/structures-materials-and-mechanisms/). ต้องเลือก qualification loads จาก mission ICD ไม่ยกค่าตัวอย่างทั่วไปมาเป็น requirement ของยานนี้.

การมี heater ที่ lander ไม่รับประกันอุณหภูมิของ motor/PCB: thermal contact, fasteners และ conductive paths กำหนดการถ่ายความร้อน ตาม [NASA Thermal Control](https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/). ค่า ±170°C ใช้เป็น environmental boundary case ไม่ใช่อุณหภูมิที่ทุกชิ้นต้องเท่ากันทันที และไม่มี atmospheric convection บนดวงจันทร์.

ต้องหา absolute target direction/attitude จริงด้วย: IMU อย่างเดียวไม่ให้ absolute yaw ที่ไร้ drift. และ gimbal ไม่สามารถกู้ link เมื่อเสาจมดิน, hull บัง Earth LOS หรือ lander ไม่มีไฟได้. ควรกำหนดขอบเขต recovery เป็นช่วง attitude/ground clearance/host availability ที่วัดและทดสอบได้.

## ทำซ้ำและไฟล์ผล

`npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:brochure-browser` (server localhost:4173). Browser test export `examples/payload-design-study.json` จาก Nominal พร้อม screenshots `test-results/payload-{circuit-detail,circuit-exploded,assembly-study,power-study}.png`. JSON มี config ครบ, sampling grid และคำอธิบายขอบเขต. Unit/browser tests ตรวจซอฟต์แวร์ ไม่รับรองฮาร์ดแวร์.
