
import React from 'react';
import { Button } from '@/components/ui/button';

interface AvailableBedActionsProps {
  onReserveBed: () => void;
  onAdmitPatient: () => void;
}

export const AvailableBedActions: React.FC<AvailableBedActionsProps> = ({
  onReserveBed,
  onAdmitPatient
}) => {
  return (
    <div className="space-y-2">
      <Button 
        size="sm" 
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        onClick={onReserveBed}
      >
        RESERVAR LEITO
      </Button>
      <Button 
        size="sm" 
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        onClick={onAdmitPatient}
      >
        ADMITIR PACIENTE
      </Button>
    </div>
  );
};
