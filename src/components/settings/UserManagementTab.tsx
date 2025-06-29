
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { AddUserModal } from './AddUserModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active: boolean;
}

export const UserManagementTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Buscando usuários...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários:', error);
        toast.error('Erro ao carregar usuários: ' + error.message);
        return;
      }

      console.log('Usuários carregados:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Erro inesperado ao carregar usuários:', error);
      toast.error('Erro inesperado ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: { email: string; fullName: string; role: 'admin' | 'user' }) => {
    try {
      console.log('Criando usuário:', userData);

      // Verificar se email já existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', userData.email.toLowerCase())
        .single();

      if (existingUser) {
        toast.error('Este email já está em uso por outro usuário');
        return;
      }

      // Gerar senha temporária
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';

      // Usar signUp do Auth Context para criar usuário
      const { signUp } = useAuth();
      const result = await signUp(userData.email, tempPassword, userData.fullName, userData.role);

      if (!result.error) {
        toast.success(`Usuário criado com sucesso! Senha temporária: ${tempPassword}`);
        await fetchUsers();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Erro inesperado ao criar usuário:', error);
      toast.error('Erro inesperado ao criar usuário');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      console.log('Alterando status do usuário:', userId, 'de', currentStatus, 'para', !currentStatus);

      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao alterar status:', error);
        toast.error('Erro ao alterar status do usuário: ' + error.message);
        return;
      }

      toast.success(`Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
      await fetchUsers();
    } catch (error) {
      console.error('Erro inesperado ao alterar status:', error);
      toast.error('Erro inesperado ao alterar status do usuário');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Usuários Cadastrados ({users.length})</h4>
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Usuário
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhum usuário cadastrado
              </div>
            ) : (
              <div className="divide-y">
                {users.map((user) => (
                  <div key={user.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.full_name}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                          disabled={user.id === profile?.id}
                        >
                          {user.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddUserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddUser={handleAddUser}
      />
    </>
  );
};
