import {writeFile} from 'node:fs/promises';
import {DEFAULTS} from '../src/engine.js';
import {patternGain} from '../src/antenna-rf.js';
const config={...DEFAULTS,patternShape:'elliptical',beamwidthV:50};
const rows=['# SYNTHETIC TWO-PLANE COSINE MODEL. NOT MEASURED OR DIGITIZED FROM A PAPER.','# Reference model: gain 6.5 dBi; widths 82.44 and 50 degrees; theta +Z, phi +X toward +Y.','frequency_ghz,theta_deg,phi_deg,gain_dbi'];
for(let theta=0;theta<=180;theta+=10)for(let phi=0;phi<360;phi+=10)rows.push([config.frequencyGHz,theta,phi,patternGain(theta,phi,config).toFixed(6)].join(','));
await writeFile('public/example-3d-pattern.csv',rows.join('\n'));
console.log('Saved labeled synthetic 3D import example.');
