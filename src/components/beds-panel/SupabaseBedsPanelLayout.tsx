
import React from 'react';
import { Loader2 } from 'lucide-react';
import BedsPanelHeader from './BedsPanelHeader';
import BedSearchBar from './BedSearchBar';
import BedsPanelContent from './BedsPanelContent';
import BedsPanelModals from './BedsPanelModals';

interface SupabaseBedsPanelLayoutProps {
  // Loading and error states
  isLoading: boolean;
  error: any;
  isMobile: boolean;
  
  // Data
  centralData: any;
  departments: string[];
  bedsWithDischargeState: any[];
  availableBedsForTransfer: any[];
  
  // Search and selection state
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  
  // Modal states
  showPatientForm: boolean;
  setShowPatientForm: (show: boolean) => void;
  showReservationForm: boolean;
  setShowReservationForm: (show: boolean) => void;
  showTransferModal: boolean;
  setShowTransferModal: (show: boolean) => void;
  showSectorModal: boolean;
  setShowSectorModal: (show: boolean) => void;
  showBedModal: boolean;
  setShowBedModal: (show: boolean) => void;
  
  // Selected items
  selectedBedId: string;
  selectedPatient: any;
  setSelectedPatient: (patient: any) => void;
  isEditingPatient: boolean;
  setIsEditingPatient: (editing: boolean) => void;
  selectedBedForEdit: any;
  setSelectedBedForEdit: (bed: any) => void;
  
  // Handlers
  handleReserveBed: (bedId: string) => void;
  handleAdmitPatient: (bedId: string) => void;
  handleEditPatient: (bedId: string) => void;
  handleTransferPatient: (bedId: string) => void;
  handleDischargePatient: (bedId: string) => void;
  handleDeleteReservation: (bedId: string) => void;
  handleDeleteBed: (bedId: string) => void;
  onToggleIsolation?: (patientId: string) => void;
  submitReservation: (data: any) => void;
  submitPatient: (data: any) => void;
  submitTransfer: (department: string, bedId: string) => void;
  handleManageSectors: () => void;
  handleCreateNewBed: () => void;
  handleEditBed: (bed: any) => void;
}

const SupabaseBedsPanelLayout: React.FC<SupabaseBedsPanelLayoutProps> = ({
  isLoading,
  error,
  isMobile,
  centralData,
  departments,
  bedsWithDischargeState,
  availableBedsForTransfer,
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
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
  selectedBedId,
  selectedPatient,
  setSelectedPatient,
  isEditingPatient,
  setIsEditingPatient,
  selectedBedForEdit,
  setSelectedBedForEdit,
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
  onToggleIsolation
}) => {
  if (isLoading) {
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

  return (
    <div className={`space-y-4 ${isMobile ? 'pb-16' : ''}`}>
      <BedsPanelHeader
        totalBeds={centralData.beds.length}
        occupiedBeds={centralData.beds.filter((bed: any) => bed.isOccupied).length}
        onManageSectors={handleManageSectors}
        onCreateNewBed={handleCreateNewBed}
      />

      <BedSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultsCount={bedsWithDischargeState.length}
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
        onToggleIsolation={onToggleIsolation}
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
      />
    </div>
  );
};

export default SupabaseBedsPanelLayout;
