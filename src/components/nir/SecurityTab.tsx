
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';

export const SecurityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Configurações de Segurança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input id="currentPassword" type="password" />
          </div>
          
          <div>
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input id="newPassword" type="password" />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          
          <Button>Alterar Senha</Button>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Logs de Acesso</h4>
          <div className="border rounded-lg max-h-40 overflow-y-auto">
            <div className="p-3 border-b text-sm">
              <p>09/06/2025 14:23 - Login realizado (admin@hospital.com)</p>
            </div>
            <div className="p-3 border-b text-sm">
              <p>09/06/2025 13:45 - Logout realizado (enfermeiro@hospital.com)</p>
            </div>
            <div className="p-3 text-sm">
              <p>09/06/2025 13:15 - Login realizado (enfermeiro@hospital.com)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
