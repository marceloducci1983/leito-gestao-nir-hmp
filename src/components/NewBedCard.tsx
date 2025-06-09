
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
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => onReserveBed(bed.id)}
            >
              RESERVAR LEITO
            </Button>
            <Button 
              size="sm" 
              className="w-full bg-green-500 hover:bg-green-600"
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
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => onAdmitPatient(bed.id)}
              >
                ADMITIR
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDeleteReservation(bed.id)}
                className="px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Occupied Bed */}
        {bed.isOccupied && bed.patient && (
          <div className="space-y-2">
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
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEditPatient(bed.id)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                EDITAR
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onTransferPatient(bed.id)}
                className="flex-1"
              >
                <ArrowRightLeft className="h-3 w-3 mr-1" />
                TRANSFERIR
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDischargePatient(bed.id)}
                className="flex-1"
              >
                <LogOut className="h-3 w-3 mr-1" />
                ALTA
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewBedCard;
