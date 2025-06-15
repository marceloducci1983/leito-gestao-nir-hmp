
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';

interface AlertsTabProps {
  settings: {
    maxStayAlert: number;
    dischargeTimeLimit: number;
    securityAlerts: boolean;
  };
  onSettingsChange: (newSettings: Partial<AlertsTabProps['settings']>) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({ settings, onSettingsChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="maxStayAlert">Alerta de Permanência (dias)</Label>
            <Input
              id="maxStayAlert"
              type="number"
              value={settings.maxStayAlert}
              onChange={(e) => onSettingsChange({ maxStayAlert: parseInt(e.target.value) })}
            />
            <p className="text-sm text-gray-600">Alertar quando paciente permanecer mais que X dias</p>
          </div>
          
          <div>
            <Label htmlFor="dischargeTimeLimit">Limite de Tempo para Alta (horas)</Label>
            <Input
              id="dischargeTimeLimit"
              type="number"
              value={settings.dischargeTimeLimit}
              onChange={(e) => onSettingsChange({ dischargeTimeLimit: parseInt(e.target.value) })}
            />
            <p className="text-sm text-gray-600">Solicitar justificativa após X horas</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="securityAlerts">Alertas de Segurança</Label>
            <p className="text-sm text-gray-600">Notificar sobre tentativas de acesso não autorizado</p>
          </div>
          <Switch
            id="securityAlerts"
            checked={settings.securityAlerts}
            onCheckedChange={(checked) => onSettingsChange({ securityAlerts: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
