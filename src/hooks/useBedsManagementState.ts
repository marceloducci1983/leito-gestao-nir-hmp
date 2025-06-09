
import { useState } from 'react';
import { Department } from '@/types';

export const useBedsManagementState = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CLINICA MEDICA');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Form states
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);

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
  };
};
