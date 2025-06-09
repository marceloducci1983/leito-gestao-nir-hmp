
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BedReservation } from '@/types';
import { toast } from 'sonner';

export const useAddReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, reservation }: { bedId: string; reservation: Omit<BedReservation, 'id' | 'bedId'> }) => {
      const { error: reservationError } = await supabase
        .from('bed_reservations')
        .insert({
          patient_name: reservation.patientName,
          origin_clinic: reservation.originClinic,
          diagnosis: reservation.diagnosis,
          bed_id: bedId,
          department: reservation.department as any
        });

      if (reservationError) throw reservationError;

      const { error: bedError } = await supabase
        .from('beds')
        .update({ is_reserved: true })
        .eq('id', bedId);

      if (bedError) throw bedError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Reserva criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar reserva:', error);
      toast.error('Erro ao criar reserva');
    }
  });
};
