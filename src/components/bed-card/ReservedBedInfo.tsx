
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, MapPin, Stethoscope, X } from 'lucide-react';

interface ReservationData {
  id: string;
  patientName: string;
  originClinic: string;
  diagnosis: string;
}

interface ReservedBedInfoProps {
  reservation: ReservationData;
  onAdmitPatient: () => void;
  onDeleteReservation: () => void;
}

export const ReservedBedInfo: React.FC<ReservedBedInfoProps> = ({
  reservation,
  onAdmitPatient,
  onDeleteReservation
}) => {
  return (
    <div className="space-y-2">
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span className="font-medium">{reservation.patientName}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{reservation.originClinic}</span>
        </div>
        <div className="flex items-center gap-1">
          <Stethoscope className="h-3 w-3" />
          <span>{reservation.diagnosis}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <Button 
          size="sm" 
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={onAdmitPatient}
        >
          ADMITIR
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onDeleteReservation}
          className="px-2 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
