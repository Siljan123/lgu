import fs from 'fs';

const coords = JSON.parse(fs.readFileSync('layers/public-site/coordinates.json', 'utf8'));
const barangayHalls = coords.filter(c => c.category === 'BARANGAY_HALL');

// Helper for DMS
function toDMS(deg, isLat) {
  const absolute = Math.abs(deg);
  const d = Math.floor(absolute);
  const minNotTruncated = (absolute - d) * 60;
  const m = Math.floor(minNotTruncated);
  const sec = ((minNotTruncated - m) * 60).toFixed(1);
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return `${d}°${m}''${sec}"${dir}`;
}

// Map from seed barangay name to BARANGAY_HALL item
function findHall(name) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const h of barangayHalls) {
    const hNorm = h.name.toLowerCase().replace('barangay hall', '').replace(/[^a-z0-9]/g, '');
    if (hNorm === normalized) return h;
    if (name === 'Karaos' && h.name.toLowerCase().includes('karaus')) return h;
    if (name === 'Bitan-agan' && h.name.toLowerCase().includes('bitanagan')) return h;
    if (name === 'Das-agan' && h.name.toLowerCase().includes('dasagan')) return h;
    if (name === 'Pisa-an' && h.name.toLowerCase().includes('pisaan')) return h;
  }
  return null;
}

