
-- Correção definitiva: Tornar coluna ENUM nullable e priorizar TEXT

-- 1. Tornar a coluna name (ENUM) nullable
ALTER TABLE public.departments ALTER COLUMN name DROP NOT NULL;

-- 2. Atualizar função create_department para não depender do ENUM
CREATE OR REPLACE FUNCTION public.create_department(p_name text, p_description text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  department_id UUID;
BEGIN
  -- Inserir departamento usando apenas campo TEXT (sem ENUM)
  INSERT INTO public.departments (name_text, description, name)
  VALUES (UPPER(TRIM(p_name)), p_description, NULL)
  RETURNING id INTO department_id;
  
  -- Tentar adicionar ao ENUM apenas para compatibilidade (silenciosamente)
  BEGIN
    IF NOT public.enum_value_exists('department_type', UPPER(TRIM(p_name))) THEN
      EXECUTE format('ALTER TYPE department_type ADD VALUE %L', UPPER(TRIM(p_name)));
      -- Se bem-sucedido, atualizar campo ENUM
      UPDATE public.departments 
      SET name = UPPER(TRIM(p_name))::department_type 
      WHERE id = department_id;
    ELSE
      -- Se já existe, apenas atualizar
      UPDATE public.departments 
      SET name = UPPER(TRIM(p_name))::department_type 
      WHERE id = department_id;
    END IF;
  EXCEPTION
    WHEN others THEN
      -- Continuar mesmo se falhar - campo TEXT é suficiente
      NULL;
  END;
  
  RETURN department_id;
END;
$$;

-- 3. Atualizar função update_department para priorizar TEXT
CREATE OR REPLACE FUNCTION public.update_department(p_id uuid, p_name text, p_description text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualizar usando campo TEXT primeiro
  UPDATE public.departments 
  SET 
    name_text = UPPER(TRIM(p_name)),
    description = p_description,
    updated_at = NOW()
  WHERE id = p_id;
  
  -- Tentar atualizar ENUM também (opcional)
  BEGIN
    IF public.enum_value_exists('department_type', UPPER(TRIM(p_name))) THEN
      UPDATE public.departments 
      SET name = UPPER(TRIM(p_name))::department_type 
      WHERE id = p_id;
    END IF;
  EXCEPTION
    WHEN others THEN
      -- Continuar mesmo se falhar
      NULL;
  END;
  
  RETURN FOUND;
END;
$$;

-- 4. Atualizar função delete_department para usar TEXT
CREATE OR REPLACE FUNCTION public.delete_department(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  dept_name TEXT;
  bed_count INTEGER;
BEGIN
  -- Buscar o nome do departamento usando TEXT
  SELECT COALESCE(name_text, name::text) INTO dept_name 
  FROM public.departments WHERE id = p_id;
  
  IF dept_name IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se há leitos neste departamento usando TEXT
  SELECT COUNT(*) INTO bed_count 
  FROM public.beds 
  WHERE COALESCE(department_text, department::text) = dept_name;
  
  IF bed_count > 0 THEN
    RAISE EXCEPTION 'Não é possível excluir departamento com leitos associados';
  END IF;
  
  -- Deletar o departamento
  DELETE FROM public.departments WHERE id = p_id;
  
  RETURN FOUND;
END;
$$;

-- 5. Garantir que todos os departamentos existentes tenham name_text
UPDATE public.departments 
SET name_text = name::text 
WHERE name_text IS NULL AND name IS NOT NULL;

-- 6. Atualizar trigger para usar TEXT ao invés de ENUM
CREATE OR REPLACE FUNCTION public.update_department_bed_counts()
RETURNS TRIGGER AS $$
DECLARE
  dept_name TEXT;
BEGIN
  -- Usar TEXT como fonte primária
  dept_name := COALESCE(NEW.department_text, OLD.department_text, NEW.department::TEXT, OLD.department::TEXT);
  
  -- Atualizar contadores para o departamento do leito modificado
  UPDATE public.departments SET
    total_beds = (
      SELECT COUNT(*) FROM public.beds 
      WHERE COALESCE(department_text, department::TEXT) = dept_name
    ),
    occupied_beds = (
      SELECT COUNT(*) FROM public.beds 
      WHERE COALESCE(department_text, department::TEXT) = dept_name AND is_occupied = true
    ),
    reserved_beds = (
      SELECT COUNT(*) FROM public.beds 
      WHERE COALESCE(department_text, department::TEXT) = dept_name AND is_reserved = true
    ),
    updated_at = now()
  WHERE COALESCE(name_text, name::TEXT) = dept_name;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
