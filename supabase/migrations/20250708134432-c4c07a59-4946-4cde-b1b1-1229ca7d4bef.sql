-- Criar usuário admin usando método mais seguro
DO $$
DECLARE
  user_email TEXT := 'sociocecel@yahoo.com.br';
  user_password TEXT := '12345678';
  user_full_name TEXT := 'Admin User';
  new_user_id UUID;
BEGIN
  -- Verificar se o usuário já existe
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = user_email) THEN
    
    -- Gerar um UUID único
    new_user_id := gen_random_uuid();
    
    -- Garantir que o UUID é único (loop até encontrar um único)
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE id = new_user_id) LOOP
      new_user_id := gen_random_uuid();
    END LOOP;
    
    -- Inserir na auth.users primeiro
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      user_email,
      crypt(user_password, gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('full_name', user_full_name, 'role', 'admin'),
      NOW(),
      NOW()
    );
    
    -- Inserir na profiles
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      role,
      is_active,
      created_by
    ) VALUES (
      new_user_id,
      user_email,
      user_full_name,
      'admin'::user_role,
      true,
      new_user_id
    );
    
    RAISE NOTICE 'Usuário admin % criado com sucesso com ID: %', user_email, new_user_id;
  ELSE
    RAISE NOTICE 'Usuário % já existe', user_email;
  END IF;
END $$;