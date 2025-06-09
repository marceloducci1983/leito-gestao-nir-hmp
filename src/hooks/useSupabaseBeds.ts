
import { useBedsData, useDischargedPatientsData } from '@/hooks/queries/useSupabaseData';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAddPatient, useDischargePatient, useTransferPatient, useUpdatePatient } from '@/hooks/mutations/usePatientMutations';
import { useAddReservation } from '@/hooks/mutations/useReservationMutations';
import { transformBedsData, transformDischargedPatientsData } from '@/utils/dataTransformers';
import { useMemo } from 'react';

export const useSupabaseBeds = () => {
  const { data: bedsData, isLoading: bedsLoading, error: bedsError } = useBedsData();
  const { data: dischargedData, isLoading: dischargedLoading, error: dischargedError } = useDischargedPatientsData();
  
  // Set up real-time subscriptions
  useRealtimeSubscriptions();

  // Get mutation hooks
  const addPatientMutation = useAddPatient();
  const updatePatientMutation = useUpdatePatient();
  const dischargePatientMutation = useDischargePatient();
  const transferPatientMutation = useTransferPatient();
  const addReservationMutation = useAddReservation();

  // Transform and memoize data
  const centralData = useMemo(() => {
    const beds = bedsData ? transformBedsData(bedsData) : [];
    const archivedPatients = dischargedData ? transformDischargedPatientsData(dischargedData) : [];
    const dischargeMonitoring = archivedPatients; // Same data for now

    return {
      beds,
      archivedPatients,
      dischargeMonitoring
    };
  }, [bedsData, dischargedData]);

  return {
    centralData,
    isLoading: bedsLoading || dischargedLoading,
    error: bedsError || dischargedError,
    addPatient: addPatientMutation.mutate,
    updatePatient: updatePatientMutation.mutate,
    dischargePatient: dischargePatientMutation.mutate,
    transferPatient: transferPatientMutation.mutate,
    addReservation: addReservationMutation.mutate
  };
};
