-- Adicionar campo is_isolation na tabela patients
ALTER TABLE public.patients 
ADD COLUMN is_isolation boolean DEFAULT false;

-- Adicionar campo is_isolation na tabela patient_discharges para manter histórico
ALTER TABLE public.patient_discharges 
ADD COLUMN is_isolation boolean DEFAULT false;

-- Criar função para alternar status de isolamento
CREATE OR REPLACE FUNCTION public.toggle_patient_isolation(p_patient_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  current_isolation boolean;
  new_isolation boolean;
BEGIN
  -- Buscar status atual
  SELECT is_isolation INTO current_isolation 
  FROM public.patients 
  WHERE id = p_patient_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Alternar status
  new_isolation := NOT current_isolation;
  
  -- Atualizar paciente
  UPDATE public.patients 
  SET is_isolation = new_isolation, updated_at = NOW()
  WHERE id = p_patient_id;
  
  RETURN new_isolation;
END;
$function$;