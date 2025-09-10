-- Modificar função para aceitar tipo de alta como parâmetro
CREATE OR REPLACE FUNCTION public.complete_discharge_and_remove_patient(
  p_discharge_id uuid, 
  p_justification text DEFAULT NULL::text,
  p_discharge_type text DEFAULT 'POR MELHORA'::text
)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
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
    -- Mover paciente para tabela de altas com tipo de alta personalizado
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
      p_discharge_type,
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
$function$