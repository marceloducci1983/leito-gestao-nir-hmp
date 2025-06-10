
-- Criar função para solicitar alta automaticamente
CREATE OR REPLACE FUNCTION public.request_discharge_for_patient(
  p_patient_id UUID,
  p_patient_name TEXT,
  p_bed_id TEXT,
  p_department TEXT
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  discharge_id UUID;
BEGIN
  -- Inserir solicitação de alta
  INSERT INTO public.discharge_control (
    patient_id,
    patient_name,
    bed_id,
    department,
    status,
    discharge_requested_at
  ) VALUES (
    p_patient_id,
    p_patient_name,
    p_bed_id,
    p_department,
    'pending',
    NOW()
  ) RETURNING id INTO discharge_id;
  
  RETURN discharge_id;
END;
$$;

-- Criar função para cancelar alta e devolver paciente ao leito
CREATE OR REPLACE FUNCTION public.cancel_discharge_and_restore_patient(
  p_discharge_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  discharge_record RECORD;
BEGIN
  -- Buscar dados da alta
  SELECT * INTO discharge_record 
  FROM public.discharge_control 
  WHERE id = p_discharge_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Cancelar a alta
  UPDATE public.discharge_control 
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_discharge_id;
  
  RETURN TRUE;
END;
$$;

-- Criar função para completar alta efetiva
CREATE OR REPLACE FUNCTION public.complete_discharge_and_remove_patient(
  p_discharge_id UUID,
  p_justification TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  discharge_record RECORD;
  patient_record RECORD;
  time_diff_hours NUMERIC;
BEGIN
  -- Buscar dados da alta
  SELECT * INTO discharge_record 
  FROM public.discharge_control 
  WHERE id = p_discharge_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Calcular tempo de espera em horas
  time_diff_hours := EXTRACT(EPOCH FROM (NOW() - discharge_record.discharge_requested_at)) / 3600;
  
  -- Se mais de 5 horas e sem justificativa, retornar erro
  IF time_diff_hours > 5 AND (p_justification IS NULL OR TRIM(p_justification) = '') THEN
    RAISE EXCEPTION 'Justificativa obrigatória para altas com mais de 5 horas de espera';
  END IF;
  
  -- Buscar dados do paciente
  SELECT * INTO patient_record 
  FROM public.patients 
  WHERE id = discharge_record.patient_id;
  
  IF FOUND THEN
    -- Mover paciente para tabela de altas
    INSERT INTO public.patient_discharges (
      patient_id,
      name,
      sex,
      birth_date,
      age,
      admission_date,
      discharge_date,
      diagnosis,
      specialty,
      expected_discharge_date,
      origin_city,
      occupation_days,
      actual_stay_days,
      is_tfd,
      tfd_type,
      bed_id,
      department,
      discharge_type,
      admission_time
    ) VALUES (
      patient_record.id,
      patient_record.name,
      patient_record.sex,
      patient_record.birth_date,
      patient_record.age,
      patient_record.admission_date,
      CURRENT_DATE,
      patient_record.diagnosis,
      patient_record.specialty,
      patient_record.expected_discharge_date,
      patient_record.origin_city,
      patient_record.occupation_days,
      EXTRACT(DAY FROM (NOW() - patient_record.admission_date::timestamp)),
      patient_record.is_tfd,
      patient_record.tfd_type,
      discharge_record.bed_id,
      patient_record.department,
      'POR MELHORA',
      patient_record.admission_time
    );
    
    -- Liberar leito
    UPDATE public.beds 
    SET is_occupied = FALSE 
    WHERE id = patient_record.bed_id;
    
    -- Remover paciente da tabela ativa
    DELETE FROM public.patients WHERE id = patient_record.id;
  END IF;
  
  -- Completar alta
  UPDATE public.discharge_control 
  SET 
    status = 'completed',
    discharge_effective_at = NOW(),
    justification = p_justification,
    updated_at = NOW()
  WHERE id = p_discharge_id;
  
  RETURN TRUE;
END;
$$;

-- Criar função para estatísticas de tempo de alta por departamento
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
    ROUND(AVG(EXTRACT(EPOCH FROM (dc.discharge_effective_at - dc.discharge_requested_at)) / 3600)::NUMERIC, 2) as avg_hours,
    COUNT(*) as total_discharges,
    COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (dc.discharge_effective_at - dc.discharge_requested_at)) / 3600 > 5) as delayed_discharges
  FROM public.discharge_control dc
  WHERE dc.status = 'completed' 
    AND dc.discharge_effective_at IS NOT NULL
    AND (p_start_date IS NULL OR dc.discharge_effective_at::DATE >= p_start_date)
    AND (p_end_date IS NULL OR dc.discharge_effective_at::DATE <= p_end_date)
  GROUP BY dc.department
  ORDER BY avg_hours DESC;
$$;

-- Criar função para estatísticas por município
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
    ROUND(AVG(EXTRACT(EPOCH FROM (dc.discharge_effective_at - dc.discharge_requested_at)) / 3600)::NUMERIC, 2) as avg_hours,
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

-- Habilitar realtime para discharge_control
ALTER TABLE public.discharge_control REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discharge_control;
