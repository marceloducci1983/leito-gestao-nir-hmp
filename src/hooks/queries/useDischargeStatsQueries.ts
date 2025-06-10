
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDischargeStatsByDepartment = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['discharge_stats_department', startDate, endDate],
    queryFn: async () => {
      console.log('Fetching discharge stats by department:', { startDate, endDate });
      
      const { data, error } = await supabase
        .rpc('get_discharge_time_stats_by_department', {
          p_start_date: startDate || null,
          p_end_date: endDate || null
        });

      if (error) {
        console.error('Error fetching discharge stats by department:', error);
        throw error;
      }

      console.log('Discharge stats by department result:', data);
      return data || [];
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 10000, // Considerar dados atuais por 10 segundos
  });
};

export const useDischargeStatsByCity = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['discharge_stats_city', startDate, endDate],
    queryFn: async () => {
      console.log('Fetching discharge stats by city:', { startDate, endDate });
      
      const { data, error } = await supabase
        .rpc('get_discharge_time_stats_by_city', {
          p_start_date: startDate || null,
          p_end_date: endDate || null
        });

      if (error) {
        console.error('Error fetching discharge stats by city:', error);
        throw error;
      }

      console.log('Discharge stats by city result:', data);
      return data || [];
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

export const useDelayedDischarges = () => {
  return useQuery({
    queryKey: ['delayed_discharges'],
    queryFn: async () => {
      console.log('Fetching delayed discharges');
      
      const { data, error } = await supabase
        .rpc('get_delayed_discharges');

      if (error) {
        console.error('Error fetching delayed discharges:', error);
        throw error;
      }

      console.log('Delayed discharges result:', data);
      return data || [];
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

// Nova query para estatísticas gerais de altas
export const useDischargeGeneralStats = () => {
  return useQuery({
    queryKey: ['discharge_general_stats'],
    queryFn: async () => {
      console.log('Fetching general discharge stats');
      
      // Buscar dados de controle de alta
      const { data: dischargeControl, error: dischargeError } = await supabase
        .from('discharge_control')
        .select('*')
        .order('discharge_requested_at', { ascending: false });

      if (dischargeError) {
        console.error('Error fetching discharge control:', dischargeError);
        throw dischargeError;
      }

      // Buscar dados de pacientes com alta
      const { data: patientDischarges, error: patientsError } = await supabase
        .from('patient_discharges')
        .select('*')
        .order('discharge_date', { ascending: false });

      if (patientsError) {
        console.error('Error fetching patient discharges:', patientsError);
        throw patientsError;
      }

      console.log('General discharge stats result:', {
        dischargeControl: dischargeControl?.length || 0,
        patientDischarges: patientDischarges?.length || 0
      });

      return {
        dischargeControl: dischargeControl || [],
        patientDischarges: patientDischarges || []
      };
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
};
