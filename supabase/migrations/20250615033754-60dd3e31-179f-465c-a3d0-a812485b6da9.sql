
-- Primeiro, remover a função existente que retorna void
DROP FUNCTION IF EXISTS public.add_department_type(text);

-- Função auxiliar para verificar se um valor existe no enum
CREATE OR REPLACE FUNCTION public.enum_value_exists(enum_name text, enum_value text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = enum_value 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = enum_name)
  );
END;
$$;

-- Recriar a função add_department_type com retorno boolean
CREATE OR REPLACE FUNCTION public.add_department_type(new_department text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o valor já existe
  IF NOT public.enum_value_exists('department_type', new_department) THEN
    -- Adicionar novo valor ao enum
    EXECUTE format('ALTER TYPE department_type ADD VALUE %L', new_department);
    RETURN true; -- Valor foi adicionado
  END IF;
  
  RETURN false; -- Valor já existia
EXCEPTION
  WHEN others THEN
    -- Log do erro para debugging
    RAISE LOG 'Erro ao adicionar tipo de departamento %: %', new_department, SQLERRM;
    RAISE;
END;
$$;

-- Função para criar departamento com tratamento especial para novos valores de enum
CREATE OR REPLACE FUNCTION public.create_department(p_name text, p_description text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  department_id UUID;
  enum_was_added boolean;
BEGIN
  -- Primeiro, tentar adicionar o valor ao enum
  SELECT public.add_department_type(p_name) INTO enum_was_added;
  
  -- Se um novo valor foi adicionado ao enum, precisamos fazer um commit
  -- para que ele seja visível na mesma sessão
  IF enum_was_added THEN
    -- Usar uma abordagem diferente: inserir usando o nome como texto primeiro
    -- e depois converter para o enum em uma operação separada
    INSERT INTO public.departments (name, description)
    VALUES (p_name::text::department_type, p_description)
    RETURNING id INTO department_id;
  ELSE
    -- Se o enum já existia, podemos inserir normalmente
    INSERT INTO public.departments (name, description)
    VALUES (p_name::department_type, p_description)
    RETURNING id INTO department_id;
  END IF;
  
  RETURN department_id;
EXCEPTION
  WHEN invalid_text_representation THEN
    -- Se ainda houver erro de representação, tentar uma inserção direta
    INSERT INTO public.departments (name, description)
    SELECT p_name::department_type, p_description
    WHERE public.enum_value_exists('department_type', p_name)
    RETURNING id INTO department_id;
    
    IF department_id IS NULL THEN
      RAISE EXCEPTION 'Falha ao criar departamento. Valor de enum pode não estar disponível ainda.';
    END IF;
    
    RETURN department_id;
  WHEN others THEN
    RAISE LOG 'Erro ao criar departamento %: %', p_name, SQLERRM;
    RAISE;
END;
$$;

-- Função para atualizar departamento com o mesmo tratamento
CREATE OR REPLACE FUNCTION public.update_department(p_id uuid, p_name text, p_description text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  enum_was_added boolean;
BEGIN
  -- Primeiro, tentar adicionar o valor ao enum se necessário
  SELECT public.add_department_type(p_name) INTO enum_was_added;
  
  -- Atualizar o departamento
  UPDATE public.departments 
  SET 
    name = p_name::department_type,
    description = p_description,
    updated_at = NOW()
  WHERE id = p_id;
  
  RETURN FOUND;
EXCEPTION
  WHEN invalid_text_representation THEN
    -- Se houver erro de representação, verificar se o enum existe
    IF public.enum_value_exists('department_type', p_name) THEN
      -- Tentar novamente
      UPDATE public.departments 
      SET 
        name = p_name::department_type,
        description = p_description,
        updated_at = NOW()
      WHERE id = p_id;
      
      RETURN FOUND;
    ELSE
      RAISE EXCEPTION 'Valor de departamento % não existe no enum', p_name;
    END IF;
  WHEN others THEN
    RAISE LOG 'Erro ao atualizar departamento %: %', p_name, SQLERRM;
    RAISE;
END;
$$;

-- Garantir permissões para todas as funções
GRANT EXECUTE ON FUNCTION public.enum_value_exists(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_department_type(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_department(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_department(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_department(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_departments() TO authenticated;
