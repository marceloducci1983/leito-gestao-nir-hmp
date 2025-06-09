import React, { useState } from 'react';
import LoginScreen from '@/components/LoginScreen';
import NavigationBar from '@/components/NavigationBar';
import BedsPanel from '@/components/BedsPanel';
import ArchivePanel from '@/components/ArchivePanel';
import DischargeMonitoring from '@/components/DischargeMonitoring';
import IndicatorsPanel from '@/components/IndicatorsPanel';
import PlaceholderPanel from '@/components/PlaceholderPanel';
import { Bed, DischargedPatient } from '@/types';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('PAINEL DE LEITOS');
  
  // Central data state that flows from BedsPanel to other modules
  const [centralData, setCentralData] = useState<{
    beds: Bed[];
    archivedPatients: DischargedPatient[];
    dischargeMonitoring: DischargedPatient[];
  }>({
    beds: [],
    archivedPatients: [],
    dischargeMonitoring: []
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('PAINEL DE LEITOS');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDataChange = (data: {
    beds: Bed[];
    archivedPatients: DischargedPatient[];
    dischargeMonitoring: DischargedPatient[];
  }) => {
    setCentralData(data);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'PAINEL DE LEITOS':
        return <BedsPanel onDataChange={handleDataChange} />;
      case 'ARQUIVO':
        return <ArchivePanel archivedPatients={centralData.archivedPatients} />;
      case 'MONITORAMENTO DE ALTAS':
        return <DischargeMonitoring dischargeMonitoring={centralData.dischargeMonitoring} />;
      case 'INDICADORES':
        return (
          <IndicatorsPanel 
            beds={centralData.beds} 
            archivedPatients={centralData.archivedPatients}
          />
        );
      case 'ALTAS PREVISTAS':
        return (
          <PlaceholderPanel
            title="ALTAS PREVISTAS"
            description="Módulo para acompanhamento de pacientes com alta prevista, facilitando o planejamento e gestão de leitos."
          />
        );
      case 'EM TFD':
        return (
          <PlaceholderPanel
            title="EM TFD"
            description="Módulo específico para gerenciamento de pacientes em Tratamento Fora do Domicílio."
          />
        );
      case 'ALERTAS DE INTERVENÇÃO':
        return (
          <PlaceholderPanel
            title="ALERTAS DE INTERVENÇÃO"
            description="Sistema de alertas para situações que requerem intervenção médica ou administrativa urgente."
          />
        );
      case 'NIR':
        return (
          <PlaceholderPanel
            title="NIR"
            description="Módulo do Núcleo Interno de Regulação para gestão de fluxos e regulação de leitos."
          />
        );
      default:
        return <BedsPanel onDataChange={handleDataChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-6">
        {renderActivePanel()}
      </main>
    </div>
  );
};

export default Index;
