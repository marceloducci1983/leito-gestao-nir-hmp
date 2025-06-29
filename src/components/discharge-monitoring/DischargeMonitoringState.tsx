
import { useState } from 'react';
import { useDischargeControl, useDepartmentStats, useCombinedDischarges } from '@/hooks/queries/useDischargeQueries';
import { useCancelDischarge, useCompleteDischarge } from '@/hooks/mutations/useDischargeMutations';
import { useDischargeStatsByDepartment, useDischargeStatsByCity, useDelayedDischarges, useDischargeGeneralStats } from '@/hooks/queries/useDischargeStatsQueries';

export const useDischargeMonitoringState = () => {
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

  const handleRefreshData = () => {
    console.log('🔄 Atualizando dados do monitoramento...');
    refetchDischargeControl();
    refetchCombinedDischarges();
    refetchStatsByDept();
    refetchStatsByCity();
    refetchDelayedDischarges();
    refetchGeneralStats();
  };

  return {
    // State
    justification,
    setJustification,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    
    // Data
    dischargeControls,
    combinedDischarges,
    departmentStats,
    dischargeStatsByDept,
    dischargeStatsByCity,
    delayedDischarges,
    generalStats,
    pendingDischarges,
    completedDischarges,
    filteredPendingDischarges,
    
    // Loading states
    isLoading,
    
    // Mutations
    cancelDischargeMutation,
    completeDischargeMutation,
    
    // Actions
    handleRefreshData
  };
};
