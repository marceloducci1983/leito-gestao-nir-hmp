
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Bed } from '@/types';
import NewBedCard from './NewBedCard';
import ResponsiveBedCard from './ResponsiveBedCard';
import { useResponsive } from '@/hooks/useResponsive';

interface BedWithDischarging extends Bed {
  isDischarging?: boolean;
}

interface BedsManagementGridProps {
  departmentBeds: BedWithDischarging[];
  onReserveBed: (bedId: string) => void;
  onAdmitPatient: (bedId: string) => void;
  onEditPatient: (bedId: string) => void;
  onTransferPatient: (bedId: string) => void;
  onDischargePatient: (bedId: string) => void;
  onDeleteReservation: (bedId: string) => void;
  onDeleteBed: (bedId: string) => void;
  onToggleIsolation?: (patientId: string) => void;
  showEditBedMode?: boolean;
  onEditBedClick?: (bed: Bed) => void;
}

const BedsManagementGrid: React.FC<BedsManagementGridProps> = ({
  departmentBeds,
  onReserveBed,
  onAdmitPatient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onDeleteReservation,
  onDeleteBed,
  onToggleIsolation,
  showEditBedMode = false,
  onEditBedClick
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const handleBedClick = (bed: Bed) => {
    if (showEditBedMode && onEditBedClick) {
      onEditBedClick(bed);
    }
  };

  let gridColumnsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  
  if (isMobile) {
    gridColumnsClass = "grid-cols-1";
  } else if (isTablet) {
    gridColumnsClass = "grid-cols-2";
  }

  return (
    <CardContent className={`${isMobile ? 'p-0' : 'p-4'}`}>
      {showEditBedMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">
            🖊️ Modo de edição ativo - Clique em qualquer leito para editá-lo
          </p>
        </div>
      )}
      
      <div className={`grid ${gridColumnsClass} gap-4`}>
        {departmentBeds.map((bed) => (
          <div 
            key={bed.id}
            onClick={() => handleBedClick(bed)}
            className={`${showEditBedMode ? 'cursor-pointer hover:ring-2 hover:ring-blue-300 rounded-lg transition-all' : ''}`}
          >
            {isMobile || isTablet ? (
              <ResponsiveBedCard
                bed={bed}
                onReserveBed={onReserveBed}
                onAdmitPatient={onAdmitPatient}
                onEditPatient={onEditPatient}
                onTransferPatient={onTransferPatient}
                onDischargePatient={onDischargePatient}
                onDeleteReservation={onDeleteReservation}
                onDeleteBed={bed.isCustom ? onDeleteBed : undefined}
                onToggleIsolation={onToggleIsolation}
                editMode={showEditBedMode}
                isDischarging={bed.isDischarging || false}
              />
            ) : (
              <NewBedCard
                bed={bed}
                onReserveBed={onReserveBed}
                onAdmitPatient={onAdmitPatient}
                onEditPatient={onEditPatient}
                onTransferPatient={onTransferPatient}
                onDischargePatient={onDischargePatient}
                onDeleteReservation={onDeleteReservation}
                onDeleteBed={bed.isCustom ? onDeleteBed : undefined}
                onToggleIsolation={onToggleIsolation}
                editMode={showEditBedMode}
                isDischarging={bed.isDischarging || false}
              />
            )}
          </div>
        ))}
      </div>
    </CardContent>
  );
};

export default BedsManagementGrid;
