
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Department {
  id: string;
  name: string;
  description: string | null;
  total_beds: number;
  occupied_beds: number;
  reserved_beds: number;
}

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async (): Promise<Department[]> => {
      console.log('🔄 Buscando departamentos do banco...');
      
      const { data, error } = await supabase.rpc('get_all_departments');

      if (error) {
        console.error('❌ Erro ao buscar departamentos:', error);
        throw error;
      }

      console.log('✅ Departamentos carregados:', data?.length, 'registros');
      console.log('📋 Lista de departamentos:', data?.map(d => d.name));
      return data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutos - menor tempo para atualizações mais frequentes
    refetchOnWindowFocus: true, // Recarregar quando a janela receber foco
    refetchOnMount: true, // Sempre recarregar ao montar
  });
};

export const useDepartmentNames = () => {
  const { data: departments, isLoading, error, refetch } = useDepartments();
  
  const departmentNames = departments?.map(dept => dept.name) || [];
  
  console.log('🏷️ Nomes de departamentos extraídos:', departmentNames);
  
  return {
    departmentNames,
    isLoading,
    error,
    refetch
  };
};
