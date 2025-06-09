
-- Criar enum para tipos de departamentos
CREATE TYPE department_type AS ENUM (
  'CLINICA MEDICA',
  'PRONTO SOCORRO', 
  'CLINICA CIRURGICA',
  'UTI ADULTO',
  'UTI NEONATAL',
  'PEDIATRIA',
  'MATERNIDADE'
);

-- Criar enum para sexo
CREATE TYPE sex_type AS ENUM ('masculino', 'feminino');

-- Criar enum para tipos de alta
CREATE TYPE discharge_type AS ENUM ('POR MELHORA', 'EVASÃO', 'TRANSFERENCIA', 'OBITO');

-- Tabela de departamentos
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name department_type NOT NULL UNIQUE,
  description TEXT,
  total_beds INTEGER DEFAULT 0,
  occupied_beds INTEGER DEFAULT 0,
  reserved_beds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de leitos
CREATE TABLE public.beds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  department department_type NOT NULL,
  is_occupied BOOLEAN DEFAULT FALSE,
  is_reserved BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, department)
);

-- Tabela de pacientes
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sex sex_type NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER NOT NULL,
  admission_date DATE NOT NULL,
  diagnosis TEXT NOT NULL,
  specialty TEXT,
  expected_discharge_date DATE NOT NULL,
  origin_city TEXT NOT NULL,
  occupation_days INTEGER DEFAULT 0,
  is_tfd BOOLEAN DEFAULT FALSE,
  tfd_type TEXT,
  bed_id UUID REFERENCES public.beds(id) ON DELETE SET NULL,
  department department_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de reservas de leitos
CREATE TABLE public.bed_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  origin_clinic TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  bed_id UUID REFERENCES public.beds(id) ON DELETE CASCADE,
  department department_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de altas de pacientes
CREATE TABLE public.patient_discharges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  name TEXT NOT NULL,
  sex sex_type NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER NOT NULL,
  admission_date DATE NOT NULL,
  discharge_date DATE NOT NULL,
  diagnosis TEXT NOT NULL,
  specialty TEXT,
  expected_discharge_date DATE NOT NULL,
  origin_city TEXT NOT NULL,
  occupation_days INTEGER NOT NULL,
  actual_stay_days INTEGER NOT NULL,
  is_tfd BOOLEAN DEFAULT FALSE,
  tfd_type TEXT,
  bed_id TEXT NOT NULL,
  department department_type NOT NULL,
  discharge_type discharge_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de transferências de pacientes
CREATE TABLE public.patient_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  from_bed_id UUID,
  to_bed_id UUID REFERENCES public.beds(id) ON DELETE SET NULL,
  from_department department_type NOT NULL,
  to_department department_type NOT NULL,
  transfer_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de histórico de ocupação de leitos
CREATE TABLE public.bed_occupations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bed_id UUID REFERENCES public.beds(id) ON DELETE CASCADE,
  patient_id UUID,
  department department_type NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  occupation_type TEXT NOT NULL, -- 'occupied', 'reserved', 'available'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bed_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_discharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bed_occupations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir todas as operações para usuários autenticados por enquanto)
CREATE POLICY "Allow all operations for authenticated users" ON public.departments
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON public.beds
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON public.patients
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON public.bed_reservations
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON public.patient_discharges
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON public.patient_transfers
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON public.bed_occupations
  FOR ALL USING (true);

-- Inserir departamentos iniciais
INSERT INTO public.departments (name, description) VALUES
  ('CLINICA MEDICA', 'Clínica Médica - Internação geral'),
  ('PRONTO SOCORRO', 'Pronto Socorro - Atendimento de emergência'),
  ('CLINICA CIRURGICA', 'Clínica Cirúrgica - Pré e pós operatório'),
  ('UTI ADULTO', 'UTI Adulto - Cuidados intensivos'),
  ('UTI NEONATAL', 'UTI Neonatal - Cuidados intensivos neonatais'),
  ('PEDIATRIA', 'Pediatria - Atendimento infantil'),
  ('MATERNIDADE', 'Maternidade - Obstetrícia e parto');

-- Inserir leitos iniciais para CLINICA MEDICA
INSERT INTO public.beds (name, department_id, department) 
SELECT 
  bed_name,
  d.id,
  'CLINICA MEDICA'
FROM public.departments d,
UNNEST(ARRAY['ISOL', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '4A', '4B',
    '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B',
    '11A', '11B', '12A', '12B', '13A', '13B', '14A', '14B', '14C', '14D',
    '15A', '15B', '15C', '16A', '16B', '16C', '17A', '17B', '17C', '18']) AS bed_name
WHERE d.name = 'CLINICA MEDICA';

-- Inserir leitos iniciais para PRONTO SOCORRO
INSERT INTO public.beds (name, department_id, department) 
SELECT 
  bed_name,
  d.id,
  'PRONTO SOCORRO'
FROM public.departments d,
UNNEST(ARRAY['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '2E',
    '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D',
    '5A', '5B', '5C', 'Isolamento', 'BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', 'BOX-5',
    'CI-1', 'CI-2', 'CI-3', 'CI-4']) AS bed_name
WHERE d.name = 'PRONTO SOCORRO';

-- Inserir leitos iniciais para CLINICA CIRURGICA
INSERT INTO public.beds (name, department_id, department) 
SELECT 
  bed_name,
  d.id,
  'CLINICA CIRURGICA'
