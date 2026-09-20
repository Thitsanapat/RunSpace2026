import {mkdir,writeFile} from 'node:fs/promises';
import {PRESETS,DEFAULTS,presetConfig,runSimulation,runThermal,csvExport,MODEL_VERSION} from '../src/engine.js';
import {engineeringReport} from '../src/engineering-ui.js';
import {REFERENCES} from '../src/research.js';
await mkdir('examples',{recursive:true});
const rows=[];
for(const id of Object.keys(PRESETS)){
  const r=runSimulation(presetConfig(id)),f=r.frames.at(-1);
  rows.push({preset:id,finalErrorDeg:f.error,gimbalMarginDb:f.link.margin,fixedMarginDb:f.fixedLink.margin,availability:r.summary.availability,fixedAvailability:r.summary.fixedAvailability,blockedReason:f.blockedReason||'',plateFits:f.packaging.fits,targetFits:f.packagingReachable,releaseTime:r.summary.releaseTime});
  if(id==='tilt'){
    await writeFile('examples/off-nominal.csv',csvExport(r));
    await writeFile('examples/off-nominal.json',JSON.stringify({modelVersion:MODEL_VERSION,...r,references:REFERENCES},null,2));
    await writeFile('examples/off-nominal-report.md',engineeringReport(r.config,r,{}));
  }
}
const fields=Object.keys(rows[0]);
await writeFile('examples/preset-comparison.csv',[fields.join(','),...rows.map(r=>fields.map(k=>r[k]??'').join(','))].join('\n'));
const thermal={modelVersion:MODEL_VERSION,defaults:DEFAULTS,cold:runThermal(presetConfig('dust'),24),hot:runThermal(presetConfig('hot'),24)};
await writeFile('examples/thermal-24h.json',JSON.stringify(thermal,null,2));
console.log('Saved reproducible examples: default report / JSON / CSV, 11-preset comparison, cold and hot 24 h studies.');
