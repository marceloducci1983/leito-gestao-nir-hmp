
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, ArrowRightLeft, LogOut, Loader2, Shield, ShieldAlert } from 'lucide-react';

interface PatientActionButtonsProps {
  onEditPatient: () => void;
  onTransferPatient: () => void;
  onDischargePatient: () => void;
  onToggleIsolation?: (patientId: string) => void;
  patientId?: string;
  isIsolation?: boolean;
  isDischarging?: boolean;
  isMobile?: boolean;
}

export const PatientActionButtons: React.FC<PatientActionButtonsProps> = ({
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onToggleIsolation,
  patientId,
  isIsolation = false,
  isDischarging = false,
  isMobile = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDischargeClick = async () => {
    console.log('🔴 Botão DAR ALTA clicado');
    
    if (isProcessing || isDischarging) {
      console.log('⚠️ Já está processando, ignorando clique');
      return;
    }
    
    setIsProcessing(true);
    console.log('⚡ Chamando onDischargePatient...');
    
    try {
      await onDischargePatient();
      console.log('✅ onDischargePatient executado com sucesso');
    } catch (error) {
      console.error('❌ Erro em onDischargePatient:', error);
    } finally {
      // Reset após 2 segundos para permitir nova tentativa se necessário
      setTimeout(() => {
        console.log('🔄 Resetando estado de processamento');
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleIsolationToggle = () => {
    if (onToggleIsolation && patientId) {
      onToggleIsolation(patientId);
    }
  };

  const isDisabled = isDischarging || isProcessing;

  return (
    <div className="grid grid-cols-1 gap-2">
      {/* Edit Button */}
      <Button 
        size={isMobile ? "default" : "sm"}
        onClick={onEditPatient}
        disabled={isDisabled}
        className={`w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isMobile ? 'h-12 text-base' : ''}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
        <Edit className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} mr-2 relative z-10`} />
        <span className="relative z-10">{isMobile ? 'EDITAR PACIENTE' : 'EDITAR'}</span>
      </Button>

      {/* Transfer Button */}
      <Button 
        size={isMobile ? "default" : "sm"}
        onClick={onTransferPatient}
        disabled={isDisabled}
        className={`w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isMobile ? 'h-12 text-base' : ''}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
        <ArrowRightLeft className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} mr-2 relative z-10`} />
        <span className="relative z-10">TRANSFERIR</span>
      </Button>

      {/* Discharge Button */}
      <Button 
        size={isMobile ? "default" : "sm"}
        onClick={handleDischargeClick}
        disabled={isDisabled}
        className={`w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isMobile ? 'h-12 text-base' : ''}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
        {isDisabled ? (
          <Loader2 className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} mr-2 relative z-10 animate-spin`} />
        ) : (
          <LogOut className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} mr-2 relative z-10`} />
        )}
        <span className="relative z-10">
          {isDisabled ? 'PROCESSANDO...' : 'DAR ALTA'}
        </span>
      </Button>

      {/* Isolation Button */}
      {onToggleIsolation && (
        <Button 
          size="sm"
          onClick={handleIsolationToggle}
          disabled={isDisabled}
          className={`w-full ${isIsolation 
            ? 'bg-gray-500 hover:bg-gray-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700'
          } shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {isIsolation ? (
            <ShieldAlert className="h-3 w-3 mr-1.5" />
          ) : (
            <Shield className="h-3 w-3 mr-1.5" />
          )}
          <span className="text-xs font-medium">ISOLAMENTO</span>
        </Button>
      )}
    </div>
  );
};
