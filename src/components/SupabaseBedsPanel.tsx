
import React from 'react';
import { useSupabaseBedsPanelState } from '@/components/beds-panel/SupabaseBedsPanelState';
import SupabaseBedsPanelLayout from '@/components/beds-panel/SupabaseBedsPanelLayout';

interface SupabaseBedsPanelProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
  const state = useSupabaseBedsPanelState({ onDataChange });

  return <SupabaseBedsPanelLayout {...state} />;
};

export default SupabaseBedsPanel;
