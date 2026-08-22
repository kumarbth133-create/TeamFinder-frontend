import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, '../src/assets/logo.png');
const logoBuf = fs.readFileSync(logoPath);
const base64 = logoBuf.toString('base64');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <clipPath id="circleClip">
      <circle cx="32" cy="32" r="29" />
    </clipPath>
    <filter id="subtle-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity="0.2" />
    </filter>
  </defs>

  <!-- Circular Base with White Background, Crimson Red Ring & 100% Transparent Outer Canvas -->
  <circle cx="32" cy="32" r="29" fill="#ffffff" stroke="#ca0019" stroke-width="2.5" filter="url(#subtle-glow)" />

  <!-- Embedded Logo centered and scaled to fit the circle -->
  <g clip-path="url(#circleClip)">
    <image 
      href="data:image/png;base64,${base64}" 
      x="-13" 
      y="-13" 
      width="90" 
      height="90" 
      preserveAspectRatio="xMidYMid meet" 
    />
  </g>
</svg>`;

const outPath = path.join(__dirname, '../public/favicon.svg');
fs.writeFileSync(outPath, svgContent);
console.log('Successfully generated public/favicon.svg');
