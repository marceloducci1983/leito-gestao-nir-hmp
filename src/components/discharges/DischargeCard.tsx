
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Stethoscope, Bed, AlertTriangle } from 'lucide-react';
import { ExpectedDischarge } from '@/types/discharges';
import { formatDate, formatDateTime } from '@/utils/dateUtils';

interface DischargeCardProps {
  discharge: ExpectedDischarge;
}

const DischargeCard: React.FC<DischargeCardProps> = ({ discharge }) => {
  const { patient, hoursUntilDischarge, isUrgent } = discharge;

  return (
    <Card className={`transition-all hover:shadow-md ${isUrgent ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User className="h-5 w-5" />
            {patient.name}
          </CardTitle>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant={isUrgent ? "destructive" : "default"} className={isUrgent ? "" : "bg-yellow-500"}>
              {isUrgent ? '24H' : '48H'}
            </Badge>
            {isUrgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {/* Data de Nascimento e Idade */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span><strong>Nascimento:</strong> {formatDate(patient.birthDate)} ({patient.age} anos)</span>
          </div>

          {/* Data de Admissão */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span><strong>Admissão:</strong> {formatDate(patient.admissionDate)}</span>
          </div>

          {/* DPA - Data Provável de Alta (Destaque) */}
          <div className="flex items-center gap-2 p-2 bg-orange-100 rounded-md border border-orange-200 md:col-span-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="font-bold text-orange-800">
              DPA: {formatDateTime(patient.expectedDischargeDate)} 
              <span className="text-orange-600 ml-2">({hoursUntilDischarge}h restantes)</span>
            </span>
          </div>

          {/* Município de Origem (Destaque) */}
          <div className="flex items-center gap-2 p-2 bg-purple-100 rounded-md border border-purple-200 md:col-span-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            <span className="font-bold text-purple-800">Município de Origem: {patient.originCity}</span>
          </div>

          {/* Diagnóstico */}
          <div className="flex items-start gap-2 md:col-span-2">
            <Stethoscope className="h-4 w-4 text-red-600 mt-0.5" />
            <span><strong>Diagnóstico:</strong> {patient.diagnosis}</span>
          </div>

          {/* Departamento e Leito */}
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-gray-600" />
            <span><strong>Setor:</strong> {patient.department}</span>
          </div>

          <div className="flex items-center gap-2">
            <span><strong>Leito:</strong> {patient.bedId}</span>
          </div>

          {/* TFD */}
          <div className="flex items-center gap-2">
            <span><strong>TFD:</strong> {patient.isTFD ? 'Sim' : 'Não'}</span>
            {patient.isTFD && patient.tfdType && (
              <span className="text-sm text-gray-600">({patient.tfdType})</span>
            )}
          </div>

          {/* Especialidade */}
          {patient.specialty && (
            <div className="flex items-center gap-2">
              <span><strong>Especialidade:</strong> {patient.specialty}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DischargeCard;
