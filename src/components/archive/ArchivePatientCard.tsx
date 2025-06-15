
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
      case 'POR MELHORA': return 'bg-green-50 text-green-600 border-green-100';
      case 'TRANSFERENCIA': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'EVASÃO': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'OBITO': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
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
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-100 bg-white">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 bg-blue-50 border border-blue-100">
            <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-gray-800 truncate">{patient.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <User className="h-3 w-3" />
                  {patient.age} anos
                </p>
              </div>
              <Badge className={`${getDischargeTypeColor(patient.dischargeType)} font-medium text-xs px-2 py-1 shrink-0`}>
                {patient.dischargeType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 px-4 pb-4">
        {/* Informações Pessoais e Origem */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <span className="text-gray-600 text-xs">Nascimento</span>
              <p className="font-medium text-gray-800">{formatDateOnly(patient.birthDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <span className="text-gray-600 text-xs">Origem</span>
              <p className="font-medium text-gray-800 truncate">{patient.originCity}</p>
            </div>
          </div>
        </div>

        {/* Informações Médicas */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <Activity className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-gray-600 text-xs">Diagnóstico</span>
              <p className="font-medium text-gray-800 text-sm leading-tight">{patient.diagnosis}</p>
            </div>
          </div>
          {patient.specialty && (
            <div className="flex items-center gap-2 text-sm ml-6">
              <Building className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600 text-xs">Especialidade:</span>
              <span className="font-medium text-gray-800 text-xs">{patient.specialty}</span>
            </div>
          )}
        </div>

        {/* Informações de Internação */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Building className="h-3 w-3 text-gray-400" />
            <div>
              <p className="text-gray-500">Depto</p>
              <p className="font-medium text-gray-800 truncate">{patient.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3 text-gray-400" />
            <div>
              <p className="text-gray-500">Leito</p>
              <p className="font-medium text-gray-800">{patient.bedId.split('-').pop()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <div>
              <p className="text-gray-500">Permanência</p>
              <p className="font-medium text-gray-800">{patient.actualStayDays} dias</p>
            </div>
          </div>
        </div>

        {/* Datas e TFD - Layout mais compacto */}
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-25 rounded-md border border-gray-100">
              <p className="text-gray-500 mb-1">Admissão</p>
              <p className="font-semibold text-gray-800">
                {formatDateSaoPaulo(patient.admissionDate)}
              </p>
            </div>
            <div className="text-center p-2 bg-gray-25 rounded-md border border-gray-100">
              <p className="text-gray-500 mb-1">Alta</p>
              <p className="font-semibold text-gray-800">
                {formatDateSaoPaulo(patient.dischargeDate)}
              </p>
            </div>
            <div className="text-center p-2 bg-gray-25 rounded-md border border-gray-100">
              <p className="text-gray-500 mb-1">TFD</p>
              <p className="font-semibold">
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
