
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Stethoscope, Edit, ArrowRightLeft, LogOut, Loader2, Shield, ShieldAlert } from 'lucide-react';
import { getBedStatusColor } from './bed-card/BedStatus';
import { BedHeader } from './bed-card/BedHeader';
import { AvailableBedActions } from './bed-card/AvailableBedActions';
import { ReservedBedInfo } from './bed-card/ReservedBedInfo';
import { useResponsive } from '@/hooks/useResponsive';
import { formatDate } from '@/utils/dateUtils';

interface ResponsiveBedCardProps {
  bed: {
    id: string;
    name: string;
    department: string;
    isOccupied: boolean;
    isReserved: boolean;
    isCustom?: boolean;
    patient?: {
      id: string;
      name: string;
      sex: string;
      birthDate: string;
      age: number;
      admissionDate: string;
      admissionTime?: string;
      diagnosis: string;
      specialty?: string;
      expectedDischargeDate: string;
      originCity: string;
      occupationDays: number;
      isTFD: boolean;
      tfdType?: string;
      isIsolation?: boolean;
    };
    reservation?: {
      id: string;
      patientName: string;
      originClinic: string;
      diagnosis: string;
    };
  };
  onReserveBed: (bedId: string) => void;
  onAdmitPatient: (bedId: string) => void;
  onEditPatient: (bedId: string) => void;
  onTransferPatient: (bedId: string) => void;
  onDischargePatient: (bedId: string) => void;
  onDeleteReservation: (bedId: string) => void;
  onDeleteBed?: (bedId: string) => void;
  onToggleIsolation?: (patientId: string) => void;
  editMode?: boolean;
  isDischarging?: boolean;
}

