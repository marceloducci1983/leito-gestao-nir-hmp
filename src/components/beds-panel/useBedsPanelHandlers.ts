
import { useDeleteReservation } from '@/hooks/mutations/useReservationMutations';
import { useUpdatePatient } from '@/hooks/mutations/usePatientMutations';
import { useDeleteBed } from '@/hooks/mutations/useBedMutations';
import { useDischargeFlow } from '@/hooks/useDischargeFlow';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '@/types';

export const useBedsPanelHandlers = (
  centralData: any,
  selectedBedId: string,
  setSelectedBedId: (id: string) => void,
  selectedPatient: Patient | null,
  setSelectedPatient: (patient: Patient | null) => void,
  selectedDepartment: string,
  setSelectedDepartment: (department: string) => void,
  setShowReservationForm: (show: boolean) => void,
  setShowPatientForm: (show: boolean) => void,
  setShowTransferModal: (show: boolean) => void,
  setIsEditingPatient: (editing: boolean) => void,
  setShowSectorModal: (show: boolean) => void,
  setShowBedModal: (show: boolean) => void,
  setSelectedBedForEdit: (bed: any) => void,
  addPatient: any,
  transferPatient: any,
  addReservation: any
) => {
  const deleteReservationMutation = useDeleteReservation();
  const updatePatientMutation = useUpdatePatient();
  const deleteBedMutation = useDeleteBed();
  const { toast } = useToast();
  const { handleDischargeRequest, isDischarging } = useDischargeFlow();

  const handleReserveBed = (bedId: string) => {
    const bed = centralData.beds.find((b: any) => b.id === bedId);
    if (bed) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department);
      setShowReservationForm(true);
    }
  };

  const handleAdmitPatient = (bedId: string) => {
    const bed = centralData.beds.find((b: any) => b.id === bedId);
    if (bed) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department);
      setSelectedPatient(null);
      setIsEditingPatient(false);
      setShowPatientForm(true);
    }
  };

  const handleEditPatient = (bedId: string) => {
    const bed = centralData.beds.find((b: any) => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department);
      setSelectedPatient(bed.patient);
      setIsEditingPatient(true);
      setShowPatientForm(true);
    }
  };

  const handleTransferPatient = (bedId: string) => {
    const bed = centralData.beds.find((b: any) => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setShowTransferModal(true);
    }
  };

  const handleDischargePatient = async (bedId: string) => {
    const bed = centralData.beds.find((b: any) => b.id === bedId);
    if (bed && bed.patient) {
      console.log('🏥 Preparando solicitação de alta para:', {
        patientId: bed.patient.id,
        patientName: bed.patient.name,
        bedId: bedId,
        bedName: bed.name,
        department: bed.department
      });
      
      const result = await handleDischargeRequest({
        patientId: bed.patient.id,
        patientName: bed.patient.name,
        bedId: bedId,
        department: bed.department,
        bedName: bed.name
      });

      if (result.success) {
        console.log('✅ Alta solicitada com sucesso no painel');
        toast({
          title: "Alta solicitada",
          description: `Alta de ${bed.patient.name} enviada para o monitoramento`,
        });
      } else {
        console.error('❌ Erro na solicitação de alta no painel:', result.error);
        toast({
          title: "Erro",
          description: "Erro ao solicitar alta. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteReservation = async (bedId: string) => {
    try {
      await deleteReservationMutation.mutateAsync(bedId);
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir reserva",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBed = async (bedId: string) => {
    try {
      await deleteBedMutation.mutateAsync(bedId);
    } catch (error) {
      console.error('Erro ao excluir leito:', error);
    }
  };

  const submitReservation = async (reservationData: any) => {
    try {
      await addReservation({ 
        bedId: selectedBedId, 
        reservation: {
          patient_name: reservationData.patient_name,
          origin_clinic: reservationData.origin_clinic,
          diagnosis: reservationData.diagnosis
        }
      });
      setShowReservationForm(false);
    } catch (error) {
      console.error('Erro ao reservar leito:', error);
    }
  };

  const submitPatient = async (patientData: any) => {
    try {
      if (selectedPatient) {
        await updatePatientMutation.mutateAsync({
          patientId: selectedPatient.id,
          patientData: patientData
        });
      } else {
        await addPatient({ bedId: selectedBedId, patientData });
      }
      setShowPatientForm(false);
      setSelectedPatient(null);
      setIsEditingPatient(false);
    } catch (error) {
      console.error('Erro ao processar paciente:', error);
    }
  };

  const submitTransfer = async (targetDepartment: string, targetBedId: string) => {
    if (!selectedPatient) return;

    try {
      await transferPatient({
        patientId: selectedPatient.id,
        fromBedId: selectedBedId,
        toBedId: targetBedId
      });
      setShowTransferModal(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Erro ao transferir paciente:', error);
    }
  };

  const handleManageSectors = () => {
    setShowSectorModal(true);
  };

  const handleCreateNewBed = () => {
    setSelectedBedForEdit(null);
    setShowBedModal(true);
  };

  const handleEditBed = (bed: any) => {
    setSelectedBedForEdit({
      id: bed.id,
      name: bed.name,
      department: bed.department
    });
    setShowBedModal(true);
  };

  return {
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
  };
};
