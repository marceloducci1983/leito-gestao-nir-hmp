
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
      toast.error('Credenciais inválidas');
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
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (error) {
      toast.error('Erro no cadastro: ' + error.message);
      return { error };
    }

    toast.success('Cadastro realizado com sucesso! Verifique seu email.');
    return { error: null };
  } catch (error) {
    toast.error('Erro inesperado no cadastro');
    return { error };
  }
};

export const signOutUser = async () => {
  try {
    // Limpar sessão admin se existir
    clearAdminSession();
    
    // Tentar fazer logout do Supabase também
    const { error } = await supabase.auth.signOut();
    
    toast.success('Logout realizado com sucesso!');
    return { error };
  } catch (error) {
    toast.error('Erro inesperado ao sair');
    return { error };
  }
};
