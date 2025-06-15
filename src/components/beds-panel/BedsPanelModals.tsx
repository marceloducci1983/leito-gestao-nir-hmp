
import React from 'react';
import { Patient } from '@/types';
import NewReservationForm from '@/components/forms/NewReservationForm';
import NewPatientForm from '@/components/forms/NewPatientForm';
import TransferModal from '@/components/forms/TransferModal';
import SectorManagementModal from '@/components/forms/SectorManagementModal';
import BedManagementModal from '@/components/forms/BedManagementModal';
import TestingPanel from '@/components/test/TestingPanel';

interface BedsPanelModalsProps {
  // Reservation modal
  showReservationForm: boolean;
  onCloseReservationForm: () => void;
  onSubmitReservation: (reservationData: any) => void;
  selectedBedId: string;
  selectedDepartment: string;

  // Patient modal
  showPatientForm: boolean;
  onClosePatientForm: () => void;
  onSubmitPatient: (patientData: any) => void;
  isEditingPatient: boolean;
  selectedPatient: Patient | null;

  // Transfer modal
  showTransferModal: boolean;
  onCloseTransferModal: () => void;
  onSubmitTransfer: (targetDepartment: string, targetBedId: string) => void;
  availableBedsForTransfer: Array<{ id: string; name: string; department: string }>;

  // Sector management modal
  showSectorModal: boolean;
  onCloseSectorModal: () => void;
  departments: string[];

  // Bed management modal
  showBedModal: boolean;
  onCloseBedModal: () => void;
  selectedBedForEdit: any;
  
  // Testing modal
  showTestingModal?: boolean;
  onCloseTestingModal?: () => void;
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
  selectedBedForEdit,
  showTestingModal = false,
  onCloseTestingModal
}) => {
  console.log('🔵 BedsPanelModals renderizado - INÍCIO');
  console.log('🔍 showBedModal recebido:', showBedModal);
  console.log('🔍 departments recebidos:', departments?.length || 0);
  console.log('🔍 selectedBedForEdit:', selectedBedForEdit);
  console.log('🔍 onCloseBedModal type:', typeof onCloseBedModal);

  return (
    <>
      <NewReservationForm
        isOpen={showReservationForm}
        onClose={onCloseReservationForm}
        onSubmit={onSubmitReservation}
        bedId={selectedBedId}
        department={selectedDepartment}
      />

      <NewPatientForm
        isOpen={showPatientForm}
        onClose={onClosePatientForm}
        onSubmit={onSubmitPatient}
        bedId={selectedBedId}
        department={selectedDepartment}
        isEditing={isEditingPatient}
        patientData={selectedPatient}
      />

      {selectedPatient && (
        <TransferModal
          isOpen={showTransferModal}
          onClose={onCloseTransferModal}
          onSubmit={onSubmitTransfer}
          patientName={selectedPatient.name}
          availableBeds={availableBedsForTransfer}
          currentDepartment={selectedPatient.department}
        />
      )}

      <SectorManagementModal
        isOpen={showSectorModal}
        onClose={onCloseSectorModal}
        departments={departments}
      />

      {/* Bed Management Modal - com logs de debug detalhados */}
      {console.log('🚀 Tentando renderizar BedManagementModal com showBedModal:', showBedModal)}
      <BedManagementModal
        isOpen={showBedModal}
        onClose={() => {
          console.log('🔴 BedManagementModal - onClose chamado');
          onCloseBedModal();
        }}
        departments={departments}
        bedData={selectedBedForEdit}
        isEditing={!!selectedBedForEdit}
      />

      {/* Testing Modal */}
      {showTestingModal && onCloseTestingModal && (
        <TestingPanel
          isOpen={showTestingModal}
          onClose={onCloseTestingModal}
        />
      )}
    </>
  );
};

export default BedsPanelModals;
