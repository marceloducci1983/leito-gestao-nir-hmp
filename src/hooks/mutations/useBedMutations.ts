
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
      console.log('🔄 [MUTATION] Iniciando criação de leito:', data);
      
      // Validar dados de entrada
      if (!data.name || !data.department) {
        console.error('❌ [MUTATION] Dados inválidos:', data);
        throw new Error('Nome do leito e departamento são obrigatórios');
      }

      console.log('⚡ [MUTATION] Chamando função create_bed no Supabase...');
      const { data: result, error } = await supabase.rpc('create_bed', {
        p_name: data.name.trim(),
        p_department: data.department
      });

      if (error) {
        console.error('❌ [MUTATION] Erro do Supabase:', error);
        throw new Error(`Erro ao criar leito: ${error.message}`);
      }

      if (!result) {
        console.error('❌ [MUTATION] Função retornou resultado vazio');
        throw new Error('Erro interno: função não retornou ID do leito');
      }

      console.log('✅ [MUTATION] Leito criado com sucesso! ID:', result);
      return result;
    },
    onSuccess: (bedId, variables) => {
      console.log('🎉 [MUTATION] onSuccess executado para leito:', bedId);
      
      // Invalidar múltiplas queries para garantir sincronização completa
      const queriesToInvalidate = [
        { queryKey: ['beds'] },
        { queryKey: ['departments'] },
        { queryKey: ['department-stats'] },
        { queryKey: ['discharged-patients'] },
        { queryKey: ['discharge-control'] }
      ];

      console.log('🔄 [MUTATION] Invalidando queries:', queriesToInvalidate.length);
      
      queriesToInvalidate.forEach(query => {
        queryClient.invalidateQueries(query);
      });

      // Forçar refetch imediato das queries de leitos
      queryClient.refetchQueries({ queryKey: ['beds'] });
      
      toast({
        title: "✅ Leito criado com sucesso!",
        description: `${variables.name} foi adicionado ao ${variables.department}`,
        duration: 3000,
      });

      console.log('✅ [MUTATION] Processo de criação finalizado com sucesso');
    },
    onError: (error: any, variables) => {
      console.error('💥 [MUTATION] onError executado:', error);
      console.error('💥 [MUTATION] Variáveis que falharam:', variables);
      
      toast({
        title: "❌ Erro ao criar leito",
        description: error.message || "Erro desconhecido ao criar leito",
        variant: "destructive",
        duration: 5000,
      });
    }
  });
};

export const useUpdateBed = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateBedData) => {
      console.log('🔄 [UPDATE] Atualizando leito:', data);
      
      const { data: result, error } = await supabase.rpc('update_bed', {
        p_bed_id: data.bedId,
        p_name: data.name,
        p_department: data.department
      });

      if (error) {
        console.error('❌ [UPDATE] Erro ao atualizar leito:', error);
        throw error;
      }

      console.log('✅ [UPDATE] Leito atualizado com sucesso:', result);
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
      console.log('🗑️ [DELETE] Removendo leito customizado:', bedId);
      
      if (!bedId) {
        throw new Error('ID do leito é obrigatório');
      }

      // Usar a função específica para leitos customizados
      const { data, error } = await supabase.rpc('delete_custom_bed', {
        p_bed_id: bedId
      });

      if (error) {
        console.error('❌ [DELETE] Erro ao remover leito:', error);
        throw new Error(`Erro ao excluir leito: ${error.message}`);
      }

      if (!data) {
        console.error('❌ [DELETE] Leito não encontrado ou não é customizado');
        throw new Error('Leito não encontrado ou não pode ser excluído');
      }

      console.log('✅ [DELETE] Leito removido com sucesso');
      return data;
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['discharged-patients'] });
      queryClient.invalidateQueries({ queryKey: ['discharge-control'] });
      queryClient.invalidateQueries({ queryKey: ['department-stats'] });
      
      // Forçar refetch imediato
      queryClient.refetchQueries({ queryKey: ['beds'] });
      
      toast({
        title: "✅ Leito excluído",
        description: "O leito customizado foi removido com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('💥 Falha na remoção do leito:', error);
      toast({
        title: "❌ Erro",
        description: error.message || "Erro ao excluir leito",
        variant: "destructive",
      });
    }
  });
};
