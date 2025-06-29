
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DebugInfoCardProps {
  dischargeControls: any[];
  pendingDischarges: any[];
  completedDischarges: any[];
  combinedDischarges: any[];
  dischargeStatsByDept: any[];
  dischargeStatsByCity: any[];
  delayedDischarges: any[];
}

const DebugInfoCard: React.FC<DebugInfoCardProps> = ({
  dischargeControls,
  pendingDischarges,
  completedDischarges,
  combinedDischarges,
  dischargeStatsByDept,
  dischargeStatsByCity,
  delayedDischarges
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Controles de Alta:</strong> {dischargeControls.length}</p>
            <p><strong>Pendentes:</strong> {pendingDischarges.length}</p>
            <p><strong>Completadas:</strong> {completedDischarges.length}</p>
          </div>
          <div>
            <p><strong>Altas Combinadas:</strong> {combinedDischarges.length}</p>
            <p><strong>Stats por Dept:</strong> {dischargeStatsByDept.length}</p>
            <p><strong>Stats por Cidade:</strong> {dischargeStatsByCity.length}</p>
            <p><strong>Altas Atrasadas:</strong> {delayedDischarges.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfoCard;
