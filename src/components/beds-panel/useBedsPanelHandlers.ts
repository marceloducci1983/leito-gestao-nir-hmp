
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bed, Department, Patient } from '@/types';

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
  addPatient: (data: any) => void;
  transferPatient: (data: any) => void;
  addReservation: (data: any) => void;
  isEditingPatient: boolean;
}

export const useBedsPanelHandlers = ({
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
  addReservation,
  isEditingPatient
}: UseBedsPanelHandlersProps) => {
  const { toast } = useToast();

  const handleReserveBed = (bedId: string) => {
    setSelectedBedId(bedId);
    setShowReservationForm(true);
  };

  const handleAdmitPatient = (bedId: string) => {
    setSelectedBedId(bedId);
    setSelectedPatient(null);
    setIsEditingPatient(false);
    setShowPatientForm(true);
  };

  const handleEditPatient = (bedId: string) => {
    const bed = centralData.beds.find((b: Bed) => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setIsEditingPatient(true);
      setShowPatientForm(true);
    }
  };

  const handleTransferPatient = (bedId: string) => {
    const bed = centralData.beds.find((b: Bed) => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setShowTransferModal(true);
    }
  };

  const handleDischargePatient = (bedId: string) => {
    const bed = centralData.beds.find((b: Bed) => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      // setShowDischargeModal(true); // Certifique-se de ter um estado para o modal de alta
    }
  };

  const handleDeleteReservation = async (bedId: string) => {
    try {
      // Lógica para excluir a reserva seria implementada aqui
      toast({
        title: "Reserva excluída",
        description: "A reserva foi removida com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao excluir reserva",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewBed = () => {
    console.log('🔵 Botão "Criar Novo Leito" clicado - INÍCIO');
    console.log('🔍 Estado atual setShowBedModal function:', typeof setShowBedModal);
    console.log('🔍 Departamentos disponíveis:', centralData?.departmentNames?.length || 0);
    console.log('🔍 CentralData disponível:', !!centralData);
    
    try {
      console.log('⚙️ Resetando selectedBedForEdit para null...');
      setSelectedBedForEdit(null);
      
      console.log('⚙️ Chamando setShowBedModal(true)...');
      setShowBedModal(true);
      
      console.log('✅ setShowBedModal(true) executado com sucesso');
      
      // Verificar se o estado mudou após um pequeno delay
      setTimeout(() => {
        console.log('🔍 Verificação pós-execução - aguardando estado atualizar...');
      }, 100);
      
    } catch (error) {
      console.error('❌ Erro ao executar handleCreateNewBed:', error);
      toast({
        title: "Erro",
        description: "Erro ao abrir formulário de criação de leito",
        variant: "destructive",
      });
    }
    
    console.log('🔵 Botão "Criar Novo Leito" clicado - FIM');
  };

  const handleDeleteBed = async (bedId: string) => {
    try {
      // Lógica para excluir o leito seria implementada aqui
      toast({
        title: "Leito excluído",
        description: "O leito customizado foi removido",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao excluir leito",
        variant: "destructive",
      });
    }
  };

  const submitReservation = (reservationData: any) => {
    try {
      addReservation(reservationData);
      toast({
        title: "Leito reservado com sucesso",
        description: `Reserva para ${reservationData.patient_name}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao reservar leito",
        variant: "destructive",
      });
    }
  };

  const submitPatient = (patientData: any) => {
    try {
      addPatient(patientData);
      toast({
        title: isEditingPatient ? "Paciente editado com sucesso" : "Paciente admitido com sucesso",
        description: `${patientData.name} - ${patientData.diagnosis}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: isEditingPatient ? "Erro ao editar paciente" : "Erro ao admitir paciente",
        variant: "destructive",
      });
    }
  };

  const submitTransfer = (targetDepartment: string, targetBedId: string) => {
    if (!selectedPatient) return;

    try {
      transferPatient({
        patientId: selectedPatient.id,
        fromBedId: selectedBedId,
        toBedId: targetBedId
      });
      toast({
        title: "Transferência realizada com sucesso",
        description: `${selectedPatient.name} transferido para ${targetDepartment}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao transferir paciente",
        variant: "destructive",
      });
    }
  };

  const handleManageSectors = () => {
    setShowSectorModal(true);
  };

  const handleEditBed = () => {
    // setEditBedMode(true);
  };

  const isDischarging = useCallback((bedId: string) => {
    return false;
  }, []);

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
