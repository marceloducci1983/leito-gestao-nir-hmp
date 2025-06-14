
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Calendar, Building, AlertCircle, MapPin } from 'lucide-react';
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
    <Card className={`${waitTime.isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{discharge.patient_name}</h3>
              {waitTime.isOverdue && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Atrasado
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tempo de Espera</p>
                <p className={`flex items-center gap-1 font-medium ${waitTime.isOverdue ? 'text-red-600' : ''}`}>
                  <Clock className="h-4 w-4" />
                  {waitTime.hours}h {waitTime.minutes}m
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">Solicitado em</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDateTimeSaoPaulo(discharge.discharge_requested_at)}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">Departamento</p>
                <p className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {discharge.department}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">Leito</p>
                <p className="font-medium text-blue-600">
                  {discharge.bed_name || discharge.bed_id}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Município</p>
                <p className="flex items-center gap-1 text-green-600 font-medium">
                  <MapPin className="h-4 w-4" />
                  {discharge.origin_city || 'Não informado'}
                </p>
              </div>
            </div>

            {waitTime.isOverdue && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-red-600">
                  Justificativa obrigatória (alta com mais de 5h):
                </label>
                <Textarea
                  placeholder="Descreva o motivo da demora..."
                  value={justification}
                  onChange={(e) => onJustificationChange(e.target.value)}
                  className="border-red-200"
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
            >
              Cancelar Alta
            </Button>
            <Button
              size="sm"
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700"
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
