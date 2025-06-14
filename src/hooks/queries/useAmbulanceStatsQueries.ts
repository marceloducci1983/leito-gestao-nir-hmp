
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAmbulanceStatsByCityAndSector = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['ambulance_stats_by_city_and_sector', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_ambulance_stats_by_city_and_sector', {
        p_start_date: startDate || null,
        p_end_date: endDate || null
      });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useAmbulanceStatsByCity = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['ambulance_stats_by_city', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_ambulance_stats_by_city', {
        p_start_date: startDate || null,
        p_end_date: endDate || null
      });
      
      if (error) throw error;
      return data || [];
    }
  });
};
