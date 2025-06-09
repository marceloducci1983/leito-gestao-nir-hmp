
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseBed {
  id: string;
  name: string;
  department: string;
  status: 'available' | 'occupied' | 'reserved';
  is_custom?: boolean;
  patient_id?: string;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  patient_birth_date?: string;
  patient_admission_date?: string;
  patient_admission_time?: string;
  patient_diagnosis?: string;
  patient_origin_city?: string;
  patient_expected_discharge_date?: string;
  patient_tfd?: boolean;
  patient_tfd_type?: string;
  reservation_patient_name?: string;
  reservation_origin_clinic?: string;
  reservation_diagnosis?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for creating new beds
interface CreateBedData {
  name: string;
  department: string;
  status?: 'available' | 'occupied' | 'reserved';
  is_custom?: boolean;
}

export const useBeds = () => {
  const [beds, setBeds] = useState<SupabaseBed[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBeds = async () => {
    try {
      console.log('Fetching beds from database...');
      
      // Use ordenação com função alphanumeric_sort do banco
      const { data, error } = await supabase
        .from('beds')
        .select('*')
        .order('department')
        .order('alphanumeric_sort(name)');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Beds fetched successfully:', data?.length || 0, 'beds');
      console.log('Sample bed data:', data?.[0]);
      
      setBeds(data || []);
    } catch (error) {
      console.error('Error fetching beds:', error);
      toast({
        title: "Erro ao carregar leitos",
        description: "Não foi possível carregar os dados dos leitos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBed = async (bedData: CreateBedData) => {
    try {
      const { data, error } = await supabase
        .from('beds')
        .insert([{
          name: bedData.name,
          department: bedData.department,
          status: bedData.status || 'available',
          is_custom: bedData.is_custom || false
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setBeds(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating bed:', error);
      toast({
        title: "Erro ao criar leito",
        description: "Não foi possível criar o novo leito",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateBed = async (id: string, updates: Partial<SupabaseBed>) => {
    try {
      const { data, error } = await supabase
        .from('beds')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setBeds(prev => prev.map(bed => bed.id === id ? data : bed));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating bed:', error);
      toast({
        title: "Erro ao atualizar leito",
        description: "Não foi possível atualizar o leito",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteBed = async (id: string) => {
    try {
      const { error } = await supabase
        .from('beds')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBeds(prev => prev.filter(bed => bed.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting bed:', error);
      toast({
        title: "Erro ao excluir leito",
        description: "Não foi possível excluir o leito",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  return {
    beds,
    loading,
    createBed,
    updateBed,
    deleteBed,
    refetch: fetchBeds
  };
};
