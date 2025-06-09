
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
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        queryClient.invalidateQueries({ queryKey: ['beds'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bed_reservations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['beds'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patient_discharges' }, () => {
        queryClient.invalidateQueries({ queryKey: ['patient_discharges'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bedsChannel);
    };
  }, [queryClient]);
};
