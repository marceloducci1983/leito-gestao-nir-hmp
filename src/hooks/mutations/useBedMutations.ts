
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCreateBed = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ name, department }: { name: string; department: string }) => {
      const { data, error } = await supabase.rpc('create_bed', {
        p_name: name,
        p_department: department
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Leito criado com sucesso",
        description: "O novo leito foi adicionado ao sistema",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar leito:', error);
      toast({
        title: "Erro ao criar leito",
        description: "Não foi possível criar o leito",
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
      const { data, error } = await supabase.rpc('update_bed', {
        p_bed_id: bedId,
        p_name: name,
        p_department: department
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Leito editado com sucesso",
        description: "As alterações foram salvas",
      });
    },
    onError: (error) => {
      console.error('Erro ao editar leito:', error);
      toast({
        title: "Erro ao editar leito",
        description: "Não foi possível salvar as alterações",
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
      const { error } = await supabase
        .from('beds')
        .delete()
        .eq('id', bedId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Leito excluído com sucesso",
        description: "O leito foi removido do sistema",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir leito:', error);
      toast({
        title: "Erro ao excluir leito",
        description: "Não foi possível excluir o leito",
        variant: "destructive",
      });
    }
  });
};
