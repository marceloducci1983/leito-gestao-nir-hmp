
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUpdateInvestigation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      alertType,
      status,
      notes
    }: {
      patientId: string;
      alertType: string;
      status: 'investigated' | 'not_investigated';
      notes?: string;
    }) => {
      try {
        console.log('Atualizando investigação:', { patientId, alertType, status, notes });
        
        // Verificar se já existe um registro
        const { data: existing, error: selectError } = await supabase
          .from('alert_investigations')
          .select('id')
          .eq('patient_id', patientId)
          .eq('alert_type', alertType)
          .maybeSingle();

        if (selectError) {
          console.error('Erro ao buscar investigação existente:', selectError);
          throw selectError;
        }

        if (existing) {
          // Atualizar registro existente
          const { data, error } = await supabase
            .from('alert_investigations')
            .update({
              investigation_status: status,
              investigation_notes: notes,
              investigated_by: 'Sistema',
              investigated_at: new Date().toISOString(),
              investigated: status === 'investigated',
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select();

          if (error) {
            console.error('Erro ao atualizar investigação:', error);
            throw error;
          }
          
          console.log('Investigação atualizada:', data);
          return data;
        } else {
          // Criar novo registro
          const { data, error } = await supabase
            .from('alert_investigations')
            .insert({
              patient_id: patientId,
              alert_type: alertType,
              investigation_status: status,
              investigation_notes: notes,
              investigated_by: 'Sistema',
              investigated_at: new Date().toISOString(),
              investigated: status === 'investigated'
            })
            .select();

          if (error) {
            console.error('Erro ao criar investigação:', error);
            throw error;
          }
          
          console.log('Nova investigação criada:', data);
          return data;
        }
      } catch (error) {
        console.error('Erro geral na mutação:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidar queries relacionadas para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ['readmissions'] });
      queryClient.invalidateQueries({ queryKey: ['alert_investigations'] });
      console.log('Queries invalidadas com sucesso');
    },
    onError: (error: any) => {
      console.error('Erro na mutação:', error);
      toast.error('Erro ao atualizar investigação: ' + (error.message || 'Erro desconhecido'));
    }
  });
};
