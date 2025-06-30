
-- Primeiro, vamos verificar e corrigir a estrutura da tabela profiles
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'user'::user_role;

-- Recriar a função handle_new_user com melhor tratamento de erro
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

-- Adicionar uma política RLS mais permissiva para inserção automática
DROP POLICY IF EXISTS "Profile trigger insert policy" ON public.profiles;
CREATE POLICY "Profile trigger insert policy"
ON public.profiles
FOR INSERT
WITH CHECK (true); -- Permitir inserção durante o processo de signup

-- Garantir que as outras políticas existam
DROP POLICY IF EXISTS "Profile select policy" ON public.profiles;
CREATE POLICY "Profile select policy"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR public.is_current_user_admin()
);

DROP POLICY IF EXISTS "Profile update policy" ON public.profiles;
CREATE POLICY "Profile update policy"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id OR public.is_current_user_admin());

DROP POLICY IF EXISTS "Profile admin insert policy" ON public.profiles;
CREATE POLICY "Profile admin insert policy"
ON public.profiles
FOR INSERT
WITH CHECK (public.is_current_user_admin());
