
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, ArrowRightLeft, LogOut, Loader2 } from 'lucide-react';

interface PatientActionButtonsProps {
  onEditPatient: () => void;
  onTransferPatient: () => void;
  onDischargePatient: () => void;
  isDischarging?: boolean;
}

export const PatientActionButtons: React.FC<PatientActionButtonsProps> = ({
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  isDischarging = false
}) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {/* Edit Button */}
      <Button 
        size="sm" 
        onClick={onEditPatient}
        disabled={isDischarging}
        className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
        <Edit className="h-4 w-4 mr-2 relative z-10" />
        <span className="relative z-10">EDITAR</span>
      </Button>

      {/* Transfer Button */}
      <Button 
        size="sm" 
        onClick={onTransferPatient}
        disabled={isDischarging}
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
        <ArrowRightLeft className="h-4 w-4 mr-2 relative z-10" />
        <span className="relative z-10">TRANSFERIR</span>
      </Button>

      {/* Discharge Button */}
      <Button 
        size="sm" 
        onClick={onDischargePatient}
        disabled={isDischarging}
        className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
        {isDischarging ? (
          <Loader2 className="h-4 w-4 mr-2 relative z-10 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4 mr-2 relative z-10" />
        )}
        <span className="relative z-10">
          {isDischarging ? 'PROCESSANDO...' : 'DAR ALTA'}
        </span>
      </Button>
    </div>
  );
};
