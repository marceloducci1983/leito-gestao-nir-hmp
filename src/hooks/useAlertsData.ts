
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateInvestigationId } from '@/utils/investigationUtils';

export const useAlertsData = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Query para buscar pacientes com internação longa usando cálculo em tempo real
  const { data: longStayPatients = [], isLoading: longStayLoading } = useQuery({
    queryKey: ['long_stay_patients'],
    queryFn: async () => {
      console.log('Buscando pacientes com internação longa...');
      
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          beds!inner(name, department)
        `)
        .gte('occupation_days', 15)
        .order('occupation_days', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar pacientes com internação longa:', error);
        throw error;
      }
      
      // Transformar dados para o formato esperado pelo componente
      const transformedData = data?.map(patient => ({
        ...patient,
        admissionDate: patient.admission_date,
        admissionTime: patient.admission_time,
        originCity: patient.origin_city,
        expectedDischargeDate: patient.expected_discharge_date,
        isTFD: patient.is_tfd,
        tfdType: patient.tfd_type,
        // Calcular dias reais de internação em tempo real
        calculatedDays: Math.floor((new Date().getTime() - new Date(patient.admission_date).getTime()) / (1000 * 60 * 60 * 24))
      })) || [];
      
      console.log('Pacientes com internação longa encontrados:', transformedData);
      return transformedData;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos para manter atualizado
    staleTime: 2 * 60 * 1000 // Considerar dados obsoletos após 2 minutos
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
    },
    refetchInterval: 10 * 60 * 1000 // Refetch a cada 10 minutos
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
      // Usar os dias calculados em tempo real para ordenação
      const daysA = a.calculatedDays || a.occupation_days || 0;
      const daysB = b.calculatedDays || b.occupation_days || 0;
      
      if (sortOrder === 'asc') {
        return daysA - daysB;
      }
      return daysB - daysA;
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
