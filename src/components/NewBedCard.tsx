
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Stethoscope, Edit, ArrowRightLeft, LogOut, X, Trash2 } from 'lucide-react';

interface BedCardProps {
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
}

const NewBedCard: React.FC<BedCardProps> = ({
  bed,
  onReserveBed,
  onAdmitPatient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onDeleteReservation,
  onDeleteBed
}) => {
  const getStatusColor = () => {
    if (bed.isOccupied) return 'bg-red-100 border-red-300';
    if (bed.isReserved) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  const getStatusBadge = () => {
    if (bed.isOccupied) return <Badge variant="destructive">Ocupado</Badge>;
    if (bed.isReserved) return <Badge className="bg-yellow-500">Reservado</Badge>;
    return <Badge className="bg-green-500">Disponível</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateOccupationDays = (admissionDate: string) => {
    const admission = new Date(admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admission.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className={`w-full ${getStatusColor()} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start text-sm">
          <div className="space-y-1">
            <span className="font-bold">{bed.name}</span>
            <div className="text-xs text-gray-600 font-normal">{bed.department}</div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {bed.isCustom && onDeleteBed && (
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={() => onDeleteBed(bed.id)}
                title="Excluir leito customizado"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Available Bed */}
        {!bed.isOccupied && !bed.isReserved && (
          <div className="space-y-2">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={() => onReserveBed(bed.id)}
            >
              RESERVAR LEITO
            </Button>
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={() => onAdmitPatient(bed.id)}
            >
              ADMITIR PACIENTE
            </Button>
          </div>
        )}

        {/* Reserved Bed */}
        {bed.isReserved && bed.reservation && (
          <div className="space-y-2">
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="font-medium">{bed.reservation.patientName}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{bed.reservation.originClinic}</span>
              </div>
              <div className="flex items-center gap-1">
                <Stethoscope className="h-3 w-3" />
                <span>{bed.reservation.diagnosis}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => onAdmitPatient(bed.id)}
              >
                ADMITIR
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDeleteReservation(bed.id)}
                className="px-2 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Occupied Bed */}
        {bed.isOccupied && bed.patient && (
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
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>DPA: {formatDate(bed.patient.expectedDischargeDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{bed.patient.originCity}</span>
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
                  <Badge variant="outline" className="text-xs">
                    TFD {bed.patient.tfdType && `- ${bed.patient.tfdType}`}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Modern Action Buttons with 3D Effect */}
            <div className="grid grid-cols-1 gap-2">
              {/* Edit Button */}
              <Button 
                size="sm" 
                onClick={() => onEditPatient(bed.id)}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
                <Edit className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">EDITAR</span>
              </Button>

              {/* Transfer Button */}
              <Button 
                size="sm" 
                onClick={() => onTransferPatient(bed.id)}
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
                <ArrowRightLeft className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">TRANSFERIR</span>
              </Button>

              {/* Discharge Button */}
              <Button 
                size="sm" 
                onClick={() => onDischargePatient(bed.id)}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
                <LogOut className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">DAR ALTA</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewBedCard;
