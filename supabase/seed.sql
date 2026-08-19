-- Seed data for Municipal Organization Structure of San Francisco, Agusan del Sur
-- Trimmed version: 10 departments only (kept hierarchically valid)
-- NOTE: adds contact to governance.employees. Run this once if the column
-- doesn't exist yet on your table:
-- ALTER TABLE governance.employees ADD COLUMN IF NOT EXISTS contact text;

TRUNCATE TABLE governance.employees, governance.positions, governance.departments CASCADE;

-- 1. Municipal Mayor (root)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('305451c6-aa72-4bf9-9480-5509c8263c23', 'Municipal Mayor', 'LCE', 'Local Chief Executive and Head of the Municipal Government of San Francisco, Agusan del Sur', NULL, 0);
INSERT INTO governance.positions (id, title) VALUES ('b66aec09-a5cb-44d7-9089-cf0b2ebe7db7', 'Municipal Mayor');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('da1794fa-791f-402c-a6dc-444f671665ab', 'Hon. Grace', 'A.', 'Rodriguez', '305451c6-aa72-4bf9-9480-5509c8263c23', 'b66aec09-a5cb-44d7-9089-cf0b2ebe7db7', '0917-234-5601');

-- 2. Office of the Municipal Mayor (child of Mayor)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 'Office of the Municipal Mayor', 'MO', 'Executive Support, Special Projects, and Administrative Assistance to the Mayor', '305451c6-aa72-4bf9-9480-5509c8263c23', 1);
INSERT INTO governance.positions (id, title) VALUES ('184c6e5a-ce50-407f-9992-384565e846f5', 'Head of Executive Office');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('99b7e585-6882-4b3a-9ba6-8006fea474c5', 'Atty. Manuel', 'T.', 'Cordero', '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', '184c6e5a-ce50-407f-9992-384565e846f5', '0917-234-5602');