FROM public.departments d,
UNNEST(ARRAY['1A – ORTOP', '1B – ORTOP', '1C – ORTOP', '2A – ORTOP', '2B – ORTOP', '2C – ORTOP',
    '3A – ORTOP', '3B – ORTOP', '4A – CIRUR', '4B – CIRUR', '5A – CIRUR', '5B – CIRUR',
    '7A – CIRUR', '7B – CIRUR', '7C – CIRUR', '8A – ORTOP', '8B – ORTOP', '8C – ORTOP',
    '9A – CIRUR', '9B – CIRUR', '9C – CIRUR', '10A – PED', '10B – PED',
    '11A – CIRUR', '11B – CIRUR', '11C – CIRUR', 'Isolamento']) AS bed_name
WHERE d.name = 'CLINICA CIRURGICA';

-- Inserir leitos iniciais para UTI ADULTO
INSERT INTO public.beds (name, department_id, department) 
SELECT 
  bed_name,
  d.id,
  'UTI ADULTO'
FROM public.departments d,
UNNEST(ARRAY['BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', 'BOX-5', 'BOX-6', 'BOX-7', 'BOX-8',
    'BOX-9', 'BOX-10', 'BOX-11', 'BOX-12', 'BOX-13', 'BOX-14', 'BOX-15-ISOL', 'BOX-16-ISOL']) AS bed_name
WHERE d.name = 'UTI ADULTO';

-- Inserir leitos iniciais para UTI NEONATAL
INSERT INTO public.beds (name, department_id, department) 
SELECT 
  bed_name,
  d.id,
  'UTI NEONATAL'
FROM public.departments d,
UNNEST(ARRAY['1A', '1B', '1C', '1D', 'Canguru-2A', 'Canguru-2B', 'Convencional 1', 'Convencional 2']) AS bed_name
WHERE d.name = 'UTI NEONATAL';

-- Inserir leitos iniciais para PEDIATRIA
INSERT INTO public.beds (name, department_id, department) 
SELECT 
  bed_name,
  d.id,
  'PEDIATRIA'
FROM public.departments d,
UNNEST(ARRAY['BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', '1A', '1B', '1C', '1D',
    '2A', '2B', '2C', '2D', '2E', '3A', '3B', '3C', '3D',
    '4A', '4B', '4C', '4D', '5A', '5B', '5C', 'Isolamento']) AS bed_name
WHERE d.name = 'PEDIATRIA';

-- Inserir leitos iniciais para MATERNIDADE
INSERT INTO public.beds (name, department_id, department) 
SELECT 
  bed_name,
  d.id,
  'MATERNIDADE'
FROM public.departments d,
UNNEST(ARRAY['1A', '1B', '2A', '2B', '4A', '4B', '5A', '5B', '6A', '6B',
    '7A', '7B', '9A', '9B', '9C', '10A', '10B', '10C',
    '11A', '11B', '11C', 'ISOL', 'Ind. A', 'Ind. B', 'BOX-A',
    'CI-A', 'CI-B', 'PP-1', 'PP-2', 'PP-3']) AS bed_name
WHERE d.name = 'MATERNIDADE';

-- Função para atualizar contadores de leitos nos departamentos
CREATE OR REPLACE FUNCTION update_department_bed_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contadores para o departamento do leito modificado
  UPDATE public.departments SET
    total_beds = (
      SELECT COUNT(*) FROM public.beds 
      WHERE department = COALESCE(NEW.department, OLD.department)
    ),
    occupied_beds = (
      SELECT COUNT(*) FROM public.beds 
      WHERE department = COALESCE(NEW.department, OLD.department) AND is_occupied = true
    ),
    reserved_beds = (
      SELECT COUNT(*) FROM public.beds 
      WHERE department = COALESCE(NEW.department, OLD.department) AND is_reserved = true
    ),
    updated_at = now()
  WHERE name = COALESCE(NEW.department, OLD.department);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar contadores automaticamente
CREATE TRIGGER update_bed_counts_on_insert
  AFTER INSERT ON public.beds
  FOR EACH ROW EXECUTE FUNCTION update_department_bed_counts();

CREATE TRIGGER update_bed_counts_on_update
  AFTER UPDATE ON public.beds
  FOR EACH ROW EXECUTE FUNCTION update_department_bed_counts();

CREATE TRIGGER update_bed_counts_on_delete
  AFTER DELETE ON public.beds
  FOR EACH ROW EXECUTE FUNCTION update_department_bed_counts();

-- Atualizar contadores iniciais
UPDATE public.departments SET
  total_beds = (
    SELECT COUNT(*) FROM public.beds WHERE beds.department = departments.name
  ),
  occupied_beds = (
    SELECT COUNT(*) FROM public.beds WHERE beds.department = departments.name AND is_occupied = true
  ),
  reserved_beds = (
    SELECT COUNT(*) FROM public.beds WHERE beds.department = departments.name AND is_reserved = true
  );

-- Habilitar realtime para todas as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.departments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.beds;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bed_reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_discharges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_transfers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bed_occupations;

-- Configurar REPLICA IDENTITY FULL para realtime
ALTER TABLE public.departments REPLICA IDENTITY FULL;
ALTER TABLE public.beds REPLICA IDENTITY FULL;
ALTER TABLE public.patients REPLICA IDENTITY FULL;
ALTER TABLE public.bed_reservations REPLICA IDENTITY FULL;
ALTER TABLE public.patient_discharges REPLICA IDENTITY FULL;
ALTER TABLE public.patient_transfers REPLICA IDENTITY FULL;
ALTER TABLE public.bed_occupations REPLICA IDENTITY FULL;
