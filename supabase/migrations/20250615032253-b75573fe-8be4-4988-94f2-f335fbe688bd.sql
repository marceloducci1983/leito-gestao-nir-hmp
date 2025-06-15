
-- Função para adicionar novo valor ao enum department_type
CREATE OR REPLACE FUNCTION public.add_department_type(new_department text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Adicionar novo valor ao enum se não existir
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = new_department 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'department_type')
  ) THEN
    EXECUTE format('ALTER TYPE department_type ADD VALUE %L', new_department);
  END IF;
END;
$$;

-- Função para criar departamento
CREATE OR REPLACE FUNCTION public.create_department(p_name text, p_description text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  department_id UUID;
BEGIN
  -- Adicionar o novo tipo de departamento ao enum
  PERFORM public.add_department_type(p_name);
  
  -- Inserir o departamento na tabela
  INSERT INTO public.departments (name, description)
  VALUES (p_name::department_type, p_description)
  RETURNING id INTO department_id;
  
  RETURN department_id;
END;
$$;

-- Função para atualizar departamento
CREATE OR REPLACE FUNCTION public.update_department(p_id uuid, p_name text, p_description text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Adicionar o novo tipo ao enum se necessário
  PERFORM public.add_department_type(p_name);
  
  -- Atualizar o departamento
  UPDATE public.departments 
  SET 
    name = p_name::department_type,
    description = p_description,
    updated_at = NOW()
  WHERE id = p_id;
  
  RETURN FOUND;
END;
$$;

-- Função para deletar departamento (só se não tiver leitos)
CREATE OR REPLACE FUNCTION public.delete_department(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  dept_name department_type;
  bed_count INTEGER;
BEGIN
  -- Buscar o nome do departamento
  SELECT name INTO dept_name FROM public.departments WHERE id = p_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se há leitos neste departamento
  SELECT COUNT(*) INTO bed_count 
  FROM public.beds 
  WHERE department = dept_name;
  
  IF bed_count > 0 THEN
    RAISE EXCEPTION 'Não é possível excluir departamento com leitos associados';
  END IF;
  
  -- Deletar o departamento
  DELETE FROM public.departments WHERE id = p_id;
  
  RETURN FOUND;
END;
$$;

-- Função para listar todos os departamentos
CREATE OR REPLACE FUNCTION public.get_all_departments()
RETURNS TABLE(id uuid, name text, description text, total_beds integer, occupied_beds integer, reserved_beds integer)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    d.id,
    d.name::text,
    d.description,
    d.total_beds,
    d.occupied_beds,
    d.reserved_beds
  FROM public.departments d
  ORDER BY d.name;
$$;
