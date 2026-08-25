import fs from 'fs';

const coords = JSON.parse(fs.readFileSync('layers/public-site/coordinates.json', 'utf8'));

const barangayHalls = coords.filter(c => c.category === 'BARANGAY_HALL');
console.log('Total BARANGAY_HALL entries:', barangayHalls.length);

function toDMS(deg, isLat) {
  const absolute = Math.abs(deg);
  const d = Math.floor(absolute);
  const minNotTruncated = (absolute - d) * 60;
  const m = Math.floor(minNotTruncated);
  const sec = ((minNotTruncated - m) * 60).toFixed(1);
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return `${d}°${m}'${sec}"${dir}`;
}

barangayHalls.forEach(b => {
  const dms = `${toDMS(b.lat, true)} ${toDMS(b.lng, false)}`;
  console.log(`${b.name} -> Lat: ${b.lat.toFixed(6)}, Lng: ${b.lng.toFixed(6)}, DMS: ${dms}`);
});
