# Lunar Link engineering study

Model 1.5.2; generated 2026-09-23T16:39:36.191Z

## Scope
Entire payload including gimbal: 100 × 100 × 200 mm. Reduced-order simulation; not flight qualification. Antenna compact: Mission packaging target, not a published antenna: 60 × 60 × 7 mm stacked CP patch topology informed by ANSER. Gain 5.2 dBic, 90° analytical HPBW and S11 −10 dB are system requirements/sensitivity inputs, not transferred measurements. Full-wave installed EM and hardware measurements are required.

## Results
- Gimbal / fixed availability: 16.49 / 16.49% of complete run
- Final gimbal / fixed margin: — / — dB
- Final pointing error: 0.0926 deg
- Obstruction: LANDER HULL
- Final plate fits: true; target fits: true
- Full swept diameter: 85.14 mm
- Landing lock release: 4.340 s
- First link after release: — s; not sustained acquisition
- Sampled command latency bound: 20.00 ms; does not measure motor settling or full sensor/computation delay
- Payload / host / heater energy: 0.08910 / 0.08910 / 0.00000 Wh. Host includes payload; heater is a subset.

## Equations
FSPL = 20log10(4 pi R f/c). EIRP = 10log10(Ptx) + gain - cable loss. C/N0 = EIRP - FSPL + G/T + 228.599 - polarization - other loss. Eb/N0 = C/N0 - 10log10(bitrate). Margin = Eb/N0 - required - implementation.
Symmetric-cosine reference only (not a fit to imported 3D / elliptical patterns): exponent 2.00000; HPBW 90 deg; ideal directivity 7.78 dBi; implied efficiency 55.19%. Analytical pattern floor is -40 dB relative to peak; this floor is not imposed on imports. Imported polar cuts are axisymmetric approximations.

## Thermal and power boundary
Two nodes: payload and lander interface. The lander supplies DC power only; the transceiver/PA and dedicated heater are mounted on the payload/gimbal. The heater deposits heat in the payload node. Conduction K(Tlander-Tpayload) is the residual path through the isolated mount and exchanges equal/opposite heat. Each node radiates to ground/deep space and absorbs sunlight. NASA table references are -170 C (-274 F) and +110 C (+230 F) surface values; they are not prescribed payload temperatures. Payload RF, heater and functional loads all draw from the lander bus allocation. No solar battery recharge or full lander power model. Fixed baseline shares the host availability from this paired study.

## Limits and proposal corrections
Gimbal locks during impact and releases after rest confirmation. Body motion is prescribed, not a rigid-body contact/impact solver. Plate corner envelope does not validate cables/yokes/motors. Full swept rotation may exceed 2U. Hull is a box and ground is a plane; rocks, equipment panels, illustrated service blocks and terrain meshes do not enter obstruction. Buried antenna and lost power cannot be repaired by repointing. No shock strength, full-wave EM, complete CAD mass or lunar thermal qualification.
Known input attitude is used with bias/noise; star-tracker/IMU absolute attitude estimation is not implemented. IMU alone cannot establish absolute yaw at rest. Spring return does not make a patch omnidirectional. 50 ms command response is separate from motor settling. RF PA input is additional to the proposal's controller/motor power budget.

## Numerical method
Semi-implicit Euler 2 ms; sampled PID 100 Hz; telemetry every 40 ms. Coordinates +Y up, +Z forward; q = yaw(Y) * pitch(X) * roll(Z). Independent axes, uncoupled dynamics.

