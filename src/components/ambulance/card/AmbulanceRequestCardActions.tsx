
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useConfirmAmbulanceTransport, useCancelAmbulanceTransport } from '@/hooks/mutations/useAmbulanceMutations';
import AmbulanceTimer from '../AmbulanceTimer';

interface AmbulanceRequestCardActionsProps {
  requestId: string;
  status: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

const AmbulanceRequestCardActions: React.FC<AmbulanceRequestCardActionsProps> = ({
  requestId,
  status,
  createdAt,
  confirmedAt,
  cancelledAt
}) => {
  const confirmMutation = useConfirmAmbulanceTransport();
  const cancelMutation = useCancelAmbulanceTransport();

  const handleConfirm = () => {
    confirmMutation.mutate(requestId);
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar esta solicitação?')) {
      cancelMutation.mutate(requestId);
    }
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      {/* TEMPO COM DESTAQUE */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-bold text-blue-800 text-base">Tempo:</span>
            <AmbulanceTimer 
              createdAt={createdAt}
              status={status}
              confirmedAt={confirmedAt}
              cancelledAt={cancelledAt}
            />
          </div>
        </div>
      </div>

      {status === 'PENDING' && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={confirmMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Confirmar
          </Button>
        </div>
      )}
    </div>
  );
};

export default AmbulanceRequestCardActions;
