
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSubscriptions = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const bedsChannel = supabase
      .channel('beds-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, () => {
        queryClient.invalidateQueries({ queryKey: ['beds'] });
        queryClient.invalidateQueries({ queryKey: ['department_stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        queryClient.invalidateQueries({ queryKey: ['beds'] });
        queryClient.invalidateQueries({ queryKey: ['department_stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bed_reservations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['beds'] });
        queryClient.invalidateQueries({ queryKey: ['department_stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patient_discharges' }, () => {
        queryClient.invalidateQueries({ queryKey: ['patient_discharges'] });
        queryClient.invalidateQueries({ queryKey: ['readmissions'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discharge_control' }, () => {
        queryClient.invalidateQueries({ queryKey: ['discharge_control'] });
        queryClient.invalidateQueries({ queryKey: ['discharge_stats_department'] });
        queryClient.invalidateQueries({ queryKey: ['discharge_stats_city'] });
        queryClient.invalidateQueries({ queryKey: ['delayed_discharges'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bedsChannel);
    };
  }, [queryClient]);
};
