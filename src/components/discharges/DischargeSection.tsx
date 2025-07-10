
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PatientCard from './PatientCard';

interface DischargeSectionProps {
  title: string;
  discharges: any[];
  badgeColor: string;
  isUrgent?: boolean;
}

const DischargeSection: React.FC<DischargeSectionProps> = ({ 
  title, 
  discharges, 
  badgeColor, 
  isUrgent = false 
}) => (
  <div className="section">
    <div className={`section-header ${isUrgent ? 'urgent' : 'regular'}`}>
      <div className="section-title">
        {isUrgent ? '🚨' : '📅'} {title}
      </div>
      <div className="section-count">
        {discharges.length}
      </div>
    </div>
    <div className="patient-list">
      {discharges.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px', fontStyle: 'italic' }}>
          Nenhum paciente com alta prevista para {isUrgent ? 'as próximas 24 horas' : '48 horas'}.
        </p>
      ) : (
        <>
          {discharges.map((bed) => (
            <PatientCard key={bed.id} bed={bed} isUrgent={isUrgent} />
          ))}
        </>
      )}
    </div>
    
    {/* Versão para visualização normal da aplicação */}
    <div className="mb-8">
      <div className={`flex items-center justify-between mb-4 p-3 rounded-lg ${
        isUrgent ? 'bg-red-50 border-l-4 border-red-400' : 'bg-blue-50 border-l-4 border-blue-400'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isUrgent ? '🚨' : '📅'}</span>
          <h2 className={`text-xl font-semibold ${isUrgent ? 'text-red-700' : 'text-blue-700'}`}>
            {title}
          </h2>
        </div>
        <Badge 
          className={`${isUrgent ? 'bg-red-500' : 'bg-blue-500'} text-white px-3 py-1 text-lg font-bold`}
        >
          {discharges.length}
        </Badge>
      </div>
      
      {discharges.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-lg">Nenhum paciente com alta prevista para {isUrgent ? 'as próximas 24 horas' : '48 horas'}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {discharges.map((bed) => (
            <PatientCard key={bed.id} bed={bed} isUrgent={isUrgent} />
          ))}
        </div>
      )}
    </div>
  </div>
);

export default DischargeSection;
