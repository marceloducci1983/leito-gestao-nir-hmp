
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAddTfdIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      interventionType,
      description
    }: {
      patientId: string;
      interventionType: 'EMAIL' | 'LIGACAO' | 'WPP' | 'PLANO_DE_SAUDE' | 'OUTROS';
      description: string;
    }) => {
      const { data, error } = await supabase
        .from('tfd_interventions')
        .insert({
          patient_id: patientId,
          intervention_type: interventionType,
          description: description
        });

      if (error) {
        console.error('Erro ao adicionar intervenção TFD:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tfd_interventions'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Intervenção TFD adicionada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao adicionar intervenção TFD');
      console.error('Erro:', error);
    }
  });
};

export const useArchiveTfdPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      patientName,
      patientData,
      interventions
    }: {
      patientId: string;
      patientName: string;
      patientData: any;
      interventions: any[];
    }) => {
      // Primeiro arquivar o paciente
      const { data: archiveData, error: archiveError } = await supabase
        .from('tfd_archives')
        .insert({
          patient_id: patientId,
          patient_name: patientName,
          patient_data: patientData,
          interventions: interventions,
          archived_by: 'Sistema'
        });

      if (archiveError) {
        console.error('Erro ao arquivar paciente TFD:', archiveError);
        throw archiveError;
      }

      // Depois dar alta ao paciente (move para patient_discharges)
      const { error: dischargeError } = await supabase.rpc('discharge_patient', {
        patient_id: patientId,
        discharge_type: 'POR MELHORA'
      });

      if (dischargeError) {
        console.error('Erro ao dar alta ao paciente:', dischargeError);
        throw dischargeError;
      }

      return archiveData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['tfd_archives'] });
      queryClient.invalidateQueries({ queryKey: ['patient_discharges'] });
      toast.success('Paciente TFD arquivado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao arquivar paciente TFD');
      console.error('Erro:', error);
    }
  });
};