const ResponsiveBedCard: React.FC<ResponsiveBedCardProps> = ({
  bed,
  onReserveBed,
  onAdmitPatient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onDeleteReservation,
  onDeleteBed,
  onToggleIsolation,
  editMode = false,
  isDischarging = false
}) => {
  const { isMobile, isTablet } = useResponsive();

  const calculateOccupationDays = (admissionDate: string) => {
    const admission = new Date(admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admission.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Mobile Patient Action Buttons Component
  const MobilePatientActions = () => (
    <div className="grid grid-cols-1 gap-3 mt-4">
      <Button 
        size={isMobile ? "default" : "sm"}
        onClick={() => onEditPatient(bed.id)}
        disabled={isDischarging}
        className="w-full h-12 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 text-white font-bold shadow-lg"
      >
        <Edit className="h-5 w-5 mr-2" />
        <span>EDITAR PACIENTE</span>
      </Button>

      <Button 
        size={isMobile ? "default" : "sm"}
        onClick={() => onTransferPatient(bed.id)}
        disabled={isDischarging}
        className="w-full h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 text-white font-bold shadow-lg"
      >
        <ArrowRightLeft className="h-5 w-5 mr-2" />
        <span>TRANSFERIR</span>
      </Button>

      <Button 
        size={isMobile ? "default" : "sm"}
        onClick={() => onDischargePatient(bed.id)}
        disabled={isDischarging}
        className="w-full h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold shadow-lg"
      >
        {isDischarging ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <LogOut className="h-5 w-5 mr-2" />
        )}
        <span>
          {isDischarging ? 'PROCESSANDO...' : 'DAR ALTA'}
        </span>
      </Button>

      {onToggleIsolation && bed.patient && (
        <Button 
          size="sm"
          onClick={() => onToggleIsolation(bed.patient!.id)}
          disabled={isDischarging}
          className={`w-full ${bed.patient.isIsolation 
            ? 'bg-gray-500 hover:bg-gray-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700'
          } shadow-md hover:shadow-lg transition-all duration-200`}
        >
          {bed.patient.isIsolation ? (
            <ShieldAlert className="h-4 w-4 mr-2" />
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          <span className="font-medium">ISOLAMENTO</span>
        </Button>
      )}
    </div>
  );

  // Mobile Patient Info Component
  const MobilePatientInfo = ({ patient }: { patient: any }) => (
    <div className="space-y-3">
      <div className="text-center pb-3 border-b">
        <h3 className="text-lg font-bold text-gray-900">{patient.name}</h3>
        <p className="text-sm text-gray-600">{patient.age} anos, {patient.sex}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <Calendar className="h-4 w-4 text-blue-600" />
          <div>
            <span className="font-medium">Admissão:</span>
            <br />
            <span>{formatDate(patient.admissionDate)}</span>
            {patient.admissionTime && <span> às {patient.admissionTime}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-yellow-100 rounded border border-yellow-200">
          <Calendar className="h-4 w-4 text-yellow-600" />
          <div>
            <span className="font-medium text-yellow-800">DPA:</span>
            <br />
            <span className="text-yellow-700">{patient.expectedDischargeDate ? formatDate(patient.expectedDischargeDate) : 'SEM DATA PREVISTA DE ALTA'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-blue-100 rounded border border-blue-200">
          <MapPin className="h-4 w-4 text-blue-600" />
          <div>
            <span className="font-medium text-blue-800">Origem:</span>
            <br />
            <span className="text-blue-700">{patient.originCity}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 bg-red-50 rounded">
          <Stethoscope className="h-4 w-4 text-red-600 mt-1" />
          <div>
            <span className="font-medium text-red-800">Diagnóstico:</span>
            <br />
            <span className="text-red-700">{patient.diagnosis}</span>
          </div>
        </div>

        {patient.specialty && (
          <div className="text-center p-2 bg-blue-50 rounded">
            <span className="text-sm font-medium text-blue-800">
              Especialidade: {patient.specialty}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-medium">
            Internação: {calculateOccupationDays(patient.admissionDate)} dias
          </span>
          {patient.isTFD && (
            <Badge variant="outline" className="text-xs border-red-300 text-red-700 bg-red-100">
              TFD {patient.tfdType && `- ${patient.tfdType}`}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className={`w-full transition-all hover:shadow-md ${getBedStatusColor(bed.isOccupied, bed.isReserved, bed.patient?.isIsolation)} ${isDischarging ? 'opacity-75' : ''} ${isMobile ? 'min-h-[200px]' : ''}`}>
      <BedHeader
        name={bed.name}
        department={bed.department}
        isOccupied={bed.isOccupied}
        isReserved={bed.isReserved}
        isCustom={bed.isCustom}
        onDeleteBed={onDeleteBed ? () => onDeleteBed(bed.id) : undefined}
      />

      <CardContent className={`${isMobile ? 'p-4 space-y-4' : 'space-y-3'}`}>
        {/* Available Bed */}
        {!bed.isOccupied && !bed.isReserved && (
          <AvailableBedActions
            onReserveBed={() => onReserveBed(bed.id)}
            onAdmitPatient={() => onAdmitPatient(bed.id)}
          />
        )}

        {/* Reserved Bed */}
        {bed.isReserved && bed.reservation && (
          <ReservedBedInfo
            reservation={bed.reservation}
            onAdmitPatient={() => onAdmitPatient(bed.id)}
            onDeleteReservation={() => onDeleteReservation(bed.id)}
          />
        )}

        {/* Occupied Bed */}
        {bed.isOccupied && bed.patient && (
          <>
            {isMobile ? (
              <>
                <MobilePatientInfo patient={bed.patient} />
                <MobilePatientActions />
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="font-medium">{bed.patient.name}</span>
                    <span className="text-gray-500">({bed.patient.age}a, {bed.patient.sex})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Admissão: {formatDate(bed.patient.admissionDate)}</span>
                  </div>
                  {bed.patient.admissionTime && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Hora: {bed.patient.admissionTime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 p-2 bg-yellow-100 rounded-md border border-yellow-200">
                    <Calendar className="h-3 w-3 text-yellow-600" />
                    <span className="font-bold text-yellow-800">DPA: {bed.patient.expectedDischargeDate ? formatDate(bed.patient.expectedDischargeDate) : 'SEM DATA PREVISTA DE ALTA'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-100 rounded border border-blue-200">
                    <MapPin className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-800">{bed.patient.originCity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    <span>{bed.patient.diagnosis}</span>
                  </div>
                  {bed.patient.specialty && (
                    <div className="text-gray-600">
                      Especialidade: {bed.patient.specialty}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Dias: {calculateOccupationDays(bed.patient.admissionDate)}</span>
                    {bed.patient.isTFD && (
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700 bg-red-100">
                        TFD {bed.patient.tfdType && `- ${bed.patient.tfdType}`}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => onEditPatient(bed.id)}
                    disabled={isDischarging}
                    className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 text-white font-bold shadow-lg"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span>EDITAR</span>
                  </Button>

                  <Button 
                    size="sm" 
                    onClick={() => onTransferPatient(bed.id)}
                    disabled={isDischarging}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 text-white font-bold shadow-lg"
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    <span>TRANSFERIR</span>
                  </Button>

                  <Button 
                    size="sm" 
                    onClick={() => onDischargePatient(bed.id)}
                    disabled={isDischarging}
                    className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold shadow-lg"
                  >
                    {isDischarging ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4 mr-2" />
                    )}
                    <span>
                      {isDischarging ? 'PROCESSANDO...' : 'DAR ALTA'}
                    </span>
                  </Button>

                  {onToggleIsolation && (
                    <Button 
                      size="sm"
                      onClick={() => onToggleIsolation(bed.patient!.id)}
                      disabled={isDischarging}
                      className={`w-full ${bed.patient.isIsolation 
                        ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700'
                      } shadow-md hover:shadow-lg transition-all duration-200`}
                    >
                      {bed.patient.isIsolation ? (
                        <ShieldAlert className="h-3 w-3 mr-1.5" />
                      ) : (
                        <Shield className="h-3 w-3 mr-1.5" />
                      )}
                      <span className="text-xs font-medium">ISOLAMENTO</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveBedCard;
