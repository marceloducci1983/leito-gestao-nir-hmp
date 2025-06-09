
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseReservation {
  id: string;
  patient_name: string;
  origin_clinic: string;
  diagnosis: string;
  bed_id?: string;
  created_at?: string;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<SupabaseReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*');
      
      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData: Omit<SupabaseReservation, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select()
        .single();
      
      if (error) throw error;
      
      setReservations(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return { success: false, error };
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setReservations(prev => prev.filter(res => res.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting reservation:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    loading,
    createReservation,
    deleteReservation,
    refetch: fetchReservations
  };
};
