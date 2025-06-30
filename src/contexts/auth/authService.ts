
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
    console.log('Iniciando cadastro de usuário:', { email, fullName, role });
    
    // Validações de entrada
    if (!email || !password || !fullName) {
      const errorMsg = 'Todos os campos são obrigatórios';
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = 'Formato de email inválido';
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    // Validar senha
    if (password.length < 6) {
      const errorMsg = 'Senha deve ter pelo menos 6 caracteres';
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    console.log('Chamando supabase.auth.signUp com:', {
      email: email.trim(),
      passwordLength: password.length,
      fullName,
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

    if (error) {
      console.error('Erro no cadastro do Supabase:', error);
      
      // Tratar erros específicos do Supabase
      if (error.message?.includes('User already registered')) {
        toast.error('Este email já está registrado. Tente fazer login ou use outro email.');
      } else if (error.message?.includes('Password should be at least')) {
        toast.error('Senha muito fraca. Use pelo menos 6 caracteres.');
      } else if (error.message?.includes('Unable to validate email address')) {
        toast.error('Email inválido. Verifique o formato do email.');
      } else if (error.message?.includes('Email rate limit exceeded')) {
        toast.error('Limite de emails excedido. Tente novamente em alguns minutos.');
      } else if (error.message?.includes('Database error saving new user')) {
        toast.error('Erro interno do banco de dados. Tente novamente.');
      } else {
        toast.error('Erro no cadastro: ' + error.message);
      }
      
      return { error };
    }

    console.log('Usuário cadastrado com sucesso no Supabase:', data);
    
    // Verificar se o usuário foi criado
    if (!data.user) {
      const errorMsg = 'Erro ao criar usuário - dados do usuário não retornados';
      console.error(errorMsg);
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
    return { error: null, data };
    
  } catch (error) {
    console.error('Erro inesperado no cadastro:', error);
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
