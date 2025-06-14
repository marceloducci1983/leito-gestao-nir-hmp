
import React from 'react';
import { Car, Bed, Building, MapPin } from 'lucide-react';
import { formatDateSaoPaulo, formatTimeSaoPaulo } from '@/utils/timezoneUtils';
import { fromZonedTime } from 'date-fns-tz';

interface AmbulanceRequestCardInfoProps {
  sector?: string;
  bed?: string;
  originCity: string;
  vehicleType: string;
  vehicleSubtype?: string;
  mobility: string;
  isPuerpera: boolean;
  appropriateCrib?: boolean;
  requestDate: string;
  requestTime: string;
}

const AmbulanceRequestCardInfo: React.FC<AmbulanceRequestCardInfoProps> = ({
  sector,
  bed,
  originCity,
  vehicleType,
  vehicleSubtype,
  mobility,
  isPuerpera,
  appropriateCrib,
  requestDate,
  requestTime
}) => {
  const getVehicleInfo = () => {
    if (vehicleType === 'AMBULANCIA') {
      return `Ambulância ${vehicleSubtype || 'Básica'}`;
    }
    return 'Carro Comum';
  };

  const formatRequestDateTime = () => {
    try {
      // Combinar data e hora da solicitação
      const dateTimeString = `${requestDate}T${requestTime}`;
      const requestDateTime = new Date(dateTimeString);
      
      // Tratar a data/hora como horário de Brasília (não UTC)
      const saoPauloDate = fromZonedTime(requestDateTime, 'America/Sao_Paulo');
      
      return `${formatDateSaoPaulo(saoPauloDate)} às ${formatTimeSaoPaulo(saoPauloDate)}`;
    } catch (error) {
      console.error('Error formatting request date/time:', error);
      return `${requestDate} às ${requestTime}`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        {sector && (
          <div className="flex items-center space-x-2 text-sm">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Setor:</span>
            <span>{sector}</span>
          </div>
        )}
        
        {bed && (
          <div className="flex items-center space-x-2 text-sm">
            <Bed className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Leito:</span>
            <span>{bed}</span>
          </div>
        )}

        {/* ORIGEM COM DESTAQUE - TAMANHO REDUZIDO */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg rounded-lg p-3 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span className="font-bold text-green-800 text-xs">Origem:</span>
            <span className="font-semibold text-green-700 text-base">{originCity}</span>
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
          <span className="ml-2">{mobility}</span>
        </div>

        {isPuerpera && appropriateCrib && (
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
  );
};

export default AmbulanceRequestCardInfo;
