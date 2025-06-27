
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavigationBar from '@/components/NavigationBar';
import SupabaseBedsPanel from '@/components/SupabaseBedsPanel';
import IndicatorsPanel from '@/components/IndicatorsPanel';
import DischargeMonitoringPanel from '@/components/DischargeMonitoringPanel';
import ExpectedDischargesPanel from '@/components/ExpectedDischargesPanel';
import AlertsPanel from '@/components/AlertsPanel';
import TfdPanel from '@/components/TfdPanel';
import ArchivePanel from '@/components/ArchivePanel';
import TestingPanel from '@/components/test/TestingPanel';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';

interface IndexProps {
  onLogout?: () => void; // Deprecated, não mais usado
}

const Index: React.FC<IndexProps> = () => {
  const [activeTab, setActiveTab] = useState('beds');
  const [appData, setAppData] = useState({
    beds: [],
    archivedPatients: [],
    dischargeMonitoring: []
  });
  const { isAdmin, signOut } = useAuth();

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  const handleDataChange = (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => {
    setAppData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header com menu do usuário */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Sistema de Gestão de Leitos
            </h1>
            <p className="text-muted-foreground">NIR - HMP</p>
          </div>
          <UserMenu onSettingsClick={handleSettingsClick} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-muted/50">
              <TabsTrigger value="beds" className="text-xs sm:text-sm">Leitos</TabsTrigger>
              <TabsTrigger value="indicators" className="text-xs sm:text-sm">Indicadores</TabsTrigger>
              <TabsTrigger value="discharges" className="text-xs sm:text-sm">Altas</TabsTrigger>
              <TabsTrigger value="expected" className="text-xs sm:text-sm">Previsões</TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs sm:text-sm">Alertas</TabsTrigger>
              <TabsTrigger value="tfd" className="text-xs sm:text-sm">TFD</TabsTrigger>
              <TabsTrigger value="archive" className="text-xs sm:text-sm">Arquivo</TabsTrigger>
              <TabsTrigger value="testing" className="text-xs sm:text-sm">Testes</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="settings" className="text-xs sm:text-sm">Configurações</TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="beds" className="mt-0">
            <SupabaseBedsPanel onDataChange={handleDataChange} />
          </TabsContent>

          <TabsContent value="indicators" className="mt-0">
            <IndicatorsPanel data={appData} />
          </TabsContent>

          <TabsContent value="discharges" className="mt-0">
            <DischargeMonitoringPanel />
          </TabsContent>

          <TabsContent value="expected" className="mt-0">
            <ExpectedDischargesPanel data={appData} />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="tfd" className="mt-0">
            <TfdPanel />
          </TabsContent>

          <TabsContent value="archive" className="mt-0">
            <ArchivePanel archivedPatients={appData.archivedPatients} />
          </TabsContent>

          <TabsContent value="testing" className="mt-0">
            <TestingPanel isOpen={true} onClose={() => setActiveTab('beds')} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="settings" className="mt-0">
              <SettingsPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
