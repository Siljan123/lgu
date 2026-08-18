-- Seed data for Municipal Organization Structure of San Francisco, Agusan del Sur
-- Trimmed version: 10 departments only (kept hierarchically valid)
-- NOTE: adds contact to public.employees. Run this once if the column
-- doesn't exist yet on your table:
-- ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS contact text;

TRUNCATE TABLE public.employees, public.positions, public.departments CASCADE;

-- 1. Municipal Mayor (root)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('305451c6-aa72-4bf9-9480-5509c8263c23', 'Municipal Mayor', 'LCE', 'Local Chief Executive and Head of the Municipal Government of San Francisco, Agusan del Sur', NULL, 0);
INSERT INTO public.positions (id, title) VALUES ('b66aec09-a5cb-44d7-9089-cf0b2ebe7db7', 'Municipal Mayor');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('da1794fa-791f-402c-a6dc-444f671665ab', 'Hon. Grace', 'A.', 'Rodriguez', '305451c6-aa72-4bf9-9480-5509c8263c23', 'b66aec09-a5cb-44d7-9089-cf0b2ebe7db7', '0917-234-5601');

-- 2. Office of the Municipal Mayor (child of Mayor)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 'Office of the Municipal Mayor', 'MO', 'Executive Support, Special Projects, and Administrative Assistance to the Mayor', '305451c6-aa72-4bf9-9480-5509c8263c23', 1);
INSERT INTO public.positions (id, title) VALUES ('184c6e5a-ce50-407f-9992-384565e846f5', 'Head of Executive Office');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('99b7e585-6882-4b3a-9ba6-8006fea474c5', 'Atty. Manuel', 'T.', 'Cordero', '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', '184c6e5a-ce50-407f-9992-384565e846f5', '0917-234-5602');

