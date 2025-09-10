
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PendingDischargesFilters from './PendingDischargesFilters';
import PendingDischargeCard from './PendingDischargeCard';
import { calculateWaitTime, createEffectiveDischargeHandler } from './DischargeMonitoringLogic';
import DischargeTypeModal from '@/components/forms/DischargeTypeModal';

interface PendingDischargesTabProps {
  dischargeControls: any[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'oldest' | 'newest';
  onSortChange: (value: 'oldest' | 'newest') => void;
  justification: { [key: string]: string };
  onJustificationChange: (id: string, value: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  dischargeTypeModal: {
    isOpen: boolean;
    discharge?: any;
    requiresJustification: boolean;
  };
  onOpenDischargeTypeModal: (discharge: any, requiresJustification: boolean) => void;
  onCloseDischargeTypeModal: () => void;
  onConfirmDischarge: (dischargeType: string, justification?: string) => void;
  isCompleting: boolean;
}

const PendingDischargesTab: React.FC<PendingDischargesTabProps> = ({
  dischargeControls,
  isLoading,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  justification,
  onJustificationChange,
  onCancel,
  onComplete,
  dischargeTypeModal,
  onOpenDischargeTypeModal,
  onCloseDischargeTypeModal,
  onConfirmDischarge,
  isCompleting
}) => {
  const handleEffectiveDischarge = createEffectiveDischargeHandler(
    dischargeControls,
    justification,
    { mutate: onComplete },
    onOpenDischargeTypeModal
  );
  return (
    <div className="space-y-4">
      <PendingDischargesFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />

      {dischargeControls.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma alta pendente no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dischargeControls.map((discharge) => {
            const waitTime = calculateWaitTime(discharge.discharge_requested_at);
            
            return (
              <PendingDischargeCard
                key={discharge.id}
                discharge={discharge}
                waitTime={waitTime}
                justification={justification[discharge.id] || ''}
                onJustificationChange={(value) => onJustificationChange(discharge.id, value)}
                onCancel={() => onCancel(discharge.id)}
                onComplete={() => handleEffectiveDischarge(discharge.id)}
              />
            );
          })}
        </div>
      )}

      <DischargeTypeModal
        isOpen={dischargeTypeModal.isOpen}
        onClose={onCloseDischargeTypeModal}
        onConfirm={onConfirmDischarge}
        patientName={dischargeTypeModal.discharge?.patient_name || ''}
        requiresJustification={dischargeTypeModal.requiresJustification}
        isLoading={isCompleting}
      />
    </div>
  );
};

export default PendingDischargesTab;
