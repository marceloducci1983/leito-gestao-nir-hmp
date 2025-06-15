
-- Atualizar função para estatísticas de tempo de alta por departamento
-- Agora calcula baseado em 7h da manhã do dia da solicitação
CREATE OR REPLACE FUNCTION public.get_discharge_time_stats_by_department(
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
) RETURNS TABLE(
  department TEXT,
  avg_hours NUMERIC,
  total_discharges BIGINT,
  delayed_discharges BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    dc.department::TEXT,
    ROUND(AVG(EXTRACT(EPOCH FROM (dc.discharge_effective_at - (DATE_TRUNC('day', dc.discharge_requested_at) + INTERVAL '7 hours'))) / 3600)::NUMERIC, 2) as avg_hours,
    COUNT(*) as total_discharges,
    COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (dc.discharge_effective_at - (DATE_TRUNC('day', dc.discharge_requested_at) + INTERVAL '7 hours'))) / 3600 > 5) as delayed_discharges
  FROM public.discharge_control dc
  WHERE dc.status = 'completed' 
    AND dc.discharge_effective_at IS NOT NULL
    AND (p_start_date IS NULL OR dc.discharge_effective_at::DATE >= p_start_date)
    AND (p_end_date IS NULL OR dc.discharge_effective_at::DATE <= p_end_date)
  GROUP BY dc.department
  ORDER BY avg_hours DESC;
$$;

-- Atualizar função para estatísticas por município
-- Agora calcula baseado em 7h da manhã do dia da solicitação
CREATE OR REPLACE FUNCTION public.get_discharge_time_stats_by_city(
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
) RETURNS TABLE(
  origin_city TEXT,
  avg_hours NUMERIC,
  total_discharges BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    pd.origin_city::TEXT,
    ROUND(AVG(EXTRACT(EPOCH FROM (dc.discharge_effective_at - (DATE_TRUNC('day', dc.discharge_requested_at) + INTERVAL '7 hours'))) / 3600)::NUMERIC, 2) as avg_hours,
    COUNT(*) as total_discharges
  FROM public.discharge_control dc
  JOIN public.patient_discharges pd ON dc.patient_id = pd.patient_id
  WHERE dc.status = 'completed' 
    AND dc.discharge_effective_at IS NOT NULL
    AND (p_start_date IS NULL OR dc.discharge_effective_at::DATE >= p_start_date)
    AND (p_end_date IS NULL OR dc.discharge_effective_at::DATE <= p_end_date)
  GROUP BY pd.origin_city
  ORDER BY avg_hours DESC;
$$;

-- Atualizar função para altas atrasadas
-- Agora calcula baseado em 7h da manhã do dia da solicitação
CREATE OR REPLACE FUNCTION public.get_delayed_discharges()
 RETURNS TABLE(patient_name text, department text, discharge_requested_at timestamp with time zone, discharge_effective_at timestamp with time zone, delay_hours numeric, justification text)
 LANGUAGE sql
 STABLE
AS $$
  SELECT 
    dc.patient_name,
    dc.department,
    dc.discharge_requested_at,
    dc.discharge_effective_at,
    ROUND(
      EXTRACT(EPOCH FROM (dc.discharge_effective_at - (DATE_TRUNC('day', dc.discharge_requested_at) + INTERVAL '7 hours'))) / 3600::numeric, 2
    ) as delay_hours,
    dc.justification
  FROM public.discharge_control dc
  WHERE dc.status = 'completed' 
    AND dc.discharge_effective_at IS NOT NULL
    AND EXTRACT(EPOCH FROM (dc.discharge_effective_at - (DATE_TRUNC('day', dc.discharge_requested_at) + INTERVAL '7 hours'))) / 3600 > 5
  ORDER BY delay_hours DESC;
$$;
