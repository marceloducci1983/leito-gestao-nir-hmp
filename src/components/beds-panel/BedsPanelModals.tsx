
import React from 'react';
import { Patient, Department } from '@/types';
import NewReservationForm from '@/components/forms/NewReservationForm';
import NewPatientForm from '@/components/forms/NewPatientForm';
import TransferModal from '@/components/forms/TransferModal';
import SectorManagementModal from '@/components/forms/SectorManagementModal';
import BedManagementModal from '@/components/forms/BedManagementModal';
import TestingPanel from '@/components/test/TestingPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BedsPanelModalsProps {
  // Reservation modal
  showReservationForm: boolean;
  onCloseReservationForm: () => void;
  onSubmitReservation: (reservationData: any) => void;
  selectedBedId: string;
  selectedDepartment: Department;

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
  departments: Department[];

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

      <BedManagementModal
        isOpen={showBedModal}
        onClose={onCloseBedModal}
        departments={departments}
        bedData={selectedBedForEdit}
        isEditing={!!selectedBedForEdit}
      />

      {/* Testing Modal */}
      {showTestingModal && onCloseTestingModal && (
        <Dialog open={showTestingModal} onOpenChange={onCloseTestingModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>🧪 Painel de Testes do Sistema de Leitos</DialogTitle>
            </DialogHeader>
            <TestingPanel />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BedsPanelModals;
