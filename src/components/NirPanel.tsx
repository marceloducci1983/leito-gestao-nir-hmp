
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { SystemInfoCard } from './nir/SystemInfoCard';
import { GeneralSettingsCard } from './nir/GeneralSettingsCard';
import { AlertsTab } from './nir/AlertsTab';
import { UsersTab } from './nir/UsersTab';
import { BackupTab } from './nir/BackupTab';
import { SecurityTab } from './nir/SecurityTab';

const NirPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    autoBackup: true,
    notifications: true,
    realTimeUpdates: true,
    securityAlerts: true,
    hospitalName: 'Hospital Municipal de Paracatu – Núcleo Interno de Regulação de Leitos (NIR-HMP)',
    adminEmail: 'admin@hospital.com',
    maxStayAlert: 15,
    dischargeTimeLimit: 5,
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    toast.success('Exportação de dados iniciada!');
  };

  const handleBackup = () => {
    toast.success('Backup realizado com sucesso!');
  };

  const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">NIR - Configurações</h1>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <SystemInfoCard />
          <GeneralSettingsCard 
            settings={settings} 
            onSettingsChange={handleSettingsChange} 
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AlertsTab 
            settings={settings} 
            onSettingsChange={handleSettingsChange} 
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UsersTab />
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <BackupTab 
            onBackup={handleBackup}
            onExportData={handleExportData}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NirPanel;
