
-- Melhorar a função de reinternações para ser case-insensitive
CREATE OR REPLACE FUNCTION public.get_readmissions_within_30_days()
RETURNS TABLE(patient_name text, discharge_date date, readmission_date date, diagnosis text, origin_city text, days_between integer)
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
  INNER JOIN public.patients p ON LOWER(TRIM(pd.name)) = LOWER(TRIM(p.name))
  WHERE p.admission_date > pd.discharge_date
    AND (p.admission_date - pd.discharge_date) <= 30
  ORDER BY pd.discharge_date DESC;
$$;

-- Criar índices para melhor performance se não existirem
CREATE INDEX IF NOT EXISTS idx_discharge_control_status ON public.discharge_control(status);
CREATE INDEX IF NOT EXISTS idx_discharge_control_patient_id ON public.discharge_control(patient_id);
CREATE INDEX IF NOT EXISTS idx_discharge_control_requested_at ON public.discharge_control(discharge_requested_at);

-- Atualizar a função de contagem de departamentos para incluir dados em tempo real
CREATE OR REPLACE FUNCTION public.get_department_stats()
RETURNS TABLE(
  department text,
  total_beds bigint,
  occupied_beds bigint,
  reserved_beds bigint,
  available_beds bigint,
  occupation_rate numeric
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    b.department::text,
    COUNT(*) as total_beds,
    COUNT(*) FILTER (WHERE b.is_occupied = true) as occupied_beds,
    COUNT(*) FILTER (WHERE b.is_reserved = true) as reserved_beds,
    COUNT(*) FILTER (WHERE b.is_occupied = false AND b.is_reserved = false) as available_beds,
    ROUND(
      (COUNT(*) FILTER (WHERE b.is_occupied = true)::numeric / COUNT(*)::numeric) * 100, 2
    ) as occupation_rate
  FROM public.beds b
  GROUP BY b.department
  ORDER BY b.department;
$$;
