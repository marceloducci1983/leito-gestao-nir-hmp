
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export const UsersTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gerenciamento de Usuários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Usuários Ativos</h4>
          <Button variant="outline">Adicionar Usuário</Button>
        </div>
        
        <div className="border rounded-lg">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Administrador</p>
                <p className="text-sm text-gray-600">admin@hospital.com</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Editar</Button>
                <Button variant="destructive" size="sm">Remover</Button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Enfermeiro</p>
                <p className="text-sm text-gray-600">enfermeiro@hospital.com</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Editar</Button>
                <Button variant="destructive" size="sm">Remover</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
