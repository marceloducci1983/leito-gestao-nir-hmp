import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ambulance } from 'lucide-react';
import { useDischargeControl, useDepartmentStats, useCombinedDischarges } from '@/hooks/queries/useDischargeQueries';
import { useCancelDischarge, useCompleteDischarge } from '@/hooks/mutations/useDischargeMutations';
import { useDischargeStatsByDepartment, useDischargeStatsByCity, useDelayedDischarges, useDischargeGeneralStats } from '@/hooks/queries/useDischargeStatsQueries';
import { toast } from 'sonner';
import DischargeMonitoringHeader from './discharge-monitoring/DischargeMonitoringHeader';
import PendingDischargesFilters from './discharge-monitoring/PendingDischargesFilters';
import PendingDischargeCard from './discharge-monitoring/PendingDischargeCard';
import CombinedDischargesGrid from './discharge-monitoring/CombinedDischargesGrid';
import AnalyticsCharts from './discharge-monitoring/AnalyticsCharts';
import SimplifiedReportsSection from './discharge-monitoring/SimplifiedReportsSection';

const DischargeMonitoringPanel: React.FC = () => {
  const [justification, setJustification] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'oldest' | 'newest'>('oldest');

  // Queries - usando tanto a query original quanto a combinada
  const { data: dischargeControls = [], isLoading, refetch: refetchDischargeControl } = useDischargeControl();
  const { data: combinedDischarges = [], refetch: refetchCombinedDischarges } = useCombinedDischarges();
  const { data: departmentStats = [] } = useDepartmentStats();
  const { data: dischargeStatsByDept = [], refetch: refetchStatsByDept } = useDischargeStatsByDepartment();
  const { data: dischargeStatsByCity = [], refetch: refetchStatsByCity } = useDischargeStatsByCity();
  const { data: delayedDischarges = [], refetch: refetchDelayedDischarges } = useDelayedDischarges();
  const { data: generalStats, refetch: refetchGeneralStats } = useDischargeGeneralStats();

  // Mutations
  const cancelDischargeMutation = useCancelDischarge();
  const completeDischargeMutation = useCompleteDischarge();

  console.log('📊 Dados no painel de monitoramento:', {
    dischargeControls: dischargeControls.length,
    combinedDischarges: combinedDischarges.length,
    pendingCount: dischargeControls.filter(d => d.status === 'pending').length
  });

  const pendingDischarges = dischargeControls.filter(d => d.status === 'pending');
  const completedDischarges = dischargeControls.filter(d => d.status === 'completed');

  const filteredPendingDischarges = pendingDischarges
    .filter(discharge =>
      discharge.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discharge.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (discharge.origin_city && discharge.origin_city.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.discharge_requested_at).getTime();
      const dateB = new Date(b.discharge_requested_at).getTime();
      return sortBy === 'oldest' ? dateA - dateB : dateB - dateA;
    });

  const calculateWaitTime = (requestedAt: string) => {
    const requested = new Date(requestedAt);
    const now = new Date();
    const diffMs = now.getTime() - requested.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, isOverdue: hours >= 5 };
  };

  const handleEffectiveDischarge = (id: string) => {
    const discharge = dischargeControls.find(d => d.id === id);
    if (!discharge) return;

    const waitTime = calculateWaitTime(discharge.discharge_requested_at);
    
    if (waitTime.isOverdue && !justification[id]) {
      toast.error('É necessário justificar altas com mais de 5 horas de espera.');
      return;
    }

    completeDischargeMutation.mutate({ 
      dischargeId: id, 
      justification: waitTime.isOverdue ? justification[id] : undefined 
    });
  };

  const handleRefreshData = () => {
    console.log('🔄 Atualizando dados do monitoramento...');
    toast.info('Atualizando dados...');
    refetchDischargeControl();
    refetchCombinedDischarges();
    refetchStatsByDept();
    refetchStatsByCity();
    refetchDelayedDischarges();
    refetchGeneralStats();
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
        onRefresh={handleRefreshData}
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
            Solicitação de Ambulância (em desenvolvimento)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <PendingDischargesFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {filteredPendingDischarges.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Nenhuma alta pendente no momento.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Total de altas processadas hoje: {combinedDischarges.filter(d => 
                    new Date(d.discharge_requested_at || d.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPendingDischarges.map((discharge) => {
                const waitTime = calculateWaitTime(discharge.discharge_requested_at);
                
                return (
                  <PendingDischargeCard
                    key={discharge.id}
                    discharge={discharge}
                    waitTime={waitTime}
                    justification={justification[discharge.id] || ''}
                    onJustificationChange={(value) => setJustification(prev => ({
                      ...prev,
                      [discharge.id]: value
                    }))}
                    onCancel={() => cancelDischargeMutation.mutate(discharge.id)}
                    onComplete={() => handleEffectiveDischarge(discharge.id)}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="combined" className="space-y-4">
          <CombinedDischargesGrid discharges={combinedDischarges} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Debug info para verificar dados */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Controles de Alta:</strong> {dischargeControls.length}</p>
                    <p><strong>Pendentes:</strong> {pendingDischarges.length}</p>
                    <p><strong>Completadas:</strong> {completedDischarges.length}</p>
                  </div>
                  <div>
                    <p><strong>Altas Combinadas:</strong> {combinedDischarges.length}</p>
                    <p><strong>Stats por Dept:</strong> {dischargeStatsByDept.length}</p>
                    <p><strong>Stats por Cidade:</strong> {dischargeStatsByCity.length}</p>
                    <p><strong>Altas Atrasadas:</strong> {delayedDischarges.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <Ambulance className="h-16 w-16 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-700">
                  Solicitação de Ambulância
                </h3>
                <p className="text-gray-500 max-w-md">
                  Esta funcionalidade está em desenvolvimento e em breve permitirá 
                  gerenciar solicitações de ambulância para transporte de pacientes.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    🚧 Em Desenvolvimento
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Funcionalidade será disponibilizada em uma próxima atualização.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DischargeMonitoringPanel;
