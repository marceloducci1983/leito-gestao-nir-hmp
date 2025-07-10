
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DischargeSummaryProps {
  discharges24h: number;
  discharges48h: number;
}

const DischargeSummary: React.FC<DischargeSummaryProps> = ({ discharges24h, discharges48h }) => (
  <>
    {/* Versão para impressão/relatório */}
    <div className="summary">
      <h3>📊 Resumo Executivo</h3>
      <div className="stats">
        <div className="stat-item">
          <span className="stat-number">🚨 {discharges24h}</span>
          <span className="stat-label">Altas Urgentes (24h)</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">📅 {discharges48h}</span>
          <span className="stat-label">Altas Programadas (48h)</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">📋 {discharges24h + discharges48h}</span>
          <span className="stat-label">Total de Altas Previstas</span>
        </div>
      </div>
    </div>

    {/* Versão para visualização normal da aplicação */}
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
  </>
);

export default DischargeSummary;
