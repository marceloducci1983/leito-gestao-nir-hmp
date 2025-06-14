
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface AmbulanceRequestCardHeaderProps {
  patientName: string;
  isPuerpera: boolean;
  status: string;
}

const AmbulanceRequestCardHeader: React.FC<AmbulanceRequestCardHeaderProps> = ({
  patientName,
  isPuerpera,
  status
}) => {
  const getStatusBadge = () => {
    switch (status) {
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

  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg flex items-center space-x-2">
        <User className="h-5 w-5" />
        <span>{patientName}</span>
        {isPuerpera && (
          <Badge variant="secondary" className="ml-2">Puérpera</Badge>
        )}
      </CardTitle>
      {getStatusBadge()}
    </div>
  );
};

export default AmbulanceRequestCardHeader;
