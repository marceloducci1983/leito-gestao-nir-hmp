
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBedsData = () => {
  return useQuery({
    queryKey: ['beds'],
    queryFn: async () => {
      console.log('Fetching beds data...');
      
      const { data, error } = await supabase
        .from('beds')
        .select(`
          *,
          patients (
            id,
            name,
            sex,
            birth_date,
            age,
            admission_date,
            admission_time,
            diagnosis,
            specialty,
            expected_discharge_date,
            origin_city,
            occupation_days,
            is_tfd,
            tfd_type,
            bed_id,
            department,
            department_text
          ),
          bed_reservations (
            id,
            patient_name,
            origin_clinic,
            diagnosis,
            department,
            department_text
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching beds:', error);
        throw error;
      }

      console.log('Beds data fetched:', data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
