
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types';
import { toast } from 'sonner';

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, patientData }: { bedId: string; patientData: Omit<Patient, 'id' | 'bedId' | 'occupationDays'> }) => {
      console.log('Adding patient with data:', { bedId, patientData });
      
      // Primeiro, inserir o paciente
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: patientData.name,
          sex: patientData.sex,
          birth_date: patientData.birthDate,
          age: patientData.age,
          admission_date: patientData.admissionDate,
          admission_time: patientData.admissionTime,
          diagnosis: patientData.diagnosis,
          specialty: patientData.specialty,
          expected_discharge_date: patientData.expectedDischargeDate,
          origin_city: patientData.originCity,
          is_tfd: patientData.isTFD,
          tfd_type: patientData.tfdType,
          department: patientData.department as any,
          bed_id: bedId,
          occupation_days: 0
        })
        .select()
        .single();

      if (patientError) {
        console.error('Error inserting patient:', patientError);
        throw patientError;
      }

      // Então, atualizar o leito para ocupado
      const { error: bedError } = await supabase
        .from('beds')
        .update({ 
          is_occupied: true,
          is_reserved: false
        })
        .eq('id', bedId);

      if (bedError) {
        console.error('Error updating bed:', bedError);
        throw bedError;
      }

      // Se havia uma reserva, removê-la
      const { error: reservationError } = await supabase
        .from('bed_reservations')
        .delete()
        .eq('bed_id', bedId);

      // Não lançar erro se não havia reserva para deletar
      if (reservationError && reservationError.code !== 'PGRST116') {
        console.warn('Erro ao remover reserva:', reservationError);
      }

      return patient;
    },
    onSuccess: async () => {
      // Forçar refetch imediato em vez de apenas invalidar
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['beds'] }),
        queryClient.refetchQueries({ queryKey: ['patient_discharges'] })
      ]);
      toast.success('Paciente admitido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao admitir paciente:', error);
      toast.error('Erro ao admitir paciente. Verifique os dados e tente novamente.');
    }
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, patientData }: { patientId: string; patientData: Partial<Patient> }) => {
      console.log('Updating patient with data:', { patientId, patientData });
      
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .update({
          name: patientData.name,
          sex: patientData.sex,
          birth_date: patientData.birthDate,
          age: patientData.age,
          admission_date: patientData.admissionDate,
          admission_time: patientData.admissionTime,
          diagnosis: patientData.diagnosis,
          specialty: patientData.specialty,
          expected_discharge_date: patientData.expectedDischargeDate,
          origin_city: patientData.originCity,
          is_tfd: patientData.isTFD,
          tfd_type: patientData.tfdType
        })
        .eq('id', patientId)
        .select()
        .single();

      if (patientError) {
        console.error('Error updating patient:', patientError);
        throw patientError;
      }

      return patient;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['beds'] });
      toast.success('Paciente editado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao editar paciente:', error);
      toast.error('Erro ao editar paciente. Tente novamente.');
    }
  });
};

