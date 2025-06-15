
import React from 'react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import { useDepartmentNames } from '@/hooks/queries/useDepartmentQueries';
import { useResponsive } from '@/hooks/useResponsive';
import { useBedsPanelLogic } from './useBedsPanelLogic';
import { useBedsPanelHandlers } from './useBedsPanelHandlers';

interface SupabaseBedsPanelStateProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

export const useSupabaseBedsPanelState = ({ onDataChange }: SupabaseBedsPanelStateProps) => {
  const { centralData, isLoading, error, addPatient, transferPatient, addReservation } = useSupabaseBeds();
  const { departmentNames, isLoading: loadingDepartments } = useDepartmentNames();
  const { isMobile } = useResponsive();

  // Estados e lógica do painel
  const {
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
    sortedBeds,
    availableBedsForTransfer
  } = useBedsPanelLogic(centralData);

  // Handlers para ações dos leitos
  const {
    handleReserveBed,
    handleAdmitPatient,
    handleEditPatient,
    handleTransferPatient,
    handleDischargePatient,
    handleDeleteReservation,
    handleDeleteBed,
    submitReservation,
    submitPatient,
    submitTransfer,
    handleManageSectors,
    handleCreateNewBed,
    handleEditBed,
    isDischarging
  } = useBedsPanelHandlers({
    centralData,
    selectedBedId,
    setSelectedBedId,
    selectedPatient,
    setSelectedPatient,
    selectedDepartment,
    setSelectedDepartment,
    setShowReservationForm,
    setShowPatientForm,
    setShowTransferModal,
    setIsEditingPatient,
    setShowSectorModal,
    setShowBedModal,
    setSelectedBedForEdit,
    addPatient,
    transferPatient,
    addReservation
  });

  // Estado para modal de testes
  const [showTestingModal, setShowTestingModal] = React.useState(false);

  // Update parent component with data
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(centralData);
    }
  }, [centralData, onDataChange]);

  // Usar departamentos dinâmicos do banco de dados com fallback
  const departments = departmentNames.length > 0 ? departmentNames : [
    'CLINICA MEDICA',
    'PRONTO SOCORRO', 
    'CLINICA CIRURGICA',
    'UTI ADULTO',
    'UTI NEONATAL',
    'PEDIATRIA',
    'MATERNIDADE'
  ];

  const handleOpenTesting = () => {
    setShowTestingModal(true);
  };

  // Para cada leito, determine se está em processo de alta
  const bedsWithDischargeState = sortedBeds.map((bed: any) => ({
    ...bed,
    isDischarging: isDischarging(bed.id)
  }));

  return {
    // Loading and error states
    isLoading: isLoading || loadingDepartments,
    error,
    isMobile,
    
    // Data
    centralData,
    departments,
    bedsWithDischargeState,
    availableBedsForTransfer,
    
    // Search and selection state
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    
    // Modal states
    showPatientForm,
    setShowPatientForm,
    showReservationForm,
    setShowReservationForm,
    showTransferModal,
    setShowTransferModal,
    showSectorModal,
    setShowSectorModal,
    showBedModal,
    setShowBedModal,
    showTestingModal,
    setShowTestingModal,
    
    // Selected items
    selectedBedId,
    selectedPatient,
    setSelectedPatient,
    isEditingPatient,
    setIsEditingPatient,
    selectedBedForEdit,
    setSelectedBedForEdit,
    
    // Handlers
    handleReserveBed,
    handleAdmitPatient,
    handleEditPatient,
    handleTransferPatient,
    handleDischargePatient,
    handleDeleteReservation,
    handleDeleteBed,
    submitReservation,
    submitPatient,
    submitTransfer,
    handleManageSectors,
    handleCreateNewBed,
    handleEditBed,
    handleOpenTesting
  };
};
