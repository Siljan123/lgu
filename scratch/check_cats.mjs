import fs from 'fs';

const coords = JSON.parse(fs.readFileSync('layers/public-site/coordinates.json', 'utf8'));

const cats = [...new Set(coords.map(c => c.category))];
console.log('Categories:', cats);
