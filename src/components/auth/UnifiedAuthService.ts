import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const signInUser = async (email: string, password: string) => {
  try {
    console.log('🔑 Tentando fazer login com:', email);
    
    // Usar apenas autenticação normal do Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      console.error('❌ Erro de login:', error);
      
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

    console.log('✅ Login realizado com sucesso:', data);
    toast.success('Login realizado com sucesso!');
    return { user: data.user, profile: null, session: data.session, error: null };
  } catch (error) {
    console.error('💥 Erro inesperado no login:', error);
    toast.error('Erro inesperado no login');
    return { user: null, profile: null, session: null, error };
  }
};

export const createUserAsAdmin = async (email: string, password: string, fullName: string, role: 'admin' | 'user' = 'user') => {
  try {
    console.log('🔄 createUserAsAdmin iniciado com:', { email, fullName, role });
    
    // Validações de entrada
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

    console.log('✅ Validações passaram, criando usuário via Admin API...');

    // Usar Admin API para criar usuário com senha definida
    const { data, error } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        full_name: fullName.trim(),
        role: role,
      }
    });

    console.log('📡 Resposta do Admin API:', { data, error });

    if (error) {
      console.error('❌ Erro no Admin API:', error);
      
      if (error.message?.includes('User already registered')) {
        toast.error('Este email já está registrado no sistema');
      } else if (error.message?.includes('Password')) {
        toast.error('Erro na senha: ' + error.message);
      } else if (error.message?.includes('Email')) {
        toast.error('Erro no email: ' + error.message);
      } else {
        toast.error('Erro ao criar usuário: ' + error.message);
      }
      
      return { error };
    }

    if (!data.user) {
      const errorMsg = 'Erro ao criar usuário - dados do usuário não retornados';
      console.error('❌', errorMsg);
      toast.error(errorMsg);
      return { error: { message: errorMsg } };
    }

    console.log('🎉 Usuário criado com sucesso! ID:', data.user.id);
    return { error: null, data };
    
  } catch (error) {
    console.error('💥 Erro inesperado na criação via Admin API:', error);
    const errorMsg = 'Erro inesperado ao criar usuário: ' + (error as Error).message;
    toast.error(errorMsg);
    return { error: { message: errorMsg } };
  }
};

export const signOutUser = async () => {
  try {
    console.log('🔄 Iniciando logout...');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Erro no logout do Supabase:', error);
      toast.error('Erro ao sair: ' + error.message);
      return { error };
    }
    
    console.log('✅ Logout realizado com sucesso');
    toast.success('Logout realizado com sucesso!');
    return { error: null };
    
  } catch (error) {
    console.error('💥 Erro inesperado ao sair:', error);
    toast.error('Erro inesperado ao sair');
    return { error };
  }
};