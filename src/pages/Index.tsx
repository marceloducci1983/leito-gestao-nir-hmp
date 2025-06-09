
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import NavigationBar from '@/components/NavigationBar';
import SupabaseBedsPanel from '@/components/SupabaseBedsPanel';
import IndicatorsPanel from '@/components/IndicatorsPanel';
import ExpectedDischargesPanel from '@/components/ExpectedDischargesPanel';
import TfdPanel from '@/components/TfdPanel';
import AlertsPanel from '@/components/AlertsPanel';
import DischargeMonitoringPanel from '@/components/DischargeMonitoringPanel';
import ArchivePanel from '@/components/ArchivePanel';
import NirPanel from '@/components/NirPanel';

const Index = () => {
  const [activeTab, setActiveTab] = useState('beds');
  const [centralData, setCentralData] = useState({
    beds: [],
    archivedPatients: [],
    dischargeMonitoring: []
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="beds" className="mt-0">
            <SupabaseBedsPanel onDataChange={setCentralData} />
          </TabsContent>
          
          <TabsContent value="indicators" className="mt-0">
            <IndicatorsPanel data={centralData} />
          </TabsContent>
          
          <TabsContent value="expected-discharges" className="mt-0">
            <ExpectedDischargesPanel data={centralData} />
          </TabsContent>
          
          <TabsContent value="tfd" className="mt-0">
            <TfdPanel />
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-0">
            <AlertsPanel />
          </TabsContent>
          
          <TabsContent value="discharge-monitoring" className="mt-0">
            <DischargeMonitoringPanel />
          </TabsContent>
          
          <TabsContent value="archive" className="mt-0">
            <ArchivePanel archivedPatients={centralData.archivedPatients} />
          </TabsContent>
          
          <TabsContent value="nir" className="mt-0">
            <NirPanel />
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
