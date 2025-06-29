
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PendingDischargesFilters from './PendingDischargesFilters';
import PendingDischargeCard from './PendingDischargeCard';
import { calculateWaitTime } from './DischargeMonitoringLogic';

interface PendingDischargesTabProps {
  filteredPendingDischarges: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'oldest' | 'newest';
  onSortChange: (value: 'oldest' | 'newest') => void;
  justification: { [key: string]: string };
  onJustificationChange: (id: string, value: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  combinedDischarges: any[];
}

const PendingDischargesTab: React.FC<PendingDischargesTabProps> = ({
  filteredPendingDischarges,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  justification,
  onJustificationChange,
  onCancel,
  onComplete,
  combinedDischarges
}) => {
  return (
    <div className="space-y-4">
      <PendingDischargesFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />

      {filteredPendingDischarges.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma alta pendente no momento.</p>
            <p className="text-sm text-gray-400 mt-2">
              Total de altas processadas hoje: {combinedDischarges.filter(d => 
                new Date(d.discharge_requested_at || d.created_at).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPendingDischarges.map((discharge) => {
            const waitTime = calculateWaitTime(discharge.discharge_requested_at);
            
            return (
              <PendingDischargeCard
                key={discharge.id}
                discharge={discharge}
                waitTime={waitTime}
                justification={justification[discharge.id] || ''}
                onJustificationChange={(value) => onJustificationChange(discharge.id, value)}
                onCancel={() => onCancel(discharge.id)}
                onComplete={() => onComplete(discharge.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingDischargesTab;
