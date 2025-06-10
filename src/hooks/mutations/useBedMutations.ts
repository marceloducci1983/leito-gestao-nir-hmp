
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCreateBed = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ name, department }: { name: string; department: string }) => {
      console.log('Creating bed with:', { name, department });
      
      const { data, error } = await supabase.rpc('create_bed', {
        p_name: name,
        p_department: department
      });

      if (error) {
        console.error('Error creating bed:', error);
        throw error;
      }
      
      console.log('Bed created successfully:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas a leitos
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.refetchQueries({ queryKey: ['beds'] });
      
      toast({
        title: "Leito criado com sucesso",
        description: "O novo leito foi adicionado ao sistema",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar leito:', error);
      toast({
        title: "Erro ao criar leito",
        description: error.message || "Não foi possível criar o leito",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateBed = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bedId, name, department }: { bedId: string; name: string; department: string }) => {
      console.log('Updating bed with:', { bedId, name, department });
      
      const { data, error } = await supabase.rpc('update_bed', {
        p_bed_id: bedId,
        p_name: name,
        p_department: department
      });

      if (error) {
        console.error('Error updating bed:', error);
        throw error;
      }
      
      console.log('Bed updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.refetchQueries({ queryKey: ['beds'] });
      
      toast({
        title: "Leito editado com sucesso",
        description: "As alterações foram salvas",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao editar leito:', error);
      toast({
        title: "Erro ao editar leito",
        description: error.message || "Não foi possível salvar as alterações",
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
      console.log('Deleting bed:', bedId);
      
      const { error } = await supabase
        .from('beds')
        .delete()
        .eq('id', bedId);

      if (error) {
        console.error('Error deleting bed:', error);
        throw error;
      }
      
      console.log('Bed deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.refetchQueries({ queryKey: ['beds'] });
      
      toast({
        title: "Leito excluído com sucesso",
        description: "O leito foi removido do sistema",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao excluir leito:', error);
      toast({
        title: "Erro ao excluir leito",
        description: error.message || "Não foi possível excluir o leito",
        variant: "destructive",
      });
    }
  });
};
