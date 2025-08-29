-- Permitir NULL no campo expected_discharge_date da tabela patients
ALTER TABLE public.patients ALTER COLUMN expected_discharge_date DROP NOT NULL;

-- Também permitir NULL na tabela patient_discharges para consistência
ALTER TABLE public.patient_discharges ALTER COLUMN expected_discharge_date DROP NOT NULL;