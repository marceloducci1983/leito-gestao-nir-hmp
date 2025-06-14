
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AmbulanceRequestData {
  patient_name: string;
  sector: string;
  bed: string;
  is_puerpera: boolean;
  appropriate_crib?: boolean;
  mobility: 'DEITADO' | 'SENTADO';
  vehicle_type: 'AMBULANCIA' | 'CARRO_COMUM';
  vehicle_subtype?: 'BASICA' | 'AVANCADA';
  origin_city: string;
}

export const useCreateAmbulanceRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AmbulanceRequestData) => {
      console.log('🚑 Criando solicitação de ambulância:', data);
      
      const { data: result, error } = await supabase
        .from('ambulance_requests')
        .insert([data])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar solicitação:', error);
        throw error;
      }
      
      return result;
    },
    onSuccess: () => {
      toast.success('Solicitação de ambulância criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['ambulance_requests'] });
      queryClient.invalidateQueries({ queryKey: ['ambulance_stats_by_city'] });
    },
    onError: (error) => {
      console.error('Erro na mutation:', error);
      toast.error('Erro ao criar solicitação de ambulância');
    }
  });
};

export const useConfirmAmbulanceTransport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      console.log('✅ Confirmando transporte:', requestId);
      
      const { data, error } = await supabase.rpc('confirm_ambulance_transport', {
        p_request_id: requestId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Transporte confirmado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['ambulance_requests'] });
      queryClient.invalidateQueries({ queryKey: ['ambulance_stats_by_city'] });
    },
    onError: () => {
      toast.error('Erro ao confirmar transporte');
    }
  });
};

export const useCancelAmbulanceTransport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      console.log('❌ Cancelando transporte:', requestId);
      
      const { data, error } = await supabase.rpc('cancel_ambulance_transport', {
        p_request_id: requestId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Transporte cancelado');
      queryClient.invalidateQueries({ queryKey: ['ambulance_requests'] });
    },
    onError: () => {
      toast.error('Erro ao cancelar transporte');
    }
  });
};
