
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAddReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, reservation }: { 
      bedId: string; 
      reservation: { 
        patient_name: string; 
        origin_clinic: string; 
        diagnosis: string; 
      } 
    }) => {
      // Buscar dados do leito para obter o departamento
      const { data: bed, error: bedError } = await supabase
        .from('beds')
        .select('department')
        .eq('id', bedId)
        .single();

      if (bedError) throw bedError;

      // Inserir a reserva
      const { data: reservationData, error: reservationError } = await supabase
        .from('bed_reservations')
        .insert({
          bed_id: bedId,
          patient_name: reservation.patient_name,
          origin_clinic: reservation.origin_clinic,
          diagnosis: reservation.diagnosis,
          department: bed.department
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Atualizar o leito como reservado
      const { error: bedUpdateError } = await supabase
        .from('beds')
        .update({ is_reserved: true })
        .eq('id', bedId);

      if (bedUpdateError) throw bedUpdateError;

      return reservationData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Leito reservado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao reservar leito:', error);
      toast.error('Erro ao reservar leito');
    }
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bedId: string) => {
      // Deletar a reserva
      const { error: deleteError } = await supabase
        .from('bed_reservations')
        .delete()
        .eq('bed_id', bedId);

      if (deleteError) throw deleteError;

      // Atualizar o leito como não reservado
      const { error: bedUpdateError } = await supabase
        .from('beds')
        .update({ is_reserved: false })
        .eq('id', bedId);

      if (bedUpdateError) throw bedUpdateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Reserva removida com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover reserva:', error);
      toast.error('Erro ao remover reserva');
    }
  });
};
