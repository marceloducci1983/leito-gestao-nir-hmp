
import React from 'react';
import ExpectedDischargesHeader from './discharges/ExpectedDischargesHeader';
import DischargeSection from './discharges/DischargeSection';
import DischargeSummary from './discharges/DischargeSummary';
import { useExpectedDischargesData } from '@/hooks/useExpectedDischargesData';
import { handlePrintDischarges } from '@/utils/printUtils';

interface ExpectedDischargesPanelProps {
  data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  };
}

const ExpectedDischargesPanel: React.FC<ExpectedDischargesPanelProps> = ({ data }) => {
  const { discharges24h, discharges48h } = useExpectedDischargesData(data);

  return (
    <div className="space-y-6">
      <ExpectedDischargesHeader onPrint={handlePrintDischarges} />

      <div id="discharges-content" className="space-y-6">
        <DischargeSection
          title="Altas 24h"
          discharges={discharges24h}
          badgeColor="bg-orange-500"
          isUrgent={true}
        />

        <DischargeSection
          title="Altas 48h"
          discharges={discharges48h}
          badgeColor=""
          isUrgent={false}
        />

        <DischargeSummary
          discharges24h={discharges24h.length}
          discharges48h={discharges48h.length}
        />
      </div>
    </div>
  );
};

export default ExpectedDischargesPanel;
