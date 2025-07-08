-- Criar usuário admin de forma mais simples
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'sociocecel@yahoo.com.br',
  crypt('12345678', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User", "role": "admin"}',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'sociocecel@yahoo.com.br'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  is_active,
  created_by
) 
SELECT
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'sociocecel@yahoo.com.br',
  'Admin User',
  'admin'::user_role,
  true,
  '550e8400-e29b-41d4-a716-446655440001'::uuid
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'sociocecel@yahoo.com.br'
);