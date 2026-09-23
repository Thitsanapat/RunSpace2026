# Page 14 recalculation — RF, link budget, power and thermal boundary

อัปเดตสำหรับ architecture รุ่น 1.5.2: **lander จ่ายเฉพาะ DC power**; transceiver/modem/PA, internal RF cable, gimbal controller และ heater อยู่บน payload 2U. Heater ฝากความร้อนลง payload node และใช้ thermal isolator โดยยังมี residual conductance ผ่านจุดยึดเป็นพารามิเตอร์ในซิม. ค่าเริ่มต้น `0.2 W/K` เป็น sensitivity assumption ที่ต้องแทนด้วยผล thermal-interface test; คำว่า isolated ไม่ได้หมายถึง conductance เป็นศูนย์.

## สิ่งที่เปลี่ยนและไม่เปลี่ยน

| Result | หลังย้าย RF chain มาอยู่ payload |
|---|---|
| FSPL, EIRP และ link-headroom-vs-tilt | **ไม่เปลี่ยน** ตราบใดที่ PA ยังส่ง RF output 5 W และ gain/loss เดิม |
| Fixed 65° / gimbal on-axis | **ไม่เปลี่ยน:** −3.22 / +4.26 dB หลัง reserve |
| Payload bus sizing | **เปลี่ยน:** ต้องรวม PA DC, regulator loss, motors/controller และ local heater |
| Thermal interpretation | −170°C และ +110°C/+230°F เป็น lunar surface-boundary references ไม่ใช่อุณหภูมิ antenna/electronics |
| RF temperature result | ยังไม่มี measured S11/gain/AR-vs-temperature; ค่า temperature coefficient ในซิมเป็น 0 จึงห้ามอ้างว่า RF ผ่านที่อุณหภูมิสุดขั้ว |

## Link budget ทีละบรรทัด

Inputs: `f = 2.205 GHz`, `R = 384,400 km`, `Ptx = 5 W RF`, realized boresight gain `5.2 dBic`, feed loss `1 dB`, polarization loss `0.5 dB`, other loss `1 dB`, ground `G/T = 22 dB/K`, `Rb = 4 kbps`, required `Eb/N0 = 4.5 dB`, implementation loss `1.5 dB`, design reserve `3 dB`.

```text
Ptx(dBW) = 10 log10(5) = 6.99 dBW
EIRP = 6.99 + 5.20 − 1.00 = 11.19 dBW
FSPL = 20 log10(4πRf/c) = 211.01 dB
C/N0 = 11.19 − 211.01 + 22 + 228.599 − 0.5 − 1.0
     = 49.28 dB-Hz
10 log10(Rb) = 10 log10(4000) = 36.02 dB-Hz
Eb/N0 = 49.28 − 36.02 = 13.26 dB
Raw margin = 13.26 − 4.50 − 1.50 = 7.26 dB
Headroom after reserve = 7.26 − 3.00 = +4.26 dB
```

Maximum rate under the same power, threshold and 3 dB reserve is approximately `10.66 kbps` before the configured receiver-bandwidth ceiling.

## กราฟ headroom vs lander tilt

กราฟใช้ tilt เป็น fixed-antenna mispointing ใน analytical cosine pattern. เส้น gimbal สมมติว่ายังรักษา boresight ได้และมี clear LOS.

| Case at 65° | Gain | EIRP | Eb/N0 | Raw margin | After 3 dB reserve |
|---|---:|---:|---:|---:|---:|
| Fixed patch | −2.28 dBi | 3.71 dBW | 5.78 dB | −0.22 dB | **−3.22 dB — FAIL** |
| Gimbal on-axis | 5.20 dBic | 11.19 dBW | 13.26 dB | 7.26 dB | **+4.26 dB — PASS*** |

`*` Clear-path RF result only. ตำแหน่ง green-zone ปัจจุบันใน installed 65° case ถูก hull proxy บัง จึงยังเป็น installed-case FAIL. กิมบอลกู้ pointing gain ได้ `7.48 dB` แต่กู้ blockage ไม่ได้.

## Power recalculation

```text
PA DC before payload converter = 5 W RF / 0.35 = 14.29 W
Peak functional branch from trajectory = 22.11 W
Local payload/gimbal heater = 30.00 W
Worst-case simultaneous lander branch = 52.11 W
```

ที่ minimum host bus 22 V และ harness round-trip 0.5 Ω แบบ constant-power screening:

- load terminal ≈ `20.74 V`
- steady current ≈ `2.51 A`
- current allocation `0.5 A` → **FAIL / ICD gap**
- 470 µF hold-up ก่อนตกถึง 18 V ≈ `0.48 ms`, ต่ำกว่า requirement 100 ms

หน้า 14 ควรแสดง link evidence เป็นหลัก แล้วใส่ footnote สั้นว่า `5 W RF requires 14.29 W PA DC; complete worst-case branch 52.11 W including local heater`. รายละเอียด current/hold-up ควรย้ายไปหน้า power หรือ appendix.

## Temperature statement ที่ใช้ได้

เขียนว่า:

> NASA lunar-surface boundary reference: −170°C cold and +110°C hot (+230°F). The payload heater is local and thermally isolated from the lander, with residual mount conduction modeled separately. RF operation across this range is not yet qualified.

ห้ามเขียน `−170°C to +230°C`. ค่า `+230` ในตาราง NASA เป็น **องศาฟาเรนไฮต์** เท่ากับประมาณ `+110°C`. Survival thermal run ซึ่งปิด RF และ motors ให้ payload ประมาณ `88.5°C` หลัง 24 ชั่วโมงใน hot case และเกิน operating maximum `+80°C`; การส่งจริงจะเพิ่ม onboard PA heat จึงต้องทำ coupled transmit-duty thermal run, ใช้ hot inhibit, coating/radiator/MLI และ thermal-vac verification.

NASA reference: [Lunar Surface Temperatures, NTRS 20150003498](https://ntrs.nasa.gov/citations/20150003498).
