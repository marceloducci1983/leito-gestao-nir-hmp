
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOccupationDaysUpdater = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateOccupationDays = async () => {
      try {
        console.log('Atualizando occupation_days para todos os pacientes...');
        
        // Buscar todos os pacientes e atualizar seus dias de ocupação
        const { data: patients, error: fetchError } = await supabase
          .from('patients')
          .select('id, admission_date')
          .not('admission_date', 'is', null);
        
        if (fetchError) {
          console.error('Erro ao buscar pacientes:', fetchError);
          return;
        }

        if (patients && patients.length > 0) {
          // Atualizar cada paciente com o cálculo correto de dias
          const updates = patients.map(patient => {
            const admissionDate = new Date(patient.admission_date);
            const currentDate = new Date();
            const diffTime = currentDate.getTime() - admissionDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            return supabase
              .from('patients')
              .update({ occupation_days: diffDays })
              .eq('id', patient.id);
          });

          const results = await Promise.allSettled(updates);
          
          const errors = results.filter(result => result.status === 'rejected');
          if (errors.length > 0) {
            console.error('Alguns updates falharam:', errors);
          } else {
            console.log('Occupation_days atualizados com sucesso');
          }
        }
        
        // Invalidar queries para refletir as mudanças
        queryClient.invalidateQueries({ queryKey: ['long_stay_patients'] });
        queryClient.invalidateQueries({ queryKey: ['beds'] });
      } catch (error) {
        console.error('Erro na atualização automática:', error);
      }
    };

    // Executar imediatamente
    updateOccupationDays();

    // Configurar execução a cada hora
    const interval = setInterval(updateOccupationDays, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [queryClient]);

  return null;
};
