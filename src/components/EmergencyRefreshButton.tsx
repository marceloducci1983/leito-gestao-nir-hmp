import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const EmergencyRefreshButton: React.FC = () => {
  const queryClient = useQueryClient();

  const handleEmergencyRefresh = async () => {
    try {
      console.log('🚨 REFRESH DE EMERGÊNCIA INICIADO - LIMPEZA TOTAL');
      
      // Step 1: Clear all cache aggressively
      console.log('🧹 Limpando todo o cache...');
      queryClient.clear();
      
      // Step 2: Remove all cached data for specific queries
      console.log('🗑️ Removendo cache específico...');
      queryClient.removeQueries({ queryKey: ['beds'] });
      queryClient.removeQueries({ queryKey: ['discharged-patients'] });
      queryClient.removeQueries({ queryKey: ['discharge-control'] });
      queryClient.removeQueries({ queryKey: ['department-stats'] });
      
      // Step 3: Force invalidate and refetch
      console.log('🔄 Forçando nova busca...');
      await queryClient.invalidateQueries({ queryKey: ['beds'] });
      await queryClient.invalidateQueries({ queryKey: ['discharged-patients'] });
      await queryClient.invalidateQueries({ queryKey: ['discharge-control'] });
      await queryClient.invalidateQueries({ queryKey: ['department-stats'] });
      
      // Step 4: Force a complete reload
      console.log('⚡ Forçando reload completo...');
      await queryClient.refetchQueries({ queryKey: ['beds'] });
      
      toast.success('🎉 Sistema totalmente sincronizado!');
      console.log('✅ REFRESH DE EMERGÊNCIA CONCLUÍDO');
      
    } catch (error) {
      console.error('❌ Erro no refresh de emergência:', error);
      toast.error('Erro ao sincronizar sistema');
    }
  };

  return (
    <Button
      onClick={handleEmergencyRefresh}
      variant="outline"
      size="sm"
      className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
    >
      <RefreshCw className="h-4 w-4 mr-2" />
      Sincronizar Dados
    </Button>
  );
};

export default EmergencyRefreshButton;