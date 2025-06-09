
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Stethoscope } from 'lucide-react';

interface PatientData {
  id: string;
  name: string;
  sex: string;
  birthDate: string;
  age: number;
  admissionDate: string;
  admissionTime?: string;
  diagnosis: string;
  specialty?: string;
  expectedDischargeDate: string;
  originCity: string;
  occupationDays: number;
  isTFD: boolean;
  tfdType?: string;
}

interface PatientInfoProps {
  patient: PatientData;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateOccupationDays = (admissionDate: string) => {
    const admission = new Date(admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admission.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="text-xs space-y-1">
      <div className="flex items-center gap-1">
        <User className="h-3 w-3" />
        <span className="font-medium">{patient.name}</span>
        <span className="text-gray-500">({patient.age}a, {patient.sex})</span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>Admissão: {formatDate(patient.admissionDate)}</span>
      </div>
      {patient.admissionTime && (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Hora: {patient.admissionTime}</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>DPA: {formatDate(patient.expectedDischargeDate)}</span>
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        <span>{patient.originCity}</span>
      </div>
      <div className="flex items-center gap-1">
        <Stethoscope className="h-3 w-3" />
        <span>{patient.diagnosis}</span>
      </div>
      {patient.specialty && (
        <div className="text-gray-600">
          Especialidade: {patient.specialty}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span>Dias: {calculateOccupationDays(patient.admissionDate)}</span>
        {patient.isTFD && (
          <Badge variant="outline" className="text-xs">
            TFD {patient.tfdType && `- ${patient.tfdType}`}
          </Badge>
        )}
      </div>
    </div>
  );
};
