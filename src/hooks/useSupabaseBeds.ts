
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bed, Patient, BedReservation, DischargedPatient } from '@/types';
import { toast } from 'sonner';

interface SupabaseBed {
  id: string;
  name: string;
  department: string;
  is_occupied: boolean;
  is_reserved: boolean;
  is_custom: boolean;
  patients?: SupabasePatient;
  bed_reservations?: SupabaseBedReservation;
}

interface SupabasePatient {
  id: string;
  name: string;
  sex: string;
  birth_date: string;
  age: number;
  admission_date: string;
  diagnosis: string;
  specialty?: string;
  expected_discharge_date: string;
  origin_city: string;
  occupation_days: number;
  is_tfd: boolean;
  tfd_type?: string;
  department: string;
}

interface SupabaseBedReservation {
  id: string;
  patient_name: string;
  origin_clinic: string;
  diagnosis: string;
  department: string;
}

export const useSupabaseBeds = () => {
  const queryClient = useQueryClient();
  const [centralData, setCentralData] = useState<{
    beds: Bed[];
    archivedPatients: DischargedPatient[];
    dischargeMonitoring: DischargedPatient[];
  }>({
    beds: [],
    archivedPatients: [],
    dischargeMonitoring: []
  });

  // Fetch beds with patients and reservations
  const { data: bedsData, isLoading, error } = useQuery({
    queryKey: ['beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beds')
        .select(`
          *,
          patients(*),
          bed_reservations(*)
        `)
        .order('department')
        .order('name');

      if (error) throw error;
      return data as SupabaseBed[];
    }
  });

  // Fetch discharged patients
  const { data: dischargedData } = useQuery({
    queryKey: ['patient_discharges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patient_discharges')
        .select('*')
        .order('discharge_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Transform Supabase data to frontend format
  useEffect(() => {
    if (bedsData) {
      const transformedBeds: Bed[] = bedsData.map(bed => ({
        id: bed.id,
        name: bed.name,
        department: bed.department as any,
        isOccupied: bed.is_occupied,
        isReserved: bed.is_reserved,
        isCustom: bed.is_custom,
        patient: bed.patients ? {
          id: bed.patients.id,
          name: bed.patients.name,
          sex: bed.patients.sex as any,
          birthDate: bed.patients.birth_date,
          age: bed.patients.age,
          admissionDate: bed.patients.admission_date,
          diagnosis: bed.patients.diagnosis,
          specialty: bed.patients.specialty,
          expectedDischargeDate: bed.patients.expected_discharge_date,
          originCity: bed.patients.origin_city,
          occupationDays: bed.patients.occupation_days,
          isTFD: bed.patients.is_tfd,
          tfdType: bed.patients.tfd_type,
          bedId: bed.id,
          department: bed.patients.department as any
        } : undefined,
        reservation: bed.bed_reservations ? {
          id: bed.bed_reservations.id,
          patientName: bed.bed_reservations.patient_name,
          originClinic: bed.bed_reservations.origin_clinic,
          diagnosis: bed.bed_reservations.diagnosis,
          bedId: bed.id,
          department: bed.bed_reservations.department as any
        } : undefined
      }));

      const transformedDischarges: DischargedPatient[] = dischargedData?.map(discharge => ({
        id: discharge.patient_id,
        name: discharge.name,
        sex: discharge.sex as any,
        birthDate: discharge.birth_date,
        age: discharge.age,
        admissionDate: discharge.admission_date,
        diagnosis: discharge.diagnosis,
        specialty: discharge.specialty,
        expectedDischargeDate: discharge.expected_discharge_date,
        originCity: discharge.origin_city,
        occupationDays: discharge.occupation_days,
        isTFD: discharge.is_tfd,
        tfdType: discharge.tfd_type,
        bedId: discharge.bed_id,
        department: discharge.department as any,
        dischargeDate: discharge.discharge_date,
        dischargeType: discharge.discharge_type as any,
        actualStayDays: discharge.actual_stay_days
      })) || [];

      setCentralData({
        beds: transformedBeds,
        archivedPatients: transformedDischarges,
        dischargeMonitoring: transformedDischarges.filter(p => {
          const dischargeDate = new Date(p.dischargeDate);
          const today = new Date();
          const diffTime = today.getTime() - dischargeDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7; // Last 7 days
        })
      });
    }
  }, [bedsData, dischargedData]);

  // Mutations for bed operations
  const addPatientMutation = useMutation({
    mutationFn: async ({ bedId, patient }: { bedId: string; patient: Omit<Patient, 'id' | 'bedId'> }) => {
      // Insert patient
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
          department: patient.department
        })
        .select()
        .single();

      if (patientError) throw patientError;

      // Update bed status
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

  const dischargePatientMutation = useMutation({
    mutationFn: async ({ bedId, patientId, dischargeData }: { 
      bedId: string; 
      patientId: string; 
      dischargeData: { dischargeType: string; dischargeDate: string; } 
    }) => {
      // Get patient data first
      const { data: patient, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (fetchError) throw fetchError;

      // Calculate actual stay days
      const admissionDate = new Date(patient.admission_date);
      const dischargeDate = new Date(dischargeData.dischargeDate);
      const actualStayDays = Math.ceil((dischargeDate.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));

      // Insert into discharges
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
          department: patient.department,
          discharge_type: dischargeData.dischargeType
        });

      if (dischargeError) throw dischargeError;

      // Delete patient
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (deleteError) throw deleteError;

      // Update bed status
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

  const addReservationMutation = useMutation({
    mutationFn: async ({ bedId, reservation }: { bedId: string; reservation: Omit<BedReservation, 'id' | 'bedId'> }) => {
      const { error: reservationError } = await supabase
        .from('bed_reservations')
        .insert({
          patient_name: reservation.patientName,
          origin_clinic: reservation.originClinic,
          diagnosis: reservation.diagnosis,
          bed_id: bedId,
          department: reservation.department
        });

      if (reservationError) throw reservationError;

      // Update bed status
      const { error: bedError } = await supabase
        .from('beds')
        .update({ is_reserved: true })
        .eq('id', bedId);

      if (bedError) throw bedError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Reserva criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar reserva:', error);
      toast.error('Erro ao criar reserva');
    }
  });

  const transferPatientMutation = useMutation({
    mutationFn: async ({ patientId, fromBedId, toBedId, notes }: { 
      patientId: string; 
      fromBedId: string; 
      toBedId: string; 
      notes?: string; 
    }) => {
      // Get patient and bed data
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

      // Record transfer
      const { error: transferError } = await supabase
        .from('patient_transfers')
        .insert({
          patient_id: patientId,
          from_bed_id: fromBedId,
          to_bed_id: toBedId,
          from_department: patient.department,
          to_department: toBed.department,
          notes: notes
        });

      if (transferError) throw transferError;

      // Update patient
      const { error: updatePatientError } = await supabase
        .from('patients')
        .update({ 
          bed_id: toBedId,
          department: toBed.department
        })
        .eq('id', patientId);

      if (updatePatientError) throw updatePatientError;

      // Update bed statuses
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

  // Real-time subscriptions
  useEffect(() => {
    const bedsChannel = supabase
      .channel('beds-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, () => {
        queryClient.invalidateQueries({ queryKey: ['beds'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        queryClient.invalidateQueries({ queryKey: ['beds'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bed_reservations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['beds'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patient_discharges' }, () => {
        queryClient.invalidateQueries({ queryKey: ['patient_discharges'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bedsChannel);
    };
  }, [queryClient]);

  return {
    centralData,
    isLoading,
    error,
    addPatient: addPatientMutation.mutateAsync,
    dischargePatient: dischargePatientMutation.mutateAsync,
    addReservation: addReservationMutation.mutateAsync,
    transferPatient: transferPatientMutation.mutateAsync
  };
};
