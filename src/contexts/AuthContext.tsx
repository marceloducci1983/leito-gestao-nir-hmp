
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthContextType, Profile } from './auth/types';
import { signInUser, createUserAsAdmin, signOutUser } from '../components/auth/UnifiedAuthService';
import { fetchProfile, updateUserProfile } from './auth/profileService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'admin' && profile?.is_active === true;

  const signIn = async (email: string, password: string) => {
    const result = await signInUser(email, password);
    
    if (!result.error) {
      setUser(result.user);
      setProfile(result.profile);
      setSession(result.session);
    }
    
    return { error: result.error };
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'user' = 'user') => {
    return await createUserAsAdmin(email, password, fullName, role);
  };

  const createUser = async (email: string, password: string, fullName: string, role: 'admin' | 'user' = 'user') => {
    return await createUserAsAdmin(email, password, fullName, role);
  };

  const signOut = async () => {
    const result = await signOutUser();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    const result = await updateUserProfile(user.id, updates);
    
    if (!result.error && result.data) {
      setProfile(result.data);
      toast.success('Perfil atualizado com sucesso!');
    } else {
      toast.error('Erro ao atualizar perfil: ' + result.error?.message);
    }
    
    return result;
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initAuth = async () => {
      console.log('🔄 Iniciando autenticação...');
      
      try {
        // Timeout de segurança para evitar loading infinito
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Timeout de segurança ativado - forçando fim do loading');
            setLoading(false);
          }
        }, 10000);

        // Configurar listener de autenticação PRIMEIRO
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('🔄 Auth state changed:', event, session?.user?.email);
            
            // Atualizar estados básicos sincronamente
            setSession(session);
            setUser(session?.user ?? null);
            
            // Buscar perfil em background se usuário logado
            if (session?.user) {
              console.log('👤 Buscando perfil do usuário...');
              fetchProfile(session.user.id)
                .then(userProfile => {
                  if (mounted) {
                    console.log('✅ Perfil carregado:', userProfile?.role);
                    setProfile(userProfile);
                  }
                })
                .catch(error => {
                  console.error('❌ Erro ao buscar perfil:', error);
                  if (mounted) {
                    setProfile(null);
                  }
                })
                .finally(() => {
                  if (mounted) {
                    setLoading(false);
                    clearTimeout(timeoutId);
                  }
                });
            } else {
              console.log('🚪 Usuário não logado - limpando dados');
              if (mounted) {
                setProfile(null);
                setLoading(false);
                clearTimeout(timeoutId);
              }
            }
          }
        );

        // Verificar sessão inicial DEPOIS do listener
        console.log('🔍 Verificando sessão inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          if (mounted) {
            setLoading(false);
            clearTimeout(timeoutId);
          }
          return;
        }

        if (!mounted) return;
        
        console.log('📊 Sessão inicial:', session ? 'encontrada' : 'não encontrada');
        
        // Se não há sessão, finalizar loading imediatamente
        if (!session) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
        // Se há sessão, o listener cuidará do resto

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('💥 Erro na inicialização da autenticação:', error);
        if (mounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const value = {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    updateProfile,
    createUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
