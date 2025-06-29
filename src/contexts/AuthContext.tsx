
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthContextType, Profile } from './auth/types';
import { signInUser, signUpUser, signOutUser } from './auth/authService';
import { fetchProfile, updateUserProfile } from './auth/profileService';
import { getStoredAdminSession } from './auth/adminAuth';

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
    return await signUpUser(email, password, fullName, role);
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

    const initAuth = async () => {
      try {
        // Verificar se existe sessão admin salva
        const savedAdminSession = getStoredAdminSession();
        if (savedAdminSession) {
          const { user: adminUser, profile: adminProfile, session: adminSession } = savedAdminSession;
          if (mounted) {
            setUser(adminUser);
            setProfile(adminProfile);
            setSession(adminSession);
            setLoading(false);
          }
          return;
        }

        // Configurar listener de autenticação para usuários normais
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event, session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
              // Buscar perfil do usuário
              const userProfile = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(userProfile);
              }
            } else {
              if (mounted) {
                setProfile(null);
              }
            }

            if (mounted) {
              setLoading(false);
            }
          }
        );

        // Verificar sessão inicial
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profile);
            setLoading(false);
          }
        } else {
          if (mounted) {
            setLoading(false);
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
