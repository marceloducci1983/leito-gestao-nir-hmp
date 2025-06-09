
import React from 'react';
import { PatientInfo } from './PatientInfo';
import { PatientActionButtons } from './PatientActionButtons';

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

interface OccupiedBedInfoProps {
  patient: PatientData;
  onEditPatient: () => void;
  onTransferPatient: () => void;
  onDischargePatient: () => void;
}

export const OccupiedBedInfo: React.FC<OccupiedBedInfoProps> = ({
  patient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient
}) => {
  return (
    <div className="space-y-3">
      <PatientInfo patient={patient} />
      <PatientActionButtons
        onEditPatient={onEditPatient}
        onTransferPatient={onTransferPatient}
        onDischargePatient={onDischargePatient}
      />
    </div>
  );
};
