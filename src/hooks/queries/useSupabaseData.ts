
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBedsData = () => {
  return useQuery({
    queryKey: ['beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beds')
        .select(`
          *,
          patients(*),
          bed_reservations(*)
        `)
        .order('department')
        .order('name');

      if (error) throw error;
      return data;
    }
  });
};

export const useDischargedPatientsData = () => {
  return useQuery({
    queryKey: ['patient_discharges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patient_discharges')
        .select('*')
        .order('discharge_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};
