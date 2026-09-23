# Web simulation demo — 90-second script

## เตรียมก่อนขึ้นพรีเซนต์

เปิดเว็บสองแท็บเพื่อไม่เสียเวลา scroll:

- **Tab A — Mission overview:** เลือก `Off-nominal landing`, กด `Run scenario`, เลื่อนเวลามาที่ประมาณ 12 s และเตรียมปุ่ม `Mount` / `Payload 2U`
- **Tab B — Antenna & RF:** เตรียมบริเวณ RF operating point และกราฟ margin-vs-mispointing; ใช้ค่า compact target 2.205 GHz / 5.2 dBic
- ใช้ browser zoom 75–80%, ปิด notification และต่อไฟเลี้ยงเครื่อง
- เตรียม `p14-final-literature-to-link-evidence.png` เป็น fallback หาก WebGL หรือเครือข่ายมีปัญหา

อย่าปรับ slider สดระหว่างพูด. ให้รันและตรวจผลก่อนเริ่มจับเวลา.

## ลำดับหน้าจอ

| เวลา | หน้าจอ / การกระทำ | ประเด็นที่ต้องเห็น |
|---:|---|---|
| 0–12 s | Tab A · มุม Mount | cyan payload อยู่แทน green surface-payload allocation |
| 12–27 s | กด `Payload 2U` | antenna + 2-axis gimbal + electronics อยู่ใน 2U |
| 27–43 s | กลับ `Mount`; ชี้ timeline/telemetry | impact lock → rest confirmation → Earth acquisition |
| 43–52 s | ชี้ `LANDER HULL` / no clear LOS | ซิมเปิดเผย installed-geometry failure |
| 52–78 s | สลับ Tab B · RF result | FSPL, EIRP, fixed vs gimballed headroom |
| 78–90 s | ชี้ pass/fail boundary และปิดเรื่อง | clear-LOS recovery, limitation, next verification |

## บทพูดฉบับหลัก — ประมาณ 90 วินาที

> โจทย์ของเราคือ หลังลงจอด lander อาจเอียงจนเสาแบบติดตัวยานชี้ออกจากโลก และสูญเสีย link ทั้งที่ระบบหลักยังทำงานอยู่
>
> กล่องสีฟ้าคือ surface payload ที่แทน green zone ทั้ง antenna, two-axis gimbal, transceiver/PA, electronics และ heater pad อยู่ใน 2U และไม่เกิน 1.5 กิโลกรัม เราเลือก stacked circularly polarized S-band patch ที่ 2.205 กิกะเฮิรตซ์ เป้าหมาย 60 คูณ 60 คูณ 7 มิลลิเมตร โดย lander จ่ายเฉพาะ DC power; heater ติดบน payload/gimbal และรับไฟจาก bus เดียวกัน
>
> ระหว่าง touchdown กิมบอลจะล็อก เมื่อยานนิ่งจึงใช้ attitude และ Earth ephemeris ชี้กลับหาโลก เว็บนี้คำนวณ geometry, control, power, thermal surface reference ลบ 170 ถึงบวก 110 องศาเซลเซียส และ RF link ร่วมกัน โดย heater อยู่บน payload/gimbal และดึงไฟจาก lander ไม่ใช่เพียง animation ค่า NASA ที่เขียนบวก 230 คือฟาเรนไฮต์ หรือบวก 110 เซลเซียส
>
> สำหรับ direct-to-Earth ระยะ 384,400 กิโลเมตร FSPL เท่ากับ 211.01 เดซิเบล กำลังส่ง 5 วัตต์กับ gain target 5.2 dBic ให้ EIRP 11.19 dBW ที่ 4 กิโลบิตต่อวินาทีและ ground G/T 22 dB/K เหลือ headroom 4.26 dB หลัง reserve 3 dB
>
> เมื่อ lander เอียง 65 องศา fixed antenna เหลือ minus 3.22 dB และไม่ผ่าน แต่กิมบอลรักษา boresight ให้เป็น plus 4.26 dB ในกรณี clear line of sight หรือกู้ headroom ได้ 7.48 dB
>
> ซิมยังพบว่า green zone ปัจจุบันถูก hull บัง เราจึงต้องปรับ mount และ field of view แล้วตรวจด้วย full-wave EM, VNA และ chamber test ระบบนี้จึงบอกได้ก่อนสร้างฮาร์ดแวร์ว่า landing แบบใดกู้ link ได้ และถ้าไม่ได้ ล้มเหลวเพราะอะไร

## จุดที่ต้องเน้นด้วยเมาส์

1. Cyan payload บน lander — ตำแหน่งติดตั้งจริงของแนวคิด
2. กรอบ 2U — ย้ำว่า 2U รวม gimbal ไม่ใช่เฉพาะ antenna
3. Timeline หลัง touchdown — กิมบอลไม่หมุนช่วง impact
4. `Line of sight: LANDER HULL` — หลักฐานว่า geometry gate สำคัญกว่าการชี้อย่างเดียว
5. เส้น 0 dB หลัง reserve — fixed ตัดลงเป็น fail ขณะที่ gimbal คงค่าบวก

## ประโยคห้ามพูด

- ห้ามพูดว่า antenna 60 mm ผ่าน CST/HFSS แล้ว
- ห้ามเรียก S11 −10 dB ว่าผล simulation; เป็น requirement
- ห้ามพูดว่ากิมบอลแก้ได้ทุกท่าลงจอด เพราะ hull, terrain, burial, jam และ host-power loss ยังทำให้ link fail
- ห้ามพูดว่า 5 W RF เท่ากับ 5 W DC; ที่ PA efficiency 35% ต้องใช้ประมาณ 14.29 W DC เฉพาะ PA
- ห้ามเรียก −170/+110°C ว่าอุณหภูมิ antenna; เป็น surface-boundary reference และ +230 คือ °F

## เวอร์ชันตัดเหลือ 60 วินาที

ตัดรายละเอียด power/heater และลำดับ impact lock ออก แต่คงห้าตัวเลขนี้:

`2U / 1.5 kg · 2.205 GHz · FSPL 211.01 dB · fixed −3.22 dB · gimbal +4.26 dB`

## แผนสำรองหากเว็บมีปัญหา

เปิด `p14-final-literature-to-link-evidence.png` แล้วใช้บทพูดช่วง RF ต่อทันที. อย่าเสียเวลารอ WebGL เกิน 3 วินาที.
