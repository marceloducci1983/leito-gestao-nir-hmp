
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateDepartmentData {
  name: string;
  description?: string;
}

interface UpdateDepartmentData {
  id: string;
  name: string;
  description?: string;
}

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateDepartmentData) => {
      console.log('Creating department:', data);
      
      const { data: result, error } = await supabase.rpc('create_department', {
        p_name: data.name.toUpperCase(),
        p_description: data.description || null
      });

      if (error) {
        console.error('Error creating department:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Sucesso",
        description: "Setor criado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Department creation failed:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar setor: " + error.message,
        variant: "destructive",
      });
    }
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateDepartmentData) => {
      console.log('Updating department:', data);
      
      const { data: result, error } = await supabase.rpc('update_department', {
        p_id: data.id,
        p_name: data.name.toUpperCase(),
        p_description: data.description || null
      });

      if (error) {
        console.error('Error updating department:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Sucesso",
        description: "Setor atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Department update failed:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar setor: " + error.message,
        variant: "destructive",
      });
    }
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (departmentId: string) => {
      console.log('Deleting department:', departmentId);
      
      const { data: result, error } = await supabase.rpc('delete_department', {
        p_id: departmentId
      });

      if (error) {
        console.error('Error deleting department:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Sucesso",
        description: "Setor removido com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Department deletion failed:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover setor: " + error.message,
        variant: "destructive",
      });
    }
  });
};
