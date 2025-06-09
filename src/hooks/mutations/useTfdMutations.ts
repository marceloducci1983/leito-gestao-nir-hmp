
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

      // Depois dar alta ao paciente através da tabela patient_discharges
      const { data: patientDataFromDb } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientDataFromDb) {
        // Inserir na tabela de altas
        const { error: dischargeError } = await supabase
          .from('patient_discharges')
          .insert({
            patient_id: patientId,
            name: patientDataFromDb.name,
            sex: patientDataFromDb.sex,
            birth_date: patientDataFromDb.birth_date,
            age: patientDataFromDb.age,
            admission_date: patientDataFromDb.admission_date,
            discharge_date: new Date().toISOString().split('T')[0],
            diagnosis: patientDataFromDb.diagnosis,
            specialty: patientDataFromDb.specialty,
            expected_discharge_date: patientDataFromDb.expected_discharge_date,
            origin_city: patientDataFromDb.origin_city,
            occupation_days: patientDataFromDb.occupation_days || 0,
            actual_stay_days: Math.ceil((new Date().getTime() - new Date(patientDataFromDb.admission_date).getTime()) / (1000 * 60 * 60 * 24)),
            is_tfd: patientDataFromDb.is_tfd,
            tfd_type: patientDataFromDb.tfd_type,
            bed_id: patientDataFromDb.bed_id || '',
            department: patientDataFromDb.department,
            discharge_type: 'POR MELHORA'
          });

        if (dischargeError) {
          console.error('Erro ao dar alta ao paciente:', dischargeError);
          throw dischargeError;
        }

        // Remover paciente da tabela patients
        const { error: deleteError } = await supabase
          .from('patients')
          .delete()
          .eq('id', patientId);

        if (deleteError) {
          console.error('Erro ao remover paciente:', deleteError);
          throw deleteError;
        }

        // Atualizar status do leito
        if (patientDataFromDb.bed_id) {
          const { error: bedError } = await supabase
            .from('beds')
            .update({ is_occupied: false })
            .eq('id', patientDataFromDb.bed_id);

          if (bedError) {
            console.error('Erro ao atualizar leito:', bedError);
          }
        }
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
