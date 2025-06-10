
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
    <Card>
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
