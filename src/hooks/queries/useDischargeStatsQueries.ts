
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDischargeStatsByDepartment = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['discharge_stats_department', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_discharge_time_stats_by_department', {
          p_start_date: startDate || null,
          p_end_date: endDate || null
        });

      if (error) {
        console.error('Error fetching discharge stats by department:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export const useDischargeStatsByCity = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['discharge_stats_city', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_discharge_time_stats_by_city', {
          p_start_date: startDate || null,
          p_end_date: endDate || null
        });

      if (error) {
        console.error('Error fetching discharge stats by city:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export const useDelayedDischarges = () => {
  return useQuery({
    queryKey: ['delayed_discharges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_delayed_discharges');

      if (error) {
        console.error('Error fetching delayed discharges:', error);
        throw error;
      }

      return data || [];
    }
  });
};
