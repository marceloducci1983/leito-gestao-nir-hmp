-- Criar o tipo ENUM user_role se não existir
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Corrigir a função handle_new_user para usar o tipo correto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log para debugging
  RAISE LOG 'Creating profile for user: %', new.id;
  
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

-- Verificar se o trigger existe e recriá-lo se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();