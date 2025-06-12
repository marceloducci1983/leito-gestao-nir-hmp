
import { useState } from 'react';
import { Department, Patient } from '@/types';

export const useBedsManagementState = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CLINICA MEDICA');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Form states
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  
  // Loading states
  const [dischargingBeds, setDischargingBeds] = useState<Set<string>>(new Set());

  const setIsDischarging = (bedId: string, isDischarging: boolean) => {
    setDischargingBeds(prev => {
      const newSet = new Set(prev);
      if (isDischarging) {
        newSet.add(bedId);
      } else {
        newSet.delete(bedId);
      }
      return newSet;
    });
  };

  const isDischarging = (bedId: string) => dischargingBeds.has(bedId);

  return {
    selectedDepartment,
    setSelectedDepartment,
    selectedBedId,
    setSelectedBedId,
    selectedPatient,
    setSelectedPatient,
    showPatientForm,
    setShowPatientForm,
    showReservationForm,
    setShowReservationForm,
    showDischargeModal,
    setShowDischargeModal,
    showTransferModal,
    setShowTransferModal,
    isEditingPatient,
    setIsEditingPatient,
    dischargingBeds,
    setIsDischarging,
    isDischarging
  };
};
