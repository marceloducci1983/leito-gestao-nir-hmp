
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSubscriptions = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Configurando subscrições em tempo real...');
    
    const bedsChannel = supabase
      .channel('beds-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, (payload) => {
        console.log('Mudança em beds:', payload);
        queryClient.invalidateQueries({ queryKey: ['beds'] });
        queryClient.invalidateQueries({ queryKey: ['department_stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, (payload) => {
        console.log('Mudança em patients:', payload);
        queryClient.invalidateQueries({ queryKey: ['beds'] });
        queryClient.invalidateQueries({ queryKey: ['department_stats'] });
        queryClient.invalidateQueries({ queryKey: ['long_stay_patients'] }); // Adicionar invalidação para alertas
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bed_reservations' }, (payload) => {
        console.log('Mudança em bed_reservations:', payload);
        queryClient.invalidateQueries({ queryKey: ['beds'] });
        queryClient.invalidateQueries({ queryKey: ['department_stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patient_discharges' }, (payload) => {
        console.log('Mudança em patient_discharges:', payload);
        queryClient.invalidateQueries({ queryKey: ['patient_discharges'] });
        queryClient.invalidateQueries({ queryKey: ['readmissions'] });
        queryClient.invalidateQueries({ queryKey: ['long_stay_patients'] }); // Invalidar para atualizar alertas
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discharge_control' }, (payload) => {
        console.log('Mudança em discharge_control:', payload);
        queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
        queryClient.invalidateQueries({ queryKey: ['discharge_stats_department'] });
        queryClient.invalidateQueries({ queryKey: ['discharge_stats_city'] });
        queryClient.invalidateQueries({ queryKey: ['delayed_discharges'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alert_investigations' }, (payload) => {
        console.log('Mudança em alert_investigations:', payload);
        queryClient.invalidateQueries({ queryKey: ['alert_investigations'] });
      })
      .subscribe((status) => {
        console.log('Status da subscrição realtime:', status);
      });

    return () => {
      console.log('Removendo subscrições em tempo real...');
      supabase.removeChannel(bedsChannel);
    };
  }, [queryClient]);
};
