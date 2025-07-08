-- Criar usuário admin sociocecel@yahoo.com.br (com verificação)
DO $$
DECLARE
  user_id UUID;
  existing_user_id UUID;
BEGIN
  -- Verificar se já existe um usuário com este email
  SELECT id INTO existing_user_id 
  FROM public.profiles 
  WHERE email = 'sociocecel@yahoo.com.br';
  
  -- Se não existir, criar o usuário
  IF existing_user_id IS NULL THEN
    -- Gerar novo UUID
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
    
    RAISE NOTICE 'Usuário admin criado com sucesso: %', user_id;
  ELSE
    RAISE NOTICE 'Usuário já existe com ID: %', existing_user_id;
  END IF;
END $$;