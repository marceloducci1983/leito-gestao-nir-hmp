
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';

interface GeneralSettingsCardProps {
  settings: {
    hospitalName: string;
    adminEmail: string;
    realTimeUpdates: boolean;
    notifications: boolean;
    autoBackup: boolean;
  };
  onSettingsChange: (newSettings: Partial<GeneralSettingsCardProps['settings']>) => void;
}

export const GeneralSettingsCard: React.FC<GeneralSettingsCardProps> = ({ settings, onSettingsChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações Gerais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="hospitalName">Nome Institucional do Hospital</Label>
            <Input
              id="hospitalName"
              value={settings.hospitalName}
              onChange={(e) => onSettingsChange({ hospitalName: e.target.value })}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Nome completo da instituição para identificação oficial</p>
          </div>
          <div>
            <Label htmlFor="adminEmail">Email do Administrador</Label>
            <Input
              id="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => onSettingsChange({ adminEmail: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Contato responsável pela administração do sistema</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Preferências do Sistema</h4>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="realTimeUpdates" className="font-medium">Atualizações em Tempo Real</Label>
              <p className="text-sm text-gray-600 mt-1">
                Permite que as informações sobre os leitos, pacientes e movimentações sejam atualizadas 
                automaticamente, garantindo maior precisão no controle da ocupação e disponibilidade.
              </p>
            </div>
            <Switch
              id="realTimeUpdates"
              checked={settings.realTimeUpdates}
              onCheckedChange={(checked) => onSettingsChange({ realTimeUpdates: checked })}
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="notifications" className="font-medium">Notificações</Label>
              <p className="text-sm text-gray-600 mt-1">
                Habilita o recebimento de alertas e mensagens do sistema sobre eventos importantes, como novas 
                solicitações de leito, altas médicas, transferências ou intercorrências críticas.
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => onSettingsChange({ notifications: checked })}
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="autoBackup" className="font-medium">Backup Automático</Label>
              <p className="text-sm text-gray-600 mt-1">
                Garante a segurança dos dados com a realização de backups diários de forma automática, 
                evitando perdas de informação em caso de falhas ou incidentes.
              </p>
            </div>
            <Switch
              id="autoBackup"
              checked={settings.autoBackup}
              onCheckedChange={(checked) => onSettingsChange({ autoBackup: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
