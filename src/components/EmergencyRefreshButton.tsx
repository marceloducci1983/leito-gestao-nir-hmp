import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const EmergencyRefreshButton: React.FC = () => {
  const queryClient = useQueryClient();

  const handleEmergencyRefresh = async () => {
    try {
      console.log('🚨 REFRESH DE EMERGÊNCIA INICIADO');
      
      // Clear all cache
      queryClient.clear();
      
      // Force invalidate specific queries
      await queryClient.invalidateQueries({ queryKey: ['beds'] });
      await queryClient.invalidateQueries({ queryKey: ['discharged-patients'] });
      
      toast.success('Sistema sincronizado - dados atualizados!');
      
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