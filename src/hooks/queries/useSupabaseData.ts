
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBedsData = () => {
  return useQuery({
    queryKey: ['beds'],
    queryFn: async () => {
      console.log('🔄 Fetching beds data...');
      
      // First, get all beds
      const { data: bedsData, error: bedsError } = await supabase
        .from('beds')
        .select('*')
        .order('name');

      if (bedsError) {
        console.error('❌ Error fetching beds:', bedsError);
        throw bedsError;
      }

      // Then get all patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*');

      if (patientsError) {
        console.error('❌ Error fetching patients:', patientsError);
        throw patientsError;
      }

      // Get all reservations
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('bed_reservations')
        .select('*');

      if (reservationsError) {
        console.error('❌ Error fetching reservations:', reservationsError);
        throw reservationsError;
      }

      // Combine data manually
      const data = bedsData.map(bed => {
        // Find patients for this bed
        const patients = patientsData.filter(p => p.bed_id === bed.id);
        // Find reservations for this bed
        const bed_reservations = reservationsData.filter(r => r.bed_id === bed.id);
        
        return {
          ...bed,
          patients,
          bed_reservations
        };
      });

      console.log('✅ Beds data combined:', data?.length, 'beds');
      console.log('🔍 Sample bed data:', data?.[0]);
      return data;
    },
    staleTime: 0, // Force immediate refresh
    refetchInterval: 5000, // Auto refresh every 5 seconds
  });
};

export const useDischargedPatientsData = () => {
  return useQuery({
    queryKey: ['discharged-patients'],
    queryFn: async () => {
      console.log('Fetching discharged patients data...');
      
      const { data, error } = await supabase
        .from('patient_discharges')
        .select('*')
        .order('discharge_date', { ascending: false });

      if (error) {
        console.error('Error fetching discharged patients:', error);
        throw error;
      }

      console.log('Discharged patients data fetched:', data?.length, 'records');
      return data;
    },
    staleTime: 0, // Force immediate refresh
  });
};
