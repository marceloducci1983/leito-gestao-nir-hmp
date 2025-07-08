
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Edit, Key, Search, Filter } from 'lucide-react';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { profile, signUp } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Buscando usuários...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        toast.error('Erro ao carregar usuários: ' + error.message);
        return;
      }

      console.log('✅ Usuários carregados:', data);
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('💥 Erro inesperado ao carregar usuários:', error);
      toast.error('Erro inesperado ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: { email: string; fullName: string; role: 'admin' | 'user' }) => {
    try {
      setCreatingUser(true);
      console.log('🔄 handleAddUser iniciado com:', userData);

      // Validações de entrada mais rigorosas
      if (!userData.email?.trim() || !userData.fullName?.trim() || !userData.role) {
        console.error('❌ Dados inválidos:', userData);
        toast.error('Todos os campos são obrigatórios');
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email.trim())) {
        console.error('❌ Email inválido:', userData.email);
        toast.error('Formato de email inválido');
        return;
      }

      // Validar nome completo (pelo menos 2 palavras)
      const nameParts = userData.fullName.trim().split(' ');
      if (nameParts.length < 2) {
        console.error('❌ Nome incompleto:', userData.fullName);
        toast.error('Por favor, insira o nome completo (nome e sobrenome)');
        return;
      }

      // Verificar se email já existe usando maybeSingle()
      console.log('🔄 Verificando se email já existe:', userData.email.toLowerCase());
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', userData.email.toLowerCase().trim())
        .maybeSingle();

      if (checkError) {
        console.error('❌ Erro ao verificar email existente:', checkError);
        toast.error('Erro ao verificar email: ' + checkError.message);
        return;
      }

      if (existingUser) {
        console.error('❌ Email já existe:', existingUser);
        toast.error('Este email já está em uso por outro usuário');
        return;
      }

      // Gerar senha temporária mais robusta
      const tempPassword = 'Temp' + Math.random().toString(36).slice(-8) + 'Aa1!';
      console.log('🔑 Senha temporária gerada (comprimento):', tempPassword.length);

      // Criar usuário usando signUp do Auth Context
      console.log('🔄 Chamando signUp com dados validados:', {
        email: userData.email.trim(),
        fullName: userData.fullName.trim(),
        role: userData.role,
        passwordLength: tempPassword.length
      });

      const result = await signUp(userData.email.trim(), tempPassword, userData.fullName.trim(), userData.role);

      console.log('📡 Resultado do signUp:', result);

      if (result.error) {
        console.error('❌ Erro no signUp:', {
          message: result.error.message,
          error: result.error
        });
        
        // Tratar erros específicos
        if (result.error.message?.includes('User already registered')) {
          toast.error('Este email já está registrado no sistema');
        } else if (result.error.message?.includes('Password')) {
          toast.error('Erro na senha: ' + result.error.message);
        } else if (result.error.message?.includes('Email')) {
          toast.error('Erro no email: ' + result.error.message);
        } else if (result.error.message?.includes('Database error')) {
          toast.error('Erro no banco de dados. Verifique se o tipo user_role foi criado corretamente.');
        } else {
          toast.error('Erro ao criar usuário: ' + result.error.message);
        }
        return;
      }

      console.log('🎉 Usuário criado com sucesso!');
      toast.success(`Usuário criado com sucesso! Senha temporária: ${tempPassword}`);
      
      // Recarregar lista de usuários
      await fetchUsers();
      setIsAddModalOpen(false);
      
    } catch (error) {
      console.error('💥 Erro inesperado ao criar usuário:', {
        message: (error as Error).message,
        stack: (error as Error).stack,
        error
      });
      toast.error('Erro inesperado ao criar usuário: ' + (error as Error).message);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      console.log('🔄 Alterando status do usuário:', userId, 'de', currentStatus, 'para', !currentStatus);

      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) {
        console.error('❌ Erro ao alterar status:', error);
        toast.error('Erro ao alterar status do usuário: ' + error.message);
        return;
      }

      toast.success(`Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
      await fetchUsers();
    } catch (error) {
      console.error('💥 Erro inesperado ao alterar status:', error);
      toast.error('Erro inesperado ao alterar status do usuário');
    }
  };

  // Filtrar usuários com base na busca e filtros
  useEffect(() => {
    let filtered = users;

    // Filtro por busca (nome ou email)
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleChangePassword = (user: UserProfile) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h4 className="font-medium">
              Usuários Cadastrados ({filteredUsers.length} de {users.length})
            </h4>
            <Button 
              onClick={() => setIsAddModalOpen(true)} 
              className="flex items-center gap-2"
              disabled={creatingUser}
            >
              <Plus className="h-4 w-4" />
              {creatingUser ? 'Criando...' : 'Adicionar Usuário'}
            </Button>
          </div>

          {/* Filtros de Busca */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Carregando usuários...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {users.length === 0 ? 'Nenhum usuário cadastrado' : 'Nenhum usuário encontrado com os filtros aplicados'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => (
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
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleChangePassword(user)}
                        >
                          <Key className="h-4 w-4 mr-1" />
                          Senha
                        </Button>
                        <Button 
                          variant={user.is_active ? "destructive" : "default"}
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
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddUser={handleAddUser}
      />
      
      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
        onUserUpdated={fetchUsers}
      />
      
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        user={selectedUser}
      />
    </>
  );
};
