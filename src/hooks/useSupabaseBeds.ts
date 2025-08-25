
import { useBedsData, useDischargedPatientsData } from '@/hooks/queries/useSupabaseData';
import { useDischargeControl, useDepartmentStats } from '@/hooks/queries/useDischargeQueries';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAddPatient, useDischargePatient, useTransferPatient, useUpdatePatient } from '@/hooks/mutations/usePatientMutations';
import { useAddReservation } from '@/hooks/mutations/useReservationMutations';
import { useRequestDischarge } from '@/hooks/mutations/useDischargeMutations';
import { transformBedsData, transformDischargedPatientsData } from '@/utils/dataTransformers';
import { useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useSupabaseBeds = () => {
  const queryClient = useQueryClient();
  const { data: bedsData, isLoading: bedsLoading, error: bedsError, refetch: refetchBeds } = useBedsData();
  const { data: dischargedData, isLoading: dischargedLoading, error: dischargedError } = useDischargedPatientsData();
  const { data: dischargeControlData, isLoading: dischargeControlLoading } = useDischargeControl();
  const { data: departmentStats, isLoading: statsLoading } = useDepartmentStats();
  
  // Force cache invalidation on mount to ensure fresh data
  useEffect(() => {
    console.log('🔄 USESUPABASEBEDS - Forçando atualização de cache...');
    console.log('🔍 USESUPABASEBEDS - Estado atual:', {
      bedsLoading,
      bedsError,
      hasBedsData: !!bedsData,
      bedsDataLength: bedsData?.length,
      dischargedLoading,
      dischargedError,
      hasDischargedData: !!dischargedData,
      dischargedDataLength: dischargedData?.length
    });
    
    queryClient.invalidateQueries({ queryKey: ['beds'] });
    queryClient.invalidateQueries({ queryKey: ['discharged-patients'] });
    refetchBeds();
  }, [queryClient, refetchBeds, bedsLoading, bedsError, bedsData, dischargedLoading, dischargedError, dischargedData]);
  
  // Set up real-time subscriptions
  useRealtimeSubscriptions();

  // Get mutation hooks
  const addPatientMutation = useAddPatient();
  const updatePatientMutation = useUpdatePatient();
  const dischargePatientMutation = useDischargePatient();
  const transferPatientMutation = useTransferPatient();
  const addReservationMutation = useAddReservation();
  const requestDischargeMutation = useRequestDischarge();

  // Transform and memoize data
  const centralData = useMemo(() => {
    console.log('🔄 USESUPABASEBEDS - Transformando dados...');
    console.log('🔍 USESUPABASEBEDS - Dados recebidos:', {
      bedsData: bedsData?.length,
      dischargedData: dischargedData?.length,
      dischargeControlData: dischargeControlData?.length,
      departmentStats: departmentStats?.length
    });
    
    const beds = bedsData ? transformBedsData(bedsData) : [];
    const archivedPatients = dischargedData ? transformDischargedPatientsData(dischargedData) : [];
    const dischargeMonitoring = archivedPatients; // Same data for now
    const dischargeControl = dischargeControlData || [];
    const stats = departmentStats || [];

    console.log('✅ USESUPABASEBEDS - Dados transformados:', {
      beds: beds.length,
      totalOccupied: beds.filter(b => b.isOccupied).length,
      totalAvailable: beds.filter(b => !b.isOccupied && !b.isReserved).length,
      totalReserved: beds.filter(b => b.isReserved).length,
      archivedPatients: archivedPatients.length,
      dischargeControl: dischargeControl.length,
      stats: stats.length
    });

    return {
      beds,
      archivedPatients,
      dischargeMonitoring,
      dischargeControl,
      departmentStats: stats
    };
  }, [bedsData, dischargedData, dischargeControlData, departmentStats]);

  // Função addPatient que retorna Promise
  const addPatient = async (data: { bedId: string; patientData: any }) => {
    console.log('🔄 useSupabaseBeds.addPatient chamado com:', data);
    return await addPatientMutation.mutateAsync(data);
  };

  // Função addReservation que retorna Promise
  const addReservation = async (data: { bedId: string; reservation: any }) => {
    console.log('🔄 useSupabaseBeds.addReservation chamado com:', data);
    return await addReservationMutation.mutateAsync(data);
  };

  return {
    centralData,
    isLoading: bedsLoading || dischargedLoading || dischargeControlLoading || statsLoading,
    error: bedsError || dischargedError,
    addPatient,
    updatePatient: updatePatientMutation.mutate,
    dischargePatient: dischargePatientMutation.mutate,
    transferPatient: transferPatientMutation.mutate,
    addReservation,
    requestDischarge: requestDischargeMutation.mutate
  };
};
