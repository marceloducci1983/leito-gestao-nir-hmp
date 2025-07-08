-- Limpar tudo relacionado ao user_role e recriar do zero
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TYPE IF EXISTS user_role CASCADE;

-- Recriar o tipo user_role
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Recriar a função handle_new_user com configurações mais robustas
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
    COALESCE((new.raw_user_meta_data ->> 'role')::public.user_role, 'user'::public.user_role),
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

-- Verificar se a tabela profiles está com as configurações corretas
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'user'::user_role;