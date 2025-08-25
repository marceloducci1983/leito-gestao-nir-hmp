import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const SuperEmergencyRefreshButton: React.FC = () => {
  const queryClient = useQueryClient();

  const handleSuperEmergencyRefresh = async () => {
    try {
      console.log('🚨🚨 SUPER REFRESH DEFINITIVO INICIADO 🚨🚨');
      
      // Step 1: Force page reload after clearing everything
      toast.success('🔄 Reiniciando aplicação completamente...');
      
      // Clear everything
      queryClient.clear();
      queryClient.removeQueries();
      
      // Force full page reload after brief delay
      setTimeout(() => {
        console.log('🔃 FORÇANDO RELOAD COMPLETO DA PÁGINA');
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error('❌ Erro no super refresh:', error);
      toast.error('Erro ao reiniciar aplicação');
    }
  };

  return (
    <Button
      onClick={handleSuperEmergencyRefresh}
      variant="destructive"
      size="sm"
      className="bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      RESET TOTAL
    </Button>
  );
};

export default SuperEmergencyRefreshButton;