
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { AddUserModal } from './AddUserModal';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const UsersTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@hospital.com',
      role: 'Administrador'
    },
    {
      id: '2',
      name: 'Enfermeiro',
      email: 'enfermeiro@hospital.com',
      role: 'Enfermeiro'
    }
  ]);

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    // Verificar se email já existe
    if (users.some(user => user.email.toLowerCase() === userData.email.toLowerCase())) {
      toast.error('Este email já está em uso por outro usuário');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...userData
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleEditUser = (userId: string) => {
    // TODO: Implementar edição de usuário
    toast.info('Funcionalidade de edição será implementada em breve');
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast.success('Usuário removido com sucesso!');
  };

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
            <h4 className="font-medium">Usuários Ativos ({users.length})</h4>
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              Adicionar Usuário
            </Button>
          </div>
          
          <div className="border rounded-lg">
            {users.map((user, index) => (
              <div key={user.id} className={`p-4 ${index < users.length - 1 ? 'border-b' : ''}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.role}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
