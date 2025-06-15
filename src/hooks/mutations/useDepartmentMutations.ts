
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
      console.log('🔄 Criando departamento:', data);
      
      const { data: result, error } = await supabase.rpc('create_department', {
        p_name: data.name.toUpperCase(),
        p_description: data.description || null
      });

      if (error) {
        console.error('❌ Erro ao criar departamento:', error);
        // Tratamento específico para erros de ENUM
        if (error.message?.includes('unsafe use of new value')) {
          console.log('🔄 Tentando novamente após erro de ENUM...');
          // Aguardar um pouco e tentar novamente
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: retryResult, error: retryError } = await supabase.rpc('create_department', {
            p_name: data.name.toUpperCase(),
            p_description: data.description || null
          });
          
          if (retryError) {
            console.error('❌ Erro na segunda tentativa:', retryError);
            throw retryError;
          }
          
          console.log('✅ Departamento criado na segunda tentativa:', retryResult);
          return retryResult;
        }
        throw error;
      }

      console.log('✅ Departamento criado com sucesso:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Sucesso na criação do departamento:', data);
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Sucesso",
        description: "Setor criado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('💥 Falha na criação do departamento:', error);
      let errorMessage = "Erro ao criar setor";
      
      if (error.message?.includes('unsafe use of new value')) {
        errorMessage = "Erro temporário de sincronização. Tente novamente em alguns segundos.";
      } else if (error.message) {
        errorMessage = `Erro ao criar setor: ${error.message}`;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
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
      console.log('🔄 Atualizando departamento:', data);
      
      const { data: result, error } = await supabase.rpc('update_department', {
        p_id: data.id,
        p_name: data.name.toUpperCase(),
        p_description: data.description || null
      });

      if (error) {
        console.error('❌ Erro ao atualizar departamento:', error);
        
        // Tratamento específico para erros de ENUM
        if (error.message?.includes('unsafe use of new value')) {
          console.log('🔄 Tentando novamente após erro de ENUM...');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: retryResult, error: retryError } = await supabase.rpc('update_department', {
            p_id: data.id,
            p_name: data.name.toUpperCase(),
            p_description: data.description || null
          });
          
          if (retryError) {
            console.error('❌ Erro na segunda tentativa:', retryError);
            throw retryError;
          }
          
          console.log('✅ Departamento atualizado na segunda tentativa:', retryResult);
          return retryResult;
        }
        throw error;
      }

      console.log('✅ Departamento atualizado com sucesso:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Sucesso na atualização do departamento:', data);
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Sucesso",
        description: "Setor atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('💥 Falha na atualização do departamento:', error);
      let errorMessage = "Erro ao atualizar setor";
      
      if (error.message?.includes('unsafe use of new value')) {
        errorMessage = "Erro temporário de sincronização. Tente novamente em alguns segundos.";
      } else if (error.message) {
        errorMessage = `Erro ao atualizar setor: ${error.message}`;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
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
      console.log('🔄 Removendo departamento:', departmentId);
      
      const { data: result, error } = await supabase.rpc('delete_department', {
        p_id: departmentId
      });

      if (error) {
        console.error('❌ Erro ao remover departamento:', error);
        throw error;
      }

      console.log('✅ Departamento removido com sucesso:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Sucesso na remoção do departamento:', data);
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Sucesso",
        description: "Setor removido com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('💥 Falha na remoção do departamento:', error);
      let errorMessage = "Erro ao remover setor";
      
      if (error.message?.includes('leitos associados')) {
        errorMessage = "Não é possível excluir setor com leitos associados";
      } else if (error.message) {
        errorMessage = `Erro ao remover setor: ${error.message}`;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
};
