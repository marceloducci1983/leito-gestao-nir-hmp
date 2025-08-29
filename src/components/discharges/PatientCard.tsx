
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
    {/* Versão APENAS para impressão - oculta na visualização normal */}
    <div className={`patient-item ${isUrgent ? '' : 'regular'} print:block hidden`}>
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
          <span><strong>DPA: {bed.patient.expectedDischargeDate ? formatDateOnly(bed.patient.expectedDischargeDate) : 'SEM DATA PREVISTA DE ALTA'}</strong></span>
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

    {/* Versão para visualização normal - layout como a segunda imagem */}
    <Card className={`print:hidden ${isUrgent ? 'border-l-4 border-red-400' : 'border-l-4 border-blue-400'} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        {/* Header com nome, leito e badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="font-bold text-lg text-gray-900">{bed.patient.name}</h3>
              <p className="text-sm text-blue-600 font-medium">{bed.name} - {bed.department}</p>
            </div>
          </div>
          {isUrgent && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1">
              Urgente - 24h
            </Badge>
          )}
        </div>
        
        {/* Grid de informações em 4 colunas como na segunda imagem */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-3 w-3 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500 uppercase font-medium">Nascimento</span>
            </div>
            <span className="text-sm font-medium">{formatDateSaoPaulo(bed.patient.birthDate)}</span>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-xs text-gray-500 uppercase font-medium">Idade</span>
            </div>
            <span className="text-sm font-medium">{bed.patient.age || calculateAge(bed.patient.birthDate)} anos</span>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 uppercase font-medium">Admissão</span>
            </div>
            <span className="text-sm font-medium">{formatDateSaoPaulo(bed.patient.admissionDate)}</span>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="h-3 w-3 text-orange-600" />
              </div>
              <span className="text-xs text-gray-500 uppercase font-medium">Origem</span>
            </div>
            <span className="text-sm font-medium">{bed.patient.originCity}</span>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <Calendar className="h-3 w-3 text-red-600" />
              </div>
              <span className="text-xs text-red-500 uppercase font-medium">DPA</span>
            </div>
            <span className="text-sm font-bold text-red-600">{bed.patient.expectedDischargeDate ? formatDateOnly(bed.patient.expectedDischargeDate) : 'SEM DATA PREVISTA DE ALTA'}</span>
          </div>
          
          {bed.patient.specialty && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-3 w-3 text-teal-600" />
                </div>
                <span className="text-xs text-gray-500 uppercase font-medium">Especialidade</span>
              </div>
              <span className="text-sm font-medium">{bed.patient.specialty}</span>
            </div>
          )}
        </div>
        
        {/* Diagnóstico em destaque */}
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
              <Stethoscope className="h-3 w-3 text-purple-600" />
            </div>
            <div>
              <span className="text-xs text-purple-600 uppercase font-medium block mb-1">Diagnóstico</span>
              <span className="text-sm text-gray-800 font-medium">{bed.patient.diagnosis}</span>
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
