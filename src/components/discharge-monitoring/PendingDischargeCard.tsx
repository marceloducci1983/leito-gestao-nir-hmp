
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Calendar, Building, AlertCircle, MapPin, User } from 'lucide-react';
import { formatDateTimeSaoPaulo } from '@/utils/timezoneUtils';

interface PendingDischargeCardProps {
  discharge: any;
  waitTime: { hours: number; minutes: number; isOverdue: boolean };
  justification: string;
  onJustificationChange: (value: string) => void;
  onCancel: () => void;
  onComplete: () => void;
}

const PendingDischargeCard: React.FC<PendingDischargeCardProps> = ({
  discharge,
  waitTime,
  justification,
  onJustificationChange,
  onCancel,
  onComplete
}) => {
  return (
    <Card className={`
      transition-all duration-300 hover:shadow-lg
      border-l-4 border-l-orange-500 bg-orange-50/30 border-orange-100
      ${waitTime.isOverdue ? 'ring-2 ring-red-200 bg-red-50/50' : ''}
    `}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-4">
            {/* Header com nome do paciente */}
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-xl text-gray-800">{discharge.patient_name}</h3>
              {waitTime.isOverdue && (
                <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                  Atrasado
                </Badge>
              )}
            </div>
            
            {/* Grid de informações principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Tempo de Espera</p>
                <p className={`flex items-center gap-2 font-bold text-lg ${waitTime.isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                  <Clock className="h-4 w-4" />
                  {waitTime.hours}h {waitTime.minutes}m
                </p>
              </div>
              
              <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Solicitado em</p>
                <p className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDateTimeSaoPaulo(discharge.discharge_requested_at)}</span>
                </p>
              </div>
              
              <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Departamento</p>
                <p className="flex items-center gap-2 font-medium">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-blue-700">{discharge.department}</span>
                </p>
              </div>
              
              <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Leito</p>
                <p className="font-bold text-lg text-blue-600">
                  {discharge.bed_name || discharge.bed_id}
                </p>
              </div>

              <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Município</p>
                <p className="flex items-center gap-2 text-green-600 font-medium">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{discharge.origin_city || 'Não informado'}</span>
                </p>
              </div>
            </div>

            {/* Justificativa para altas atrasadas */}
            {waitTime.isOverdue && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <label className="block text-sm font-semibold text-red-700 mb-2">
                  Justificativa obrigatória (alta com mais de 5h):
                </label>
                <Textarea
                  placeholder="Descreva o motivo da demora..."
                  value={justification}
                  onChange={(e) => onJustificationChange(e.target.value)}
                  className="border-red-200 focus:border-red-400"
                />
              </div>
            )}
          </div>
          
          {/* Botões de ação */}
          <div className="flex flex-col gap-3 ml-6">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700 hover:text-yellow-800 min-w-32"
            >
              Cancelar Alta
            </Button>
            <Button
              size="sm"
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700 text-white min-w-32"
            >
              Alta Efetiva
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingDischargeCard;
