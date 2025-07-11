
import { useBedsData, useDischargedPatientsData } from '@/hooks/queries/useSupabaseData';
import { useDischargeControl, useDepartmentStats } from '@/hooks/queries/useDischargeQueries';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAddPatient, useDischargePatient, useTransferPatient, useUpdatePatient } from '@/hooks/mutations/usePatientMutations';
import { useAddReservation } from '@/hooks/mutations/useReservationMutations';
import { useRequestDischarge } from '@/hooks/mutations/useDischargeMutations';
import { transformBedsData, transformDischargedPatientsData } from '@/utils/dataTransformers';
import { useMemo } from 'react';

export const useSupabaseBeds = () => {
  const { data: bedsData, isLoading: bedsLoading, error: bedsError } = useBedsData();
  const { data: dischargedData, isLoading: dischargedLoading, error: dischargedError } = useDischargedPatientsData();
  const { data: dischargeControlData, isLoading: dischargeControlLoading } = useDischargeControl();
  const { data: departmentStats, isLoading: statsLoading } = useDepartmentStats();
  
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
    const beds = bedsData ? transformBedsData(bedsData) : [];
    const archivedPatients = dischargedData ? transformDischargedPatientsData(dischargedData) : [];
    const dischargeMonitoring = archivedPatients; // Same data for now
    const dischargeControl = dischargeControlData || [];
    const stats = departmentStats || [];

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
