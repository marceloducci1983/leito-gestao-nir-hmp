
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDischargeControl = () => {
  return useQuery({
    queryKey: ['discharge_control'],
    queryFn: async () => {
      console.log('🔍 Buscando dados de controle de alta com município...');
      
      // Buscar dados com JOIN para incluir município de origem
      const { data, error } = await supabase
        .from('discharge_control')
        .select(`
          *,
          patients!inner(origin_city)
        `)
        .order('discharge_requested_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar discharge_control:', error);
        throw error;
      }

      console.log('✅ Dados de discharge_control encontrados:', data?.length || 0);
      
      // Retornar os dados com município de origem
      return data?.map(item => ({
        ...item,
        bed_name: item.bed_id, // bed_id já é o nome do leito, não um UUID
        origin_city: item.patients?.origin_city || 'Não informado'
      })) || [];
    }
  });
};

// Melhorar a query para buscar altas combinadas com município consistente
export const useCombinedDischarges = () => {
  return useQuery({
    queryKey: ['combined_discharges'],
    queryFn: async () => {
      console.log('🔍 Buscando altas combinadas com município...');
      
      // Buscar altas diretas da tabela patient_discharges (já tem origin_city)
      const { data: directDischarges, error: directError } = await supabase
        .from('patient_discharges')
        .select('*')
        .order('created_at', { ascending: false });

      if (directError) {
        console.error('❌ Erro ao buscar altas diretas:', directError);
        throw directError;
      }

      // Buscar solicitações de alta com município de origem
      const { data: controlledDischarges, error: controlError } = await supabase
        .from('discharge_control')
        .select(`
          *,
          patients!inner(origin_city)
        `)
        .order('discharge_requested_at', { ascending: false });

      if (controlError) {
        console.error('❌ Erro ao buscar altas controladas:', controlError);
        throw controlError;
      }

      console.log('✅ Altas diretas encontradas:', directDischarges?.length || 0);
      console.log('✅ Altas controladas encontradas:', controlledDischarges?.length || 0);

      // Combinar e normalizar os dados com campos consistentes
      const combined = [
        // Altas diretas (já completadas)
        ...(directDischarges || []).map(discharge => ({
          ...discharge,
          source: 'direct' as const,
          status: 'completed' as const,
          bed_name: discharge.bed_id,
          discharge_requested_at: discharge.created_at,
          discharge_effective_at: discharge.created_at,
          patient_name: discharge.name, // Campo principal para nome
          name: discharge.name, // Campo de backup
          origin_city: discharge.origin_city // Já disponível nas altas diretas
        })),
        // Altas controladas (pendentes e completadas)
        ...(controlledDischarges || []).map(discharge => ({
          ...discharge,
          source: 'controlled' as const,
          bed_name: discharge.bed_id,
          patient_name: discharge.patient_name, // Campo principal para nome
          name: discharge.patient_name, // Campo de backup
          origin_city: discharge.patients?.origin_city || 'Não informado' // Incluir município
        }))
      ];

      // Ordenar por data mais recente (discharge_requested_at ou created_at)
      const sortedCombined = combined.sort((a, b) => {
        const dateA = new Date(a.discharge_requested_at || a.created_at);
        const dateB = new Date(b.discharge_requested_at || b.created_at);
        return dateB.getTime() - dateA.getTime();
      });

      console.log('✅ Total de altas combinadas:', sortedCombined.length);
      return sortedCombined;
    },
    refetchInterval: 5000 // Atualizar a cada 5 segundos para mostrar dados em tempo real
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
