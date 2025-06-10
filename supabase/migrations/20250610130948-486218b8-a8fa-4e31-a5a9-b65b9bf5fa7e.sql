
-- Criar função para adicionar novos leitos
CREATE OR REPLACE FUNCTION public.create_bed(
  p_name TEXT,
  p_department TEXT
) RETURNS uuid
LANGUAGE plpgsql
AS $$
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
    p_department::public.department_enum,
    false,
    false,
    true
  ) RETURNING id INTO bed_id;
  
  RETURN bed_id;
END;
$$;

-- Criar função para editar leitos existentes
CREATE OR REPLACE FUNCTION public.update_bed(
  p_bed_id UUID,
  p_name TEXT,
  p_department TEXT
) RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Atualizar leito existente
  UPDATE public.beds 
  SET 
    name = p_name,
    department = p_department::public.department_enum,
    updated_at = NOW()
  WHERE id = p_bed_id;
  
  RETURN FOUND;
END;
$$;