// 27 barangay metadata table
const barangayMetadata = [
  { name: 'Alegria', classification: 'Rural', pop: 3420, yr: '2024', elev: '75m ASL', elevM: 75.0, area: 14.50, addr: 'Purok 1, Alegria', phone: '+63 912 001 0001', email: 'brgy.alegria@sanfranz.gov.ph', desc: 'An agricultural community in San Francisco.' },
  { name: 'Bayugan 2', classification: 'Rural', pop: 5120, yr: '2024', elev: '62m ASL', elevM: 62.0, area: 18.20, addr: 'Purok Central, Bayugan 2', phone: '+63 912 001 0002', email: 'brgy.bayugan2@sanfranz.gov.ph', desc: 'A bustling rural center along the secondary access road.' },
  { name: 'Bitan-agan', classification: 'Rural', pop: 2890, yr: '2024', elev: '85m ASL', elevM: 85.0, area: 12.30, addr: 'Purok 2, Bitan-agan', phone: '+63 912 001 0003', email: 'brgy.bitanagan@sanfranz.gov.ph', desc: 'Known for agro-forestry and crop production.' },
  { name: 'Borbon', classification: 'Rural', pop: 4150, yr: '2024', elev: '58m ASL', elevM: 58.0, area: 16.80, addr: 'Purok 3, Borbon', phone: '+63 912 001 0004', email: 'brgy.borbon@sanfranz.gov.ph', desc: 'Rich agricultural plains and farming households.' },
  { name: 'Buenasuerte', classification: 'Rural', pop: 2310, yr: '2024', elev: '92m ASL', elevM: 92.0, area: 11.40, addr: 'Purok 1, Buenasuerte', phone: '+63 912 001 0005', email: 'brgy.buenasuerte@sanfranz.gov.ph', desc: 'Upland farming area producing corn and root crops.' },
  { name: 'Caimpugan', classification: 'Rural', pop: 3780, yr: '2024', elev: '48m ASL', elevM: 48.0, area: 21.50, addr: 'Purok 2, Caimpugan', phone: '+63 912 001 0006', email: 'brgy.caimpugan@sanfranz.gov.ph', desc: 'Bordering the Agusan Marsh wildlife sanctuary.' },
  { name: 'Das-agan', classification: 'Rural', pop: 3100, yr: '2024', elev: '65m ASL', elevM: 65.0, area: 13.10, addr: 'Purok 1, Das-agan', phone: '+63 912 001 0007', email: 'brgy.dasagan@sanfranz.gov.ph', desc: 'Peaceful inland community with rubber plantations.' },
  { name: 'Ebro', classification: 'Rural', pop: 2650, yr: '2024', elev: '70m ASL', elevM: 70.0, area: 15.00, addr: 'Purok 2, Ebro', phone: '+63 912 001 0008', email: 'brgy.ebro@sanfranz.gov.ph', desc: 'Agricultural barangay cultivating rice and palm oil.' },
  { name: 'Hubang', classification: 'Urban', pop: 9450, yr: '2024', elev: '55m ASL', elevM: 55.0, area: 10.80, addr: 'National Highway, Hubang', phone: '+63 912 001 0009', email: 'brgy.hubang@sanfranz.gov.ph', desc: 'Major urban and transport hub along the Maharlika Highway.' },
  { name: 'Karaos', classification: 'Urban', pop: 8920, yr: '2024', elev: '52m ASL', elevM: 52.0, area: 9.50, addr: 'Purok 4, Karaos', phone: '+63 912 001 0010', email: 'brgy.karaos@sanfranz.gov.ph', desc: 'Commercial area host to educational institutions and trade.' },
  { name: 'Ladgadan', classification: 'Rural', pop: 2480, yr: '2024', elev: '80m ASL', elevM: 80.0, area: 14.20, addr: 'Purok 1, Ladgadan', phone: '+63 912 001 0011', email: 'brgy.ladgadan@sanfranz.gov.ph', desc: 'Highland community known for organic farming.' },
  { name: 'Lapinigan', classification: 'Rural', pop: 3920, yr: '2024', elev: '60m ASL', elevM: 60.0, area: 17.60, addr: 'Purok 3, Lapinigan', phone: '+63 912 001 0012', email: 'brgy.lapinigan@sanfranz.gov.ph', desc: 'Active farming cooperative community.' },
  { name: 'Lucac', classification: 'Rural', pop: 3150, yr: '2024', elev: '68m ASL', elevM: 68.0, area: 13.70, addr: 'Purok 2, Lucac', phone: '+63 912 001 0013', email: 'brgy.lucac@sanfranz.gov.ph', desc: 'Known for fresh produce and livestock raising.' },
  { name: 'Mate', classification: 'Rural', pop: 2740, yr: '2024', elev: '77m ASL', elevM: 77.0, area: 16.10, addr: 'Purok 1, Mate', phone: '+63 912 001 0014', email: 'brgy.mate@sanfranz.gov.ph', desc: 'Rural agrarian development zone.' },
  { name: 'New Visayas', classification: 'Rural', pop: 3600, yr: '2024', elev: '64m ASL', elevM: 64.0, area: 12.90, addr: 'Purok 2, New Visayas', phone: '+63 912 001 0015', email: 'brgy.newvisayas@sanfranz.gov.ph', desc: 'Close-knit agricultural community.' },
  { name: 'Ormaca', classification: 'Rural', pop: 2180, yr: '2024', elev: '88m ASL', elevM: 88.0, area: 15.40, addr: 'Purok 1, Ormaca', phone: '+63 912 001 0016', email: 'brgy.ormaca@sanfranz.gov.ph', desc: 'Upland barangay rich in agro-forestry resources.' },
  { name: 'Pasta', classification: 'Rural', pop: 2950, yr: '2024', elev: '72m ASL', elevM: 72.0, area: 13.80, addr: 'Purok 3, Pasta', phone: '+63 912 001 0017', email: 'brgy.pasta@sanfranz.gov.ph', desc: 'High-yield rice producing barangay.' },
  { name: 'Pisa-an', classification: 'Rural', pop: 3380, yr: '2024', elev: '69m ASL', elevM: 69.0, area: 14.90, addr: 'Purok 1, Pisa-an', phone: '+63 912 001 0018', email: 'brgy.pisaan@sanfranz.gov.ph', desc: 'Riverine agricultural area.' },
  { name: 'Rizal', classification: 'Rural', pop: 4050, yr: '2024', elev: '61m ASL', elevM: 61.0, area: 15.30, addr: 'Purok Central, Rizal', phone: '+63 912 001 0019', email: 'brgy.rizal@sanfranz.gov.ph', desc: 'Fertile valley producing grains and coconuts.' },
  { name: 'San Isidro', classification: 'Rural', pop: 3520, yr: '2024', elev: '63m ASL', elevM: 63.0, area: 16.20, addr: 'Purok 2, San Isidro', phone: '+63 912 001 0020', email: 'brgy.sanisidro@sanfranz.gov.ph', desc: 'Named after the patron saint of farmers.' },
  { name: 'Santa Ana', classification: 'Rural', pop: 2870, yr: '2024', elev: '79m ASL', elevM: 79.0, area: 14.10, addr: 'Purok 1, Santa Ana', phone: '+63 912 001 0021', email: 'brgy.santaana@sanfranz.gov.ph', desc: 'Highland area focused on vegetable crop production.' },
  { name: 'Tagapua', classification: 'Rural', pop: 2640, yr: '2024', elev: '82m ASL', elevM: 82.0, area: 19.80, addr: 'Purok 2, Tagapua', phone: '+63 912 001 0022', email: 'brgy.tagapua@sanfranz.gov.ph', desc: 'Timberland and diversified agro-farm district.' },
  { name: 'Barangay 1', classification: 'Urban', pop: 6200, yr: '2024', elev: '50m ASL', elevM: 50.0, area: 4.20, addr: 'Poblacion Plaza, Barangay 1', phone: '+63 912 001 0023', email: 'brgy.1@sanfranz.gov.ph', desc: 'Administrative and government civic center.' },
  { name: 'Barangay 2', classification: 'Urban', pop: 5890, yr: '2024', elev: '50m ASL', elevM: 50.0, area: 3.80, addr: 'Market Site, Barangay 2', phone: '+63 912 001 0024', email: 'brgy.2@sanfranz.gov.ph', desc: 'Central public market and commercial trading center.' },
  { name: 'Barangay 3', classification: 'Urban', pop: 5420, yr: '2024', elev: '51m ASL', elevM: 51.0, area: 3.50, addr: 'Mabini St., Barangay 3', phone: '+63 912 001 0025', email: 'brgy.3@sanfranz.gov.ph', desc: 'High-density residential and retail district.' },
  { name: 'Barangay 4', classification: 'Urban', pop: 6150, yr: '2024', elev: '49m ASL', elevM: 49.0, area: 4.10, addr: 'Rizal Avenue, Barangay 4', phone: '+63 912 001 0026', email: 'brgy.4@sanfranz.gov.ph', desc: 'Financial, banking, and business district.' },
  { name: 'Barangay 5', classification: 'Urban', pop: 5780, yr: '2024', elev: '50m ASL', elevM: 50.0, area: 3.90, addr: 'Quezon Boulevard, Barangay 5', phone: '+63 912 001 0027', email: 'brgy.5@sanfranz.gov.ph', desc: 'Institutional and education zone of the poblacion.' }
];

const lines = barangayMetadata.map((b, i) => {
  const hall = findHall(b.name);
  if (!hall) throw new Error('Not found hall: ' + b.name);
  const lat = hall.lat.toFixed(6);
  const lng = hall.lng.toFixed(6);
  const dms = `${toDMS(hall.lat, true)} ${toDMS(hall.lng, false)}`;
  const isLast = i === barangayMetadata.length - 1;
  return `(gen_random_uuid(), '${b.name}', '${b.classification}', ${b.pop}, '${b.yr}', '${b.elev}', ${b.elevM.toFixed(1)}, ${lat}, ${lng}, '${dms}', ${b.area.toFixed(2)}, '${b.addr}', '${b.phone}', '${b.email}', null, '${b.desc}')${isLast ? ';' : ','}`;
});

console.log(lines.join('\n'));
