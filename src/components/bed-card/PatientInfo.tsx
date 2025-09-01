
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Stethoscope } from 'lucide-react';
import { formatDate, formatDateTime, formatDateOnly, formatAgeForDepartment } from '@/utils/dateUtils';

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
  department?: string;
}

interface PatientInfoProps {
  patient: PatientData;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  console.log('🔍 PatientInfo - Dados do paciente recebidos:', {
    name: patient.name,
    originCity: patient.originCity,
    expectedDischargeDate: patient.expectedDischargeDate,
    isTFD: patient.isTFD,
    tfdType: patient.tfdType
  });
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
        <span className="text-gray-500">
          ({patient.department && (patient.department === 'UTI NEONATAL' || patient.department === 'PEDIATRIA') 
            ? formatAgeForDepartment(patient.birthDate, patient.department) 
            : `${patient.age}a`}, {patient.sex})
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>Admissão: {formatDateOnly(patient.admissionDate)}</span>
      </div>
      {patient.admissionTime && (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Hora: {patient.admissionTime}</span>
        </div>
      )}
      <div className="flex items-center gap-2 p-2 bg-yellow-100 rounded-md border border-yellow-200">
        <Calendar className="h-3 w-3 text-yellow-600" />
        <span className="font-bold text-yellow-800">DPA: {patient.expectedDischargeDate ? formatDateOnly(patient.expectedDischargeDate) : 'SEM DATA PREVISTA DE ALTA'}</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-blue-100 rounded-md border border-blue-200">
        <MapPin className="h-3 w-3 text-blue-600" />
        <span className="font-medium text-blue-800">{patient.originCity}</span>
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
          <Badge variant="outline" className="text-xs border-blue-600 text-white bg-blue-600">
            TFD {patient.tfdType && `- ${patient.tfdType}`}
          </Badge>
        )}
      </div>
    </div>
  );
};
