
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import { Bed } from '@/types';

interface BedCardProps {
  bed: Bed;
  onReserveBed: (bedId: string) => void;
  onAdmitPatient: (bedId: string) => void;
  onEditPatient: (bedId: string) => void;
  onTransferPatient: (bedId: string) => void;
  onDischargePatient: (bedId: string) => void;
  onDeleteReservation: (bedId: string) => void;
  onDeleteBed?: (bedId: string) => void;
}

const BedCard: React.FC<BedCardProps> = ({
  bed,
  onReserveBed,
  onAdmitPatient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onDeleteReservation,
  onDeleteBed
}) => {
  const getBedStatus = () => {
    if (bed.isOccupied && bed.patient) return 'occupied';
    if (bed.isReserved && bed.reservation) return 'reserved';
    return 'available';
  };

  const getStatusColor = () => {
    switch (getBedStatus()) {
      case 'occupied': return 'bg-red-100 border-red-300';
      case 'reserved': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-green-100 border-green-300';
    }
  };

  const getStatusBadge = () => {
    switch (getBedStatus()) {
      case 'occupied': return <Badge variant="destructive">Ocupado</Badge>;
      case 'reserved': return <Badge variant="default" className="bg-yellow-500">Reservado</Badge>;
      default: return <Badge variant="default" className="bg-green-500">Disponível</Badge>;
    }
  };

  return (
    <Card className={`w-full min-h-[200px] ${getStatusColor()}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-bold">{bed.name}</CardTitle>
            {getStatusBadge()}
          </div>
          <div className="text-xs text-gray-600 font-medium">
            {bed.department}
          </div>
        </div>
        {bed.isCustom && onDeleteBed && (
          <Button
            onClick={() => onDeleteBed(bed.id)}
            variant="destructive"
            size="sm"
            className="text-xs"
          >
            EXCLUIR NOVO LEITO
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2">
        {bed.isOccupied && bed.patient && (
          <div className="text-xs space-y-2">
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3 text-blue-600" />
              <span><strong>Paciente:</strong> {bed.patient.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <span><strong>Idade:</strong> {bed.patient.age} anos</span>
            </div>
            <div className="flex items-start gap-1">
              <span><strong>Diagnóstico:</strong> {bed.patient.diagnosis}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-green-600" />
              <span><strong>Admissão:</strong> {new Date(bed.patient.admissionDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-600" />
              <span><strong>Dias:</strong> {bed.patient.occupationDays}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-purple-600" />
              <span><strong>Município:</strong> {bed.patient.originCity}</span>
            </div>
            <div className="flex items-center gap-1">
              <span><strong>TFD:</strong> {bed.patient.isTFD ? 'Sim' : 'Não'}</span>
            </div>
            {bed.patient.specialty && (
              <div className="flex items-center gap-1">
                <span><strong>Especialidade:</strong> {bed.patient.specialty}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 mt-2">
              <Button onClick={() => onEditPatient(bed.id)} size="sm" variant="outline" className="text-xs">
                EDITAR
              </Button>
              <Button onClick={() => onTransferPatient(bed.id)} size="sm" variant="outline" className="text-xs">
                TRANSFERIR
              </Button>
              <Button onClick={() => onDischargePatient(bed.id)} size="sm" variant="destructive" className="text-xs">
                DAR ALTA
              </Button>
            </div>
          </div>
        )}

        {bed.isReserved && bed.reservation && (
          <div className="text-xs space-y-2">
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3 text-blue-600" />
              <span><strong>Reservado para:</strong> {bed.reservation.patientName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-purple-600" />
              <span><strong>Origem:</strong> {bed.reservation.originClinic}</span>
            </div>
            <div className="flex items-start gap-1">
              <span><strong>Diagnóstico:</strong> {bed.reservation.diagnosis}</span>
            </div>
            
            <Button onClick={() => onDeleteReservation(bed.id)} size="sm" variant="destructive" className="text-xs mt-2">
              EXCLUIR RESERVA
            </Button>
          </div>
        )}

        {!bed.isOccupied && !bed.isReserved && (
          <div className="flex flex-col gap-2">
            <Button onClick={() => onReserveBed(bed.id)} size="sm" variant="outline" className="text-xs">
              RESERVAR LEITO
            </Button>
            <Button onClick={() => onAdmitPatient(bed.id)} size="sm" className="text-xs">
              ADMITIR PACIENTE
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BedCard;
