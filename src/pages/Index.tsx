
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import NavigationBar from '@/components/NavigationBar';
import BottomNavigation from '@/components/BottomNavigation';
import SupabaseBedsPanel from '@/components/SupabaseBedsPanel';
import IndicatorsPanel from '@/components/IndicatorsPanel';
import ExpectedDischargesPanel from '@/components/ExpectedDischargesPanel';
import TfdPanel from '@/components/TfdPanel';
import AlertsPanel from '@/components/AlertsPanel';
import DischargeMonitoringPanel from '@/components/DischargeMonitoringPanel';
import ArchivePanel from '@/components/ArchivePanel';
import NirPanel from '@/components/NirPanel';
import { useResponsive } from '@/hooks/useResponsive';

interface IndexProps {
  onLogout: () => void;
}

const Index: React.FC<IndexProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('beds');
  const [centralData, setCentralData] = useState({
    beds: [],
    archivedPatients: [],
    dischargeMonitoring: []
  });
  
  const { isMobile } = useResponsive();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />
      
      <div className={`container mx-auto ${isMobile ? 'px-0 py-3' : 'px-4 py-6'}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="beds" className="mt-0">
            <SupabaseBedsPanel onDataChange={setCentralData} />
          </TabsContent>
          
          <TabsContent value="indicators" className="mt-0">
            <div className={isMobile ? 'px-4' : ''}>
              <IndicatorsPanel data={centralData} />
            </div>
          </TabsContent>
          
          <TabsContent value="expected-discharges" className="mt-0">
            <div className={isMobile ? 'px-4' : ''}>
              <ExpectedDischargesPanel data={centralData} />
            </div>
          </TabsContent>
          
          <TabsContent value="tfd" className="mt-0">
            <div className={isMobile ? 'px-4' : ''}>
              <TfdPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-0">
            <div className={isMobile ? 'px-4' : ''}>
              <AlertsPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="discharge-monitoring" className="mt-0">
            <div className={isMobile ? 'px-4' : ''}>
              <DischargeMonitoringPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="archive" className="mt-0">
            <div className={isMobile ? 'px-4' : ''}>
              <ArchivePanel archivedPatients={centralData.archivedPatients} />
            </div>
          </TabsContent>
          
          <TabsContent value="nir" className="mt-0">
            <div className={isMobile ? 'px-4' : ''}>
              <NirPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {isMobile && <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />}
      <Toaster />
    </div>
  );
};

export default Index;
