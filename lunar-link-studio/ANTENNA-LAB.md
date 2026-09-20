# Antenna & RF laboratory — v1.3.0

รุ่น 1.3 เปลี่ยนตำแหน่งติดตั้งเป็น top green surface payload ตาม [SURFACE-MODEL.md](SURFACE-MODEL.md). สมการ RF เดิมยังใช้ แต่ default 65° tip ที่ตำแหน่งใหม่ถูก hull proxy บัง จึงไม่ผ่าน actual link แม้ on-axis clear-path budget ด้านล่างยังมี margin 8.557 dB.

ขอบเขตงาน: เพิ่มซิมและหลักฐานคำนวณตาม `Ultra Smooth Landing - Proposal (2).pdf`; ไม่ได้แก้หรือสร้างสไลด์. Payload รวมเสาและ gimbal ยังคง2U ตามข้อกำหนดล่าสุด

## ความถี่และงานวิจัยที่เลือก

ใช้ **2.205 GHz เป็น baseline สำหรับซิม downlink** เนื่องจากอยู่ในช่วง2.2–2.3 GHz ที่สไลด์ PDFหน้า13 ระบุ และมี reference antenna ที่วัดจริง. การกำหนดความถี่ภารกิจสุดท้ายต้องตรง host radio, ground station, bandwidth และ mission frequency assignment; งาน antenna paper ไม่ใช่หลักฐานการจัดสรรช่องสัญญาณ

| Reference | หลักฐานที่ใช้ | สิ่งที่ไม่ย้ายมาอ้าง |
|---|---|---|
| Sánchez-Sevilleja et al., Sensors2025 | Dual-CP stacked patch80×80×6.53 mm,30g;2.03/2.205 GHz; isolated gain6.5–7 dBi | HPBW82.44° ในซิมเป็น approximation; ไม่ใช่ measured HPBW; ไม่ได้ digitize full pattern |
| Jirawattanaphol et al., Technologies2026, เผยแพร่27เม.ย.2026 | Mounted prototype: measured S11 bandwidth2.00–2.34 GHz, AR bandwidth2.04–2.25 GHz; gainสูงสุด7.24 dBic ที่2.18 GHz; มี measured cuts ที่2.05/2.15/2.25 GHz | ห้ามใช้7.24 dBic ที่2.205 GHz โดยอัตโนมัติ; ไม่มีหลักฐาน fit ของ complete gimbal ใน2U; ยังไม่มี raw curve CSV |
| Nascetti et al., Tigrisat2015 | Comparison ที่2.45 GHz, simulated gain7.3 dBi และ measured HPBW≈60° | ไม่ใช่ downlink2.205 GHz design; 96 mm board มีปัญหา sweep ใน2U |

