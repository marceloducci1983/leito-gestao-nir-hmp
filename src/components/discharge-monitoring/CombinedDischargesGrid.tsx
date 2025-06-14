
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { formatDateTimeSaoPaulo } from '@/utils/timezoneUtils';

interface CombinedDischargesGridProps {
  discharges: any[];
}

const CombinedDischargesGrid: React.FC<CombinedDischargesGridProps> = ({ discharges }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {discharges.slice(0, 20).map((discharge, index) => (
        <Card key={index} className={`${discharge.source === 'controlled' ? 'border-blue-200' : 'border-green-200'}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{discharge.patient_name}</h3>
              <Badge variant={discharge.source === 'controlled' ? 'secondary' : 'default'}>
                {discharge.source === 'controlled' ? 'Controlada' : 'Direta'}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm">
              <p><strong>Departamento:</strong> {discharge.department}</p>
              <p><strong>Leito:</strong> {discharge.bed_name || discharge.bed_id}</p>
              <p className="flex items-center gap-1">
                <strong>Município:</strong> 
                <MapPin className="h-3 w-3 text-green-600" />
                <span className="text-green-600">{discharge.origin_city || 'Não informado'}</span>
              </p>
              <p><strong>Data:</strong> {formatDateTimeSaoPaulo(discharge.discharge_requested_at || discharge.created_at)}</p>
              <p><strong>Status:</strong> 
                <Badge variant={discharge.status === 'completed' ? 'default' : 'secondary'} className="ml-2">
                  {discharge.status === 'completed' ? 'Concluída' : discharge.status}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CombinedDischargesGrid;
