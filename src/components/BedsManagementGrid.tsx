
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Bed } from '@/types';
import NewBedCard from './NewBedCard';

interface BedsManagementGridProps {
  departmentBeds: Bed[];
  onReserveBed: (bedId: string) => void;
  onAdmitPatient: (bedId: string) => void;
  onEditPatient: (bedId: string) => void;
  onTransferPatient: (bedId: string) => void;
  onDischargePatient: (bedId: string) => void;
  onDeleteReservation: (bedId: string) => void;
  onDeleteBed: (bedId: string) => void;
}

const BedsManagementGrid: React.FC<BedsManagementGridProps> = ({
  departmentBeds,
  onReserveBed,
  onAdmitPatient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onDeleteReservation,
  onDeleteBed
}) => {
  return (
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {departmentBeds.map((bed) => (
          <NewBedCard
            key={bed.id}
            bed={bed}
            onReserveBed={onReserveBed}
            onAdmitPatient={onAdmitPatient}
            onEditPatient={onEditPatient}
            onTransferPatient={onTransferPatient}
            onDischargePatient={onDischargePatient}
            onDeleteReservation={onDeleteReservation}
            onDeleteBed={bed.isCustom ? onDeleteBed : undefined}
          />
        ))}
      </div>
    </CardContent>
  );
};

export default BedsManagementGrid;