-- 3. Public Information & Media Relations Section (child of Office of the Mayor)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('74a54232-d9a8-41d1-b1ad-adc8878da8d1', 'Public Information & Media Relations Section', 'PIMO', 'Press releases, social media management, municipal broadcast, and public information dissemination', '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 1);
INSERT INTO public.positions (id, title) VALUES ('82a9584c-690e-4a6e-81db-b861de1844ec', 'Section Head');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('0e7cfdc7-2cf5-452d-8b0d-3e73375e8e5a', 'Carla', 'Jean', 'Dimaculangan', '74a54232-d9a8-41d1-b1ad-adc8878da8d1', '82a9584c-690e-4a6e-81db-b861de1844ec', '0917-234-5603');

-- 4. Internal Audit & Quality Management Unit (child of Office of the Mayor)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('3cdbe894-fbb7-4011-885a-e359bc6103db', 'Internal Audit & Quality Management Unit', 'IAQMU', 'Internal operational compliance, ISO quality systems review, and procedural audits', '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 2);
INSERT INTO public.positions (id, title) VALUES ('05fbb49c-7bf1-4b31-b7db-293ca615eb99', 'Unit Head');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('263847dd-4730-4f7f-90f0-069adcb6eb59', 'Audie M.', 'Fernandez,', 'CPA', '3cdbe894-fbb7-4011-885a-e359bc6103db', '05fbb49c-7bf1-4b31-b7db-293ca615eb99', '0917-234-5604');

-- 5. Bids and Awards Committee (BAC) Secretariat (child of Office of the Mayor)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('4552aace-5afa-4f5f-80bc-ddbdfa74cf49', 'Bids and Awards Committee (BAC) Secretariat', 'BAC-SEC', 'Public procurement logistics, bidding documentation, and RA 9184 compliance monitoring', '27c9d518-7cd2-43f8-9160-ec1ed2b5ac89', 3);
INSERT INTO public.positions (id, title) VALUES ('2a918a95-39d7-41e9-904e-71f2f7264c3f', 'Secretariat Head');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('fa272b16-bd13-44e1-99dc-04c3ed0fe0ee', 'Atty. Manuel', 'T.', 'Cordero', '4552aace-5afa-4f5f-80bc-ddbdfa74cf49', '2a918a95-39d7-41e9-904e-71f2f7264c3f', '0917-234-5602');

-- 6. Human Resource Management Office (child of Mayor)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 'Human Resource Management Office', 'HRMO', 'Personnel Administration, Recruitment, Staff Welfare, and Human Resource Development', '305451c6-aa72-4bf9-9480-5509c8263c23', 2);
INSERT INTO public.positions (id, title) VALUES ('9ce26b8e-fd6e-4038-9513-5fab585a13e1', 'Municipal HRMO Officer');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('ccccbd41-2474-4d1b-bead-1ab978c60ec8', 'Lucia M.', 'Balagtas,', 'DPA', '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', '9ce26b8e-fd6e-4038-9513-5fab585a13e1', '0917-234-5606');

-- 7. Recruitment, Selection & Placement Section (child of HRMO)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('7b469aad-89a0-4cf4-a61d-a31a9542e760', 'Recruitment, Selection & Placement Section', 'RSP', 'Job postings, merit promotion board secretariat, applicant screening, and appointments', '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 1);
INSERT INTO public.positions (id, title) VALUES ('e772be74-b708-4242-84bf-529d58f5e715', 'Section Head');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('96939037-75dc-41a9-97ff-b5bce856b66d', 'Geraldine', 'O.', 'Cruz', '7b469aad-89a0-4cf4-a61d-a31a9542e760', 'e772be74-b708-4242-84bf-529d58f5e715', '0917-234-5607');

-- 8. Training, Learning & Development Section (child of HRMO)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('5fac5874-26ff-421f-a07e-7fd5afa16c40', 'Training, Learning & Development Section', 'L&D', 'Capacity building, staff seminars, performance management (SPMS), and training programs', '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 2);
INSERT INTO public.positions (id, title) VALUES ('6d14ce92-12d6-4a16-a168-a357e9f01e5b', 'Section Head');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('6a05a7df-8d79-45d3-b3e6-0f07b6fde029', 'Paul', 'Vincent', 'Tolentino', '5fac5874-26ff-421f-a07e-7fd5afa16c40', '6d14ce92-12d6-4a16-a168-a357e9f01e5b', '0917-234-5608');

-- 9. Personnel Records & Benefits Unit (child of HRMO)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('017af83c-bf3c-4115-b8b3-1bf866a00824', 'Personnel Records & Benefits Unit', 'PRBU', '201 file records, service cards, leave administration, GSIS, PhilHealth, and Pag-IBIG liaison', '3f023ea1-d5b6-4a6c-a8c8-4d8f1102e9cd', 3);
INSERT INTO public.positions (id, title) VALUES ('d0d85221-cddb-443a-a05f-e4ec1742e2cb', 'Unit Head');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('6161ab7c-34f6-4e44-977f-592baa0334c9', 'Marites', 'E.', 'Gomez', '017af83c-bf3c-4115-b8b3-1bf866a00824', 'd0d85221-cddb-443a-a05f-e4ec1742e2cb', '0917-234-5609');

-- 10. Municipal Health Office (child of Mayor)
INSERT INTO public.departments (id, name, acronym, description, parent_id, order_index) VALUES ('6dfa39d6-63b1-49c4-914e-fb0ee5739b19', 'Municipal Health Office', 'MHO', 'Primary Healthcare Services, Public Health Programs, Sanitation, and Medical Assistance', '305451c6-aa72-4bf9-9480-5509c8263c23', 3);
INSERT INTO public.positions (id, title) VALUES ('caca170e-3fc3-463f-a3cc-9f4899fbb758', 'Municipal Health Officer / MHO Head');
INSERT INTO public.employees (id, first_name, middle_name, last_name, department_id, position_id, contact) VALUES ('a247c29b-1945-4c83-8d57-3ed2d0af3dc5', 'Dr. Alberto K. Sanchez,', 'MD,', 'MPH', '6dfa39d6-63b1-49c4-914e-fb0ee5739b19', 'caca170e-3fc3-463f-a3cc-9f4899fbb758', '0917-234-5610');