แหล่งหลัก: [Sensors2025 ฉบับเต็ม](https://pmc.ncbi.nlm.nih.gov/articles/PMC11860546/), [Technologies2026 DOI](https://doi.org/10.3390/technologies14050263), [Tigrisat DOI](https://doi.org/10.1109/LAWP.2014.2366791). ตรวจข้อมูล19ก.ย.2026 ไม่ได้อ้างว่าเป็นการสำรวจงานทั้งหมดในโลก

NASA แสดง S-band return communications2200–2290 MHz พร้อมสเปก G/T, bandwidth และ modulation/coding ที่ต่างกันตามสถานี. ซิมยังใช้ G/T22 dB/K เป็น assumption ไม่ได้ผูกกับบริการสถานีใดที่ยืนยันแล้ว. [NASA Ground Data Systems2026](https://www.nasa.gov/smallsat-institute/sst-soa/ground-data-systems-and-mission-operations/)

แก้ข้อมูล Tigrisat ในรุ่นนี้: overall thickness ใช้7 mm ตาม comparison table3 ของ Sensors2025 แทน allowance2.1 mm ที่นับเฉพาะชั้นบอร์ดในรุ่นก่อน. มวล50g ยังเป็น allowance ที่สมมติ

## กราฟที่เพิ่ม และคำถามที่แต่ละกราฟตอบ

| กราฟ/ผล | แกนและข้อมูล | ใช้ตัดสินอะไร |
|---|---|---|
| Interactive3D radiation | สี=directional gain(dBi); radius=relative dB−30…0 หรือ normalized linear power | เห็นรูปลำรังสีและทิศโลกหลังยานเอียง; ไม่ใช่ระยะส่งหรือขอบเขตสัญญาณที่ตัดฉับพลัน |
| θ–φ heatmap | φ0…360°, θ0…180°จากboresight; marker=โลก | ตรวจความไม่สมมาตร, sidelobes/nulls จากข้อมูลที่นำเข้า |
| Principal-plane cuts | gainกับsignedθ;φ0/180 และ90/270 | HPBWสองระนาบ, backlobe, off-axis loss; สำหรับCPไม่ควรเรียกสองเส้นนี้ว่าE/H planeโดยไม่มีนิยาม |
| Margin vs mispoint | marginกับθสองระนาบ;เส้นreserve | มุมผิดพลาดที่ RFยังยอมได้ ต่างจากเกณฑ์ควบคุม±0.5° |
| Gain vs frequency | boresightและทิศgimbalที่เลือก | ความถี่ใดมีgainพอ; หากไม่มีCSVจะคงgainไว้และติดป้ายassumption |
| S11 vs frequency | S11เป็นdBค่าลบ;เส้น−10 dBเป็นscreening | Matching band; ไม่แปลว่าgainหรือCPผ่านตามไปด้วย |
| AR vs frequency | axial ratio(dB);เส้น3 dBเป็นscreening | CP band; เป็นข้อมูลboresight/scalar ยังไม่ได้มีAR(θ,φ) |
| Margin vs frequency | on-axis clear pathเทียบactual geometry/power | ปัญหาantenna responseกับFSPL;ช่องว่างบอกข้อมูลนอกช่วงหรือLOS/powerไม่ผ่าน |
| Margin vs information bitrate | log10(kbps)ตั้งแต่0.01ถึง10000 kbps | อัตราข้อมูลที่มีreserveและผ่านbandwidth;ไม่เพิ่มcoding gainเอง |
| Margin vs range | 0.5–1.5เท่าของconfigured range | sensitivityต่อระยะ ไม่ใช่ephemerisหรือการจำลองrelayที่ตรวจสอบแล้ว |
| One-variable sensitivity | Δmarginจากเพิ่มpower/range/rate/loss/G/T | จัดลำดับว่าพารามิเตอร์ใดคุ้มที่จะปรับหรือวัดให้แม่น |
| RF operating point | gain,loss,EIRP,Pr,N,C/N,C/N0,Eb/N0,margin,bandwidth | ไล่ตรวจbudgetได้ทีละขั้นและหาจุดที่ไม่ผ่าน |

กราฟเดิมที่ใช้ร่วมกัน: error/time, margin/time, motor torque, payload power/energy, thermalสองโหนด และ Monte Carlo landing attitude map. Inspect mission time ใน RF tab เลือกframeของการลงจอดจริง; white arrow ใน3D เป็น Earth LOS ในantenna frame

## พารามิเตอร์ที่มีผล และควรเก็บหลักฐานอย่างไร

| กลุ่ม | Inputs/ค่าตั้งต้น | ผลในซิม | หลักฐานที่ยังต้องหา |
|---|---|---|---|
| Antenna pattern | peak6.5 dBi; HPBW82.44°; second-plane HPBW; analytical backlobe floor40 dB | directional gain ตามθ,φเข้าสู่budgetทั้งfixed/gimbal | วัด/EM full pattern บน representative lander; measured gain convention |
| Frequency |2.205 GHz | FSPL; lookup RF CSV เมื่อมี | ย่าน host radio + station; calibrationของfrequency response |
| Matching | scalar S11−15 dB | VSWR1.433; mismatch0.140 dBใช้เฉพาะaccepted-power gain | VNA S11หลังconnector/feed reference planeที่กำหนด |
| Gain convention | Realized(default) / accepted-power | Realizedไม่หักmismatchซ้ำ;acceptedหัก1−|Γ|²หนึ่งครั้ง | แยกgain/directivity/realized/co-polarอย่างชัดเจน |
| Polarization | fixedloss0.5 dB หรือAR→idealCP receiver; scalar AR3 dB | polarization overlapลดreceivedpower | measured co/cross fieldsหรือARทั้งfrequencyและangle; receiverpolarization |
| Installation | additional loss0 dB | ลดgainใน3Dและlinkเท่ากัน | วัดก่อน/หลังติดบนlander;ห้ามหักซ้ำกับmounted pattern |
| RF transmitter |5 W; feedloss1 dB; PA efficiency35% | EIRPและDC14.286 WของPA | RFportpower, cable/connectors, temperature, PAbackoff |
| Receiver | G/T22 dB/K; Tsys100 K; noiseBW100 kHz | Pr,N,C/N,marginและbandwidthgate | สเปกground station/pointing/weather/elevationจริง |
| Waveform | info4 kbps; codingrate0.5;2bits/symbol;rolloff0.35 | coded8 kbps;4ksym/s;occupiedBW5.4 kHz | waveform,codeและrequiredEb/N0ที่BER/FERเป้าหมาย |
| Detection | requiredEb/N0 4.5 dB;implementation1.5 dB;reserve3 dB | pass/failและmaxrate | measured receiverperformance;ไม่ควรยืมthresholdคนละcode |
| Propagation |384400km;otherloss1 dB;horizon0° | FSPL,geometrygate | ephemeris,landingcoordinates,stationelevation,channelmodel |
| Thermal RF | coefficient0 ppm/°C;Tref20°C | shift frequency lookupเมื่อมีCSV | วัดresonance/gain/S11/ARกับtemperatureจริง;ค่าบนUIเป็นsensitivity |
| Landing/mechanism | roll/pitch/yaw,mountXYZ,burial,travel,2Uclearance,lock/rest | error/LOS/gimbalreachและเวลาเริ่มacquire | CADmount/trajectory/benchtests;การหมุนไม่ได้แก้groundblock |

Tsys และG/Tไม่ได้เป็น ตัวแปรปรับ margin ที่เป็นอิสระต่อกัน: เมื่อเปลี่ยนTsysโดยคงG/T ซิมจะเปลี่ยน implied receiver gainพร้อมกัน จึงเปลี่ยนPrและnoiseเท่ากัน แต่marginคงเดิม. หากต้องการจำลองnoiseเพิ่มโดยdishgainคงเดิม ต้องลดG/Tตามจริง

## สมการที่เพิ่ม

กำหนดθจากboresight+Z,φ=atan2(y,x) ในantenna frame. ใช้ inverse rotation ของlanderและgimbalแปลงEarthvector; ทั้งภาพ3Dและlinkbudgetเรียกฟังก์ชันdirectional gainเดียวกัน

Two-plane approximation:

```
nH = ln(0.5) / ln(cos(HPBWH/2))
nV = ln(0.5) / ln(cos(HPBWV/2))
n(φ) = nH cos²φ + nV sin²φ
G(θ,φ) = G0 + max(−floor, 10 n(φ) log10(cosθ))
```

ใช้forward hemisphere และfloorด้านหลัง; ไม่มีการสร้างsidelobeปลอม. หากต้องการsidelobes/nullsจริงให้นำเข้าθ–φgrid. Numerical integral ∫Glinear dΩ/(4π) ใช้ evaluated gain หลังผลของความถี่ อุณหภูมิ mismatch ที่ต้องใช้ และ installation loss เช่นเดียวกับภาพ 3D. จึงไม่ใช่ radiation efficiency ของเสาเปล่าโดยตรง; การตีความเป็น efficiency ต้องรู้ gain convention และ normalization ของ total gain. Gain แบบ co-polar component อย่างเดียวไม่ให้ total radiation efficiency. ค่าเกิน100%ชี้ว่าข้อมูล/แบบจำลองไม่สอดคล้อง ไม่ได้พิสูจน์gainเกินฟิสิกส์. ความถี่นอกข้อมูลจะไม่แสดงค่ารวม รูป pattern หรือ heatmap และส่งออก grid ไม่ได้.

```
|Γ| = 10^(S11_dB/20)
VSWR = (1+|Γ|)/(1−|Γ|)
Lmismatch = −10log10(1−|Γ|²)

a = 10^(AR_dB/20)
PLF_same = (a+1)² / [2(a²+1)]
PLF_opposite = (a−1)² / [2(a²+1)]
Lpol = −10log10(PLF)
```

Polarizationสูตรนี้เป็นกรณีจำกัด: total transmitgain + elliptical polarizationรับด้วยidealCP. ถ้าinputเป็นmatchingCPcomponent(dBic)อยู่แล้ว ให้ใช้fixedlossเฉพาะadditionalreceiver mismatch; ห้ามหักprojectionซ้ำ. คำว่าsame/oppositeหมายถึงmatching/orthogonalCPในการรับ ไม่ใช่การเลือกป้ายRHCP/LHCPจากคนละviewing convention. กรณีorthogonalidealใช้lossfloor120 dBเชิงตัวเลข แทน∞. [Polarization vectors](https://www.mathworks.com/help/phased/ref/polloss.html)

```
Gr(dBi) = G/T(dB/K) + 10log10(Tsys)
Pr(dBW) = EIRP − FSPL + Gr − Lpol − Lother
N(dBW) = −228.599 + 10log10(Tsys) + 10log10(Bnoise)
C/N = Pr − N = C/N0 − 10log10(Bnoise)
Eb/N0 = C/N0 − 10log10(R_information)
R_coded = R_information / coding_rate
Rs = R_coded / bits_per_symbol
Boccupied ≈ Rs(1+rolloff)
```

ใช้root-raised-cosine/raised-cosine bandwidth approximation ไม่ใช่occupied spectrumของทุกwaveform. RequiredEb/N0ยังเป็นinputที่ต้องตรงinformation-bit definitionและcode; **ไม่บวกcodinggainเอง**. [Link budget basis](https://www.mathworks.com/help/satcom/gs/satellite-link-budget.html)

Default on-axisผลเดิม: EIRP12.490 dBW,FSPL211.012 dB,C/N0 50.577 dB-Hz,Eb/N0 14.557 dB,margin8.557 dB. เพิ่มPr=−128.022 dBm,noise=−128.599 dBm ที่100 kHz,C/N=0.577 dB. C/Nต่ำกว่าEb/N0ได้ เพราะnoisebandwidthกับbitrateต่างกัน. Maxrate=min(energy-limited14.379,bandwidth-limited74.074)=14.379 kbps ที่reserve3 dB

เกณฑ์pass: มีRF power + clear LOS + supported frequency data + margin≥reserve + Boccupied≤receiver bandwidth. Geometric pointingและ2U fitเป็นเกณฑ์แยก จึงยังต้องดูmechanical telemetry

## Data import / export

**3D pattern CSV** เป็นหนึ่งfrequencyต่อไฟล์:

```csv
frequency_ghz,theta_deg,phi_deg,gain_dbi
2.205,0,0,6.5
```

ตัวอย่างข้างบนแสดงheader/rowเท่านั้น ไฟล์จริงต้องเป็นcomplete Cartesian θ×φgrid; θมี0และ180อย่างน้อย3ค่า;φมี0และอย่างน้อย4ค่าใน[0,360),ไม่ใส่360ซ้ำ. Gainที่poleเดียวกันต้องตรงกันภายใน0.05 dB. รองรับnonuniform steps,bilinear interpolationในdBและcyclicφ;≤40000rows. การinterpolateในdBคือapproximation ไม่ใช่interpolationของcomplex E-fields

**Frequency response CSV**:

```csv
frequency_ghz,s11_db,gain_dbi,axial_ratio_db
2.0,-10,6,3
2.1,-20,8,1
2.2,-10,6,3
```

ตัวอย่างนี้สังเคราะห์ ไม่ใช่ข้อมูลpaper. ทุกคอลัมน์จำเป็น,≥2ความถี่ไม่ซ้ำ,sortภายใน,interpolateเป็นdB. ไม่extrapolate: ลิงก์เป็นunsupportedนอกช่วง. Frequencyresponseเปลี่ยนboresight gainโดยคงangular shapeไว้;ยังไม่ใช่multi-frequency full 3D pattern. ไม่มีresponseCSVและมี3Dgridจะรองรับเฉพาะfrequencyที่tagไว้

Thermal sensitivityใช้ f_lookup=f_actual/[1+αppm×10⁻⁶(T−Tref)]. Positiveαหมายถึงresonance frequencyเพิ่มตามtemperature. ไม่ได้คำนวณthermal expansion/εrจากวัสดุเอง;หากไม่มีresponseCSV coefficientนี้ยังไม่ทำให้gaincurveเปลี่ยน

ไฟล์ `public/example-frequency-response.csv` มีป้าย SYNTHETIC; ใช้ทดลอง import เท่านั้น. Export current 3D grid มีป้าย GENERATED SIMULATION ไม่ใช่ข้อมูลวัด และ sampling ทุก 5° ที่ความถี่เดียว. ตั้งแต่ v1.2.1 มี comment metadata ระบุว่าเป็น evaluated snapshot พร้อมอุณหภูมิ S11 และ AR ณ เวลาที่เลือก. เมื่อนำกลับเข้า โปรแกรมตั้ง convention เป็น realized, ล้าง installation loss และ frequency response เดิม และปิด thermal frequency shift เพื่อไม่ใช้ผลที่รวมใน grid แล้วซ้ำ. S11/AR ใน snapshot คงค่าตามเวลาส่งออก; ไม่ใช่แบบจำลองการเปลี่ยนตามอุณหภูมิใหม่. Gain ตรงจุด sampling คงเดิม ส่วนค่าระหว่างจุดเป็นการ interpolate จึงอาจต่างจาก analytical curve เดิมเล็กน้อย. CSV ทั่วไปหรือรุ่นเก่าที่ไม่มี metadata ยังต้องตรวจ gain convention และ loss เอง.

การส่งออก RF study, grid และ PNG จะอัปเดตตามค่ากับเวลาที่เลือกก่อนส่งออก แม้กดทันทีหลังแก้ input.

Export RF study JSON รวมselected time,configuration,operating point,cuts,sweeps,sensitivity,references. Export mission CSVเพิ่มθ,φ,gain,S11,VSWR,AR,polarizationloss,Pr,noise,C/N,bandwidthpassและfrequency-supported. Export 3D PNGใช้cameraปัจจุบัน

## เชื่อมกับช่องว่างใน Proposal (2)

ข้อเสนอต่อไปนี้เป็นmappingของหลักฐานจากซิม ไม่ใช่การสร้างสไลด์:

- PDFหน้า9(technicalcontentที่ยังว่าง): เลือกantenna/frequency,evidencebadge,3Dpattern+cutsและRF budget table
- หน้า10(3Dprototype): ตรวจdimensionlabelsรวมถึง112 mmในรูปกับกรอบ100 mm;ต้องอ่านCAD/ทิศdimensionก่อนสรุปfit ไม่ใช่แก้RFgainให้กลบmechanicalconflict
- หน้า11(dust/thermal): เปรียบเทียบresponseก่อน/หลังติดตั้งและอุณหภูมิ;ในซิมยังไม่มีcalibrateddustdielectricloss
- หน้า14(control/dynamics): error+margin/time,EarthLOSmarker,lock/releaseและbandwidthpass;แยกcommand latencyจากsettling
- หน้า15(shock): ซิมนี้ให้แรง/torqueแบบreduced-orderเท่านั้น;ยังไม่มีstress,modalanalysisหรือSRSqualification
- หน้า16(thermal): payload / lander TและRF detuningจากข้อมูลวัด;แสดงhotcaseที่เกินmotorlimit
- หน้า17(verification): บันทึกconfiguration JSON+CSV+RF study;เปรียบเทียบกับVNA,anechoic chamber,tilt benchและthermal vacuum

สิ่งที่ยังต้องมีเพื่ออ้างว่าใช้ได้จริง: mounted antenna S11/gain/AR/3Ddata;datasheetreceiver/waveform;host ICD;CAD sweepครบสายและbearing;temperature/vibrationtest. ซิมเวอร์ชันนี้พร้อมรับหลักฐานเหล่านั้นและแสดงผลกระทบ แต่ไม่ได้แทนการทดสอบจริง
