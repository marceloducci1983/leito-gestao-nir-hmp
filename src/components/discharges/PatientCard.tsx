
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
    <Card className={`${isUrgent ? 'border-l-4 border-red-400 bg-red-50/30' : 'border-l-4 border-blue-400 bg-blue-50/30'} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        {/* Header com nome e badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{bed.patient.name}</h3>
              <p className="text-sm text-gray-600">{bed.name} - {bed.department}</p>
            </div>
          </div>
          {isUrgent && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1">
              Urgente - 24h
            </Badge>
          )}
        </div>
        
        {/* Grid de informações organizadas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase font-medium">Nascimento</span>
            </div>
            <span className="text-sm font-medium">{formatDateSaoPaulo(bed.patient.birthDate)}</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase font-medium">Idade</span>
            </div>
            <span className="text-sm font-medium">{bed.patient.age || calculateAge(bed.patient.birthDate)} anos</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase font-medium">Admissão</span>
            </div>
            <span className="text-sm font-medium">{formatDateSaoPaulo(bed.patient.admissionDate)}</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase font-medium">Origem</span>
            </div>
            <span className="text-sm font-medium">{bed.patient.originCity}</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-500 uppercase font-medium">DPA</span>
            </div>
            <span className="text-sm font-bold text-red-600">{formatDateOnly(bed.patient.expectedDischargeDate)}</span>
          </div>
          
          {bed.patient.specialty && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase font-medium">Especialidade</span>
              </div>
              <span className="text-sm font-medium">{bed.patient.specialty}</span>
            </div>
          )}
        </div>
        
        {/* Diagnóstico */}
        <div className="border-t pt-3">
          <div className="flex items-start gap-2 mb-2">
            <Stethoscope className="h-4 w-4 mt-1 text-gray-500" />
            <div>
              <span className="text-xs text-gray-500 uppercase font-medium block mb-1">Diagnóstico</span>
              <span className="text-sm text-gray-700">{bed.patient.diagnosis}</span>
            </div>
          </div>
          
          {bed.patient.isTFD && (
            <Badge variant="outline" className="mt-2 text-xs border-orange-300 text-orange-700 bg-orange-50">
              🚑 TFD {bed.patient.tfdType && `- ${bed.patient.tfdType}`}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  </>
);

export default PatientCard;
