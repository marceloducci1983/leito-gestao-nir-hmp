
-- Corrigir função add_department_type para usar SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.add_department_type(new_department text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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
EXCEPTION
  WHEN others THEN
    -- Log do erro para debugging
    RAISE LOG 'Erro ao adicionar tipo de departamento %: %', new_department, SQLERRM;
    -- Re-raise o erro para que a aplicação possa tratá-lo
    RAISE;
END;
$$;

-- Corrigir função create_department para melhor tratamento de erros
CREATE OR REPLACE FUNCTION public.create_department(p_name text, p_description text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
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
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Erro ao criar departamento %: %', p_name, SQLERRM;
    RAISE;
END;
$$;

-- Corrigir função update_department para melhor tratamento de erros
CREATE OR REPLACE FUNCTION public.update_department(p_id uuid, p_name text, p_description text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Erro ao atualizar departamento %: %', p_name, SQLERRM;
    RAISE;
END;
$$;

-- Garantir que as funções tenham as permissões corretas
GRANT EXECUTE ON FUNCTION public.add_department_type(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_department(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_department(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_department(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_departments() TO authenticated;
