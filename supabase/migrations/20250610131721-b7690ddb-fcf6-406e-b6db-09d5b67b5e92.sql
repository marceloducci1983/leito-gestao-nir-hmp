
-- Corrigir função create_bed para usar o tipo correto
CREATE OR REPLACE FUNCTION public.create_bed(p_name text, p_department text)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
  bed_id UUID;
BEGIN
  -- Inserir novo leito
  INSERT INTO public.beds (
    name,
    department,
    is_occupied,
    is_reserved,
    is_custom
  ) VALUES (
    p_name,
    p_department::public.department_type,
    false,
    false,
    true
  ) RETURNING id INTO bed_id;
  
  RETURN bed_id;
END;
$function$;

-- Corrigir função update_bed para usar o tipo correto
CREATE OR REPLACE FUNCTION public.update_bed(p_bed_id uuid, p_name text, p_department text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Atualizar leito existente
  UPDATE public.beds 
  SET 
    name = p_name,
    department = p_department::public.department_type,
    updated_at = NOW()
  WHERE id = p_bed_id;
  
  RETURN FOUND;
END;
$function$;
