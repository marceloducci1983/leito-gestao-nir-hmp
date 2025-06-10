
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
      const { data, error } = await supabase
        .rpc('request_discharge_for_patient', {
          p_patient_id: patientId,
          p_patient_name: patientName,
          p_bed_id: bedId,
          p_department: department
        });

      if (error) {
        console.error('Erro ao solicitar alta:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Alta solicitada com sucesso! Aguardando confirmação no monitoramento.');
    },
    onError: (error: any) => {
      toast.error('Erro ao solicitar alta');
      console.error('Erro:', error);
    }
  });
};

export const useCancelDischarge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dischargeId: string) => {
      const { data, error } = await supabase
        .rpc('cancel_discharge_and_restore_patient', {
          p_discharge_id: dischargeId
        });

      if (error) {
        console.error('Erro ao cancelar alta:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Alta cancelada! Paciente devolvido ao painel de leitos.');
    },
    onError: (error: any) => {
      toast.error('Erro ao cancelar alta');
      console.error('Erro:', error);
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
      const { data, error } = await supabase
        .rpc('complete_discharge_and_remove_patient', {
          p_discharge_id: dischargeId,
          p_justification: justification
        });

      if (error) {
        console.error('Erro ao dar alta efetiva:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['patient_discharges'] });
      toast.success('Alta efetiva realizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao dar alta efetiva');
      console.error('Erro:', error);
    }
  });
};
