import {chromium} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const source=resolve('slide-assets/p14-anser-reference-antenna-figure5.png');
const output=resolve('slide-assets/p14-anser-reference-antenna-figure5d.png');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:2881,height:1815},deviceScaleFactor:1});
const url=pathToFileURL(source).href;
await page.goto(url,{waitUntil:'load'});
await page.screenshot({path:output,clip:{x:840,y:1032,width:1200,height:783}});
await browser.close();
console.log(output);
