
import React from 'react';
import ReservationForm from '@/components/forms/ReservationForm';
import PatientForm from '@/components/forms/PatientForm';
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
  console.log('🔄 BedsPanelModals - showBedModal:', showBedModal);
  console.log('🔄 BedsPanelModals - selectedBedForEdit:', selectedBedForEdit);

  return (
    <>
      {showReservationForm && (
        <ReservationForm
          onSubmit={onSubmitReservation}
          onClose={onCloseReservationForm}
          bedId={selectedBedId}
          departmentName={selectedDepartment}
        />
      )}

      {showPatientForm && (
        <PatientForm
          onSubmit={onSubmitPatient}
          onClose={onClosePatientForm}
          isEditing={isEditingPatient}
          initialData={selectedPatient}
        />
      )}

      {showTransferModal && (
        <TransferModal
          onSubmit={onSubmitTransfer}
          onClose={onCloseTransferModal}
          availableBeds={availableBedsForTransfer}
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
