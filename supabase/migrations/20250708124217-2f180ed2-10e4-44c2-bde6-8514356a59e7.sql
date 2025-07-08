-- Primeiro, limpar triggers e funções
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Verificar se user_role existe e recriá-lo se necessário
DO $$ BEGIN
    -- Tentar criar o tipo se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        -- Tipo já existe, continuar
        NULL;
END $$;

-- Recriar a função handle_new_user com configurações robustas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log para debugging
  RAISE LOG 'Creating profile for user: %', new.id;
  
  -- Inserir perfil do usuário
  INSERT INTO public.profiles (id, email, full_name, role, created_by)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data ->> 'role')::user_role, 'user'::user_role),
    COALESCE((new.raw_user_meta_data ->> 'created_by')::uuid, new.id)
  );
  
  RAISE LOG 'Profile created successfully for user: %', new.id;
  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
    RAISE;
END;
$$;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();