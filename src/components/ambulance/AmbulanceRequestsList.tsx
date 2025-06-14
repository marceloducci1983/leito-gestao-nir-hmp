
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAmbulanceRequests } from '@/hooks/queries/useAmbulanceQueries';
import AmbulanceRequestCard from './AmbulanceRequestCard';

const AmbulanceRequestsList: React.FC = () => {
  const { data: requests = [], isLoading } = useAmbulanceRequests();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando solicitações...</div>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'PENDING');
  const completedRequests = requests.filter(req => req.status !== 'PENDING');

  return (
    <div className="space-y-6">
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-600">
            Solicitações Pendentes ({pendingRequests.length})
          </h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <AmbulanceRequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {completedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-600">
            Histórico ({completedRequests.length})
          </h3>
          <div className="space-y-4">
            {completedRequests.map((request) => (
              <AmbulanceRequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma solicitação de ambulância encontrada.</p>
            <p className="text-sm text-gray-400 mt-2">
              Clique em "NOVA SOLICITAÇÃO" para criar a primeira solicitação.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AmbulanceRequestsList;
