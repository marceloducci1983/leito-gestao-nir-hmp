
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DischargedPatient } from '@/types';
import { formatDateSaoPaulo } from '@/utils/timezoneUtils';
import { formatDateOnly } from '@/utils/dateUtils';
import { Calendar, MapPin, Activity, Building, Bed, Clock, User } from 'lucide-react';

interface ArchivePatientCardProps {
  patient: DischargedPatient;
}

const ArchivePatientCard: React.FC<ArchivePatientCardProps> = ({ patient }) => {
  const getDischargeTypeColor = (type: string) => {
    switch (type) {
      case 'POR MELHORA': return 'bg-green-100 text-green-700 border-green-200';
      case 'TRANSFERENCIA': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EVASÃO': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'OBITO': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 bg-blue-100">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {patient.age} anos
                </p>
              </div>
              <Badge className={`${getDischargeTypeColor(patient.dischargeType)} font-medium`}>
                {patient.dischargeType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Informações Pessoais */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Informações Pessoais
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Nascimento:</span>
              <span className="font-medium">{formatDateOnly(patient.birthDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Origem:</span>
              <span className="font-medium">{patient.originCity}</span>
            </div>
          </div>
        </div>

        {/* Informações Médicas */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Informações Médicas
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <Activity className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-gray-600">Diagnóstico:</span>
                <p className="font-medium mt-1 leading-relaxed">{patient.diagnosis}</p>
              </div>
            </div>
            {patient.specialty && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Especialidade:</span>
                <span className="font-medium">{patient.specialty}</span>
              </div>
            )}
          </div>
        </div>

        {/* Informações de Internação */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Internação
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Departamento:</span>
              <span className="font-medium">{patient.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bed className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Leito:</span>
              <span className="font-medium">{patient.bedId.split('-').pop()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Permanência:</span>
              <span className="font-medium">{patient.actualStayDays} dias</span>
            </div>
          </div>
        </div>

        {/* Datas e TFD */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Admissão</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatDateSaoPaulo(patient.admissionDate)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Alta</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatDateSaoPaulo(patient.dischargeDate)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide">TFD</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {patient.isTFD ? (
                  <span className="text-blue-600">Sim</span>
                ) : (
                  <span className="text-gray-600">Não</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivePatientCard;
