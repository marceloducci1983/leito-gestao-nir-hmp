import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, User, MapPin, Car, Bed, Building } from 'lucide-react';
import { useConfirmAmbulanceTransport, useCancelAmbulanceTransport } from '@/hooks/mutations/useAmbulanceMutations';
import { formatDateSaoPaulo, formatTimeSaoPaulo } from '@/utils/timezoneUtils';
import { fromZonedTime } from 'date-fns-tz';
import AmbulanceTimer from './AmbulanceTimer';

interface AmbulanceRequest {
  id: string;
  patient_name: string;
  sector?: string;
  bed?: string;
  is_puerpera: boolean;
  appropriate_crib?: boolean;
  mobility: string;
  vehicle_type: string;
  vehicle_subtype?: string;
  origin_city: string;
  request_date: string;
  request_time: string;
  status: string;
  confirmed_at?: string;
  cancelled_at?: string;
  created_at: string;
}

interface AmbulanceRequestCardProps {
  request: AmbulanceRequest;
}

const AmbulanceRequestCard: React.FC<AmbulanceRequestCardProps> = ({ request }) => {
  const confirmMutation = useConfirmAmbulanceTransport();
  const cancelMutation = useCancelAmbulanceTransport();

  const getStatusBadge = () => {
    switch (request.status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'CONFIRMED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmado</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getVehicleInfo = () => {
    if (request.vehicle_type === 'AMBULANCIA') {
      return `Ambulância ${request.vehicle_subtype || 'Básica'}`;
    }
    return 'Carro Comum';
  };

  const handleConfirm = () => {
    confirmMutation.mutate(request.id);
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar esta solicitação?')) {
      cancelMutation.mutate(request.id);
    }
  };

  const formatRequestDateTime = () => {
    try {
      // Combinar data e hora da solicitação
      const dateTimeString = `${request.request_date}T${request.request_time}`;
      const requestDateTime = new Date(dateTimeString);
      
      // Tratar a data/hora como horário de Brasília (não UTC)
      const saoPauloDate = fromZonedTime(requestDateTime, 'America/Sao_Paulo');
      
      return `${formatDateSaoPaulo(saoPauloDate)} às ${formatTimeSaoPaulo(saoPauloDate)}`;
    } catch (error) {
      console.error('Error formatting request date/time:', error);
      return `${request.request_date} às ${request.request_time}`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{request.patient_name}</span>
            {request.is_puerpera && (
              <Badge variant="secondary" className="ml-2">Puérpera</Badge>
            )}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {request.sector && (
              <div className="flex items-center space-x-2 text-sm">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Setor:</span>
                <span>{request.sector}</span>
              </div>
            )}
            
            {request.bed && (
              <div className="flex items-center space-x-2 text-sm">
                <Bed className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Leito:</span>
                <span>{request.bed}</span>
              </div>
            )}

            {/* ORIGEM COM DESTAQUE */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg rounded-lg p-3 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-800 text-base">Origem:</span>
                <span className="font-semibold text-green-700 text-lg">{request.origin_city}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <Car className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Veículo:</span>
              <span>{getVehicleInfo()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Mobilidade:</span>
              <span className="ml-2">{request.mobility}</span>
            </div>

            {request.is_puerpera && request.appropriate_crib && (
              <div className="text-sm">
                <span className="font-medium text-green-600">✓ Berço apropriado</span>
              </div>
            )}

            <div className="text-sm">
              <span className="font-medium">Data/Hora:</span>
              <span className="ml-2">
                {formatRequestDateTime()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          {/* TEMPO COM DESTAQUE */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <div className="flex flex-col">
                <span className="font-bold text-blue-800 text-base">Tempo:</span>
                <AmbulanceTimer 
                  createdAt={request.created_at}
                  status={request.status}
                  confirmedAt={request.confirmed_at}
                  cancelledAt={request.cancelled_at}
                />
              </div>
            </div>
          </div>

          {request.status === 'PENDING' && (
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
      </CardContent>
    </Card>
  );
};

export default AmbulanceRequestCard;
