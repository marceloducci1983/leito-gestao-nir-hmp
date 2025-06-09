
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabasePatient {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  age: number;
  admission_date: string;
  admission_time: string;
  diagnosis: string;
  origin_city: string;
  expected_discharge_date?: string;
  is_tfd?: boolean;
  tfd_type?: string;
  bed_id?: string;
  days_occupied?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const usePatients = () => {
  const [patients, setPatients] = useState<SupabasePatient[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Erro ao carregar pacientes",
        description: "Não foi possível carregar os dados dos pacientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData: Omit<SupabasePatient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          ...patientData,
          status: 'active'
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setPatients(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Erro ao admitir paciente",
        description: "Não foi possível admitir o paciente",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updatePatient = async (id: string, updates: Partial<SupabasePatient>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setPatients(prev => prev.map(patient => patient.id === id ? data : patient));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating patient:', error);
      return { success: false, error };
    }
  };

  const dischargePatient = async (patientId: string, dischargeType: string) => {
    try {
      // Get patient data first
      const { data: patient, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (fetchError) throw fetchError;

      // Calculate days occupied
      const admissionDate = new Date(patient.admission_date);
      const today = new Date();
      const daysOccupied = Math.ceil((today.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));

      // Create discharge record
      const { error: dischargeError } = await supabase
        .from('discharge_records')
        .insert([{
          patient_id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          birth_date: patient.birth_date,
          admission_date: patient.admission_date,
          admission_time: patient.admission_time,
          diagnosis: patient.diagnosis,
          origin_city: patient.origin_city,
          expected_discharge_date: patient.expected_discharge_date,
          is_tfd: patient.is_tfd || false,
          tfd_type: patient.tfd_type,
          discharge_date: new Date().toISOString().split('T')[0],
          discharge_time: new Date().toTimeString().split(' ')[0],
          discharge_type: dischargeType,
          days_occupied: daysOccupied
        }]);

      if (dischargeError) throw dischargeError;

      // Update patient status
      const { error: updateError } = await supabase
        .from('patients')
        .update({ status: 'discharged' })
        .eq('id', patientId);

      if (updateError) throw updateError;

      setPatients(prev => prev.filter(p => p.id !== patientId));
      return { success: true };
    } catch (error) {
      console.error('Error discharging patient:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    createPatient,
    updatePatient,
    dischargePatient,
    refetch: fetchPatients
  };
};
