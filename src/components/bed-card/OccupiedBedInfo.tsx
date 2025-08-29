
import React from 'react';
import { PatientInfo } from './PatientInfo';
import { PatientActionButtons } from './PatientActionButtons';
import { useResponsive } from '@/hooks/useResponsive';

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
  isIsolation?: boolean;
}

interface OccupiedBedInfoProps {
  patient: PatientData;
  onEditPatient: () => void;
  onTransferPatient: () => void;
  onDischargePatient: () => void;
  onToggleIsolation?: (patientId: string) => void;
  isDischarging?: boolean;
}

export const OccupiedBedInfo: React.FC<OccupiedBedInfoProps> = ({
  patient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onToggleIsolation,
  isDischarging = false
}) => {
  const { isMobile } = useResponsive();

  return (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-3'}`}>
      <PatientInfo patient={patient} />
      <PatientActionButtons
        onEditPatient={onEditPatient}
        onTransferPatient={onTransferPatient}
        onDischargePatient={onDischargePatient}
        onToggleIsolation={onToggleIsolation}
        patientId={patient.id}
        isIsolation={patient.isIsolation}
        isDischarging={isDischarging}
        isMobile={isMobile}
      />
    </div>
  );
};
