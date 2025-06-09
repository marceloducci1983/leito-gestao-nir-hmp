
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types';
import { toast } from 'sonner';

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, patientData }: { bedId: string; patientData: Omit<Patient, 'id' | 'bedId' | 'occupationDays'> }) => {
      console.log('Adding patient with data:', patientData);
      
      // Primeiro, inserir o paciente
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: patientData.name,
          sex: patientData.sex,
          birth_date: patientData.birthDate, // Already in ISO format from form
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Paciente admitido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao admitir paciente:', error);
      toast.error('Erro ao admitir paciente');
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
      // Buscar dados do paciente
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientError) throw patientError;

      // Calcular dias de internação
      const admissionDate = new Date(patient.admission_date);
      const dischargeDate = new Date(dischargeData.dischargeDate);
      const actualStayDays = Math.ceil((dischargeDate.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));

      // Inserir na tabela de altas
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

      if (dischargeError) throw dischargeError;

      // Remover paciente da tabela de pacientes
      const { error: deletePatientError } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (deletePatientError) throw deletePatientError;

      // Liberar o leito
      const { error: bedError } = await supabase
        .from('beds')
        .update({ is_occupied: false })
        .eq('id', bedId);

      if (bedError) throw bedError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['patient_discharges'] });
      toast.success('Alta realizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao dar alta:', error);
      toast.error('Erro ao dar alta');
    }
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
      // Buscar dados do leito de destino
      const { data: toBed, error: toBedError } = await supabase
        .from('beds')
        .select('department')
        .eq('id', toBedId)
        .single();

      if (toBedError) throw toBedError;

      // Buscar dados do leito de origem
      const { data: fromBed, error: fromBedError } = await supabase
        .from('beds')
        .select('department')
        .eq('id', fromBedId)
        .single();

      if (fromBedError) throw fromBedError;

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

      if (transferError) throw transferError;

      // Atualizar paciente com novo leito e departamento
      const { error: patientError } = await supabase
        .from('patients')
        .update({
          bed_id: toBedId,
          department: toBed.department
        })
        .eq('id', patientId);

      if (patientError) throw patientError;

      // Liberar leito de origem
      const { error: fromBedUpdateError } = await supabase
        .from('beds')
        .update({ is_occupied: false })
        .eq('id', fromBedId);

      if (fromBedUpdateError) throw fromBedUpdateError;

      // Ocupar leito de destino
      const { error: toBedUpdateError } = await supabase
        .from('beds')
        .update({ is_occupied: true, is_reserved: false })
        .eq('id', toBedId);

      if (toBedUpdateError) throw toBedUpdateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Transferência realizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao transferir paciente:', error);
      toast.error('Erro ao transferir paciente');
    }
  });
};
