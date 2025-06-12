
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getBedStatusColor } from './bed-card/BedStatus';
import { BedHeader } from './bed-card/BedHeader';
import { AvailableBedActions } from './bed-card/AvailableBedActions';
import { ReservedBedInfo } from './bed-card/ReservedBedInfo';
import { OccupiedBedInfo } from './bed-card/OccupiedBedInfo';

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
  editMode?: boolean;
  isDischarging?: boolean;
}

const NewBedCard: React.FC<BedCardProps> = ({
  bed,
  onReserveBed,
  onAdmitPatient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onDeleteReservation,
  onDeleteBed,
  editMode = false,
  isDischarging = false
}) => {
  return (
    <Card className={`w-full ${getBedStatusColor(bed.isOccupied, bed.isReserved)} transition-all hover:shadow-md ${isDischarging ? 'opacity-75' : ''}`}>
      <BedHeader
        name={bed.name}
        department={bed.department}
        isOccupied={bed.isOccupied}
        isReserved={bed.isReserved}
        isCustom={bed.isCustom}
        onDeleteBed={onDeleteBed ? () => onDeleteBed(bed.id) : undefined}
      />

      <CardContent className="space-y-3">
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
          <OccupiedBedInfo
            patient={bed.patient}
            onEditPatient={() => onEditPatient(bed.id)}
            onTransferPatient={() => onTransferPatient(bed.id)}
            onDischargePatient={() => onDischargePatient(bed.id)}
            isDischarging={isDischarging}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default NewBedCard;
