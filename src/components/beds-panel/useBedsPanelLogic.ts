
import { useState, useMemo } from 'react';
import { Department, Patient } from '@/types';
import { sortBedsByCustomOrder } from '@/utils/BedOrderUtils';

export const useBedsPanelLogic = (centralData: any) => {
  // Estados para controlar os modais
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CLINICA MEDICA');
  
  // Estado para pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados dos modais
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  const [selectedBedForEdit, setSelectedBedForEdit] = useState<any>(null);

  // Função para filtrar leitos baseado na pesquisa
  const filteredBeds = useMemo(() => {
    if (!searchTerm.trim()) {
      return centralData.beds.filter((bed: any) => bed.department === selectedDepartment);
    }

    const term = searchTerm.toLowerCase().trim();
    
    return centralData.beds.filter((bed: any) => {
      // Filtrar por departamento selecionado
      if (bed.department !== selectedDepartment) return false;
      
      // Buscar por número/nome do leito
      const bedNameMatch = bed.name.toLowerCase().includes(term);
      
      // Buscar por nome do paciente (se houver)
      const patientNameMatch = bed.patient ? 
        bed.patient.name.toLowerCase().includes(term) : false;
      
      // Buscar por nome na reserva (se houver) - FIX: usando patientName
      const reservationNameMatch = bed.reservation ? 
        bed.reservation.patientName.toLowerCase().includes(term) : false;
      
      return bedNameMatch || patientNameMatch || reservationNameMatch;
    });
  }, [centralData.beds, selectedDepartment, searchTerm]);

  const sortedBeds = sortBedsByCustomOrder(filteredBeds, selectedDepartment);

  const availableBedsForTransfer = centralData.beds
    .filter((bed: any) => !bed.isOccupied && !bed.isReserved)
    .map((bed: any) => ({
      id: bed.id,
      name: bed.name,
      department: bed.department
    }));

  return {
    // States
    selectedBedId,
    setSelectedBedId,
    selectedPatient,
    setSelectedPatient,
    selectedDepartment,
    setSelectedDepartment,
    searchTerm,
    setSearchTerm,
    showPatientForm,
    setShowPatientForm,
    showReservationForm,
    setShowReservationForm,
    showTransferModal,
    setShowTransferModal,
    isEditingPatient,
    setIsEditingPatient,
    showSectorModal,
    setShowSectorModal,
    showBedModal,
    setShowBedModal,
    selectedBedForEdit,
    setSelectedBedForEdit,
    
    // Computed values
    filteredBeds,
    sortedBeds,
    availableBedsForTransfer
  };
};
