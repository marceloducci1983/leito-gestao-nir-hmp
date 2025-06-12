
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Stethoscope } from 'lucide-react';
import { formatDateSaoPaulo } from '@/utils/timezoneUtils';
import { formatDateOnly, calculateAge } from '@/utils/dateUtils';

interface PatientCardProps {
  bed: any;
  isUrgent?: boolean;
}

const PatientCard: React.FC<PatientCardProps> = ({ bed, isUrgent = false }) => (
  <Card className={`${isUrgent ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`}>
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-semibold text-lg">{bed.patient.name}</span>
            <Badge variant="outline">{bed.name} - {bed.department}</Badge>
          </div>
          {isUrgent && (
            <Badge className="bg-orange-500">Urgente - 24h</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Nascimento: {formatDateSaoPaulo(bed.patient.birthDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>Idade: {calculateAge(bed.patient.birthDate)} anos</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Admissão: {formatDateSaoPaulo(bed.patient.admissionDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="font-medium">Origem: {bed.patient.originCity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-orange-600" />
            <span className="font-medium text-orange-600">
              DPA: {formatDateOnly(bed.patient.expectedDischargeDate)}
            </span>
          </div>
          {bed.patient.specialty && (
            <div className="flex items-center gap-2">
              <Stethoscope className="h-3 w-3" />
              <span>Especialidade: {bed.patient.specialty}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-start gap-2">
          <Stethoscope className="h-3 w-3 mt-1" />
          <span className="text-sm">{bed.patient.diagnosis}</span>
        </div>
        
        {bed.patient.isTFD && (
          <Badge variant="secondary" className="text-xs">
            TFD {bed.patient.tfdType && `- ${bed.patient.tfdType}`}
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

export default PatientCard;
