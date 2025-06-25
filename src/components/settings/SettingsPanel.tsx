
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagementTab } from './UserManagementTab';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const SettingsPanel: React.FC = () => {
  return (
    <AuthGuard requireAdmin>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Configurações do Sistema</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Gestão de Usuários</TabsTrigger>
            <TabsTrigger value="general">Configurações Gerais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <UserManagementTab />
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <GeneralSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
};
