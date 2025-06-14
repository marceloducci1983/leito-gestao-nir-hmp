
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, Car, Ambulance } from 'lucide-react';
import { useConfirmAmbulanceTransport, useCancelAmbulanceTransport } from '@/hooks/mutations/useAmbulanceMutations';

interface AmbulanceRequest {
  id: string;
  patient_name: string;
  is_puerpera: boolean;
  appropriate_crib?: boolean;
  mobility: string;
  vehicle_type: string;
  vehicle_subtype?: string;
  origin_city: string;
  request_date: string;
  request_time: string;
  status: string;
  created_at: string;
}

interface AmbulanceRequestCardProps {
  request: AmbulanceRequest;
}

const AmbulanceRequestCard: React.FC<AmbulanceRequestCardProps> = ({ request }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  
  const confirmMutation = useConfirmAmbulanceTransport();
  const cancelMutation = useCancelAmbulanceTransport();

  useEffect(() => {
    if (request.status !== 'PENDING') return;

    const updateTimer = () => {
      const requestDateTime = new Date(`${request.request_date}T${request.request_time}`);
      const now = new Date();
      const diffMs = now.getTime() - requestDateTime.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [request.request_date, request.request_time, request.status]);

  const getStatusBadge = () => {
    switch (request.status) {
      case 'PENDING':
        return <Badge variant="default" className="bg-yellow-500">Pendente</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default" className="bg-green-500">Confirmado</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{request.status}</Badge>;
    }
  };

  const getVehicleIcon = () => {
    return request.vehicle_type === 'AMBULANCIA' ? <Ambulance className="h-4 w-4" /> : <Car className="h-4 w-4" />;
  };

  const getVehicleText = () => {
    if (request.vehicle_type === 'AMBULANCIA') {
      return `Ambulância ${request.vehicle_subtype || ''}`;
    }
    return 'Carro comum';
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{request.patient_name}</h3>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">Puérpera:</span>
              <span>{request.is_puerpera ? 'SIM' : 'NÃO'}</span>
            </div>
            
            {request.is_puerpera && request.appropriate_crib !== null && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium">Berço apropriado:</span>
                <span>{request.appropriate_crib ? 'SIM' : 'NÃO'}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">Mobilidade:</span>
              <span>{request.mobility}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              {getVehicleIcon()}
              <span className="font-medium">Veículo:</span>
              <span>{getVehicleText()}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Cidade:</span>
              <span>{request.origin_city}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Solicitado em:</span>
              <span>{new Date(request.request_date).toLocaleDateString('pt-BR')} às {request.request_time}</span>
            </div>
          </div>
        </div>

        {request.status === 'PENDING' && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-mono font-bold text-orange-600">
                {elapsedTime}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => cancelMutation.mutate(request.id)}
                disabled={cancelMutation.isPending}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                CANCELAR TRANSPORTE
              </Button>
              <Button
                onClick={() => confirmMutation.mutate(request.id)}
                disabled={confirmMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                CONFIRMAR TRANSPORTE
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AmbulanceRequestCard;
