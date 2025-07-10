
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
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">📊</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Resumo Executivo</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-red-200">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚨</span>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">{discharges24h}</div>
          <div className="text-sm text-gray-600 font-medium">Altas Urgentes (24h)</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-blue-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📅</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{discharges48h}</div>
          <div className="text-sm text-gray-600 font-medium">Altas Programadas (48h)</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📋</span>
          </div>
          <div className="text-3xl font-bold text-gray-700 mb-1">{discharges24h + discharges48h}</div>
          <div className="text-sm text-gray-600 font-medium">Total de Altas Previstas</div>
        </div>
      </div>
    </div>
  </>
);

export default DischargeSummary;
