
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const GeneralSettingsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações Gerais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Sistema de Autenticação</h4>
            <p className="text-sm text-gray-600">
              O sistema está configurado com autenticação baseada em email e senha.
              Apenas administradores podem criar novos usuários.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Informações do Sistema</h4>
            <p className="text-sm text-gray-600">
              Sistema de Gestão de Leitos NIR-HMP<br />
              Versão: 2.0.0<br />
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
