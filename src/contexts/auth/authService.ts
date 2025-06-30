
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isAdminUser, createAdminSession, saveAdminSession, clearAdminSession } from './adminAuth';

export const signInUser = async (email: string, password: string) => {
  try {
    console.log('Tentando fazer login com:', email);
    
    // Verificar se é o usuário admin hardcoded primeiro
    if (isAdminUser(email, password)) {
      const { user, profile, session } = createAdminSession(email);
      saveAdminSession(user, profile, session);
      toast.success('Login realizado com sucesso!');
      return { user, profile, session, error: null };
    }

    // Para outros usuários, tentar autenticação normal com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      console.error('Erro de login:', error);
      
      // Tratar erros específicos de login
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Por favor, confirme seu email antes de fazer login');
      } else if (error.message?.includes('Too many requests')) {
        toast.error('Muitas tentativas de login. Tente novamente em alguns minutos');
      } else {
        toast.error('Erro no login: ' + error.message);
      }
      
      return { user: null, profile: null, session: null, error };
    }

    console.log('Login realizado com sucesso:', data);
    toast.success('Login realizado com sucesso!');
    return { user: data.user, profile: null, session: data.session, error: null };
  } catch (error) {
    console.error('Erro inesperado no login:', error);
    toast.error('Erro inesperado no login');
    return { user: null, profile: null, session: null, error };
  }
};

export const signUpUser = async (email: string, password: string, fullName: string, role: 'admin' | 'user' = 'user') => {
  try {
    console.log('🔄 signUpUser iniciado com:', { email, fullName, role });
    
    // Validações de entrada mais rigorosas
    if (!email || !password || !fullName) {
      const errorMsg = 'Todos os campos são obrigatórios';
      console.error('❌ Validação falhou:', errorMsg);
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const errorMsg = 'Formato de email inválido';
      console.error('❌ Email inválido:', email);
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    // Validar senha
    if (password.length < 6) {
      const errorMsg = 'Senha deve ter pelo menos 6 caracteres';
      console.error('❌ Senha muito curta:', password.length);
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    // Validar nome completo
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length < 2) {
      const errorMsg = 'Por favor, insira o nome completo (nome e sobrenome)';
      console.error('❌ Nome incompleto:', fullName);
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    console.log('✅ Validações passaram, tentando criar usuário no Supabase...');

    const redirectUrl = `${window.location.origin}/`;
    
    console.log('🔄 Chamando supabase.auth.signUp com:', {
      email: email.trim(),
      passwordLength: password.length,
      fullName: fullName.trim(),
      role,
      redirectUrl
    });

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName.trim(),
          role: role,
        }
      }
    });

    console.log('📡 Resposta do supabase.auth.signUp:', { data, error });

    if (error) {
      console.error('❌ Erro no cadastro do Supabase:', {
        message: error.message,
        status: error.status,
        details: error
      });
      
      // Tratar erros específicos do Supabase
      if (error.message?.includes('User already registered')) {
        toast.error('Este email já está registrado. Tente fazer login ou use outro email.');
      } else if (error.message?.includes('Password should be at least')) {
        toast.error('Senha muito fraca. Use pelo menos 6 caracteres.');
      } else if (error.message?.includes('Unable to validate email address')) {
        toast.error('Email inválido. Verifique o formato do email.');
      } else if (error.message?.includes('Email rate limit exceeded')) {
        toast.error('Limite de emails excedido. Tente novamente em alguns minutos.');
      } else if (error.message?.includes('Database error')) {
        console.error('💥 Erro de banco de dados detectado:', error.message);
        toast.error('Erro no banco de dados. Verifique se o tipo user_role existe.');
      } else {
        toast.error('Erro no cadastro: ' + error.message);
      }
      
      return { error };
    }

    console.log('✅ Usuário cadastrado com sucesso no Supabase:', data);
    
    // Verificar se o usuário foi criado
    if (!data.user) {
      const errorMsg = 'Erro ao criar usuário - dados do usuário não retornados';
      console.error('❌', errorMsg);
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    console.log('🎉 Usuário criado com sucesso! ID:', data.user.id);
    toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
    return { error: null, data };
    
  } catch (error) {
    console.error('💥 Erro inesperado no cadastro:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      error
    });
    const errorMsg = 'Erro inesperado no cadastro: ' + (error as Error).message;
    toast.error(errorMsg);
    return { error: { message: errorMsg } };
  }
};

export const signOutUser = async () => {
  try {
    console.log('Iniciando logout...');
    
    // Limpar sessão admin se existir
    clearAdminSession();
    
    // Tentar fazer logout do Supabase também
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erro no logout do Supabase:', error);
      toast.error('Erro ao sair: ' + error.message);
      return { error };
    }
    
    console.log('Logout realizado com sucesso');
    toast.success('Logout realizado com sucesso!');
    return { error: null };
    
  } catch (error) {
    console.error('Erro inesperado ao sair:', error);
    toast.error('Erro inesperado ao sair');
    return { error };
  }
};
