-- Criar usuário admin sociocecel@yahoo.com.br
-- Primeiro, criar uma função temporária para criar o usuário completo
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Gerar UUID para o usuário
  user_id := gen_random_uuid();
  
  -- Inserir usuário na tabela auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    'sociocecel@yahoo.com.br',
    crypt('12345678', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin User","role":"admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );
  
  -- Inserir perfil na tabela profiles
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    created_by
  ) VALUES (
    user_id,
    'sociocecel@yahoo.com.br',
    'Admin User',
    'admin'::user_role,
    true,
    user_id
  );
  
  RAISE LOG 'Usuário admin criado com sucesso: %', user_id;
END;
$$;

-- Executar a função
SELECT create_admin_user();

-- Remover a função temporária
DROP FUNCTION create_admin_user();