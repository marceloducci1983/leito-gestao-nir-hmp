
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUpdateInvestigation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      alertKey,
      patientId,
      alertType,
      status,
      notes,
      patientName
    }: {
      alertKey: string;
      patientId?: string;
      alertType: string;
      status: 'investigated' | 'not_investigated';
      notes?: string;
      patientName?: string;
    }) => {
      console.log('Iniciando mutação de investigação:', { alertKey, patientId, alertType, status, notes, patientName });
      
      // Validar parâmetros de entrada
      if (!alertKey?.toString()?.trim()) {
        throw new Error('Chave do alerta é obrigatória');
      }
      
      if (!alertType?.toString()?.trim()) {
        throw new Error('Tipo de alerta é obrigatório');
      }
      
      if (!status || !['investigated', 'not_investigated'].includes(status)) {
        throw new Error('Status de investigação inválido');
      }

      const normalizedAlertKey = alertKey.toString().trim();
      const normalizedAlertType = alertType.toString().trim();
      
      // Buscar UUID do paciente se nome foi fornecido mas ID não
      let actualPatientId = patientId;
      if (!actualPatientId && patientName) {
        console.log('Buscando UUID do paciente pelo nome:', patientName);
        try {
          const { data: patient, error: patientError } = await supabase
            .from('patients')
            .select('id')
            .ilike('name', patientName.trim())
            .limit(1)
            .maybeSingle();

          if (patientError) {
            console.warn('Erro ao buscar paciente:', patientError);
          } else if (patient) {
            actualPatientId = patient.id;
            console.log('UUID do paciente encontrado:', actualPatientId);
          } else {
            console.log('Paciente não encontrado na tabela ativa, usando NULL para patient_id');
          }
        } catch (error) {
          console.warn('Erro ao buscar UUID do paciente:', error);
        }
      }
      
      try {
        console.log('Buscando investigação existente:', { normalizedAlertKey, normalizedAlertType });
        
        // Verificar se já existe um registro usando alert_key
        const { data: existing, error: selectError } = await supabase
          .from('alert_investigations')
          .select('id, investigation_status, investigated_at, investigation_notes')
          .eq('alert_key', normalizedAlertKey)
          .eq('alert_type', normalizedAlertType)
          .maybeSingle();

        if (selectError) {
          console.error('Erro ao buscar investigação existente:', selectError);
          throw new Error(`Erro ao buscar investigação: ${selectError.message}`);
        }

        console.log('Investigação existente encontrada:', existing);

        const investigationData = {
          investigation_status: status,
          investigation_notes: notes || null,
          investigated_by: 'Sistema',
          investigated_at: new Date().toISOString(),
          investigated: status === 'investigated',
          updated_at: new Date().toISOString()
        };

        if (existing) {
          // Atualizar registro existente
          console.log('Atualizando investigação existente com ID:', existing.id);
          
          const { data, error } = await supabase
            .from('alert_investigations')
            .update(investigationData)
            .eq('id', existing.id)
            .select();

          if (error) {
            console.error('Erro ao atualizar investigação:', error);
            throw new Error(`Erro ao atualizar: ${error.message}`);
          }
          
          console.log('Investigação atualizada com sucesso:', data);
          return data;
        } else {
          // Criar novo registro
          console.log('Criando nova investigação com patient_id:', actualPatientId);
          
          const newInvestigationData = {
            alert_key: normalizedAlertKey,
            patient_id: actualPatientId || null, // Usar NULL se não houver UUID válido
            alert_type: normalizedAlertType,
            ...investigationData
          };
          
          const { data, error } = await supabase
            .from('alert_investigations')
            .insert(newInvestigationData)
            .select();

          if (error) {
            console.error('Erro ao criar investigação:', error);
            throw new Error(`Erro ao criar investigação: ${error.message}`);
          }
          
          console.log('Nova investigação criada com sucesso:', data);
          return data;
        }
      } catch (error) {
        console.error('Erro geral na mutação:', {
          error,
          alertKey: normalizedAlertKey,
          alertType: normalizedAlertType,
          status,
          patientId: actualPatientId,
          errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        
        // Re-throw o erro para que seja capturado pelo onError
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log('Mutação bem-sucedida:', { data, variables });
      
      // Invalidar queries relacionadas para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ['readmissions'] });
      queryClient.invalidateQueries({ queryKey: ['alert_investigations'] });
      queryClient.invalidateQueries({ queryKey: ['long_stay_patients'] });
      
      console.log('Queries invalidadas com sucesso');
    },
    onError: (error: any, variables) => {
      console.error('Erro na mutação (onError):', {
        error,
        variables,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      // Não mostrar toast aqui, pois já é tratado no componente
    }
  });
};
