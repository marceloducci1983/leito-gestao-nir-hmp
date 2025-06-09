
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types';
import { toast } from 'sonner';

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, patient }: { bedId: string; patient: Omit<Patient, 'id' | 'bedId'> }) => {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: patient.name,
          sex: patient.sex,
          birth_date: patient.birthDate,
          age: patient.age,
          admission_date: patient.admissionDate,
          diagnosis: patient.diagnosis,
          specialty: patient.specialty,
          expected_discharge_date: patient.expectedDischargeDate,
          origin_city: patient.originCity,
          occupation_days: patient.occupationDays,
          is_tfd: patient.isTFD,
          tfd_type: patient.tfdType,
          bed_id: bedId,
          department: patient.department as any
        })
        .select()
        .single();

      if (patientError) throw patientError;

      const { error: bedError } = await supabase
        .from('beds')
        .update({ is_occupied: true })
        .eq('id', bedId);

      if (bedError) throw bedError;

      return patientData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Paciente internado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao internar paciente:', error);
      toast.error('Erro ao internar paciente');
    }
  });
};

export const useDischargePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, patientId, dischargeData }: { 
      bedId: string; 
      patientId: string; 
      dischargeData: { dischargeType: string; dischargeDate: string; } 
    }) => {
      const { data: patient, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (fetchError) throw fetchError;

      const admissionDate = new Date(patient.admission_date);
      const dischargeDate = new Date(dischargeData.dischargeDate);
      const actualStayDays = Math.ceil((dischargeDate.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));

      const { error: dischargeError } = await supabase
        .from('patient_discharges')
        .insert({
          patient_id: patientId,
          name: patient.name,
          sex: patient.sex,
          birth_date: patient.birth_date,
          age: patient.age,
          admission_date: patient.admission_date,
          discharge_date: dischargeData.dischargeDate,
          diagnosis: patient.diagnosis,
          specialty: patient.specialty,
          expected_discharge_date: patient.expected_discharge_date,
          origin_city: patient.origin_city,
          occupation_days: patient.occupation_days,
          actual_stay_days: actualStayDays,
          is_tfd: patient.is_tfd,
          tfd_type: patient.tfd_type,
          bed_id: patient.bed_id || bedId,
          department: patient.department as any,
          discharge_type: dischargeData.dischargeType as any
        });

      if (dischargeError) throw dischargeError;

      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (deleteError) throw deleteError;

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
      toast.error('Erro ao realizar alta');
    }
  });
};

export const useTransferPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, fromBedId, toBedId, notes }: { 
      patientId: string; 
      fromBedId: string; 
      toBedId: string; 
      notes?: string; 
    }) => {
      const { data: patient, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (fetchError) throw fetchError;

      const { data: toBed, error: bedError } = await supabase
        .from('beds')
        .select('department')
        .eq('id', toBedId)
        .single();

      if (bedError) throw bedError;

      const { error: transferError } = await supabase
        .from('patient_transfers')
        .insert({
          patient_id: patientId,
          from_bed_id: fromBedId,
          to_bed_id: toBedId,
          from_department: patient.department as any,
          to_department: toBed.department as any,
          notes: notes
        });

      if (transferError) throw transferError;

      const { error: updatePatientError } = await supabase
        .from('patients')
        .update({ 
          bed_id: toBedId,
          department: toBed.department as any
        })
        .eq('id', patientId);

      if (updatePatientError) throw updatePatientError;

      const { error: fromBedError } = await supabase
        .from('beds')
        .update({ is_occupied: false })
        .eq('id', fromBedId);

      if (fromBedError) throw fromBedError;

      const { error: toBedUpdateError } = await supabase
        .from('beds')
        .update({ is_occupied: true })
        .eq('id', toBedId);

      if (toBedUpdateError) throw toBedUpdateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Transferência realizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao transferir paciente:', error);
      toast.error('Erro ao realizar transferência');
    }
  });
};
