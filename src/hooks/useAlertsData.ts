
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';

export const useAlertsData = () => {
  const { centralData, isLoading: bedsLoading } = useSupabaseBeds();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Buscar reinternações em menos de 30 dias
  const { data: readmissions = [], isLoading: readmissionsLoading } = useQuery({
    queryKey: ['readmissions'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_readmissions_within_30_days');
      if (error) throw error;
      return data;
    }
  });

  // Buscar investigações
  const { data: investigations = [], isLoading: investigationsLoading } = useQuery({
    queryKey: ['alert_investigations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_investigations')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Calcular pacientes com mais de 15 dias
  const longStayPatients = useMemo(() => {
    return centralData.beds
      .filter(bed => bed.isOccupied && bed.patient)
      .map(bed => bed.patient)
      .filter(patient => {
        const admissionDate = new Date(patient.admissionDate);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 15;
      })
      .sort((a, b) => {
        const daysA = Math.floor((new Date().getTime() - new Date(a.admissionDate).getTime()) / (1000 * 60 * 60 * 24));
        const daysB = Math.floor((new Date().getTime() - new Date(b.admissionDate).getTime()) / (1000 * 60 * 60 * 24));
        return sortOrder === 'desc' ? daysB - daysA : daysA - daysB;
      });
  }, [centralData.beds, sortOrder]);

  const getInvestigationStatus = (patientId: string, alertType: 'long_stay' | 'readmission_30_days') => {
    return investigations.find(inv => inv.patient_id === patientId && inv.alert_type === alertType);
  };

  return {
    longStayPatients,
    readmissions,
    investigations,
    getInvestigationStatus,
    sortOrder,
    setSortOrder,
    isLoading: bedsLoading || readmissionsLoading || investigationsLoading
  };
};
