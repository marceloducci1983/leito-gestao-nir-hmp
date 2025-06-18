
import { useBedActionHandlers } from './handlers/useBedActionHandlers';
import { useModalHandlers } from './handlers/useModalHandlers';
import { useFormSubmitHandlers } from './handlers/useFormSubmitHandlers';
import { Department, Patient } from '@/types';

interface UseBedsPanelHandlersProps {
  centralData: any;
  selectedBedId: string;
  setSelectedBedId: (bedId: string) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  selectedDepartment: Department;
  setSelectedDepartment: (department: Department) => void;
  setShowReservationForm: (show: boolean) => void;
  setShowPatientForm: (show: boolean) => void;
  setShowTransferModal: (show: boolean) => void;
  setIsEditingPatient: (isEditing: boolean) => void;
  setShowSectorModal: (show: boolean) => void;
  setShowBedModal: (show: boolean) => void;
  setSelectedBedForEdit: (bed: any) => void;
  addPatient: (data: any) => Promise<any>;
  transferPatient: (data: any) => void;
  addReservation: (data: any) => void;
  isEditingPatient: boolean;
}

export const useBedsPanelHandlers = (props: UseBedsPanelHandlersProps) => {
  const bedActionHandlers = useBedActionHandlers({
    centralData: props.centralData,
    selectedBedId: props.selectedBedId,
    setSelectedBedId: props.setSelectedBedId,
    selectedPatient: props.selectedPatient,
    setSelectedPatient: props.setSelectedPatient,
    setShowReservationForm: props.setShowReservationForm,
    setShowPatientForm: props.setShowPatientForm,
    setShowTransferModal: props.setShowTransferModal,
    setIsEditingPatient: props.setIsEditingPatient
  });

  const modalHandlers = useModalHandlers({
    setShowSectorModal: props.setShowSectorModal,
    setShowBedModal: props.setShowBedModal,
    setSelectedBedForEdit: props.setSelectedBedForEdit
  });

  const formSubmitHandlers = useFormSubmitHandlers({
    selectedBedId: props.selectedBedId,
    selectedPatient: props.selectedPatient,
    selectedDepartment: props.selectedDepartment,
    setShowReservationForm: props.setShowReservationForm,
    setShowPatientForm: props.setShowPatientForm,
    setSelectedPatient: props.setSelectedPatient,
    setIsEditingPatient: props.setIsEditingPatient,
    setSelectedBedId: props.setSelectedBedId,
    addPatient: props.addPatient,
    transferPatient: props.transferPatient,
    addReservation: props.addReservation,
    isEditingPatient: props.isEditingPatient
  });

  return {
    ...bedActionHandlers,
    ...modalHandlers,
    ...formSubmitHandlers
  };
};
