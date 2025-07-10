
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
  <>
    {/* Versão para impressão/relatório */}
    <div className={`patient-item ${isUrgent ? '' : 'regular'}`}>
      <div className="patient-header">
        <div className="patient-name">
          👤 {bed.patient.name}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="bed-info">
            {bed.name} - {bed.department}
          </div>
          {isUrgent && (
            <div className="urgency-badge">
              🚨 Urgente - 24h
            </div>
          )}
        </div>
      </div>
      
      <div className="patient-info">
        <div className="info-item">
          <div className="info-icon birth">📅</div>
          <span>Nascimento: {formatDateSaoPaulo(bed.patient.birthDate)}</span>
        </div>
        <div className="info-item">
          <div className="info-icon age">👶</div>
          <span>Idade: {bed.patient.age || calculateAge(bed.patient.birthDate)} anos</span>
        </div>
        <div className="info-item">
          <div className="info-icon admission">🏥</div>
          <span>Admissão: {formatDateSaoPaulo(bed.patient.admissionDate)}</span>
        </div>
        <div className="info-item">
          <div className="info-icon origin">📍</div>
          <span>Origem: {bed.patient.originCity}</span>
        </div>
        <div className="info-item">
          <div className="info-icon discharge">⏰</div>
          <span><strong>DPA: {formatDateOnly(bed.patient.expectedDischargeDate)}</strong></span>
        </div>
        {bed.patient.specialty && (
          <div className="info-item">
            <div className="info-icon specialty">🩺</div>
            <span>Especialidade: {bed.patient.specialty}</span>
          </div>
        )}
      </div>
      
      <div className="diagnosis">
        🔬 <strong>Diagnóstico:</strong> {bed.patient.diagnosis}
      </div>
      
      {bed.patient.isTFD && (
        <div className="tfd-badge">
          🚑 TFD {bed.patient.tfdType && `- ${bed.patient.tfdType}`}
        </div>
      )}
    </div>

    {/* Versão para visualização normal da aplicação */}
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
              <span>Idade: {bed.patient.age || calculateAge(bed.patient.birthDate)} anos</span>
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
  </>
);

export default PatientCard;
