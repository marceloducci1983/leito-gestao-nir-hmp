
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAmbulanceRequests = () => {
  return useQuery({
    queryKey: ['ambulance_requests'],
    queryFn: async () => {
      console.log('🚑 Buscando solicitações de ambulância...');
      const { data, error } = await supabase
        .from('ambulance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar solicitações:', error);
        throw error;
      }
      
      console.log('✅ Solicitações encontradas:', data?.length);
      return data || [];
    }
  });
};

export const useMGCities = () => {
  return useQuery({
    queryKey: ['mg_cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mg_cities')
        .select('name')
        .order('name');
      
      if (error) throw error;
      return data?.map(city => city.name) || [];
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
