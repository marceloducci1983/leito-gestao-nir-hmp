
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import DischargeMonitoringHeader from './discharge-monitoring/DischargeMonitoringHeader';
import PendingDischargesTab from './discharge-monitoring/PendingDischargesTab';
import CombinedDischargesGrid from './discharge-monitoring/CombinedDischargesGrid';
import AnalyticsCharts from './discharge-monitoring/AnalyticsCharts';
import SimplifiedReportsSection from './discharge-monitoring/SimplifiedReportsSection';
import AmbulanceModule from './ambulance/AmbulanceModule';
import DebugInfoCard from './discharge-monitoring/DebugInfoCard';
import { useDischargeMonitoringState } from './discharge-monitoring/DischargeMonitoringState';
import { createEffectiveDischargeHandler } from './discharge-monitoring/DischargeMonitoringLogic';

const DischargeMonitoringPanel: React.FC = () => {
  const {
    justification,
    setJustification,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    dischargeControls,
    combinedDischarges,
    dischargeStatsByDept,
    dischargeStatsByCity,
    delayedDischarges,
    pendingDischarges,
    completedDischarges,
    filteredPendingDischarges,
    isLoading,
    cancelDischargeMutation,
    completeDischargeMutation,
    handleRefreshData
  } = useDischargeMonitoringState();

  const handleEffectiveDischarge = createEffectiveDischargeHandler(
    dischargeControls,
    justification,
    completeDischargeMutation
  );

  const handleJustificationChange = (id: string, value: string) => {
    setJustification(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleRefreshWithToast = () => {
    toast.info('Atualizando dados...');
    handleRefreshData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando monitoramento de altas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DischargeMonitoringHeader
        pendingCount={pendingDischarges.length}
        totalProcessed={combinedDischarges.length}
        onRefresh={handleRefreshWithToast}
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">
            Altas Pendentes ({pendingDischarges.length})
          </TabsTrigger>
          <TabsTrigger value="combined">
            Todas as Altas ({combinedDischarges.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Dashboard Analítico
          </TabsTrigger>
          <TabsTrigger value="reports">
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="ambulance">
            Solicitação de Ambulância
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <PendingDischargesTab
            filteredPendingDischarges={filteredPendingDischarges}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            justification={justification}
            onJustificationChange={handleJustificationChange}
            onCancel={(id) => cancelDischargeMutation.mutate(id)}
            onComplete={handleEffectiveDischarge}
            combinedDischarges={combinedDischarges}
          />
        </TabsContent>

        <TabsContent value="combined" className="space-y-4">
          <CombinedDischargesGrid discharges={combinedDischarges} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DebugInfoCard
            dischargeControls={dischargeControls}
            pendingDischarges={pendingDischarges}
            completedDischarges={completedDischarges}
            combinedDischarges={combinedDischarges}
            dischargeStatsByDept={dischargeStatsByDept}
            dischargeStatsByCity={dischargeStatsByCity}
            delayedDischarges={delayedDischarges}
          />

          <AnalyticsCharts
            dischargeStatsByDept={dischargeStatsByDept}
            dischargeStatsByCity={dischargeStatsByCity}
            delayedDischarges={delayedDischarges}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <SimplifiedReportsSection />
        </TabsContent>

        <TabsContent value="ambulance" className="space-y-4">
          <AmbulanceModule />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DischargeMonitoringPanel;