-- 3. Public Information & Media Relations Section (child of Office of the Mayor)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('74a54232-d9a8-41d1-b1ad-adc8878da8d1', 'Public Information & Media Relations Section', 'PIMO', 'Press releases, social media management, municipal broadcast, and public information dissemination', '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 1);
INSERT INTO governance.positions (id, title) VALUES ('82a9584c-690e-4a6e-81db-b861de1844ec', 'Section Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('0e7cfdc7-2cf5-452d-8b0d-3e73375e8e5a', 'Carla', 'Jean', 'Dimaculangan', '74a54232-d9a8-41d1-b1ad-adc8878da8d1', '82a9584c-690e-4a6e-81db-b861de1844ec', '0917-234-5603');

-- 4. Internal Audit & Quality Management Unit (child of Office of the Mayor)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('3cdbe894-fbb7-4011-885a-e359bc6103db', 'Internal Audit & Quality Management Unit', 'IAQMU', 'Internal operational compliance, ISO quality systems review, and procedural audits', '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 2);
INSERT INTO governance.positions (id, title) VALUES ('05fbb49c-7bf1-4b31-b7db-293ca615eb99', 'Unit Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('263847dd-4730-4f7f-90f0-069adcb6eb59', 'Audie M.', 'Fernandez,', 'CPA', '3cdbe894-fbb7-4011-885a-e359bc6103db', '05fbb49c-7bf1-4b31-b7db-293ca615eb99', '0917-234-5604');

-- 5. Bids and Awards Committee (BAC) Secretariat (child of Office of the Mayor)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('4552aace-5afa-4f5f-80bc-ddbdfa74cf49', 'Bids and Awards Committee (BAC) Secretariat', 'BAC-SEC', 'Public procurement logistics, bidding documentation, and RA 9184 compliance monitoring', '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 3);
INSERT INTO governance.positions (id, title) VALUES ('2a918a95-39d7-41e9-904e-71f2f7264c3f', 'Secretariat Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('fa272b16-bd13-44e1-99dc-04c3ed0fe0ee', 'Atty. Manuel', 'T.', 'Cordero', '4552aace-5afa-4f5f-80bc-ddbdfa74cf49', '2a918a95-39d7-41e9-904e-71f2f7264c3f', '0917-234-5602');

-- 6. Human Resource Management Office (child of Mayor)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 'Human Resource Management Office', 'HRMO', 'Personnel Administration, Recruitment, Staff Welfare, and Human Resource Development', '305451c6-aa72-4bf9-9480-5509c8263c23', 2);
INSERT INTO governance.positions (id, title) VALUES ('9ce26b8e-fd6e-4038-9513-5fab585a13e1', 'Municipal HRMO Officer');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('ccccbd41-2474-4d1b-bead-1ab978c60ec8', 'Lucia M.', 'Balagtas,', 'DPA', '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', '9ce26b8e-fd6e-4038-9513-5fab585a13e1', '0917-234-5606');

-- 7. Recruitment, Selection & Placement Section (child of HRMO)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('7b469aad-89a0-4cf4-a61d-a31a9542e760', 'Recruitment, Selection & Placement Section', 'RSP', 'Job postings, merit promotion board secretariat, applicant screening, and appointments', '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 1);
INSERT INTO governance.positions (id, title) VALUES ('e772be74-b708-4242-84bf-529d58f5e715', 'Section Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('96939037-75dc-41a9-97ff-b5bce856b66d', 'Geraldine', 'O.', 'Cruz', '7b469aad-89a0-4cf4-a61d-a31a9542e760', 'e772be74-b708-4242-84bf-529d58f5e715', '0917-234-5607');

-- 8. Training, Learning & Development Section (child of HRMO)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('5fac5874-26ff-421f-a07e-7fd5afa16c40', 'Training, Learning & Development Section', 'L&D', 'Capacity building, staff seminars, performance management (SPMS), and training programs', '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 2);
INSERT INTO governance.positions (id, title) VALUES ('6d14ce92-12d6-4a16-a168-a357e9f01e5b', 'Section Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('6a05a7df-8d79-45d3-b3e6-0f07b6fde029', 'Paul', 'Vincent', 'Tolentino', '5fac5874-26ff-421f-a07e-7fd5afa16c40', '6d14ce92-12d6-4a16-a168-a357e9f01e5b', '0917-234-5608');

-- 9. Personnel Records & Benefits Unit (child of HRMO)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('017af83c-bf3c-4115-b8b3-1bf866a00824', 'Personnel Records & Benefits Unit', 'PRBU', '201 file records, service cards, leave administration, GSIS, PhilHealth, and Pag-IBIG liaison', '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 3);
INSERT INTO governance.positions (id, title) VALUES ('d0d85221-cddb-443a-a05f-e4ec1742e2cb', 'Unit Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('6161ab7c-34f6-4e44-977f-592baa0334c9', 'Marites', 'E.', 'Gomez', '017af83c-bf3c-4115-b8b3-1bf866a00824', 'd0d85221-cddb-443a-a05f-e4ec1742e2cb', '0917-234-5609');

-- 10. Municipal Health Office (child of Mayor)
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index) VALUES ('6dfa39d6-63b1-49c4-914e-fb0ee5739b19', 'Municipal Health Office', 'MHO', 'Primary Healthcare Services, Public Health Programs, Sanitation, and Medical Assistance', '305451c6-aa72-4bf9-9480-5509c8263c23', 3);
INSERT INTO governance.positions (id, title) VALUES ('caca170e-3fc3-463f-a3cc-9f4899fbb758', 'Municipal Health Officer / MHO Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('a247c29b-1945-4c83-8d57-3ed2d0af3dc5', 'Dr. Alberto K. Sanchez,', 'MD,', 'MPH', '6dfa39d6-63b1-49c4-914e-fb0ee5739b19', 'caca170e-3fc3-463f-a3cc-9f4899fbb758', '0917-234-5610');


-- Idempotent — safe to re-run, upserts on primary key id.
-- Elected Officials Seeder
-- 1
begin;

insert into governance.positions (id, title, rank_order) values
  ('11111111-1111-4000-8000-000000000001', 'Municipal Mayor', 1),
  ('11111111-1111-4000-8000-000000000002', 'Municipal Vice Mayor', 2),
  ('11111111-1111-4000-8000-000000000003', 'Sangguniang Bayan Member', 3),
  ('11111111-1111-4000-8000-000000000004', 'ABC President / Liga ng mga Barangay', 4),
  ('11111111-1111-4000-8000-000000000005', 'SK Federation President', 5),
  ('11111111-1111-4000-8000-000000000006', 'IPMR (Indigenous Peoples Representative)', 6)
on conflict (id) do update set
  title = excluded.title,
  rank_order = excluded.rank_order;

insert into governance.officials (id, first_name, middle_name, last_name, position_id, parent_id, contact, image_url) values
  ('22222222-2222-4000-8000-000000000001', 'Grace', 'A.', 'Rodriguez',
    '11111111-1111-4000-8000-000000000001', null, '0917-234-5601', null),
  ('22222222-2222-4000-8000-000000000002', 'Roberto', 'M.', 'Plaza',
    '11111111-1111-4000-8000-000000000002', '22222222-2222-4000-8000-000000000001', '0917-234-5602', null),
  ('22222222-2222-4000-8000-000000000003', 'Pedro', 'S.', 'Reyes',
    '11111111-1111-4000-8000-000000000003', '22222222-2222-4000-8000-000000000002', '0917-234-5611', null),
  ('22222222-2222-4000-8000-000000000004', 'Ana', 'M.', 'Villanueva',
    '11111111-1111-4000-8000-000000000003', '22222222-2222-4000-8000-000000000002', '0917-234-5612', null),
  ('22222222-2222-4000-8000-000000000005', 'Ramon', 'T.', 'Cruz',
    '11111111-1111-4000-8000-000000000003', '22222222-2222-4000-8000-000000000002', '0917-234-5613', null),
  ('22222222-2222-4000-8000-000000000006', 'Liza', 'K.', 'Santos',
    '11111111-1111-4000-8000-000000000003', '22222222-2222-4000-8000-000000000002', '0917-234-5614', null),
  ('22222222-2222-4000-8000-000000000007', 'Eduardo', 'D.', 'Flores',
    '11111111-1111-4000-8000-000000000003', '22222222-2222-4000-8000-000000000002', '0917-234-5615', null),
  ('22222222-2222-4000-8000-000000000008', 'Rodrigo', 'L.', 'Tan',
    '11111111-1111-4000-8000-000000000004', '22222222-2222-4000-8000-000000000002', '0917-234-5616', null),
  ('22222222-2222-4000-8000-000000000009', 'Kristine Joy', 'B.', 'Ramos',
    '11111111-1111-4000-8000-000000000005', '22222222-2222-4000-8000-000000000002', '0917-234-5617', null)
on conflict (id) do update set
  first_name = excluded.first_name,
  middle_name = excluded.middle_name,
  last_name = excluded.last_name,
  position_id = excluded.position_id,
  parent_id = excluded.parent_id,
  contact = excluded.contact,
  image_url = excluded.image_url;

commit;

-- barangay
-- ============================================================
-- CHANGE: barangay.id is now a random UUID (gen_random_uuid())
-- instead of a hardcoded slug (e.g. 'alegria', 'hubang').
--
-- Prerequisite: make sure these columns are typed UUID, not TEXT:
--   barangay_directory.barangay.id
--   barangay_directory.elected_officials.barangay_id
--   barangay_directory.barangay_landmark.barangay_id
-- If they're still TEXT, run this once first (safe here since we
-- TRUNCATE and reseed everything below anyway):
--
--   ALTER TABLE barangay_directory.elected_officials DROP CONSTRAINT IF EXISTS elected_officials_barangay_id_fkey;
--   ALTER TABLE barangay_directory.barangay_landmark  DROP CONSTRAINT IF EXISTS barangay_landmark_barangay_id_fkey;
--   ALTER TABLE barangay_directory.barangay            ALTER COLUMN id          TYPE uuid USING gen_random_uuid();
--   ALTER TABLE barangay_directory.elected_officials   ALTER COLUMN barangay_id TYPE uuid USING gen_random_uuid();
--   ALTER TABLE barangay_directory.barangay_landmark   ALTER COLUMN barangay_id TYPE uuid USING gen_random_uuid();
--   ALTER TABLE barangay_directory.elected_officials
--     ADD CONSTRAINT elected_officials_barangay_id_fkey FOREIGN KEY (barangay_id)
--     REFERENCES barangay_directory.barangay(id) ON DELETE CASCADE;
--   ALTER TABLE barangay_directory.barangay_landmark
--     ADD CONSTRAINT barangay_landmark_barangay_id_fkey FOREIGN KEY (barangay_id)
--     REFERENCES barangay_directory.barangay(id) ON DELETE CASCADE;
-- ============================================================
 
-- 1. Standard Barangay Positions
INSERT INTO barangay_directory.position (id, title, rank_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Punong Barangay (Captain)', 1),
  ('10000000-0000-0000-0000-000000000002', 'Barangay Kagawad', 2),
  ('10000000-0000-0000-0000-000000000003', 'SK Chairperson', 3)
ON CONFLICT (id) DO NOTHING;
 
-- Barangay ids are now random on every run, so there's no stable slug left
-- to ON CONFLICT against. Wipe and reseed to keep this script re-runnable.
TRUNCATE TABLE barangay_directory.barangay_landmark, barangay_directory.elected_officials, barangay_directory.barangay CASCADE;
 
-- 2. Insert All 27 Barangays of San Francisco, Agusan del Sur (Postal Code: 8501)
INSERT INTO barangay_directory.barangay (
  id, name, classification, postal_code, population, census_year,
  elevation_asl, elevation_meters, lat, lng, coordinates_display,
  land_area_sq_km, hall_address, contact_phone, contact_email,
  map_embed_url, description
) VALUES
(gen_random_uuid(), 'Alegria', 'Rural', '8501', 3420, '2024', '75m ASL', 75.0, 8.532100, 125.962100, '8°31''55.6"N 125°57''43.6"E', 14.50, 'Purok 1, Alegria', '+63 912 001 0001', 'brgy.alegria@sanfranz.gov.ph', null, 'An agricultural community in San Francisco.'),
(gen_random_uuid(), 'Bayugan 2', 'Rural', '8501', 5120, '2024', '62m ASL', 62.0, 8.541200, 125.971500, '8°32''28.3"N 125°58''17.4"E', 18.20, 'Purok Central, Bayugan 2', '+63 912 001 0002', 'brgy.bayugan2@sanfranz.gov.ph', null, 'A bustling rural center along the secondary access road.'),
(gen_random_uuid(), 'Bitan-agan', 'Rural', '8501', 2890, '2024', '85m ASL', 85.0, 8.512300, 125.951200, '8°30''44.3"N 125°57''04.3"E', 12.30, 'Purok 2, Bitan-agan', '+63 912 001 0003', 'brgy.bitanagan@sanfranz.gov.ph', null, 'Known for agro-forestry and crop production.'),
(gen_random_uuid(), 'Borbon', 'Rural', '8501', 4150, '2024', '58m ASL', 58.0, 8.525400, 125.983200, '8°31''31.4"N 125°58''59.5"E', 16.80, 'Purok 3, Borbon', '+63 912 001 0004', 'brgy.borbon@sanfranz.gov.ph', null, 'Rich agricultural plains and farming households.'),
(gen_random_uuid(), 'Buenasuerte', 'Rural', '8501', 2310, '2024', '92m ASL', 92.0, 8.501200, 125.941200, '8°30''04.3"N 125°56''28.3"E', 11.40, 'Purok 1, Buenasuerte', '+63 912 001 0005', 'brgy.buenasuerte@sanfranz.gov.ph', null, 'Upland farming area producing corn and root crops.'),
(gen_random_uuid(), 'Caimpugan', 'Rural', '8501', 3780, '2024', '48m ASL', 48.0, 8.495000, 125.932000, '8°29''42.0"N 125°55''55.2"E', 21.50, 'Purok 2, Caimpugan', '+63 912 001 0006', 'brgy.caimpugan@sanfranz.gov.ph', null, 'Bordering the Agusan Marsh wildlife sanctuary.'),
(gen_random_uuid(), 'Das-agan', 'Rural', '8501', 3100, '2024', '65m ASL', 65.0, 8.521000, 125.961000, '8°31''15.6"N 125°57''39.6"E', 13.10, 'Purok 1, Das-agan', '+63 912 001 0007', 'brgy.dasagan@sanfranz.gov.ph', null, 'Peaceful inland community with rubber plantations.'),
(gen_random_uuid(), 'Ebro', 'Rural', '8501', 2650, '2024', '70m ASL', 70.0, 8.538000, 125.991000, '8°32''16.8"N 125°59''27.6"E', 15.00, 'Purok 2, Ebro', '+63 912 001 0008', 'brgy.ebro@sanfranz.gov.ph', null, 'Agricultural barangay cultivating rice and palm oil.'),
(gen_random_uuid(), 'Hubang', 'Urban', '8501', 9450, '2024', '55m ASL', 55.0, 8.518000, 125.975000, '8°31''04.8"N 125°58''30.0"E', 10.80, 'National Highway, Hubang', '+63 912 001 0009', 'brgy.hubang@sanfranz.gov.ph', null, 'Major urban and transport hub along the Maharlika Highway.'),
(gen_random_uuid(), 'Karaos', 'Urban', '8501', 8920, '2024', '52m ASL', 52.0, 8.511000, 125.981000, '8°30''39.6"N 125°58''51.6"E', 9.50, 'Purok 4, Karaos', '+63 912 001 0010', 'brgy.karaos@sanfranz.gov.ph', null, 'Commercial area host to educational institutions and trade.'),
(gen_random_uuid(), 'Ladgadan', 'Rural', '8501', 2480, '2024', '80m ASL', 80.0, 8.545000, 125.952000, '8°32''42.0"N 125°57''07.2"E', 14.20, 'Purok 1, Ladgadan', '+63 912 001 0011', 'brgy.ladgadan@sanfranz.gov.ph', null, 'Highland community known for organic farming.'),
(gen_random_uuid(), 'Lapinigan', 'Rural', '8501', 3920, '2024', '60m ASL', 60.0, 8.552000, 125.968000, '8°33''07.2"N 125°58''04.8"E', 17.60, 'Purok 3, Lapinigan', '+63 912 001 0012', 'brgy.lapinigan@sanfranz.gov.ph', null, 'Active farming cooperative community.'),
(gen_random_uuid(), 'Lucac', 'Rural', '8501', 3150, '2024', '68m ASL', 68.0, 8.530000, 125.945000, '8°31''48.0"N 125°56''42.0"E', 13.70, 'Purok 2, Lucac', '+63 912 001 0013', 'brgy.lucac@sanfranz.gov.ph', null, 'Known for fresh produce and livestock raising.'),
(gen_random_uuid(), 'Mate', 'Rural', '8501', 2740, '2024', '77m ASL', 77.0, 8.561000, 125.982000, '8°33''39.6"N 125°58''55.2"E', 16.10, 'Purok 1, Mate', '+63 912 001 0014', 'brgy.mate@sanfranz.gov.ph', null, 'Rural agrarian development zone.'),
(gen_random_uuid(), 'New Visayas', 'Rural', '8501', 3600, '2024', '64m ASL', 64.0, 8.508000, 125.962000, '8°30''28.8"N 125°57''43.2"E', 12.90, 'Purok 2, New Visayas', '+63 912 001 0015', 'brgy.newvisayas@sanfranz.gov.ph', null, 'Close-knit agricultural community.'),
(gen_random_uuid(), 'Ormaca', 'Rural', '8501', 2180, '2024', '88m ASL', 88.0, 8.568000, 125.961000, '8°34''04.8"N 125°57''39.6"E', 15.40, 'Purok 1, Ormaca', '+63 912 001 0016', 'brgy.ormaca@sanfranz.gov.ph', null, 'Upland barangay rich in agro-forestry resources.'),
(gen_random_uuid(), 'Pasta', 'Rural', '8501', 2950, '2024', '72m ASL', 72.0, 8.542000, 125.938000, '8°32''31.2"N 125°56''16.8"E', 13.80, 'Purok 3, Pasta', '+63 912 001 0017', 'brgy.pasta@sanfranz.gov.ph', null, 'High-yield rice producing barangay.'),
(gen_random_uuid(), 'Pisa-an', 'Rural', '8501', 3380, '2024', '69m ASL', 69.0, 8.529000, 125.929000, '8°31''44.4"N 125°55''44.4"E', 14.90, 'Purok 1, Pisa-an', '+63 912 001 0018', 'brgy.pisaan@sanfranz.gov.ph', null, 'Riverine agricultural area.'),
(gen_random_uuid(), 'Rizal', 'Rural', '8501', 4050, '2024', '61m ASL', 61.0, 8.516000, 125.949000, '8°30''57.6"N 125°56''56.4"E', 15.30, 'Purok Central, Rizal', '+63 912 001 0019', 'brgy.rizal@sanfranz.gov.ph', null, 'Fertile valley producing grains and coconuts.'),
(gen_random_uuid(), 'San Isidro', 'Rural', '8501', 3520, '2024', '63m ASL', 63.0, 8.548000, 125.979000, '8°32''52.8"N 125°58''44.4"E', 16.20, 'Purok 2, San Isidro', '+63 912 001 0020', 'brgy.sanisidro@sanfranz.gov.ph', null, 'Named after the patron saint of farmers.'),
(gen_random_uuid(), 'Santa Ana', 'Rural', '8501', 2870, '2024', '79m ASL', 79.0, 8.559000, 125.949000, '8°33''32.4"N 125°56''56.4"E', 14.10, 'Purok 1, Santa Ana', '+63 912 001 0021', 'brgy.santaana@sanfranz.gov.ph', null, 'Highland area focused on vegetable crop production.'),
(gen_random_uuid(), 'Tagapua', 'Rural', '8501', 2640, '2024', '82m ASL', 82.0, 8.535000, 125.918000, '8°32''06.0"N 125°55''04.8"E', 19.80, 'Purok 2, Tagapua', '+63 912 001 0022', 'brgy.tagapua@sanfranz.gov.ph', null, 'Timberland and diversified agro-farm district.'),
(gen_random_uuid(), 'Barangay 1 (Poblacion)', 'Poblacion', '8501', 6200, '2024', '50m ASL', 50.0, 8.505000, 125.978000, '8°30''18.0"N 125°58''40.8"E', 4.20, 'Poblacion Plaza, Barangay 1', '+63 912 001 0023', 'brgy.1@sanfranz.gov.ph', null, 'Administrative and government civic center.'),
(gen_random_uuid(), 'Barangay 2 (Poblacion)', 'Poblacion', '8501', 5890, '2024', '50m ASL', 50.0, 8.506500, 125.979500, '8°30''23.4"N 125°58''46.2"E', 3.80, 'Market Site, Barangay 2', '+63 912 001 0024', 'brgy.2@sanfranz.gov.ph', null, 'Central public market and commercial trading center.'),
(gen_random_uuid(), 'Barangay 3 (Poblacion)', 'Poblacion', '8501', 5420, '2024', '51m ASL', 51.0, 8.508000, 125.981000, '8°30''28.8"N 125°58''51.6"E', 3.50, 'Mabini St., Barangay 3', '+63 912 001 0025', 'brgy.3@sanfranz.gov.ph', null, 'High-density residential and retail district.'),
(gen_random_uuid(), 'Barangay 4 (Poblacion)', 'Poblacion', '8501', 6150, '2024', '49m ASL', 49.0, 8.503500, 125.976500, '8°30''12.6"N 125°58''35.4"E', 4.10, 'Rizal Avenue, Barangay 4', '+63 912 001 0026', 'brgy.4@sanfranz.gov.ph', null, 'Financial, banking, and business district.'),
(gen_random_uuid(), 'Barangay 5 (Poblacion)', 'Poblacion', '8501', 5780, '2024', '50m ASL', 50.0, 8.502000, 125.975000, '8°30''07.2"N 125°58''30.0"E', 3.90, 'Quezon Boulevard, Barangay 5', '+63 912 001 0027', 'brgy.5@sanfranz.gov.ph', null, 'Institutional and education zone of the poblacion.');
 
-- 3. Elected Officials Generator (5 per barangay: 1 Captain, 3 Kagawads, 1 SK Chair)
-- Each official row also gets its own gen_random_uuid() instead of the old
-- "<slug>-off-N" text id (which is no longer valid now that barangay.id is a UUID).
DO $$
DECLARE
  b RECORD;
  captain_id UUID := '10000000-0000-0000-0000-000000000001';
  kagawad_id UUID := '10000000-0000-0000-0000-000000000002';
  sk_id      UUID := '10000000-0000-0000-0000-000000000003';
  new_captain_id UUID;
BEGIN
  FOR b IN SELECT id, name FROM barangay_directory.barangay LOOP
    new_captain_id := gen_random_uuid();

    -- 1. Punong Barangay (Captain) - Root parent (parent_id is NULL)
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, parent_id, position_id, name, committee, avatar_url, contact, order_index
    ) VALUES (
      new_captain_id,
      b.id,
      NULL,
      captain_id,
      'Hon. ' || b.name || ' Captain',
      'Executive & Peace and Order',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'Capt',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      1
    );
 
    -- 2. Kagawad 1 (Finance) - Child of Captain
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, parent_id, position_id, name, committee, avatar_url, contact, order_index
    ) VALUES (
      gen_random_uuid(),
      b.id,
      new_captain_id,
      kagawad_id,
      'Hon. ' || b.name || ' Kagawad 1',
      'Committee on Finance & Appropriations',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'Kag1',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      2
    );
 
    -- 3. Kagawad 2 (Public Works) - Child of Captain
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, parent_id, position_id, name, committee, avatar_url, contact, order_index
    ) VALUES (
      gen_random_uuid(),
      b.id,
      new_captain_id,
      kagawad_id,
      'Hon. ' || b.name || ' Kagawad 2',
      'Committee on Public Works & Infrastructure',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'Kag2',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      3
    );
 
    -- 4. Kagawad 3 (Health & Sanitation) - Child of Captain
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, parent_id, position_id, name, committee, avatar_url, contact, order_index
    ) VALUES (
      gen_random_uuid(),
      b.id,
      new_captain_id,
      kagawad_id,
      'Hon. ' || b.name || ' Kagawad 3',
      'Committee on Health, Sanitation & Environment',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'Kag3',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      4
    );
 
    -- 5. SK Chairperson - Child of Captain
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, parent_id, position_id, name, committee, avatar_url, contact, order_index
    ) VALUES (
      gen_random_uuid(),
      b.id,
      new_captain_id,
      sk_id,
      'Hon. ' || b.name || ' SK Chair',
      'Committee on Youth & Sports Development',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'SK',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      5
    );
  END LOOP;
END $$;
 
-- 4. Key Barangay Hall Landmarks
-- No more hardcoded slug FKs ('hubang', 'karaos', ...) — look up the generated
-- barangay.id by name instead, and give each landmark its own gen_random_uuid().
INSERT INTO barangay_directory.barangay_landmark (id, barangay_id, name, category, lat, lng, address)
SELECT gen_random_uuid(), b.id, v.landmark_name, v.category, v.lat, v.lng, v.address
FROM (VALUES
  ('Hubang',                  'Hubang Barangay Hall & Gym',     'Government', 8.518100, 125.975200, 'National Highway, Hubang, San Francisco'),
  ('Karaos',                  'Karaos Barangay Complex',        'Government', 8.511200, 125.981300, 'Purok 4, Karaos, San Francisco'),
  ('Barangay 1 (Poblacion)',  'Barangay 1 Hall (Poblacion)',    'Government', 8.505200, 125.978200, 'Poblacion Plaza, Barangay 1, San Francisco'),
  ('Barangay 2 (Poblacion)',  'San Francisco Public Market',    'Commercial', 8.506600, 125.979700, 'Market Site, Barangay 2, San Francisco'),
  ('Caimpugan',                'Caimpugan Marsh Eco-Deck',       'Tourism',    8.495200, 125.932300, 'Purok 2, Caimpugan, San Francisco')
) AS v(barangay_name, landmark_name, category, lat, lng, address)
JOIN barangay_directory.barangay b ON b.name = v.barangay_name;