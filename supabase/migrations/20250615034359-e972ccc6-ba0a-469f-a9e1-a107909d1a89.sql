
-- Solução definitiva: Remover dependência do ENUM department_type para novos departamentos

-- 1. Adicionar nova coluna TEXT para nomes de departamentos
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS name_text TEXT;

-- 2. Migrar dados existentes do ENUM para TEXT
UPDATE public.departments SET name_text = name::TEXT WHERE name_text IS NULL;

-- 3. Atualizar todas as tabelas que referenciam department para usar TEXT também
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS department_text TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS department_text TEXT;
ALTER TABLE public.bed_reservations ADD COLUMN IF NOT EXISTS department_text TEXT;
ALTER TABLE public.patient_discharges ADD COLUMN IF NOT EXISTS department_text TEXT;
ALTER TABLE public.patient_transfers ADD COLUMN IF NOT EXISTS from_department_text TEXT;
ALTER TABLE public.patient_transfers ADD COLUMN IF NOT EXISTS to_department_text TEXT;
ALTER TABLE public.bed_occupations ADD COLUMN IF NOT EXISTS department_text TEXT;

-- 4. Migrar dados existentes
UPDATE public.beds SET department_text = department::TEXT WHERE department_text IS NULL;
UPDATE public.patients SET department_text = department::TEXT WHERE department_text IS NULL;
UPDATE public.bed_reservations SET department_text = department::TEXT WHERE department_text IS NULL;
UPDATE public.patient_discharges SET department_text = department::TEXT WHERE department_text IS NULL;
UPDATE public.patient_transfers SET from_department_text = from_department::TEXT WHERE from_department_text IS NULL;
UPDATE public.patient_transfers SET to_department_text = to_department::TEXT WHERE to_department_text IS NULL;
UPDATE public.bed_occupations SET department_text = department::TEXT WHERE department_text IS NULL;

-- 5. Recriar função create_department sem dependência de ENUM
CREATE OR REPLACE FUNCTION public.create_department(p_name text, p_description text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  department_id UUID;
BEGIN
  -- Inserir departamento usando campo TEXT
  INSERT INTO public.departments (name_text, description)
  VALUES (UPPER(TRIM(p_name)), p_description)
  RETURNING id INTO department_id;
  
  -- Tentar adicionar ao ENUM para compatibilidade (opcional, pode falhar silenciosamente)
  BEGIN
    IF NOT public.enum_value_exists('department_type', UPPER(TRIM(p_name))) THEN
      EXECUTE format('ALTER TYPE department_type ADD VALUE %L', UPPER(TRIM(p_name)));
      -- Se sucesso, atualizar campo ENUM também
      UPDATE public.departments 
      SET name = UPPER(TRIM(p_name))::department_type 
      WHERE id = department_id;
    END IF;
  EXCEPTION
    WHEN others THEN
      -- Continuar mesmo se falhar - o importante é que temos o TEXT
      RAISE LOG 'Aviso: Falha ao adicionar ao ENUM (normal): %', SQLERRM;
  END;
  
  RETURN department_id;
END;
$$;

-- 6. Atualizar função update_department
CREATE OR REPLACE FUNCTION public.update_department(p_id uuid, p_name text, p_description text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualizar usando campo TEXT
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
      RAISE LOG 'Aviso: Falha ao atualizar ENUM (normal): %', SQLERRM;
  END;
  
  RETURN FOUND;
END;
$$;

-- 7. Atualizar função get_all_departments para usar TEXT
CREATE OR REPLACE FUNCTION public.get_all_departments()
RETURNS TABLE(id uuid, name text, description text, total_beds integer, occupied_beds integer, reserved_beds integer)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    d.id,
    COALESCE(d.name_text, d.name::text) as name,
    d.description,
    d.total_beds,
    d.occupied_beds,
    d.reserved_beds
  FROM public.departments d
  ORDER BY COALESCE(d.name_text, d.name::text);
$$;

-- 8. Criar função para criar leitos usando TEXT
CREATE OR REPLACE FUNCTION public.create_bed(p_name text, p_department text)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  bed_id UUID;
  dept_enum department_type;
BEGIN
  -- Tentar converter para ENUM se possível
  BEGIN
    dept_enum := p_department::department_type;
  EXCEPTION
    WHEN others THEN
      dept_enum := NULL;
  END;
  
  -- Inserir novo leito
  INSERT INTO public.beds (
    name,
    department,
    department_text,
    is_occupied,
    is_reserved,
    is_custom
  ) VALUES (
    p_name,
    dept_enum,
    p_department,
    false,
    false,
    true
  ) RETURNING id INTO bed_id;
  
  RETURN bed_id;
END;
$$;

-- 9. Atualizar função update_bed
CREATE OR REPLACE FUNCTION public.update_bed(p_bed_id uuid, p_name text, p_department text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  dept_enum department_type;
BEGIN
  -- Tentar converter para ENUM se possível
  BEGIN
    dept_enum := p_department::department_type;
  EXCEPTION
    WHEN others THEN
      dept_enum := NULL;
  END;
  
  -- Atualizar leito existente
  UPDATE public.beds 
  SET 
    name = p_name,
    department = dept_enum,
    department_text = p_department,
    updated_at = NOW()
  WHERE id = p_bed_id;
  
  RETURN FOUND;
END;
$$;

-- 10. Atualizar trigger de contadores para usar TEXT
CREATE OR REPLACE FUNCTION public.update_department_bed_counts()
RETURNS TRIGGER AS $$
DECLARE
  dept_name TEXT;
BEGIN
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

-- 11. Garantir permissões
GRANT EXECUTE ON FUNCTION public.create_department(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_department(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_department(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_departments() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_bed(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_bed(uuid, text, text) TO authenticated;
