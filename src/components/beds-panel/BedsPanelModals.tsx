
import React from 'react';
import ReservationForm from '@/components/forms/ReservationForm';
import NewPatientForm from '@/components/forms/NewPatientForm';
import TransferModal from '@/components/forms/TransferModal';
import SectorManagementModal from '@/components/forms/SectorManagementModal';
import BedManagementModal from '@/components/forms/BedManagementModal';

interface BedsPanelModalsProps {
  showReservationForm: boolean;
  onCloseReservationForm: () => void;
  onSubmitReservation: (data: any) => void;
  selectedBedId: string;
  selectedDepartment: string;
  showPatientForm: boolean;
  onClosePatientForm: () => void;
  onSubmitPatient: (data: any) => void;
  isEditingPatient: boolean;
  selectedPatient: any;
  showTransferModal: boolean;
  onCloseTransferModal: () => void;
  onSubmitTransfer: (department: string, bedId: string) => void;
  availableBedsForTransfer: any[];
  showSectorModal: boolean;
  onCloseSectorModal: () => void;
  departments: string[];
  showBedModal: boolean;
  onCloseBedModal: () => void;
  selectedBedForEdit?: any;
}

const BedsPanelModals: React.FC<BedsPanelModalsProps> = ({
  showReservationForm,
  onCloseReservationForm,
  onSubmitReservation,
  selectedBedId,
  selectedDepartment,
  showPatientForm,
  onClosePatientForm,
  onSubmitPatient,
  isEditingPatient,
  selectedPatient,
  showTransferModal,
  onCloseTransferModal,
  onSubmitTransfer,
  availableBedsForTransfer,
  showSectorModal,
  onCloseSectorModal,
  departments,
  showBedModal,
  onCloseBedModal,
  selectedBedForEdit
}) => {
  console.log('🔄 BedsPanelModals - showPatientForm:', showPatientForm);
  console.log('🔄 BedsPanelModals - selectedPatient:', selectedPatient);
  console.log('🔄 BedsPanelModals - isEditingPatient:', isEditingPatient);
  console.log('🔄 BedsPanelModals - selectedBedId:', selectedBedId);
  console.log('🔄 BedsPanelModals - selectedDepartment:', selectedDepartment);

  return (
    <>
      {showReservationForm && (
        <ReservationForm
          isOpen={showReservationForm}
          onClose={onCloseReservationForm}
          onSubmit={onSubmitReservation}
        />
      )}

      {showPatientForm && (
        <NewPatientForm
          isOpen={showPatientForm}
          onClose={onClosePatientForm}
          onSubmit={onSubmitPatient}
          bedId={selectedBedId}
          department={selectedDepartment}
          patient={selectedPatient}
          patientData={selectedPatient}
          isEditing={isEditingPatient}
        />
      )}

      {showTransferModal && selectedPatient && (
        <TransferModal
          isOpen={showTransferModal}
          onClose={onCloseTransferModal}
          onSubmit={onSubmitTransfer}
          patientName={selectedPatient.name}
          availableBeds={availableBedsForTransfer}
          currentDepartment={selectedPatient.department}
        />
      )}

      {showSectorModal && (
        <SectorManagementModal
          isOpen={showSectorModal}
          onClose={onCloseSectorModal}
          departments={departments}
        />
      )}

      {showBedModal && (
        <BedManagementModal
          isOpen={showBedModal}
          onClose={onCloseBedModal}
          departments={departments}
          bedData={selectedBedForEdit}
          isEditing={!!selectedBedForEdit}
        />
      )}
    </>
  );
};

export default BedsPanelModals;
