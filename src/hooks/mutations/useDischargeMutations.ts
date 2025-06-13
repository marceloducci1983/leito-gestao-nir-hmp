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
      department,
      bedName
    }: {
      patientId: string;
      patientName: string;
      bedId: string;
      department: string;
      bedName?: string;
    }) => {
      console.log('🔍 Iniciando solicitação de alta:', {
        patientId,
        patientName,
        bedId,
        department,
        bedName
      });

      // Verificar se já existe uma solicitação pendente para este paciente
      const { data: existingDischarge, error: checkError } = await supabase
        .from('discharge_control')
        .select('id, status')
        .eq('patient_id', patientId)
        .eq('status', 'pending')
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('❌ Erro ao verificar alta existente:', checkError);
        throw checkError;
      }

      if (existingDischarge) {
        console.log('⚠️ Já existe uma solicitação de alta pendente');
        throw new Error('Já existe uma solicitação de alta pendente para este paciente.');
      }

      // Usar o nome do leito se fornecido, caso contrário usar o bedId (que deveria ser o nome)
      const finalBedName = bedName || bedId;
      
      console.log('🏥 Chamando função RPC com:', {
        p_patient_id: patientId,
        p_patient_name: patientName,
        p_bed_id: finalBedName,
        p_department: department
      });

      const { data, error } = await supabase
        .rpc('request_discharge_for_patient', {
          p_patient_id: patientId,
          p_patient_name: patientName,
          p_bed_id: finalBedName,
          p_department: department
        });

      if (error) {
        console.error('❌ Erro na função RPC:', error);
        throw error;
      }

      console.log('✅ Alta solicitada com sucesso, ID:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
      queryClient.invalidateQueries({ queryKey: ['combined_discharges'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Alta solicitada com sucesso! Aguardando confirmação no monitoramento.');
    },
    onError: (error: any) => {
      console.error('❌ Erro na mutation de alta:', error);
      if (error.message.includes('Já existe uma solicitação')) {
        toast.error('Este paciente já possui uma solicitação de alta pendente!');
      } else {
        toast.error(`Erro ao solicitar alta: ${error.message}`);
      }
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
