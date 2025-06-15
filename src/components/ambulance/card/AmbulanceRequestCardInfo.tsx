
import React from 'react';
import { MapPin, User, Bed, Car, Phone, Clock, Baby } from 'lucide-react';

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
  contact?: string;
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
  requestTime,
  contact
}) => {
  const formatVehicleType = () => {
    if (vehicleType === 'AMBULANCIA') {
      return vehicleSubtype ? `Ambulância ${vehicleSubtype}` : 'Ambulância';
    }
    return 'Carro Comum';
  };

  const formatDateTime = () => {
    const date = new Date(requestDate);
    const formattedDate = date.toLocaleDateString('pt-BR');
    return `${formattedDate} às ${requestTime}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-blue-600" />
        <span><strong>Setor:</strong> {sector || 'Não informado'}</span>
      </div>

      <div className="flex items-center gap-2">
        <Bed className="w-4 h-4 text-green-600" />
        <span><strong>Leito:</strong> {bed || 'Não informado'}</span>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-red-600" />
        <span><strong>Origem:</strong> {originCity}</span>
      </div>

      {contact && (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-purple-600" />
          <span><strong>Contato:</strong> {contact}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Car className="w-4 h-4 text-orange-600" />
        <span><strong>Veículo:</strong> {formatVehicleType()}</span>
      </div>

      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-indigo-600" />
        <span><strong>Mobilidade:</strong> {mobility}</span>
      </div>

      <div className="flex items-center gap-2 md:col-span-2">
        <Clock className="w-4 h-4 text-gray-600" />
        <span><strong>Solicitado em:</strong> {formatDateTime()}</span>
      </div>

      {isPuerpera && (
        <div className="flex items-center gap-2 md:col-span-2">
          <Baby className="w-4 h-4 text-pink-600" />
          <span className="text-pink-700 font-medium">
            Puérpera {appropriateCrib ? '(com berço apropriado)' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default AmbulanceRequestCardInfo;
