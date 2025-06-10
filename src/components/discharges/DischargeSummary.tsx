
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DischargeSummaryProps {
  discharges24h: number;
  discharges48h: number;
}

const DischargeSummary: React.FC<DischargeSummaryProps> = ({ discharges24h, discharges48h }) => (
  <Card>
    <CardHeader>
      <CardTitle>Resumo</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{discharges24h}</div>
          <div className="text-sm text-gray-600">Altas em 24h</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{discharges48h}</div>
          <div className="text-sm text-gray-600">Altas em 48h</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{discharges24h + discharges48h}</div>
          <div className="text-sm text-gray-600">Total de Altas</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default DischargeSummary;
