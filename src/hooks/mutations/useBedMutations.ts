
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateBedData {
  name: string;
  department: string;
}

interface UpdateBedData {
  bedId: string;
  name: string;
  department: string;
}

export const useCreateBed = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBedData) => {
      console.log('🔄 Criando leito:', data);
      
      const { data: result, error } = await supabase.rpc('create_bed', {
        p_name: data.name,
        p_department: data.department
      });

      if (error) {
        console.error('❌ Erro ao criar leito:', error);
        throw error;
      }

      console.log('✅ Leito criado com sucesso:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['discharged-patients'] });
      queryClient.invalidateQueries({ queryKey: ['discharge-control'] });
      queryClient.invalidateQueries({ queryKey: ['department-stats'] });
      
      toast({
        title: "Sucesso",
        description: "Leito criado com sucesso e totalmente integrado",
      });
    },
    onError: (error: any) => {
      console.error('💥 Falha na criação do leito:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar leito",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateBed = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateBedData) => {
      console.log('🔄 Atualizando leito:', data);
      
      const { data: result, error } = await supabase.rpc('update_bed', {
        p_bed_id: data.bedId,
        p_name: data.name,
        p_department: data.department
      });

      if (error) {
        console.error('❌ Erro ao atualizar leito:', error);
        throw error;
      }

      console.log('✅ Leito atualizado com sucesso:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['discharged-patients'] });
      queryClient.invalidateQueries({ queryKey: ['discharge-control'] });
      queryClient.invalidateQueries({ queryKey: ['department-stats'] });
      
      toast({
        title: "Sucesso",
        description: "Leito atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('💥 Falha na atualização do leito:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar leito",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteBed = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bedId: string) => {
      console.log('🔄 Removendo leito:', bedId);
      
      const { data, error } = await supabase
        .from('beds')
        .delete()
        .eq('id', bedId);

      if (error) {
        console.error('❌ Erro ao remover leito:', error);
        throw error;
      }

      console.log('✅ Leito removido com sucesso');
      return data;
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['discharged-patients'] });
      queryClient.invalidateQueries({ queryKey: ['discharge-control'] });
      queryClient.invalidateQueries({ queryKey: ['department-stats'] });
      
      toast({
        title: "Sucesso",
        description: "Leito removido com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('💥 Falha na remoção do leito:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover leito",
        variant: "destructive",
      });
    }
  });
};
