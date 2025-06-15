
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
      console.log('Fetching departments...');
      
      const { data, error } = await supabase.rpc('get_all_departments');

      if (error) {
        console.error('Error fetching departments:', error);
        throw error;
      }

      console.log('Departments fetched:', data);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDepartmentNames = () => {
  const { data: departments, isLoading, error } = useDepartments();
  
  return {
    departmentNames: departments?.map(dept => dept.name) || [],
    isLoading,
    error
  };
};
