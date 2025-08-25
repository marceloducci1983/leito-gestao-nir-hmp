
import React from 'react';
import { useSupabaseBedsPanelState } from '@/components/beds-panel/SupabaseBedsPanelState';
import SupabaseBedsPanelLayout from '@/components/beds-panel/SupabaseBedsPanelLayout';
import EmergencyRefreshButton from '@/components/EmergencyRefreshButton';
import SuperEmergencyRefreshButton from '@/components/SuperEmergencyRefreshButton';

interface SupabaseBedsPanelProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
  const state = useSupabaseBedsPanelState({ onDataChange });

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <EmergencyRefreshButton />
        <SuperEmergencyRefreshButton />
      </div>
      <SupabaseBedsPanelLayout {...state} />
    </div>
  );
};

export default SupabaseBedsPanel;
