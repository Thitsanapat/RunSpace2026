export const REFERENCES=[
  {id:'slsp2026',title:'Jirawattanaphol et al. (27 April 2026) — SLSP-fed CP CubeSat antenna',url:'https://doi.org/10.3390/technologies14050263',doi:'10.3390/technologies14050263',facts:'Mounted prototype: measured impedance band 2.00–2.34 GHz, axial-ratio band 2.04–2.25 GHz; measured maximum gain 7.24 dBic at 2.18 GHz (Figure 20). Patterns measured at 2.05, 2.15 and 2.25 GHz (Figure 21). Useful recent comparison, not an automatic 7.24 dBic value at 2.205 GHz or a demonstrated 2U gimbal fit. No raw angular/frequency data have been imported from this paper.'},
  {id:'nasaComm2026',title:'NASA (2026) — Small Spacecraft Communications / ground systems',url:'https://www.nasa.gov/smallsat-institute/sst-soa/ground-data-systems-and-mission-operations/',facts:'Lists S-band return communications at 2200–2290 MHz and asset-dependent G/T, bandwidth, modulation and coding. Station availability and a mission frequency assignment are separate from antenna capability.'},
  {id:'polarization',title:'MathWorks — polarization loss and vector mismatch',url:'https://www.mathworks.com/help/phased/ref/polloss.html',facts:'Polarization loss comes from mismatch of normalized electric-field vectors. The simulator’s axial-ratio option is a restricted ideal-CP receiver calculation; it does not replace measured complex co/cross-polarized fields.'},
  {id:'anser2025',title:'Sánchez-Sevilleja et al. (2025) — compact S-band antenna',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC11860546/',doi:'10.3390/s25041237',facts:'Measured stacked dual-circular-polarization patch; 80 × 80 × 6.53 mm, 30 g; 2.03 / 2.205 GHz; isolated peak gain 6.5–7 dBi. See Sections 3, 5–7. Its reported axial-ratio angular coverage is not a half-power beamwidth.'},
  {id:'ac2000',title:'AAC Clyde Space AC-2000 (2022) — flight-proven compact S-band patch',url:'https://www.aac-clyde.space/wp-content/uploads/2021/11/AC-2000-1.pdf',facts:'Manufacturer datasheet: 2.0–2.3 GHz, VSWR 1.5:1, typical peak gain 5.2 dBic, approximately 2 × 2 inches, about 100 g, circular polarization, space-qualified and flight-proven. The published three-plane relative pattern is used conservatively in the mission profile. Thickness and RF power handling are not public in this datasheet.'},
  {id:'tigrisat2015',title:'Nascetti et al. (2015) — Tigrisat four-patch antenna',url:'https://doi.org/10.1109/LAWP.2014.2366791',doi:'10.1109/LAWP.2014.2366791',facts:'Four patches on a 96 mm square annular board, 57 mm opening; 2.45 GHz. Reported simulated gain 7.3 dBi; measured beamwidth about 60°. Directivity 8.3 dBi must not be substituted for gain. Author manuscript: Sections II–III.'},
  {id:'patch',title:'MathWorks — rectangular patch sizing equations',url:'https://www.mathworks.com/help/antenna/ug/impedance-analysis-of-2-by-2-patch-array.html',facts:'First-pass patch dimensions using effective permittivity and fringing-field extension; final antenna behavior requires electromagnetic analysis.'},
  {id:'link',title:'MathWorks — satellite link budget',url:'https://www.mathworks.com/help/satcom/gs/satellite-link-budget.html',facts:'EIRP, free-space loss, receiver G/T, C/N₀ and Eb/N₀ form the RF calculation chain.'},
  {id:'thermal',title:'NASA — spacecraft thermal control',url:'https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/',facts:'Vacuum thermal models use radiation and conduction, without atmospheric convection.'},
  {id:'moon',title:'NASA — Moon facts',url:'https://science.nasa.gov/moon/facts/',facts:'NASA gives about +127°C in full Sun and −173°C in darkness as general surface examples. ±170°C here is the user-selected stress envelope, not a uniform lunar air temperature.'},
  {id:'slim',title:'JAXA — SLIM landing outcome, 25 January 2024',url:'https://global.jaxa.jp/press/2024/01/20240125-1_e.html',facts:'Earth communication was established after the off-attitude landing; solar power generation was the stated problem. Antenna pointing cannot restore a failed power source.'},
  {id:'astrobotic',title:'Astrobotic — Lunar Landers Payload User’s Guide',url:'https://science.nasa.gov/wp-content/uploads/2023/11/astrobotic-lunar-landers-pug.pdf',facts:'PDF p.20 describes actuated medium/high-gain antennas after touchdown; p.46 describes payload power interfaces. Steerable lander antennas are not an unprecedented invention.'}
];

// Conservative absolute-gain cut made from the lowest value in each of the
// three published AC-2000 phi cuts. Interpolation is a simulation input, not
// a new antenna measurement.
export const AC2000_CONSERVATIVE_PATTERN=Object.freeze([
  {angle:0,gain:5.2},{angle:22.5,gain:4.2},{angle:45,gain:2.1},
  {angle:67.5,gain:-0.8},{angle:90,gain:-1.9},{angle:112.5,gain:-6.1},
  {angle:135,gain:-24.8},{angle:157.5,gain:-24.8},{angle:180,gain:-24.8}
]);
export const ANTENNA_PROFILES={
  ac2000:{label:'Mission-fit compact patch · AC-2000 evidence',source:'ac2000',values:{frequencyGHz:2.205,peakGain:5.2,beamwidth:90,antennaWidthMm:50.8,antennaHeightMm:50.8,antennaThicknessMm:15,antennaMassG:100,s11Db:-13.98,pattern:AC2000_CONSERVATIVE_PATTERN,cableTwistLimitDeg:180},beamEvidence:'The simulator uses the worst of the three published relative-gain cuts at each sampled angle. 50.8 mm is the nominal conversion of the datasheet’s approximate 2-inch size; 15 mm thickness is a project mechanical allocation because the public datasheet does not state thickness. Obtain the vendor ICD/CAD before CDR.'},
  anser:{label:'INTA / ANSER research benchmark · 2.205 GHz',source:'anser2025',values:{frequencyGHz:2.205,peakGain:6.5,beamwidth:82.44,antennaWidthMm:80,antennaHeightMm:80,antennaThicknessMm:7,antennaMassG:30,s11Db:-12,cableTwistLimitDeg:90},beamEvidence:'The qualification article reports a 7 mm physical height; 6.53 mm is the nominal stack. 82.44° remains an analytical approximation from 6.5 dBi and assumed 65% efficiency, not a measured HPBW. This profile is an RF/qualification benchmark and fails the current full 2U gimbal sweep.'},
  tigrisat:{label:'Tigrisat reference · 2.45 GHz',source:'tigrisat2015',values:{frequencyGHz:2.45,peakGain:7.3,beamwidth:60,antennaWidthMm:96,antennaHeightMm:96,antennaThicknessMm:7,antennaMassG:50},beamEvidence:'60° measured HPBW; 7.3 dBi simulated gain. 96 × 96 × 7 mm overall size is tabulated by Sánchez-Sevilleja (2025), Table 3, replacing the earlier layer-only 2.1 mm allowance. Mass 50 g remains an assumption. 2.45 GHz is a comparison reference, not the proposed 2.2–2.3 GHz downlink.'}
};
export function beamMetrics(c,onAxisMargin) {
  const lambda=299792458/(c.frequencyGHz*1e9),n=Math.log(0.5)/Math.log(Math.cos(c.beamwidth*Math.PI/360));
  const directivity=2*(n+1),gain=10**(c.peakGain/10),efficiency=gain/directivity;
  const availableLoss=onAxisMargin-c.reserveDb;
  const maxMispoint=availableLoss<0?null:Math.acos(10**(-availableLoss/(10*n)))*180/Math.PI;
  return {lambdaMm:lambda*1000,n,directivityDbi:10*Math.log10(directivity),impliedEfficiency:efficiency,
    effectiveAreaCm2:gain*lambda*lambda/(4*Math.PI)*1e4,farFieldM:2*((c.antennaWidthMm/1000)**2+(c.antennaHeightMm/1000)**2)/lambda,
    halfAngle:c.beamwidth/2,lossAtHalfDegree:-10*n*Math.log10(Math.cos(0.5*Math.PI/180)),maxMispoint,
    internallyConsistent:efficiency<=1,availableLoss};
}
