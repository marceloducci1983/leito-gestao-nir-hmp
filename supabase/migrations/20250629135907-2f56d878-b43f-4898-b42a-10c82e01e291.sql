
-- 1. Remover TODAS as políticas existentes na tabela profiles (incluindo as que podem ter nomes diferentes)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation via trigger" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON public.profiles;

-- 2. Criar funções SECURITY DEFINER para evitar recursão (substituir se já existem)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
$$;

-- 3. Criar políticas RLS usando as funções seguras com nomes únicos
CREATE POLICY "Profile select policy"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR public.is_current_user_admin()
);

CREATE POLICY "Profile update policy"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id OR public.is_current_user_admin());

CREATE POLICY "Profile admin insert policy"
ON public.profiles
FOR INSERT
WITH CHECK (public.is_current_user_admin());

-- 4. Política para inserção automática via trigger
CREATE POLICY "Profile trigger insert policy"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
