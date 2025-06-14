
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DischargedPatient } from '@/types';
import { formatDateSaoPaulo } from '@/utils/timezoneUtils';
import { formatDateOnly } from '@/utils/dateUtils';

interface ArchivePatientCardProps {
  patient: DischargedPatient;
}

const ArchivePatientCard: React.FC<ArchivePatientCardProps> = ({ patient }) => {
  const getDischargeTypeColor = (type: string) => {
    switch (type) {
      case 'POR MELHORA': return 'bg-green-500';
      case 'TRANSFERENCIA': return 'bg-blue-500';
      case 'EVASÃO': return 'bg-yellow-500';
      case 'OBITO': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{patient.name}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getDischargeTypeColor(patient.dischargeType)}>
              {patient.dischargeType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatDateSaoPaulo(patient.dischargeDate)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
          <div>
            <strong>Idade:</strong> {patient.age} anos
          </div>
          <div>
            <strong>Nascimento:</strong> {formatDateOnly(patient.birthDate)}
          </div>
          <div>
            <strong>Departamento:</strong> {patient.department}
          </div>
          <div>
            <strong>Leito:</strong> {patient.bedId.split('-').pop()}
          </div>
          <div>
            <strong>Admissão:</strong> {formatDateSaoPaulo(patient.admissionDate)}
          </div>
          <div>
            <strong>Alta:</strong> {formatDateSaoPaulo(patient.dischargeDate)}
          </div>
          <div>
            <strong>Permanência:</strong> {patient.actualStayDays} dias
          </div>
          <div>
            <strong>Origem:</strong> {patient.originCity}
          </div>
          <div>
            <strong>TFD:</strong> {patient.isTFD ? 'Sim' : 'Não'}
          </div>
          <div className="col-span-2 md:col-span-3 lg:col-span-5">
            <strong>Diagnóstico:</strong> {patient.diagnosis}
          </div>
          {patient.specialty && (
            <div className="col-span-2">
              <strong>Especialidade:</strong> {patient.specialty}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivePatientCard;
