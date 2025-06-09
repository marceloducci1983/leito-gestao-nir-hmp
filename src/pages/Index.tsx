
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BedsManagement from '@/components/BedsManagement';
import IndicatorsPanel from '@/components/IndicatorsPanel';
import ExpectedDischargesPanel from '@/components/ExpectedDischargesPanel';
import ArchivePanel from '@/components/ArchivePanel';
import DischargeMonitoring from '@/components/DischargeMonitoring';

const Index = () => {
  const [centralData, setCentralData] = useState({
    beds: [],
    archivedPatients: [],
    dischargeMonitoring: []
  });

  const handleDataChange = (data: any) => {
    setCentralData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Gestão Hospitalar
          </h1>
          <p className="text-gray-600">
            Gestão completa de leitos, pacientes e indicadores hospitalares
          </p>
        </div>

        <Tabs defaultValue="gestao-leitos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="gestao-leitos">Gestão de Leitos</TabsTrigger>
            <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
            <TabsTrigger value="altas-previstas">Altas Previstas</TabsTrigger>
            <TabsTrigger value="arquivo">Arquivo</TabsTrigger>
            <TabsTrigger value="monitoramento">Monitoramento</TabsTrigger>
          </TabsList>

          <TabsContent value="gestao-leitos" className="space-y-6">
            <BedsManagement onDataChange={handleDataChange} />
          </TabsContent>

          <TabsContent value="indicadores" className="space-y-6">
            <IndicatorsPanel data={centralData} />
          </TabsContent>

          <TabsContent value="altas-previstas" className="space-y-6">
            <ExpectedDischargesPanel data={centralData} />
          </TabsContent>

          <TabsContent value="arquivo" className="space-y-6">
            <ArchivePanel archivedPatients={centralData.archivedPatients} />
          </TabsContent>

          <TabsContent value="monitoramento" className="space-y-6">
            <DischargeMonitoring dischargeMonitoring={centralData.dischargeMonitoring} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
