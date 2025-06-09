
-- Criar tabela para controle de investigações de alertas
CREATE TABLE public.alert_investigations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('long_stay', 'readmission')),
  investigated boolean NOT NULL DEFAULT false,
  investigation_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para controle de altas efetivas
CREATE TABLE public.discharge_control (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL,
  patient_name text NOT NULL,
  bed_id text NOT NULL,
  department text NOT NULL,
  discharge_requested_at timestamp with time zone NOT NULL DEFAULT now(),
  discharge_effective_at timestamp with time zone,
  justification text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cancelled', 'completed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar campo hora_admissao na tabela patients
ALTER TABLE public.patients ADD COLUMN admission_time time;

-- Adicionar campo hora_admissao na tabela patient_discharges  
ALTER TABLE public.patient_discharges ADD COLUMN admission_time time;

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.alert_investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discharge_control ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para alert_investigations
CREATE POLICY "Allow all operations on alert_investigations"
ON public.alert_investigations
FOR ALL
USING (true)
WITH CHECK (true);

-- Criar políticas RLS para discharge_control
CREATE POLICY "Allow all operations on discharge_control"
ON public.discharge_control
FOR ALL
USING (true)
WITH CHECK (true);

-- Criar função para calcular reinternações
CREATE OR REPLACE FUNCTION public.get_readmissions_within_30_days()
RETURNS TABLE (
  patient_name text,
  discharge_date date,
  readmission_date date,
  diagnosis text,
  origin_city text,
  days_between integer
) 
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT
    pd.name as patient_name,
    pd.discharge_date,
    p.admission_date as readmission_date,
    pd.diagnosis,
    pd.origin_city,
    (p.admission_date - pd.discharge_date) as days_between
  FROM public.patient_discharges pd
  INNER JOIN public.patients p ON LOWER(pd.name) = LOWER(p.name)
  WHERE p.admission_date > pd.discharge_date
    AND (p.admission_date - pd.discharge_date) <= 30
  ORDER BY pd.discharge_date DESC;
$$;

-- Criar função para atualizar contadores de departamento
CREATE OR REPLACE FUNCTION public.update_department_counters()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Atualizar contadores quando houver mudanças nos leitos
  UPDATE public.departments SET
    total_beds = (SELECT COUNT(*) FROM public.beds WHERE department = COALESCE(NEW.department, OLD.department)),
    occupied_beds = (SELECT COUNT(*) FROM public.beds WHERE department = COALESCE(NEW.department, OLD.department) AND is_occupied = true),
    reserved_beds = (SELECT COUNT(*) FROM public.beds WHERE department = COALESCE(NEW.department, OLD.department) AND is_reserved = true),
    updated_at = now()
  WHERE name = COALESCE(NEW.department, OLD.department);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Criar trigger para atualização automática dos contadores
DROP TRIGGER IF EXISTS update_bed_counts_trigger ON public.beds;
CREATE TRIGGER update_bed_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.beds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_department_counters();