## References
- [Jirawattanaphol et al. (27 April 2026) — SLSP-fed CP CubeSat antenna](https://doi.org/10.3390/technologies14050263): Mounted prototype: measured impedance band 2.00–2.34 GHz, axial-ratio band 2.04–2.25 GHz; measured maximum gain 7.24 dBic at 2.18 GHz (Figure 20). Patterns measured at 2.05, 2.15 and 2.25 GHz (Figure 21). Useful recent comparison, not an automatic 7.24 dBic value at 2.205 GHz or a demonstrated 2U gimbal fit. No raw angular/frequency data have been imported from this paper.
- [NASA (2026) — Small Spacecraft Communications / ground systems](https://www.nasa.gov/smallsat-institute/sst-soa/ground-data-systems-and-mission-operations/): Lists S-band return communications at 2200–2290 MHz and asset-dependent G/T, bandwidth, modulation and coding. Station availability and a mission frequency assignment are separate from antenna capability.
- [MathWorks — polarization loss and vector mismatch](https://www.mathworks.com/help/phased/ref/polloss.html): Polarization loss comes from mismatch of normalized electric-field vectors. The simulator’s axial-ratio option is a restricted ideal-CP receiver calculation; it does not replace measured complex co/cross-polarized fields.
- [Sánchez-Sevilleja et al. (2025) — compact S-band antenna](https://pmc.ncbi.nlm.nih.gov/articles/PMC11860546/): Measured stacked dual-circular-polarization patch; 80 × 80 × 6.53 mm, 30 g; 2.03 / 2.205 GHz; isolated peak gain 6.5–7 dBi. See Sections 3, 5–7. Its reported axial-ratio angular coverage is not a half-power beamwidth.
- [AAC Clyde Space AC-2000 (2022) — flight-proven compact S-band patch](https://www.aac-clyde.space/wp-content/uploads/2021/11/AC-2000-1.pdf): Manufacturer datasheet: 2.0–2.3 GHz, VSWR 1.5:1, typical peak gain 5.2 dBic, approximately 2 × 2 inches, about 100 g, circular polarization, space-qualified and flight-proven. The published three-plane relative pattern is used conservatively in the mission profile. Thickness and RF power handling are not public in this datasheet.
- [Nascetti et al. (2015) — Tigrisat four-patch antenna](https://doi.org/10.1109/LAWP.2014.2366791): Four patches on a 96 mm square annular board, 57 mm opening; 2.45 GHz. Reported simulated gain 7.3 dBi; measured beamwidth about 60°. Directivity 8.3 dBi must not be substituted for gain. Author manuscript: Sections II–III.
- [MathWorks — rectangular patch sizing equations](https://www.mathworks.com/help/antenna/ug/impedance-analysis-of-2-by-2-patch-array.html): First-pass patch dimensions using effective permittivity and fringing-field extension; final antenna behavior requires electromagnetic analysis.
- [MathWorks — satellite link budget](https://www.mathworks.com/help/satcom/gs/satellite-link-budget.html): EIRP, free-space loss, receiver G/T, C/N₀ and Eb/N₀ form the RF calculation chain.
- [NASA — spacecraft thermal control](https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/): Vacuum thermal models use radiation and conduction, without atmospheric convection.
- [NASA — Moon facts](https://science.nasa.gov/moon/facts/): NASA gives about +127°C in full Sun and −173°C in darkness as general surface examples. These are surface examples, not a uniform lunar air temperature.
- [NASA NTRS 20150003498 — planetary temperature table](https://ntrs.nasa.gov/api/citations/20150003498/downloads/20150003498.pdf): The Moon row lists a maximum of 110°C / 230°F and a minimum of −170°C / −274°F. The +230 value is Fahrenheit, not Celsius. The simulator presets use this internally consistent Celsius pair as surface-boundary references.
- [JAXA — SLIM landing outcome, 25 January 2024](https://global.jaxa.jp/press/2024/01/20240125-1_e.html): Earth communication was established after the off-attitude landing; solar power generation was the stated problem. Antenna pointing cannot restore a failed power source.
- [Astrobotic — Lunar Landers Payload User’s Guide](https://science.nasa.gov/wp-content/uploads/2023/11/astrobotic-lunar-landers-pug.pdf): PDF p.20 describes actuated medium/high-gain antennas after touchdown; p.46 describes payload power interfaces. Steerable lander antennas are not an unprecedented invention.

## Reproducibility
```json
{
  "config": {
    "patternShape": "symmetric",
    "beamwidthV": 82.44,
    "backlobeFloorDb": 40,
    "gainConvention": "realized",
    "s11Db": -10,
    "axialRatioDb": 3,
    "polarizationMode": "fixed",
    "installationLossDb": 0,
    "receiverTempK": 100,
    "receiverBandwidthKHz": 100,
    "codingRate": 0.5,
    "modulationBits": 2,
    "rolloff": 0.35,
    "rfTempCoeffPpm": 0,
    "rfReferenceTemp": 20,
    "patternGrid": null,
    "frequencyResponse": null,
    "wallMm": 2,
    "pitchMotorWidthMm": 6,
    "rfBendRadiusMm": 8,
    "cableTwistLimitDeg": 180,
    "busMinV": 22,
    "busMaxV": 32,
    "busCurrentLimitA": 0.5,
    "harnessOhm": 0.5,
    "inrushA": 0.8,
    "inrushMs": 20,
    "holdCapUf": 470,
    "brownoutV": 18,
    "outageMs": 100,
    "scenario": "tilt",
    "duration": 18,
    "eventTime": 2,
    "rampTime": 1.5,
    "roll": 12,
    "pitch": -65,
    "yaw": 8,
    "jitter": 1,
    "jitterHz": 3,
    "jitterDuration": 3,
    "jitterDecay": 0.7,
    "restRate": 0.5,
    "restHold": 0.5,
    "landingLock": 1,
    "targetAz": 12,
    "targetEl": 25,
    "distanceKm": 384400,
    "horizon": 0,
    "azLimit": 180,
    "elMin": -85,
    "elMax": 85,
    "speedLimit": 90,
    "inertia": 0.00015,
    "movingMass": 0.15,
    "cgOffset": 0.002,
    "torqueLimit": 0.012,
    "kp": 0.08,
    "ki": 0.01,
    "kd": 0.006,
    "friction": 0.0001,
    "damping": 0.0003,
    "encoderBits": 14,
    "sensorBias": 0.05,
    "sensorNoise": 0.025,
    "controlHz": 100,
    "delayMs": 10,
    "torqueConstant": 0.025,
    "resistance": 8,
    "frequencyGHz": 2.205,
    "txPowerW": 5,
    "peakGain": 5.2,
    "beamwidth": 90,
    "cableLoss": 1,
    "polLoss": 0.5,
    "otherLoss": 1,
    "receiverGT": 22,
    "bitrateKbps": 4,
    "requiredEbNo": 4.5,
    "implementationLoss": 1.5,
    "reserveDb": 3,
    "antennaWidthMm": 60,
    "antennaHeightMm": 60,
    "antennaThicknessMm": 7,
    "antennaMassG": 100,
    "antennaProfile": "compact",
    "clearanceMm": 2,
    "mountX": 0.92,
    "mountY": 0.76,
    "mountZ": 0.62,
    "burialDepth": 0,
    "payloadMassKg": 1.5,
    "initialTemp": 15,
    "baseTemp": 15,
    "groundTemp": -40,
    "sunlight": 0.65,
    "solarIncidence": 0.5,
    "emissivity": 0.65,
    "absorptivity": 0.3,
    "thermalArea": 0.018,
    "heatCapacity": 240,
    "conductance": 0.2,
    "groundView": 0.25,
    "heaterW": 30,
    "heaterSetpoint": 0,
    "operatingMin": -40,
    "operatingMax": 80,
    "landerHeatCapacity": 3000,
    "landerArea": 0.2,
    "landerEmissivity": 0.1,
    "landerAbsorptivity": 0.15,
    "landerBatteryWh": 300,
    "heaterConnected": 1,
    "hostPower": 1,
    "hostRadio": 0,
    "busVoltage": 28,
    "regulatorEfficiency": 0.85,
    "dust": 0,
    "sealFactor": 0.25,
    "shockG": 0,
    "shockMs": 30,
    "batteryWh": 30,
    "electronicsW": 0.79,
    "rfEfficiency": 0.35,
    "jamAxis": "none",
    "pointingRequirement": 0.5,
    "seed": 2026,
    "pattern": null
  },
  "provenance": {},
  "beam": {
    "lambdaMm": 135.96029841269842,
    "n": 2.0000000000000004,
    "directivityDbi": 7.781512503836437,
    "impliedEfficiency": 0.5518852024709852,
    "effectiveAreaCm2": 48.70957656314172,
    "farFieldM": 0.10591327150731723,
    "halfAngle": 45,
    "lossAtHalfDegree": 0.0003307383591552883,
    "maxMispoint": 52.22320398857342,
    "internallyConsistent": true,
    "availableLoss": 4.2566444521898745
  },
  "summary": {
    "samples": 9000,
    "errorSq": 3647475.631074484,
    "peakError": 66.81782244988193,
    "peakTorque": 0.012,
    "peakCurrent": 0.48,
    "goodTime": 2.9679999999998947,
    "fixedGoodTime": 2.9679999999998947,
    "saturationTime": 0.5600000000000004,
    "dataKbit": 11.871999999999579,
    "fixedDataKbit": 11.871999999999579,
    "rmsError": 20.13144480953583,
    "availability": 16.488888888888305,
    "fixedAvailability": 16.488888888888305,
    "energyWh": 0.08910257993702447,
    "surfaceInterface": {
      "service": "ispace-top-concept",
      "source": "User-provided ispace Lunar Transportation Service leaflet photo, as of July 2026",
      "massKg": 1.5,
      "projectLimitKg": 1.5,
      "serviceLimitKg": 4,
      "projectMarginKg": 0,
      "serviceMarginKg": 2.5,
      "projectMassPass": true,
      "serviceMassPass": true,
      "massConsistent": true,
      "envelopeFits": true,
      "mountOnDeck": true,
      "candidateFit": true,
      "lateralClearanceMm": [
        50,
        50
      ],
      "verticalAllowanceMm": 0,
      "lunarWeightN": 2.43,
      "peakInterfaceForceN": 0,
      "hardwareVerified": false
    },
    "tailRms": 0.12099712122750662,
    "settlingMs": null,
    "releaseTime": 4.339999999999744,
    "acquisitionAfterRelease": null,
    "landerEnergyWh": 0.08910257993702447,
    "heaterEnergyWh": 0,
    "commandLatencyBoundMs": 20
  }
}
```

## Surface payload interface
Basis: User-provided ispace Lunar Transportation Service leaflet photo, as of July 2026. Top green zone: approximately 4 kg, 200 x 200 x 200 mm. Candidate remains attached to the lander; no deployment mechanism.
Entered total mass 1.5 kg; project limit 1.5 kg (pass: true); service mass margin 2.5 kg. Moving mass 0.15 kg is a subset, not the total. Mass hierarchy consistent: true.
2U lateral fit: true; on assumed deck: true; vertical allowance: 0 mm. External adapters/connectors need their own allocation. Concept mount [0.92, 0.76, 0.62] m.
Lunar weight m*1.62 = 2.430 N. Peak interface force m*shockG*9.80665 = 0.000 N; not stress, strength, modal response or qualification.
Lander geometry is reconstructed conceptually from the photograph. Hull LOS/contact retains the conservative box/foot proxy; equipment panels, legs, illustrated payload allocations and labels are not RF obstacles. A nominal clear field of view is not guaranteed after tipping. Host electrical/thermal parameters remain assumptions pending an interface control document.

```json
{
  "service": "ispace-top-concept",
  "source": "User-provided ispace Lunar Transportation Service leaflet photo, as of July 2026",
  "massKg": 1.5,
  "projectLimitKg": 1.5,
  "serviceLimitKg": 4,
  "projectMarginKg": 0,
  "serviceMarginKg": 2.5,
  "projectMassPass": true,
  "serviceMassPass": true,
  "massConsistent": true,
  "envelopeFits": true,
  "mountOnDeck": true,
  "candidateFit": true,
  "lateralClearanceMm": [
    50,
    50
  ],
  "verticalAllowanceMm": 0,
  "lunarWeightN": 2.43,
  "peakInterfaceForceN": 0,
  "hardwareVerified": false
}
```

## 2U assembly and host bus screening
3 concept PCBs, no local battery, and a host-powered local payload/gimbal heater. Assembly grid step 5 deg; sampled pass 100.00%; minimum signed clearance 3.08 mm. This is not continuous CAD clearance or mission reliability. Plate-only solver limits remain separate.
Worst functional/heater/total branch 22.11 / 30.00 / 52.11 W; minimum terminal 20.74 V; entered inrush 0.8 A; current allocation pass false; ideal capacitor hold-up 0.48 ms; outage pass false. No circuit transient validation.
