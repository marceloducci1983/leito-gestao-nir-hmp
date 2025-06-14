
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateInvestigationId } from '@/utils/investigationUtils';

export const useAlertsData = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Query para buscar pacientes com internação longa
  const { data: longStayPatients = [], isLoading: longStayLoading } = useQuery({
    queryKey: ['long_stay_patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .gte('occupation_days', 15);
      
      if (error) {
        console.error('Erro ao buscar pacientes com internação longa:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  // Query para buscar reinternações em 30 dias
  const { data: readmissions = [], isLoading: readmissionsLoading } = useQuery({
    queryKey: ['readmissions'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_readmissions_within_30_days');
      
      if (error) {
        console.error('Erro ao buscar reinternações:', error);
        throw error;
      }
      
      console.log('Reinternações carregadas:', data);
      return data || [];
    }
  });

  // Query para buscar investigações
  const { data: investigations = [] } = useQuery({
    queryKey: ['alert_investigations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_investigations')
        .select('*');
      
      if (error) {
        console.error('Erro ao buscar investigações:', error);
        throw error;
      }
      
      console.log('Investigações carregadas:', data);
      return data || [];
    }
  });

  // Função para buscar status de investigação usando alert_key
  const getInvestigationStatus = useMemo(() => {
    return (alertKey: string, alertType: 'long_stay' | 'readmission_30_days') => {
      console.log('Buscando investigação para:', { alertKey, alertType });
      
      const investigation = investigations.find(inv => {
        const match = inv.alert_key === alertKey && inv.alert_type === alertType;
        console.log('Comparando investigação:', {
          investigationAlertKey: inv.alert_key,
          investigationAlertType: inv.alert_type,
          searchAlertKey: alertKey,
          searchAlertType: alertType,
          match
        });
        return match;
      });
      
      console.log('Investigação encontrada:', investigation);
      return investigation;
    };
  }, [investigations]);

  // Pacientes com internação longa ordenados
  const sortedLongStayPatients = useMemo(() => {
    const sorted = [...longStayPatients].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.occupation_days - b.occupation_days;
      }
      return b.occupation_days - a.occupation_days;
    });
    
    console.log('Pacientes com internação longa ordenados:', sorted);
    return sorted;
  }, [longStayPatients, sortOrder]);

  const isLoading = longStayLoading || readmissionsLoading;

  return {
    longStayPatients: sortedLongStayPatients,
    readmissions,
    getInvestigationStatus,
    sortOrder,
    setSortOrder,
    isLoading
  };
};
