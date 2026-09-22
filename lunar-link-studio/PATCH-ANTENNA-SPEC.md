# S-band patch antenna baseline

## Architecture decision

The current RunSpace concept uses one mechanically steered **stacked circularly polarized microstrip patch** on a two-axis gimbal. It is not a phased array. The baseline geometry is taken from Sánchez-Sevilleja et al., *Sensors* 2025, DOI `10.3390/s25041237`, as a reference design at 2.03 and 2.205 GHz.

The reference has two SMP ports. Each port is a single-point coaxial feed that excites the opposite circular-polarization sense. The two ports do not form a phased array and do not require a 0/90-degree beamforming network. The mission must select the polarization sense that matches the ground service and terminate the unused port in 50 ohms unless the final RF architecture specifies a qualified switch or diversity receiver.

## Published dimensions

| Item | Symbol | Published value |
|---|---:|---:|
| Board envelope | W × L | 80 × 80 mm |
| Declared design height | Ht | 6.53 mm |
| Physical height reported during qualification | — | 7 mm |
| Upper parasitic patch radius | RP | 30.6 mm |
| Lower driven patch radius | RL | 30.7 mm |
| Upper patch notch length | LNP | 20 mm |
| Lower patch notch length | LNL | 18 mm |
| Upper patch notch depth | DNP | 5.6 mm |
| Lower patch notch depth | DNL | 4.35 mm |
| Probe offset from patch center | d_probe | 20 mm |
| Antenna mass | — | 30 g |
| Connector | — | two miniature SMP ports |
| Fasteners | — | 12 nylon screws plus central discharge pin |

The paper states that the board corners are chamfered, but it does not publish the chamfer size, tolerances, connector keep-out, solder fillet, fastener-hole diameters, or the complete mechanical datum scheme. The drawing in `slide-assets/p14-patch-dimension-detail.svg` is therefore a dimensioned concept, not a fabrication drawing.

## Published layer stack

| Layer | Material/function | Thickness |
|---|---|---:|
| H8 | Copper parasitic patch | 0.035 mm |
| H7 | Rogers RO4360 | 0.508 mm |
| H6 | Rohacell spacer | 3.000 mm |
| H5 | Copper lower driven patch | 0.035 mm |
| H4 | Rogers RO4360 | 0.508 mm |
| H3 | Rohacell spacer | 2.000 mm |
| H2 | Rogers RO4360 | 0.508 mm |
| H1 | Copper ground plane | 0.035 mm |

The dielectric and spacer thicknesses sum to 6.524 mm, which rounds to the declared 6.53 mm. Adding the three listed copper foils gives 6.629 mm. The qualification section reports a physical antenna height of 7 mm. Use **7 mm plus manufacturing tolerance and connector keep-out** for mechanical accommodation until the supplier CAD is available.

## RF baseline and evidence boundary

- Study frequency: 2.205 GHz.
- Reference requirement bands: 2.03 GHz ±10 MHz and 2.205 GHz ±25 MHz.
- Reference reflection-coefficient requirement: S11/S22 ≤ −12 dB.
- Reference isolated peak gain: approximately 6.5–7 dBi.
- Current link-model gain input: 6.5 dBic.
- Current simulator S11 input: −15 dB scalar sensitivity assumption; it is not a bandwidth curve.

`slide-assets/p14-s11-reference-vs-frequency.png` recreates the published Figure 10 as an approximate visual digitization. It shows the reference antenna's two-port simulation and measurement. It must be captioned **reference antenna data**, not **our measured S11**.

The final lander antenna needs a calibrated S11/S22 sweep after integration because the gimbal yoke, coax, connector launch, lander deck, nearby harnesses, thermal state, and regolith-facing installation can shift the match. Required closure evidence is:

1. CST/HFSS model with the actual patch stack, feed, gimbal, deck and nearby conductive structure.
2. Port definition and unused-port termination.
3. S11/S22, realized co-polar gain, cross-polar gain, axial ratio and efficiency from 2.0 to 2.3 GHz.
4. VNA measurement at a defined calibration plane on the integrated engineering model.
5. Repeat measurement across the accepted temperature range and after vibration/shock.

## 2U mechanical consequence

The 80 × 80 × 6.53 mm plate has a corner-to-corner swept diameter of approximately 113.33 mm. The current proxy gimbal cavity is 95 mm, so unrestricted rotation of this exact reference plate does not fit. The design must either reduce the radiator/board and re-optimize it electromagnetically, enlarge/rearrange the cavity, or restrict travel and prove that the reduced field of regard still covers the required post-landing attitudes.

## Source

Sánchez-Sevilleja et al., “Design, Development, and Qualification of a Broadband Compact S-Band Antenna for a CubeSat Constellation,” *Sensors*, 25(4), 1237, 2025. <https://doi.org/10.3390/s25041237>
