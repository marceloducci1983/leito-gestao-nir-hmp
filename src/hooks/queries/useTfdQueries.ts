
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTfdInterventions = (patientId?: string) => {
  return useQuery({
    queryKey: ['tfd_interventions', patientId],
    queryFn: async () => {
      let query = supabase
        .from('tfd_interventions')
        .select('*')
        .order('created_at', { ascending: false });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar intervenções TFD:', error);
        throw error;
      }

      return data;
    },
    enabled: !!patientId
  });
};

export const useTfdArchives = () => {
  return useQuery({
    queryKey: ['tfd_archives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tfd_archives')
        .select('*')
        .order('archived_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar arquivos TFD:', error);
        throw error;
      }

      return data;
    }
  });
};

export const useAverageDischargeTime = () => {
  return useQuery({
    queryKey: ['average_discharge_time'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_average_discharge_time_by_department');

      if (error) {
        console.error('Erro ao buscar tempo médio de alta:', error);
        throw error;
      }

      return data;
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
        console.error('Erro ao buscar altas atrasadas:', error);
        throw error;
      }

      return data;
    }
  });
};
