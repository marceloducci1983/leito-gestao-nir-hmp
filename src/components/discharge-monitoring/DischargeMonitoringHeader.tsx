
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

interface DischargeMonitoringHeaderProps {
  pendingCount: number;
  totalProcessed: number;
  onRefresh: () => void;
}

const DischargeMonitoringHeader: React.FC<DischargeMonitoringHeaderProps> = ({
  pendingCount,
  totalProcessed,
  onRefresh
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Monitoramento de Altas</h1>
      <div className="flex gap-4 items-center">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {pendingCount} altas pendentes
        </Badge>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {totalProcessed} total processadas
        </Badge>
      </div>
    </div>
  );
};

export default DischargeMonitoringHeader;