export const useDischargePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, patientId, dischargeData }: { 
      bedId: string; 
      patientId: string; 
      dischargeData: { dischargeType: string; dischargeDate: string } 
    }) => {
      console.log('🏥 INICIANDO ALTA DO PACIENTE:', { bedId, patientId, dischargeData });
      
      // Timeout para evitar operações que ficam travadas
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout na operação de alta')), 30000)
      );

      const dischargePromise = async () => {
        // Buscar dados do paciente
        console.log('📋 Buscando dados do paciente...');
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();

        if (patientError) {
          console.error('❌ Erro ao buscar paciente:', patientError);
          throw new Error(`Erro ao buscar paciente: ${patientError.message}`);
        }

        console.log('✅ Dados do paciente encontrados:', patient);

        // Calcular dias de internação
        const admissionDate = new Date(patient.admission_date);
        const dischargeDate = new Date(dischargeData.dischargeDate);
        const actualStayDays = Math.ceil((dischargeDate.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));

        console.log('📊 Calculando dias de internação:', { admissionDate, dischargeDate, actualStayDays });

        // Inserir na tabela de altas (ARQUIVO e MONITORAMENTO)
        console.log('💾 Inserindo dados na tabela de altas...');
        const { error: dischargeError } = await supabase
          .from('patient_discharges')
          .insert({
            patient_id: patientId,
            name: patient.name,
            sex: patient.sex,
            birth_date: patient.birth_date,
            age: patient.age,
            admission_date: patient.admission_date,
            admission_time: patient.admission_time,
            discharge_date: dischargeData.dischargeDate,
            expected_discharge_date: patient.expected_discharge_date,
            diagnosis: patient.diagnosis,
            specialty: patient.specialty,
            origin_city: patient.origin_city,
            occupation_days: patient.occupation_days,
            actual_stay_days: actualStayDays,
            is_tfd: patient.is_tfd,
            tfd_type: patient.tfd_type,
            department: patient.department,
            discharge_type: dischargeData.dischargeType as any,
            bed_id: bedId
          });

        if (dischargeError) {
          console.error('❌ Erro ao inserir alta:', dischargeError);
          throw new Error(`Erro ao registrar alta: ${dischargeError.message}`);
        }

        console.log('✅ Alta registrada com sucesso');

        // Liberar o leito PRIMEIRO
        console.log('🛏️ Liberando leito...');
        const { error: bedError } = await supabase
          .from('beds')
          .update({ is_occupied: false })
          .eq('id', bedId);

        if (bedError) {
          console.error('❌ Erro ao liberar leito:', bedError);
          throw new Error(`Erro ao liberar leito: ${bedError.message}`);
        }

        console.log('✅ Leito liberado com sucesso');

        // Remover paciente da tabela de pacientes POR ÚLTIMO
        console.log('🗑️ Removendo paciente da tabela ativa...');
        const { error: deletePatientError } = await supabase
          .from('patients')
          .delete()
          .eq('id', patientId);

        if (deletePatientError) {
          console.error('❌ Erro ao deletar paciente:', deletePatientError);
          throw new Error(`Erro ao remover paciente: ${deletePatientError.message}`);
        }

        console.log('✅ Paciente removido da tabela ativa');
        console.log('🎉 ALTA CONCLUÍDA COM SUCESSO!');

        return { success: true, patient };
      };

      // Executar com timeout
      return Promise.race([dischargePromise(), timeoutPromise]);
    },
    onSuccess: async (result) => {
      console.log('🔄 Forçando atualização dos dados...');
      
      // Forçar refetch imediato e aguardar conclusão
      try {
        await Promise.all([
          queryClient.refetchQueries({ queryKey: ['beds'], type: 'active' }),
          queryClient.refetchQueries({ queryKey: ['patient_discharges'], type: 'active' })
        ]);
        console.log('✅ Dados atualizados com sucesso');
        
        // Invalidar todas as queries relacionadas como backup
        queryClient.invalidateQueries({ queryKey: ['beds'] });
        queryClient.invalidateQueries({ queryKey: ['patient_discharges'] });
        queryClient.invalidateQueries({ queryKey: ['department_stats'] });
        
        toast.success('Alta realizada com sucesso! Dados enviados para Arquivo e Monitoramento.');
      } catch (refreshError) {
        console.error('⚠️ Erro ao atualizar dados, mas alta foi realizada:', refreshError);
        toast.success('Alta realizada com sucesso! Atualizando dados...');
        
        // Retry depois de um delay
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ['beds'] });
          queryClient.refetchQueries({ queryKey: ['patient_discharges'] });
        }, 1000);
      }
    },
    onError: (error) => {
      console.error('❌ ERRO FINAL na alta:', error);
      toast.error(`Erro ao dar alta: ${error.message || 'Erro desconhecido'}. Tente novamente.`);
    },
    retry: (failureCount, error) => {
      // Retry automático até 2 vezes para certos tipos de erro
      if (failureCount < 2 && !error.message.includes('Timeout')) {
        console.log(`🔄 Tentativa ${failureCount + 1} de retry para alta...`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000)
  });
};

export const useTransferPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, fromBedId, toBedId }: { 
      patientId: string; 
      fromBedId: string; 
      toBedId: string 
    }) => {
      console.log('Transferring patient:', { patientId, fromBedId, toBedId });
      
      // Buscar dados do leito de destino
      const { data: toBed, error: toBedError } = await supabase
        .from('beds')
        .select('department')
        .eq('id', toBedId)
        .single();

      if (toBedError) {
        console.error('Error fetching destination bed:', toBedError);
        throw toBedError;
      }

      // Buscar dados do leito de origem
      const { data: fromBed, error: fromBedError } = await supabase
        .from('beds')
        .select('department')
        .eq('id', fromBedId)
        .single();

      if (fromBedError) {
        console.error('Error fetching origin bed:', fromBedError);
        throw fromBedError;
      }

      // Registrar a transferência
      const { error: transferError } = await supabase
        .from('patient_transfers')
        .insert({
          patient_id: patientId,
          from_bed_id: fromBedId,
          to_bed_id: toBedId,
          from_department: fromBed.department,
          to_department: toBed.department,
          transfer_date: new Date().toISOString()
        });

      if (transferError) {
        console.error('Error recording transfer:', transferError);
        throw transferError;
      }

      // Atualizar paciente com novo leito e departamento
      const { error: patientError } = await supabase
        .from('patients')
        .update({
          bed_id: toBedId,
          department: toBed.department
        })
        .eq('id', patientId);

      if (patientError) {
        console.error('Error updating patient:', patientError);
        throw patientError;
      }

      // Liberar leito de origem
      const { error: fromBedUpdateError } = await supabase
        .from('beds')
        .update({ is_occupied: false })
        .eq('id', fromBedId);

      if (fromBedUpdateError) {
        console.error('Error updating origin bed:', fromBedUpdateError);
        throw fromBedUpdateError;
      }

      // Ocupar leito de destino
      const { error: toBedUpdateError } = await supabase
        .from('beds')
        .update({ is_occupied: true, is_reserved: false })
        .eq('id', toBedId);

      if (toBedUpdateError) {
        console.error('Error updating destination bed:', toBedUpdateError);
        throw toBedUpdateError;
      }
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['beds'] });
      toast.success('Transferência realizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao transferir paciente:', error);
      toast.error('Erro ao transferir paciente. Tente novamente.');
    }
  });
};
