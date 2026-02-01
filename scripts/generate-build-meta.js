#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
let sha = 'unknown';
try{ sha = execSync('git rev-parse --short HEAD').toString().trim(); }catch(e){}
const out = { sha, date: new Date().toISOString() };
const outPath = path.join(__dirname, '..', 'www', 'build-meta.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote build-meta:', outPath);