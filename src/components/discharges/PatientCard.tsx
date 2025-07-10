
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
    <Card className={`${isUrgent ? 'border-orange-300 bg-orange-50' : 'border-gray-200'} mb-4`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-lg text-gray-900">{bed.patient.name}</span>
            <span className="text-sm text-gray-600">{bed.name} - {bed.department}</span>
          </div>
          {isUrgent && (
            <Badge className="bg-orange-500 text-white">Urgente - 24h</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <span className="text-gray-500">Nascimento:</span>
              <div className="font-medium">{formatDateSaoPaulo(bed.patient.birthDate)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <span className="text-gray-500">Idade:</span>
              <div className="font-medium">{bed.patient.age || calculateAge(bed.patient.birthDate)} anos</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <span className="text-gray-500">Origem:</span>
              <div className="font-medium">{bed.patient.originCity}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <div>
              <span className="text-gray-500">DPA:</span>
              <div className="font-medium text-orange-600">{formatDateOnly(bed.patient.expectedDischargeDate)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <span className="text-gray-500">Admissão:</span>
              <div className="font-medium">{formatDateSaoPaulo(bed.patient.admissionDate)}</div>
            </div>
          </div>
          
          {bed.patient.specialty && (
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-gray-500" />
              <div>
                <span className="text-gray-500">Especialidade:</span>
                <div className="font-medium">{bed.patient.specialty}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <Stethoscope className="h-4 w-4 mt-1 text-gray-500" />
            <span className="text-sm text-gray-700">{bed.patient.diagnosis}</span>
          </div>
          
          {bed.patient.isTFD && (
            <Badge variant="secondary" className="mt-2 text-xs">
              TFD {bed.patient.tfdType && `- ${bed.patient.tfdType}`}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  </>
);

export default PatientCard;
