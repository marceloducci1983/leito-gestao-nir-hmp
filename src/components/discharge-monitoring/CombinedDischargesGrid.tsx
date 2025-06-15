
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Building, User } from 'lucide-react';
import { formatDateTimeSaoPaulo } from '@/utils/timezoneUtils';

interface CombinedDischargesGridProps {
  discharges: any[];
}

const CombinedDischargesGrid: React.FC<CombinedDischargesGridProps> = ({ discharges }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {discharges.slice(0, 20).map((discharge, index) => {
        const isEven = index % 2 === 0;
        const isControlled = discharge.source === 'controlled';
        
        return (
          <Card 
            key={index} 
            className={`
              transition-all duration-200 hover:shadow-lg hover:scale-105
              ${isEven 
                ? 'border-l-4 border-l-blue-500 bg-blue-50/30 border-blue-100' 
                : 'border-l-4 border-l-red-500 bg-red-50/30 border-red-100'
              }
              ${isControlled ? 'ring-1 ring-blue-200' : 'ring-1 ring-green-200'}
            `}
          >
            <CardContent className="p-4">
              {/* Header com nome e badges */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <h3 className="font-semibold text-lg text-gray-800">{discharge.patient_name}</h3>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge 
                    variant={isControlled ? 'secondary' : 'default'}
                    className={`text-xs ${
                      isControlled 
                        ? 'bg-blue-100 text-blue-700 border-blue-300' 
                        : 'bg-green-100 text-green-700 border-green-300'
                    }`}
                  >
                    {isControlled ? 'Controlada' : 'Direta'}
                  </Badge>
                  <Badge 
                    variant={discharge.status === 'completed' ? 'default' : 'secondary'} 
                    className={`text-xs ${
                      discharge.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : 'bg-amber-100 text-amber-700 border-amber-300'
                    }`}
                  >
                    {discharge.status === 'completed' ? 'Concluída' : discharge.status}
                  </Badge>
                </div>
              </div>
              
              {/* Informações organizadas em grid */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                {/* Departamento e Leito */}
                <div className="flex justify-between items-center p-2 bg-white/60 rounded-md border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Departamento:</span>
                  </div>
                  <span className="font-medium text-gray-800">{discharge.department}</span>
                </div>

                <div className="flex justify-between items-center p-2 bg-white/60 rounded-md border border-gray-100">
                  <span className="text-gray-600 font-medium">Leito:</span>
                  <span className="font-semibold text-blue-600">{discharge.bed_name || discharge.bed_id}</span>
                </div>

                {/* Município */}
                <div className="flex justify-between items-center p-2 bg-white/60 rounded-md border border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">Município:</span>
                  </div>
                  <span className="font-medium text-green-600">{discharge.origin_city || 'Não informado'}</span>
                </div>

                {/* Data */}
                <div className="flex justify-between items-center p-2 bg-white/60 rounded-md border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Data:</span>
                  </div>
                  <span className="font-medium text-gray-700">
                    {formatDateTimeSaoPaulo(discharge.discharge_requested_at || discharge.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CombinedDischargesGrid;
