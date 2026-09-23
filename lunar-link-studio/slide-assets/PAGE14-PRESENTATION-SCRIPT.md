# Page 14 — Antenna & Earth–Moon Link

## คำตัดสินเรื่อง S11 simulation

ควรทำ full-wave EM simulation ก่อน design freeze เพราะ S11 เพียงจุดเดียวพิสูจน์ resonance, bandwidth, circular polarization หรือ realized gain ไม่ได้. ซิมปัจจุบันเป็น system/link model และ analytical cosine pattern จึงใช้ตอบ link feasibility กับผลของ gimbal ได้ แต่ใช้ยืนยัน antenna hardware ไม่ได้.

ถ้ายังไม่มี CST/HFSS result ในวันนำเสนอ ให้ใช้คำว่า **design target / EM verification pending** และห้ามวาด resonance notch สมมติ.

## รูปที่วางหน้า 14

ถ้าจะสร้างหน้าใหม่ทั้งหน้า ให้ใช้ `p14-final-literature-to-link-evidence.png` เป็น master visual. ไฟล์นี้จัดสัดส่วน 16:9 และเชื่อม literature → selection rationale → system evidence ไว้แล้ว.

### ซ้าย — Literature reference ประมาณ 38–42%

1. `p14-anser-reference-antenna-figure5d.png` — assembled stacked dual-CP antenna
2. เลือกเพียงหนึ่งรูปจาก paper ที่แสดง measured S11 และ radiation cuts; ไม่ต้องใส่หลาย figure จนอ่านแกนไม่ออก
3. ใต้รูปใส่ citation [1] และ label:

> Literature benchmark · measured and qualified 80 mm hardware

### ขวา — Our system evidence ประมาณ 58–62%

ใช้ `p14-rf-evidence-final.png` เป็นภาพหลัก เพราะแสดง FSPL, EIRP และ fixed-vs-gimbal result ในภาพเดียว.

เพิ่มกล่องสั้นเหนือหรือใต้กราฟ:

> **Proposed antenna target — EM pending**  
> 2.205 GHz · stacked CP patch · 60 × 60 × 7 mm · 5.2 dBic target · S11 ≤ −10 dB · AR ≤ 3 dB

เพิ่มบรรทัด architecture ใต้ caption:

> Lander provides DC power only · transceiver/PA, RF cable and isolated heater are onboard the 2U payload

เพิ่มแถบข้อจำกัด:

> Current installed 65° green-zone geometry is hull-blocked; mount/FOV optimization is required.

ไม่วาง `p14-paper-comparable-rf.png` ทั้งภาพบนหน้าหลักเมื่อพื้นที่มีเพียงครึ่งหน้า เพราะตัวอักษรและ polar axes จะเล็กเกินไป. ใช้ภาพนั้นใน appendix/backup สำหรับตอบกรรมการ RF.

## Speaker script 75–90 วินาที

> งานวิจัยฝั่งซ้ายแสดงว่า stacked circularly polarized S-band patch ที่ 2.205 GHz สามารถสร้าง วัด และผ่าน environmental qualification ได้ แต่ฮาร์ดแวร์อ้างอิงมีขนาด 80 มิลลิเมตร จึงไม่สามารถนำมาใส่ในกิมบอล 2U ของเราโดยตรง เราจึงใช้ topology นี้เป็น precedent และกำหนดเป้าหมายของทีมเป็น 60 คูณ 60 คูณ 7 มิลลิเมตร ซึ่งต้อง re-optimize ด้วย full-wave EM.
>
> ฝั่งขวาเป็นผล system-level ของเรา ที่ 2.205 กิกะเฮิรตซ์ ระยะโลกถึงดวงจันทร์ทำให้เกิด free-space path loss 211.01 เดซิเบล เมื่อใช้กำลัง RF 5 วัตต์จาก PA บน payload และ gain target 5.2 dBic จะได้ EIRP 11.19 dBW. ที่ data rate 4 กิโลบิตต่อวินาทีและสมมติ ground G/T 22 dB/K ระบบมี headroom 4.26 dB หลังหัก reserve 3 dBในกรณี clear line of sight. Lander ให้เฉพาะ DC power; ที่ PA efficiency 35% กำลัง 5 W RF ต้องการ PA DC ประมาณ 14.29 W.
>
> ถ้าเสาติดกับตัวยานและยานเอียง 65 องศา link จะเหลือ minus 3.22 dB และไม่ผ่าน แต่เมื่อกิมบอลชี้กลับเข้าหาโลกจะกลับมาเป็น plus 4.26 dB. อย่างไรก็ตาม geometry ติดตั้งปัจจุบันยังถูก hull บัง จึงต้องปรับ mount และ field of view. ผลนี้พิสูจน์คุณค่าของกิมบอลในเชิง pointing แต่ยังไม่ใช่ antenna qualification.
>
> ขั้นต่อไปคือ CST หรือ HFSS sweep สำหรับ S11, S22, isolation, axial ratio, efficiency และ realized 3D gain บนโครงสร้างติดตั้งจริง จากนั้นยืนยันด้วย VNA และ chamber test.

## คำตอบเมื่อกรรมการถาม “S11 ของทีมอยู่ไหน?”

> ค่า −10 dB ที่แสดงเป็น matching requirement ที่ 2.205 GHz ไม่ใช่ผลจำลองหรือผลวัด เราไม่สร้าง resonance curve จากจุดเดียว ขั้นถัดไปคือ full-wave sweep 2.0–2.4 GHz พร้อม gimbal/deck model และจะยืนยันด้วย VNA ที่ antenna connector reference plane.

## Full-wave simulation ที่ต้องส่งออก

| Result | Sweep / cut | Acceptance target |
|---|---|---|
| S11, S22 | 2.0–2.4 GHz | ≤ −10 dB over assigned channel |
| Port isolation S21 | 2.0–2.4 GHz | report; set after feed architecture |
| Axial ratio | frequency and angle | ≤3 dB over required coverage |
| Realized gain | 3D at 2.205 GHz | ≥5.2 dBic on axis target |
| Efficiency | frequency | report radiation and total efficiency |
| Co/cross-pol cuts | XZ and YZ | identify sidelobes, nulls and handedness |
| Installed model | patch + gimbal + coax + deck | repeat S11, AR, gain and pattern |
| Thermal sensitivity | cold/ambient/hot material cases | resonance/gain remain inside link allocation |

ใช้ stack/material จาก ANSER เป็น starting point เท่านั้น. การลด board จาก 80 mm เป็น 60 mm ต้อง re-optimize patch radii, notches, feed positions, layer thicknesses และ matching; ห้าม scale ทุกมิติแล้วอ้างว่าได้ performance เดิม.

## Citations

> [1] S. Sánchez-Sevilleja, D. Poyatos-Martínez, J. L. Masa-Campos, and A. Santiago, “Design, Development, and Qualification of a Broadband Compact S-Band Antenna for a CubeSat Constellation,” *Sensors*, vol. 25, no. 4, Art. no. 1237, 2025, doi: 10.3390/s25041237.

> [2] A. Gadhafi and R. Serria, “Design and Analysis of a Communication System for a Lunar Rover,” *Sensors*, vol. 24, no. 16, Art. no. 5361, 2024, doi: 10.3390/s24165361.
