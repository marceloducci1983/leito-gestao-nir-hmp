
-- Criar tabela para intervenções TFD
CREATE TABLE public.tfd_interventions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL,
  intervention_type text NOT NULL CHECK (intervention_type IN ('EMAIL', 'LIGACAO', 'WPP', 'PLANO_DE_SAUDE', 'OUTROS')),
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para arquivos TFD
CREATE TABLE public.tfd_archives (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL,
  patient_name text NOT NULL,
  patient_data jsonb NOT NULL,
  interventions jsonb,
  archived_at timestamp with time zone NOT NULL DEFAULT now(),
  archived_by text
);

-- Melhorar tabela alert_investigations para reinternações
ALTER TABLE public.alert_investigations 
ADD COLUMN investigation_status text CHECK (investigation_status IN ('investigated', 'not_investigated', 'pending')) DEFAULT 'pending',
ADD COLUMN investigation_notes text,
ADD COLUMN investigated_by text,
ADD COLUMN investigated_at timestamp with time zone;

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.tfd_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tfd_archives ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para tfd_interventions
CREATE POLICY "Allow all operations on tfd_interventions"
ON public.tfd_interventions
FOR ALL
USING (true)
WITH CHECK (true);

-- Criar políticas RLS para tfd_archives
CREATE POLICY "Allow all operations on tfd_archives"
ON public.tfd_archives
FOR ALL
USING (true)
WITH CHECK (true);

-- Criar função para calcular tempo médio de alta por departamento
CREATE OR REPLACE FUNCTION public.get_average_discharge_time_by_department()
RETURNS TABLE (
  department text,
  avg_discharge_time_hours numeric,
  total_discharges bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    dc.department::text,
    ROUND(
      AVG(EXTRACT(EPOCH FROM (dc.discharge_effective_at - dc.discharge_requested_at)) / 3600)::numeric, 2
    ) as avg_discharge_time_hours,
    COUNT(*) as total_discharges
  FROM public.discharge_control dc
  WHERE dc.status = 'completed' 
    AND dc.discharge_effective_at IS NOT NULL
  GROUP BY dc.department
  ORDER BY avg_discharge_time_hours DESC;
$$;

-- Criar função para buscar altas com mais de 5 horas
CREATE OR REPLACE FUNCTION public.get_delayed_discharges()
RETURNS TABLE (
  patient_name text,
  department text,
  discharge_requested_at timestamp with time zone,
  discharge_effective_at timestamp with time zone,
  delay_hours numeric,
  justification text
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    dc.patient_name,
    dc.department,
    dc.discharge_requested_at,
    dc.discharge_effective_at,
    ROUND(
      EXTRACT(EPOCH FROM (dc.discharge_effective_at - dc.discharge_requested_at)) / 3600::numeric, 2
    ) as delay_hours,
    dc.justification
  FROM public.discharge_control dc
  WHERE dc.status = 'completed' 
    AND dc.discharge_effective_at IS NOT NULL
    AND EXTRACT(EPOCH FROM (dc.discharge_effective_at - dc.discharge_requested_at)) / 3600 > 5
  ORDER BY delay_hours DESC;
$$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_tfd_interventions_patient_id ON public.tfd_interventions(patient_id);
CREATE INDEX IF NOT EXISTS idx_tfd_archives_patient_name ON public.tfd_archives USING gin(to_tsvector('portuguese', patient_name));
CREATE INDEX IF NOT EXISTS idx_alert_investigations_patient_id ON public.alert_investigations(patient_id);
CREATE INDEX IF NOT EXISTS idx_discharge_control_status ON public.discharge_control(status);
CREATE INDEX IF NOT EXISTS idx_discharge_control_department ON public.discharge_control(department);
