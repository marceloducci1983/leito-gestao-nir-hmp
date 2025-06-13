
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDischargeControl = () => {
  return useQuery({
    queryKey: ['discharge_control'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discharge_control')
        .select(`
          *,
          beds:bed_id (
            name
          )
        `)
        .order('discharge_requested_at', { ascending: false });

      if (error) {
        console.error('Error fetching discharge control:', error);
        throw error;
      }

      // Mapear os dados para incluir o nome do leito corretamente
      const mappedData = data?.map(item => {
        let bed_name = item.bed_id; // Default fallback
        
        // More explicit null check that TypeScript can understand
        if (item.beds !== null && item.beds !== undefined && typeof item.beds === 'object' && 'name' in item.beds) {
          bed_name = (item.beds as { name: string }).name;
        }
        
        return {
          ...item,
          bed_name
        };
      }) || [];

      return mappedData;
    }
  });
};

export const useReadmissions = () => {
  return useQuery({
    queryKey: ['readmissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_readmissions_within_30_days');

      if (error) {
        console.error('Error fetching readmissions:', error);
        throw error;
      }

      return data;
    }
  });
};

export const useDepartmentStats = () => {
  return useQuery({
    queryKey: ['department_stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_department_stats');

      if (error) {
        console.error('Error fetching department stats:', error);
        throw error;
      }

      return data;
    },
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  });
};
