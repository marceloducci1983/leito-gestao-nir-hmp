
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOccupationDaysUpdater = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateOccupationDays = async () => {
      try {
        console.log('Atualizando occupation_days para todos os pacientes...');
        
        // Atualizar todos os pacientes com o cálculo correto de dias
        const { error } = await supabase.rpc('update_all_occupation_days');
        
        if (error) {
          console.error('Erro ao atualizar occupation_days:', error);
        } else {
          console.log('Occupation_days atualizados com sucesso');
          // Invalidar queries para refletir as mudanças
          queryClient.invalidateQueries({ queryKey: ['long_stay_patients'] });
          queryClient.invalidateQueries({ queryKey: ['beds'] });
        }
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
