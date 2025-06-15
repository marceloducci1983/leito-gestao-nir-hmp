
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
      case 'POR MELHORA': return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/50 ring-1 ring-emerald-100';
      case 'TRANSFERENCIA': return 'bg-sky-50/80 text-sky-700 border-sky-200/50 ring-1 ring-sky-100';
      case 'EVASÃO': return 'bg-amber-50/80 text-amber-700 border-amber-200/50 ring-1 ring-amber-100';
      case 'OBITO': return 'bg-rose-50/80 text-rose-700 border-rose-200/50 ring-1 ring-rose-100';
      default: return 'bg-slate-50/80 text-slate-700 border-slate-200/50 ring-1 ring-slate-100';
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
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200/60 bg-gradient-to-br from-white via-slate-50/30 to-white shadow-sm backdrop-blur-sm rounded-xl ring-1 ring-slate-100/50">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-100/50 shadow-inner ring-1 ring-blue-50">
            <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 font-semibold text-sm shadow-inner">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-slate-800 truncate">{patient.name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <User className="h-3 w-3 text-slate-400" />
                  {patient.age} anos
                </p>
              </div>
              <Badge className={`${getDischargeTypeColor(patient.dischargeType)} font-medium text-xs px-3 py-1 shrink-0 rounded-full transition-all duration-200`}>
                {patient.dischargeType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 px-4 pb-3">
        {/* Informações Pessoais e Origem */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <Calendar className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-slate-500 text-xs">Nascimento</span>
              <p className="font-medium text-slate-700">{formatDateOnly(patient.birthDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <MapPin className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-slate-500 text-xs">Origem</span>
              <p className="font-medium text-slate-700 truncate">{patient.originCity}</p>
            </div>
          </div>
        </div>

        {/* Informações Médicas */}
        <div className="space-y-2 bg-gradient-to-r from-slate-50/50 to-blue-50/30 p-3 rounded-lg border border-slate-100/50">
          <div className="flex items-start gap-2 text-sm">
            <Activity className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-slate-500 text-xs">Diagnóstico</span>
              <p className="font-medium text-slate-700 text-sm leading-tight">{patient.diagnosis}</p>
            </div>
          </div>
          {patient.specialty && (
            <div className="flex items-center gap-2 text-sm ml-6">
              <Building className="h-3 w-3 text-slate-400" />
              <span className="text-slate-500 text-xs">Especialidade:</span>
              <span className="font-medium text-slate-700 text-xs">{patient.specialty}</span>
            </div>
          )}
        </div>

        {/* Informações de Internação */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <Building className="h-3 w-3 text-slate-400" />
            <div>
              <p className="text-slate-500">Depto</p>
              <p className="font-medium text-slate-700 truncate">{patient.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <Bed className="h-3 w-3 text-slate-400" />
            <div>
              <p className="text-slate-500">Leito</p>
              <p className="font-medium text-slate-700">{patient.bedId.split('-').pop()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <Clock className="h-3 w-3 text-slate-400" />
            <div>
              <p className="text-slate-500">Permanência</p>
              <p className="font-medium text-slate-700">{patient.actualStayDays} dias</p>
            </div>
          </div>
        </div>

        {/* Datas e TFD - Layout mais compacto */}
        <div className="border-t border-slate-100/60 pt-2 mt-2">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gradient-to-br from-slate-50/80 to-blue-50/40 rounded-lg border border-slate-100/50 ring-1 ring-slate-50 transition-all duration-200 hover:shadow-sm">
              <p className="text-slate-500 mb-1">Admissão</p>
              <p className="font-semibold text-slate-700">
                {formatDateSaoPaulo(patient.admissionDate)}
              </p>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-slate-50/80 to-emerald-50/40 rounded-lg border border-slate-100/50 ring-1 ring-slate-50 transition-all duration-200 hover:shadow-sm">
              <p className="text-slate-500 mb-1">Alta</p>
              <p className="font-semibold text-slate-700">
                {formatDateSaoPaulo(patient.dischargeDate)}
              </p>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-slate-50/80 to-indigo-50/40 rounded-lg border border-slate-100/50 ring-1 ring-slate-50 transition-all duration-200 hover:shadow-sm">
              <p className="text-slate-500 mb-1">TFD</p>
              <p className="font-semibold">
                {patient.isTFD ? (
                  <span className="text-blue-600">Sim</span>
                ) : (
                  <span className="text-slate-600">Não</span>
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
