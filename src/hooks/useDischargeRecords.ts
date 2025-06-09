
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseDischargeRecord {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  birth_date: string;
  admission_date: string;
  admission_time: string;
  diagnosis: string;
  origin_city: string;
  expected_discharge_date?: string;
  is_tfd?: boolean;
  tfd_type?: string;
  discharge_date: string;
  discharge_time: string;
  discharge_type: string;
  days_occupied: number;
  created_at?: string;
}

export const useDischargeRecords = () => {
  const [dischargeRecords, setDischargeRecords] = useState<SupabaseDischargeRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDischargeRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discharge_records')
        .select('*')
        .order('discharge_date', { ascending: false });
      
      if (error) throw error;
      setDischargeRecords(data || []);
    } catch (error) {
      console.error('Error fetching discharge records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDischargeRecords();
  }, []);

  return {
    dischargeRecords,
    loading,
    refetch: fetchDischargeRecords
  };
};
