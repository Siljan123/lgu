-- Seed data for Municipal Organization Structure of San Francisco, Agusan del Sur
-- Trimmed version: 10 departments only (kept hierarchically valid)
-- NOTE: adds contact to governance.employees. Run this once if the column
-- doesn't exist yet on your table:
-- ALTER TABLE governance.employees ADD COLUMN IF NOT EXISTS contact text;

TRUNCATE TABLE governance.employees, governance.positions, governance.departments CASCADE;

-- 1. Municipal Mayor
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('305451c6-aa72-4bf9-9480-5509c8263c23', 'Municipal Mayor', 'LCE', 'Local Chief Executive and Head of the Municipal Government', NULL, 0, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('f05451c6-aa72-4bf9-9480-5509c8263c23', 'Municipal Mayor', 'LCE', NULL, '305451c6-aa72-4bf9-9480-5509c8263c23', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('b66aec09-a5cb-44d7-9089-cf0b2ebe7db7', 'Municipal Mayor');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('da1794fa-791f-402c-a6dc-444f671665ab', 'Hon. Grace', 'A.', 'Rodriguez', 'f05451c6-aa72-4bf9-9480-5509c8263c23', 'b66aec09-a5cb-44d7-9089-cf0b2ebe7db7', '0917-234-5601');

-- 2. Office of the Municipal Mayor (Exec)
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 'Office of the Municipal Mayor', 'MO', 'Executive Support', 'f05451c6-aa72-4bf9-9480-5509c8263c23', 1, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('f7c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 'Office of the Municipal Mayor', 'MO', NULL, '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('184c6e5a-ce50-407f-9992-384565e846f5', 'Head of Executive Office');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('99b7e585-6882-4b3a-9ba6-8006fea474c5', 'Atty. Manuel', 'T.', 'Cordero', 'f7c9d518-7cd2-43f8-9160-ec1ed2b5ac89', '184c6e5a-ce50-407f-9992-384565e846f5', '0917-234-5602');

-- 3. Public Information & Media Relations Section
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('74a54232-d9a8-41d1-b1ad-adc8878da8d1', 'Public Information & Media Relations Section', 'PIMO', 'Press releases', 'f7c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 1, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('f4a54232-d9a8-41d1-b1ad-adc8878da8d1', 'Public Information & Media Relations Section', 'PIMO', NULL, '74a54232-d9a8-41d1-b1ad-adc8878da8d1', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('82a9584c-690e-4a6e-81db-b861de1844ec', 'Section Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('0e7cfdc7-2cf5-452d-8b0d-3e73375e8e5a', 'Carla', 'Jean', 'Dimaculangan', 'f4a54232-d9a8-41d1-b1ad-adc8878da8d1', '82a9584c-690e-4a6e-81db-b861de1844ec', '0917-234-5603');

-- 4. IAQMU
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('3cdbe894-fbb7-4011-885a-e359bc6103db', 'Internal Audit & Quality Management Unit', 'IAQMU', 'Internal operational compliance', 'f7c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 2, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('fcdbe894-fbb7-4011-885a-e359bc6103db', 'Internal Audit & Quality Management Unit', 'IAQMU', NULL, '3cdbe894-fbb7-4011-885a-e359bc6103db', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('05fbb49c-7bf1-4b31-b7db-293ca615eb99', 'Unit Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('263847dd-4730-4f7f-90f0-069adcb6eb59', 'Audie M.', 'Fernandez,', 'CPA', 'fcdbe894-fbb7-4011-885a-e359bc6103db', '05fbb49c-7bf1-4b31-b7db-293ca615eb99', '0917-234-5604');

-- 5. BAC Secretariat
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('4552aace-5afa-4f5f-80bc-ddbdfa74cf49', 'Bids and Awards Committee (BAC) Secretariat', 'BAC-SEC', 'Public procurement logistics', 'f7c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 3, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('f552aace-5afa-4f5f-80bc-ddbdfa74cf49', 'Bids and Awards Committee (BAC) Secretariat', 'BAC-SEC', NULL, '4552aace-5afa-4f5f-80bc-ddbdfa74cf49', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('2a918a95-39d7-41e9-904e-71f2f7264c3f', 'Secretariat Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('fa272b16-bd13-44e1-99dc-04c3ed0fe0ee', 'Atty. Manuel', 'T.', 'Cordero', 'f552aace-5afa-4f5f-80bc-ddbdfa74cf49', '2a918a95-39d7-41e9-904e-71f2f7264c3f', '0917-234-5602');

-- 6. HRMO
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 'Human Resource Management Office', 'HRMO', 'Personnel Administration', 'f05451c6-aa72-4bf9-9480-5509c8263c23', 2, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('ff023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 'Human Resource Management Office', 'HRMO', NULL, '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('9ce26b8e-fd6e-4038-9513-5fab585a13e1', 'Municipal HRMO Officer');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('ccccbd41-2474-4d1b-bead-1ab978c60ec8', 'Lucia M.', 'Balagtas,', 'DPA', 'ff023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', '9ce26b8e-fd6e-4038-9513-5fab585a13e1', '0917-234-5606');

-- 7. RSP Section
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('7b469aad-89a0-4cf4-a61d-a31a9542e760', 'Recruitment, Selection & Placement Section', 'RSP', 'Job postings', 'ff023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 1, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('fb469aad-89a0-4cf4-a61d-a31a9542e760', 'Recruitment, Selection & Placement Section', 'RSP', NULL, '7b469aad-89a0-4cf4-a61d-a31a9542e760', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('e772be74-b708-4242-84bf-529d58f5e715', 'Section Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('96939037-75dc-41a9-97ff-b5bce856b66d', 'Geraldine', 'O.', 'Cruz', 'fb469aad-89a0-4cf4-a61d-a31a9542e760', 'e772be74-b708-4242-84bf-529d58f5e715', '0917-234-5607');

-- 8. L&D Section
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('5fac5874-26ff-421f-a07e-7fd5afa16c40', 'Training, Learning & Development Section', 'L&D', 'Capacity building', 'ff023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 2, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('ffac5874-26ff-421f-a07e-7fd5afa16c40', 'Training, Learning & Development Section', 'L&D', NULL, '5fac5874-26ff-421f-a07e-7fd5afa16c40', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('6d14ce92-12d6-4a16-a168-a357e9f01e5b', 'Section Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('6a05a7df-8d79-45d3-b3e6-0f07b6fde029', 'Paul', 'Vincent', 'Tolentino', 'ffac5874-26ff-421f-a07e-7fd5afa16c40', '6d14ce92-12d6-4a16-a168-a357e9f01e5b', '0917-234-5608');

-- 9. PRBU
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('017af83c-bf3c-4115-b8b3-1bf866a00824', 'Personnel Records & Benefits Unit', 'PRBU', '201 file records', 'ff023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 3, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('f17af83c-bf3c-4115-b8b3-1bf866a00824', 'Personnel Records & Benefits Unit', 'PRBU', NULL, '017af83c-bf3c-4115-b8b3-1bf866a00824', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('d0d85221-cddb-443a-a05f-e4ec1742e2cb', 'Unit Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('6161ab7c-34f6-4e44-977f-592baa0334c9', 'Marites', 'E.', 'Gomez', 'f17af83c-bf3c-4115-b8b3-1bf866a00824', 'd0d85221-cddb-443a-a05f-e4ec1742e2cb', '0917-234-5609');

-- 10. MHO
-- Label
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('6dfa39d6-63b1-49c4-914e-fb0ee5739b19', 'Municipal Health Office', 'MHO', 'Primary Healthcare Services', 'f05451c6-aa72-4bf9-9480-5509c8263c23', 3, TRUE);
-- Person
INSERT INTO governance.departments (id, name, acronym, description, parent_id, order_index, is_label) VALUES ('fdfa39d6-63b1-49c4-914e-fb0ee5739b19', 'Municipal Health Office', 'MHO', NULL, '6dfa39d6-63b1-49c4-914e-fb0ee5739b19', 0, FALSE);
INSERT INTO governance.positions (id, title) VALUES ('caca170e-3fc3-463f-a3cc-9f4899fbb758', 'Municipal Health Officer / MHO Head');
INSERT INTO governance.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('a247c29b-1945-4c83-8d57-3ed2d0af3dc5', 'Dr. Alberto K. Sanchez,', 'MD,', 'MPH', 'fdfa39d6-63b1-49c4-914e-fb0ee5739b19', 'caca170e-3fc3-463f-a3cc-9f4899fbb758', '0917-234-5610');


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
-- barangay_directory seed
TRUNCATE TABLE barangay_directory.elected_officials, barangay_directory.barangay, barangay_directory.term CASCADE;

-- 0. Shared Terms (reused across every barangay). The migration seeds a default
--    current term on a fresh reset; we truncate above and re-seed deterministically.
INSERT INTO barangay_directory.term (id, label, start_date, end_date, is_current) VALUES
  ('30000000-0000-0000-0000-000000000001', '2020-2023', '2020-06-30', '2023-06-30', FALSE),
  ('30000000-0000-0000-0000-000000000002', '2023-2026', '2023-06-30', '2026-06-30', TRUE);

-- 1. Standard Barangay Positions
--    position_category is set directly here rather than relying on the
--    title-matching backfill in the position_category migration, since
--    these titles ('Barangay Captain', 'Kagawad') are shorter forms and
--    won't match that migration's exact-title WHERE clauses.
INSERT INTO barangay_directory.position (id, title, rank_order, position_category) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Barangay Captain', 1, 'captain'),
  ('10000000-0000-0000-0000-000000000002', 'Kagawad', 2, 'kagawad'),
  ('10000000-0000-0000-0000-000000000003', 'SK Chairperson', 3, 'sk_chairperson')
ON CONFLICT (id) DO NOTHING;

-- 1b. Helper: generates a plausible Filipino "First Last" name for seed officials
CREATE OR REPLACE FUNCTION barangay_directory.random_official_name()
RETURNS TEXT AS $$
DECLARE
  first_names TEXT[] := ARRAY[
    'Juan','Maria','Jose','Ana','Pedro','Rosario','Antonio','Carmen',
    'Manuel','Luz','Ramon','Teresita','Ernesto','Corazon','Ricardo',
    'Remedios','Eduardo','Josefina','Rodrigo','Leonora','Danilo','Perla',
    'Roberto','Fe','Arturo','Estrella','Cesar','Gloria'
  ];
  last_names TEXT[] := ARRAY[
    'Santos','Reyes','Cruz','Bautista','Ocampo','Garcia','Mendoza',
    'Torres','Gonzales','Ramos','Aquino','Del Rosario','Villanueva',
    'Castillo','Navarro','Domingo','Fernandez','Pascual','Rivera',
    'Salazar','Lopez','Tolentino','Pineda','Ignacio','Aguilar',
    'Marasigan','Serrano'
  ];
BEGIN
  RETURN first_names[1 + floor(random() * array_length(first_names, 1))::int]
      || ' ' ||
      last_names[1 + floor(random() * array_length(last_names, 1))::int];
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 2. Insert All 27 Barangays of San Francisco, Agusan del Sur (Postal Code: 8501)
INSERT INTO barangay_directory.barangay (
  id, name, classification, population, census_year,
  elevation_asl, elevation_meters, lat, lng, coordinates_display,
  land_area_sq_km, hall_address, contact_phone, contact_email,
  description
) VALUES
(gen_random_uuid(), 'Alegria', 'Rural', 3420, '2024', '75m ASL', 75.0, 8.506308, 126.011568, '8°30''22.7"N 126°0''41.6"E', 14.50, 'Purok 1, Alegria', '+63 912 001 0001', 'brgy.alegria@sanfranz.gov.ph', 'An agricultural community in San Francisco.'),
(gen_random_uuid(), 'Bayugan 2', 'Rural', 5120, '2024', '62m ASL', 62.0, 8.451524, 125.970044, '8°27''5.5"N 125°58''12.2"E', 18.20, 'Purok Central, Bayugan 2', '+63 912 001 0002', 'brgy.bayugan2@sanfranz.gov.ph', 'A bustling rural center along the secondary access road.'),
(gen_random_uuid(), 'Bitan-agan', 'Rural', 2890, '2024', '85m ASL', 85.0, 8.534795, 125.983044, '8°32''5.3"N 125°58''59.0"E', 12.30, 'Purok 2, Bitan-agan', '+63 912 001 0003', 'brgy.bitanagan@sanfranz.gov.ph', 'Known for agro-forestry and crop production.'),
(gen_random_uuid(), 'Borbon', 'Rural', 4150, '2024', '58m ASL', 58.0, 8.484800, 125.894664, '8°29''5.3"N 125°53''40.8"E', 16.80, 'Purok 3, Borbon', '+63 912 001 0004', 'brgy.borbon@sanfranz.gov.ph', 'Rich agricultural plains and farming households.'),
(gen_random_uuid(), 'Buenasuerte', 'Rural', 2310, '2024', '92m ASL', 92.0, 8.410329, 125.938923, '8°24''37.2"N 125°56''20.1"E', 11.40, 'Purok 1, Buenasuerte', '+63 912 001 0005', 'brgy.buenasuerte@sanfranz.gov.ph', 'Upland farming area producing corn and root crops.'),
(gen_random_uuid(), 'Caimpugan', 'Rural', 3780, '2024', '48m ASL', 48.0, 8.392942, 125.914905, '8°23''34.6"N 125°54''53.7"E', 21.50, 'Purok 2, Caimpugan', '+63 912 001 0006', 'brgy.caimpugan@sanfranz.gov.ph', 'Bordering the Agusan Marsh wildlife sanctuary.'),
(gen_random_uuid(), 'Das-agan', 'Rural', 3100, '2024', '65m ASL', 65.0, 8.547734, 126.016072, '8°32''51.8"N 126°0''57.9"E', 13.10, 'Purok 1, Das-agan', '+63 912 001 0007', 'brgy.dasagan@sanfranz.gov.ph', 'Peaceful inland community with rubber plantations.'),
(gen_random_uuid(), 'Ebro', 'Rural', 2650, '2024', '70m ASL', 70.0, 8.445569, 125.937229, '8°26''44.0"N 125°56''14.0"E', 15.00, 'Purok 2, Ebro', '+63 912 001 0008', 'brgy.ebro@sanfranz.gov.ph', 'Agricultural barangay cultivating rice and palm oil.'),
(gen_random_uuid(), 'Hubang', 'Urban', 9450, '2024', '55m ASL', 55.0, 8.518260, 125.965741, '8°31''5.7"N 125°57''56.7"E', 10.80, 'National Highway, Hubang', '+63 912 001 0009', 'brgy.hubang@sanfranz.gov.ph', 'Major urban and transport hub along the Maharlika Highway.'),
(gen_random_uuid(), 'Karaos', 'Urban', 8920, '2024', '52m ASL', 52.0, 8.490891, 125.974115, '8°29''27.2"N 125°58''26.8"E', 9.50, 'Purok 4, Karaos', '+63 912 001 0010', 'brgy.karaos@sanfranz.gov.ph', 'Commercial area host to educational institutions and trade.'),
(gen_random_uuid(), 'Ladgadan', 'Rural', 2480, '2024', '80m ASL', 80.0, 8.488569, 125.933444, '8°29''18.8"N 125°56''0.4"E', 14.20, 'Purok 1, Ladgadan', '+63 912 001 0011', 'brgy.ladgadan@sanfranz.gov.ph', 'Highland community known for organic farming.'),
(gen_random_uuid(), 'Lapinigan', 'Rural', 3920, '2024', '60m ASL', 60.0, 8.429989, 125.982586, '8°25''48.0"N 125°58''57.3"E', 17.60, 'Purok 3, Lapinigan', '+63 912 001 0012', 'brgy.lapinigan@sanfranz.gov.ph', 'Active farming cooperative community.'),
(gen_random_uuid(), 'Lucac', 'Rural', 3150, '2024', '68m ASL', 68.0, 8.561306, 125.962097, '8°33''40.7"N 125°57''43.5"E', 13.70, 'Purok 2, Lucac', '+63 912 001 0013', 'brgy.lucac@sanfranz.gov.ph', 'Known for fresh produce and livestock raising.'),
(gen_random_uuid(), 'Mate', 'Rural', 2740, '2024', '77m ASL', 77.0, 8.433908, 126.013992, '8°26''2.1"N 126°0''50.4"E', 16.10, 'Purok 1, Mate', '+63 912 001 0014', 'brgy.mate@sanfranz.gov.ph', 'Rural agrarian development zone.'),
(gen_random_uuid(), 'New Visayas', 'Rural', 3600, '2024', '64m ASL', 64.0, 8.443308, 125.899445, '8°26''35.9"N 125°53''58.0"E', 12.90, 'Purok 2, New Visayas', '+63 912 001 0015', 'brgy.newvisayas@sanfranz.gov.ph', 'Close-knit agricultural community.'),
(gen_random_uuid(), 'Ormaca', 'Rural', 2180, '2024', '88m ASL', 88.0, 8.449261, 125.996617, '8°26''57.3"N 125°59''47.8"E', 15.40, 'Purok 1, Ormaca', '+63 912 001 0016', 'brgy.ormaca@sanfranz.gov.ph', 'Upland barangay rich in agro-forestry resources.'),
(gen_random_uuid(), 'Pasta', 'Rural', 2950, '2024', '72m ASL', 72.0, 8.413950, 125.981642, '8°24''50.2"N 125°58''53.9"E', 13.80, 'Purok 3, Pasta', '+63 912 001 0017', 'brgy.pasta@sanfranz.gov.ph', 'High-yield rice producing barangay.'),
(gen_random_uuid(), 'Pisa-an', 'Rural', 3380, '2024', '69m ASL', 69.0, 8.531176, 125.953650, '8°31''52.2"N 125°57''13.1"E', 14.90, 'Purok 1, Pisa-an', '+63 912 001 0018', 'brgy.pisaan@sanfranz.gov.ph', 'Riverine agricultural area.'),
(gen_random_uuid(), 'Rizal', 'Rural', 4050, '2024', '61m ASL', 61.0, 8.486666, 125.870527, '8°29''12.0"N 125°52''13.9"E', 15.30, 'Purok Central, Rizal', '+63 912 001 0019', 'brgy.rizal@sanfranz.gov.ph', 'Fertile valley producing grains and coconuts.'),
(gen_random_uuid(), 'San Isidro', 'Rural', 3520, '2024', '63m ASL', 63.0, 8.480831, 125.967898, '8°28''51.0"N 125°58''4.4"E', 16.20, 'Purok 2, San Isidro', '+63 912 001 0020', 'brgy.sanisidro@sanfranz.gov.ph', 'Named after the patron saint of farmers.'),
(gen_random_uuid(), 'Santa Ana', 'Rural', 2870, '2024', '79m ASL', 79.0, 8.500385, 125.961562, '8°30''1.4"N 125°57''41.6"E', 14.10, 'Purok 1, Santa Ana', '+63 912 001 0021', 'brgy.santaana@sanfranz.gov.ph', 'Highland area focused on vegetable crop production.'),
(gen_random_uuid(), 'Tagapua', 'Rural', 2640, '2024', '82m ASL', 82.0, 8.513632, 125.907178, '8°30''49.1"N 125°54''25.8"E', 19.80, 'Purok 2, Tagapua', '+63 912 001 0022', 'brgy.tagapua@sanfranz.gov.ph', 'Timberland and diversified agro-farm district.'),
(gen_random_uuid(), 'Barangay 1', 'Urban', 6200, '2024', '50m ASL', 50.0, 8.511985, 125.975286, '8°30''43.1"N 125°58''31.0"E', 4.20, 'Poblacion Plaza, Barangay 1', '+63 912 001 0023', 'brgy.1@sanfranz.gov.ph', 'Administrative and government civic center.'),
(gen_random_uuid(), 'Barangay 2', 'Urban', 5890, '2024', '50m ASL', 50.0, 8.508618, 125.980844, '8°30''31.0"N 125°58''51.0"E', 3.80, 'Market Site, Barangay 2', '+63 912 001 0024', 'brgy.2@sanfranz.gov.ph', 'Central public market and commercial trading center.'),
(gen_random_uuid(), 'Barangay 3', 'Urban', 5420, '2024', '51m ASL', 51.0, 8.507890, 125.973892, '8°30''28.4"N 125°58''26.0"E', 3.50, 'Mabini St., Barangay 3', '+63 912 001 0025', 'brgy.3@sanfranz.gov.ph', 'High-density residential and retail district.'),
(gen_random_uuid(), 'Barangay 4', 'Urban', 6150, '2024', '49m ASL', 49.0, 8.505866, 125.979367, '8°30''21.1"N 125°58''45.7"E', 4.10, 'Rizal Avenue, Barangay 4', '+63 912 001 0026', 'brgy.4@sanfranz.gov.ph', 'Financial, banking, and business district.'),
(gen_random_uuid(), 'Barangay 5', 'Urban', 5780, '2024', '50m ASL', 50.0, 8.503854, 125.978782, '8°30''13.9"N 125°58''43.6"E', 3.90, 'Quezon Boulevard, Barangay 5', '+63 912 001 0027', 'brgy.5@sanfranz.gov.ph', 'Institutional and education zone of the poblacion.');

-- 3. Elected Officials Generator (per barangay)
-- Every elected official is connected to a position LABEL (is_label = TRUE):
--   Punong Barangay (Captain)  [label, root]
--     -> Captain (person)
--          |- Barangay Kagawad  [label]
--          |    |- Kagawad 1 / 2 / 3 (persons)
--          \- SK Chairperson    [label]
--               \- SK Chair (person)
-- Label rows carry the shared position header; the people beneath inherit it
-- (their own title bar is hidden in the org chart) so positions aren't repeated.
-- Every row (labels + people) gets its own gen_random_uuid(). Siblings render
-- in sort_order (lowest first); name breaks ties. Drag-to-reorder edits sort_order.
DO $$
DECLARE
  b RECORD;
  captain_id UUID := '10000000-0000-0000-0000-000000000001';
  kagawad_id UUID := '10000000-0000-0000-0000-000000000002';
  sk_id      UUID := '10000000-0000-0000-0000-000000000003';
  current_term_id UUID := '30000000-0000-0000-0000-000000000002'; -- 2023-2026 (current)
  past_term_id    UUID := '30000000-0000-0000-0000-000000000001'; -- 2020-2023 (previous)
  captain_label_id UUID;
  new_captain_id   UUID;
  kagawad_label_id UUID;
  sk_label_id      UUID;
  past_capt_label_id UUID;
  past_capt_id       UUID;
BEGIN
  FOR b IN SELECT id, name FROM barangay_directory.barangay LOOP
    captain_label_id := gen_random_uuid();
    new_captain_id   := gen_random_uuid();
    kagawad_label_id := gen_random_uuid();
    sk_label_id      := gen_random_uuid();

    -- =========================================================
    -- CURRENT TERM (2023-2026): full organizational roster
    -- =========================================================

    -- LABEL: Punong Barangay (Captain) - root of this barangay's tree
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      captain_label_id, b.id, current_term_id, NULL, captain_id,
      'Barangay Captain', NULL, NULL, NULL, TRUE, 0
    );

    -- PERSON: the Captain, placed under the Captain label
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      new_captain_id, b.id, current_term_id, captain_label_id, captain_id,
      'Hon. ' || barangay_directory.random_official_name(),
      'Executive & Peace and Order',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'Capt',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      FALSE, 0
    );

    -- LABEL: Barangay Kagawad - under the Captain
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      kagawad_label_id, b.id, current_term_id, new_captain_id, kagawad_id,
      'Kagawad', NULL, NULL, NULL, TRUE, 0
    );

    -- PERSON: Kagawad 1 (Finance) - under the Kagawad label
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      gen_random_uuid(), b.id, current_term_id, kagawad_label_id, kagawad_id,
      'Hon. ' || barangay_directory.random_official_name(),
      'Committee on Finance & Appropriations',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'Kag1',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      FALSE, 0
    );

    -- PERSON: Kagawad 2 (Public Works) - under the Kagawad label
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      gen_random_uuid(), b.id, current_term_id, kagawad_label_id, kagawad_id,
      'Hon. ' || barangay_directory.random_official_name(),
      'Committee on Public Works & Infrastructure',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'Kag2',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      FALSE, 1
    );

    -- PERSON: Kagawad 3 (Health & Sanitation) - under the Kagawad label
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      gen_random_uuid(), b.id, current_term_id, kagawad_label_id, kagawad_id,
      'Hon. ' || barangay_directory.random_official_name(),
      'Committee on Health, Sanitation & Environment',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'Kag3',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      FALSE, 2
    );

    -- LABEL: SK Chairperson - under the Captain
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      sk_label_id, b.id, current_term_id, new_captain_id, sk_id,
      'SK Chairperson', NULL, NULL, NULL, TRUE, 1
    );

    -- PERSON: SK Chairperson - under the SK label
    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      gen_random_uuid(), b.id, current_term_id, sk_label_id, sk_id,
      'Hon. ' || barangay_directory.random_official_name(),
      'Committee on Youth & Sports Development',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'SK',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      FALSE, 0
    );

    -- =========================================================
    -- PAST TERM (2020-2023): compact roster (Captain only) so the
    -- term switcher visibly differs between terms.
    -- =========================================================
    past_capt_label_id := gen_random_uuid();
    past_capt_id       := gen_random_uuid();

    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      past_capt_label_id, b.id, past_term_id, NULL, captain_id,
      'Barangay Captain', NULL, NULL, NULL, TRUE, 0
    );

    INSERT INTO barangay_directory.elected_officials (
      id, barangay_id, term_id, parent_id, position_id, name, committee, avatar_url, contact, is_label, sort_order
    ) VALUES (
      past_capt_id, b.id, past_term_id, past_capt_label_id, captain_id,
      'Hon. ' || barangay_directory.random_official_name(),
      'Executive & Peace and Order (2020-2023)',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || b.id || 'CaptPrev',
      '+63 917 ' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0') || ' ' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
      FALSE, 0
    );
  END LOOP;
END $$;