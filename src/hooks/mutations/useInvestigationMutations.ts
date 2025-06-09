
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
      // Verificar se já existe um registro
      const { data: existing } = await supabase
        .from('alert_investigations')
        .select('id')
        .eq('patient_id', patientId)
        .eq('alert_type', alertType)
        .single();

      if (existing) {
        // Atualizar registro existente
        const { data, error } = await supabase
          .from('alert_investigations')
          .update({
            investigation_status: status,
            investigation_notes: notes,
            investigated_by: 'Sistema',
            investigated_at: new Date().toISOString(),
            investigated: status === 'investigated'
          })
          .eq('id', existing.id);

        if (error) throw error;
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
          });

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readmissions'] });
      queryClient.invalidateQueries({ queryKey: ['alert_investigations'] });
      toast.success('Status de investigação atualizado!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar investigação');
      console.error('Erro:', error);
    }
  });
};
