
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRequestDischarge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      patientId, 
      patientName, 
      bedId, 
      department 
    }: { 
      patientId: string; 
      patientName: string; 
      bedId: string; 
      department: string; 
    }) => {
      console.log('Requesting discharge for patient:', { patientId, patientName, bedId, department });
      
      const { data, error } = await supabase
        .from('discharge_control')
        .insert({
          patient_id: patientId,
          patient_name: patientName,
          bed_id: bedId,
          department: department,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error requesting discharge:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
      toast.success('Solicitação de alta enviada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao solicitar alta:', error);
      toast.error('Erro ao solicitar alta. Tente novamente.');
    }
  });
};

export const useCancelDischarge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dischargeId: string) => {
      console.log('Cancelling discharge:', dischargeId);
      
      const { error } = await supabase
        .from('discharge_control')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', dischargeId);

      if (error) {
        console.error('Error cancelling discharge:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
      toast.success('Alta cancelada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao cancelar alta:', error);
      toast.error('Erro ao cancelar alta. Tente novamente.');
    }
  });
};

export const useCompleteDischarge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      dischargeId, 
      justification 
    }: { 
      dischargeId: string; 
      justification?: string; 
    }) => {
      console.log('Completing discharge:', { dischargeId, justification });
      
      const { error } = await supabase
        .from('discharge_control')
        .update({ 
          status: 'completed',
          discharge_effective_at: new Date().toISOString(),
          justification: justification,
          updated_at: new Date().toISOString()
        })
        .eq('id', dischargeId);

      if (error) {
        console.error('Error completing discharge:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Alta efetiva realizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao efetivar alta:', error);
      toast.error('Erro ao efetivar alta. Tente novamente.');
    }
  });
};
