
import React from 'react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import { useDepartmentNames } from '@/hooks/queries/useDepartmentQueries';
import { Loader2 } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

// Importações dos componentes refatorados
import BedsPanelHeader from '@/components/beds-panel/BedsPanelHeader';
import BedSearchBar from '@/components/beds-panel/BedSearchBar';
import BedsPanelContent from '@/components/beds-panel/BedsPanelContent';
import BedsPanelModals from '@/components/beds-panel/BedsPanelModals';
import { useBedsPanelLogic } from '@/components/beds-panel/useBedsPanelLogic';
import { useBedsPanelHandlers } from '@/components/beds-panel/useBedsPanelHandlers';

interface SupabaseBedsPanelProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
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
  } = useBedsPanelHandlers(
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
  );

  // Estado para modal de testes
  const [showTestingModal, setShowTestingModal] = React.useState(false);

  // Update parent component with data
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(centralData);
    }
  }, [centralData, onDataChange]);

  if (isLoading || loadingDepartments) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando leitos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erro ao carregar dados dos leitos.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

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

  return (
    <div className={`space-y-4 ${isMobile ? 'pb-16' : ''}`}>
      <BedsPanelHeader
        totalBeds={centralData.beds.length}
        occupiedBeds={centralData.beds.filter((bed: any) => bed.isOccupied).length}
        onManageSectors={handleManageSectors}
        onCreateNewBed={handleCreateNewBed}
        onOpenTesting={handleOpenTesting}
      />

      <BedSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultsCount={sortedBeds.length}
        selectedDepartment={selectedDepartment}
      />

      <BedsPanelContent
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentSelect={setSelectedDepartment}
        departmentBeds={centralData.beds}
        sortedBeds={bedsWithDischargeState}
        searchTerm={searchTerm}
        onReserveBed={handleReserveBed}
        onAdmitPatient={handleAdmitPatient}
        onEditPatient={handleEditPatient}
        onTransferPatient={handleTransferPatient}
        onDischargePatient={handleDischargePatient}
        onDeleteReservation={handleDeleteReservation}
        onDeleteBed={handleDeleteBed}
      />

      <BedsPanelModals
        showReservationForm={showReservationForm}
        onCloseReservationForm={() => setShowReservationForm(false)}
        onSubmitReservation={submitReservation}
        selectedBedId={selectedBedId}
        selectedDepartment={selectedDepartment}
        showPatientForm={showPatientForm}
        onClosePatientForm={() => {
          setShowPatientForm(false);
          setSelectedPatient(null);
          setIsEditingPatient(false);
        }}
        onSubmitPatient={submitPatient}
        isEditingPatient={isEditingPatient}
        selectedPatient={selectedPatient}
        showTransferModal={showTransferModal}
        onCloseTransferModal={() => {
          setShowTransferModal(false);
          setSelectedPatient(null);
        }}
        onSubmitTransfer={submitTransfer}
        availableBedsForTransfer={availableBedsForTransfer}
        showSectorModal={showSectorModal}
        onCloseSectorModal={() => setShowSectorModal(false)}
        departments={departments}
        showBedModal={showBedModal}
        onCloseBedModal={() => {
          setShowBedModal(false);
          setSelectedBedForEdit(null);
        }}
        selectedBedForEdit={selectedBedForEdit}
        showTestingModal={showTestingModal}
        onCloseTestingModal={() => setShowTestingModal(false)}
      />
    </div>
  );
};

export default SupabaseBedsPanel;
