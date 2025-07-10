
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
    <Card className="md:block hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className={isUrgent ? "text-orange-600" : "text-blue-600"}>
            {title} ({discharges.length} pacientes)
          </span>
          <Badge className={badgeColor} variant={isUrgent ? "default" : "outline"}>
            {discharges.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {discharges.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum paciente com alta prevista para {isUrgent ? 'as próximas 24 horas' : '48 horas'}.
          </p>
        ) : (
          <div className="space-y-4">
            {discharges.map((bed) => (
              <PatientCard key={bed.id} bed={bed} isUrgent={isUrgent} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

export default DischargeSection;
