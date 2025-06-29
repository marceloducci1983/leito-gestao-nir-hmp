
import { User, Session } from '@supabase/supabase-js';
import { Profile } from './types';

export const ADMIN_USER = {
  email: 'sociocecel@yahooo.com.br',
  password: '12345'
};

export const createAdminSession = (email: string): { user: User; profile: Profile; session: Session } => {
  const adminProfile: Profile = {
    id: 'admin-user-id',
    email: email,
    full_name: 'Administrador Sistema',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    is_active: true
  };

  const adminUser = {
    id: 'admin-user-id',
    email: email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as User;

  const adminSession = {
    access_token: 'admin-token',
    refresh_token: 'admin-refresh',
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    token_type: 'Bearer',
    user: adminUser
  } as Session;

  return { user: adminUser, profile: adminProfile, session: adminSession };
};

export const isAdminUser = (email: string, password: string): boolean => {
  return email.toLowerCase().trim() === ADMIN_USER.email.toLowerCase() && password === ADMIN_USER.password;
};

export const saveAdminSession = (user: User, profile: Profile, session: Session): void => {
  localStorage.setItem('admin_session', JSON.stringify({
    user,
    profile,
    session
  }));
};

export const getStoredAdminSession = (): { user: User; profile: Profile; session: Session } | null => {
  const savedAdminSession = localStorage.getItem('admin_session');
  if (savedAdminSession) {
    return JSON.parse(savedAdminSession);
  }
  return null;
};

export const clearAdminSession = (): void => {
  localStorage.removeItem('admin_session');
};
