
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRequestDischarge } from '@/hooks/mutations/useDischargeMutations';
import { useDeleteBed } from '@/hooks/mutations/useBedMutations';
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
  addPatient: (data: any) => Promise<any>;
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
  const requestDischargeMutation = useRequestDischarge();
  const deleteBedMutation = useDeleteBed();

  const handleReserveBed = (bedId: string) => {
    setSelectedBedId(bedId);
    setShowReservationForm(true);
  };

  const handleAdmitPatient = (bedId: string) => {
    console.log('🏥 handleAdmitPatient chamado para leito:', bedId);
    setSelectedBedId(bedId);
    setSelectedPatient(null);
    setIsEditingPatient(false);
    setShowPatientForm(true);
    console.log('✅ handleAdmitPatient executado - modal deve abrir');
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

  const handleDischargePatient = async (bedId: string) => {
    console.log('🏥 handleDischargePatient iniciado para leito:', bedId);
    
    const bed = centralData.beds.find((b: Bed) => b.id === bedId);
    if (!bed || !bed.patient) {
      console.log('❌ Leito ou paciente não encontrado');
      return;
    }

    console.log('👤 Paciente encontrado:', bed.patient);
    
    try {
      await requestDischargeMutation.mutateAsync({
        patientId: bed.patient.id,
        patientName: bed.patient.name,
        bedId: bed.name,
        department: bed.patient.department,
        bedName: bed.name
      });

      console.log('✅ Solicitação de alta enviada para MONITORAMENTO DE ALTAS');
      
      toast({
        title: "Alta solicitada com sucesso",
        description: `${bed.patient.name} - Solicitação enviada para monitoramento`,
      });

    } catch (error: any) {
      console.error('❌ Erro ao solicitar alta:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao solicitar alta",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReservation = async (bedId: string) => {
    try {
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
    console.log('🔵 [HANDLER] Botão "Criar Novo Leito" clicado - INÍCIO');
    console.log('🔍 [HANDLER] Estado atual setShowBedModal function:', typeof setShowBedModal);
    console.log('🔍 [HANDLER] Departamentos disponíveis:', centralData?.departmentNames?.length || 0);
    console.log('🔍 [HANDLER] CentralData disponível:', !!centralData);
    console.log('🔍 [HANDLER] Departamento selecionado:', selectedDepartment);
    
    try {
      console.log('⚙️ [HANDLER] Resetando selectedBedForEdit para null...');
      setSelectedBedForEdit(null);
      
      console.log('⚙️ [HANDLER] Chamando setShowBedModal(true)...');
      setShowBedModal(true);
      
      console.log('✅ [HANDLER] setShowBedModal(true) executado com sucesso');
      console.log('✅ [HANDLER] Modal deve estar aberto agora');
      
    } catch (error) {
      console.error('❌ [HANDLER] Erro ao executar handleCreateNewBed:', error);
      toast({
        title: "Erro",
        description: "Erro ao abrir formulário de criação de leito",
        variant: "destructive",
      });
    }
    
    console.log('🔵 [HANDLER] Botão "Criar Novo Leito" clicado - FIM');
  };

  const handleDeleteBed = async (bedId: string) => {
    console.log('🗑️ [HANDLER] Excluindo leito customizado:', bedId);
    
    if (!bedId) {
      console.error('❌ [HANDLER] ID do leito não fornecido');
      toast({
        title: "Erro",
        description: "ID do leito não identificado",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('⚡ [HANDLER] Chamando mutation para excluir leito...');
      await deleteBedMutation.mutateAsync(bedId);
      console.log('✅ [HANDLER] Leito excluído com sucesso');
      
    } catch (error: any) {
      console.error('❌ [HANDLER] Erro ao excluir leito:', error);
      // O toast de erro já é exibido pela mutation
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

  const submitPatient = async (patientData: any) => {
    console.log('📝 submitPatient iniciado com dados:', patientData);
    console.log('🏥 Leito selecionado:', selectedBedId);
    console.log('🏭 Departamento selecionado:', selectedDepartment);
    console.log('✏️ Está editando?', isEditingPatient);
    
    if (!selectedBedId) {
      console.error('❌ selectedBedId não encontrado');
      toast({
        title: "Erro",
        description: "Leito não selecionado",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('⚡ Chamando addPatient com bedId e patientData...');
      
      // Garantir que o departamento seja passado corretamente
      const patientDataWithDepartment = {
        ...patientData,
        department: patientData.department || selectedDepartment
      };
      
      console.log('🔄 Dados finais do paciente a serem enviados:', patientDataWithDepartment);
      
      const result = await addPatient({
        bedId: selectedBedId,
        patientData: patientDataWithDepartment
      });
      
      console.log('✅ Resposta do addPatient:', result);
      console.log('✅ Paciente admitido com sucesso');
      
      // Fechar modal apenas após sucesso
      setShowPatientForm(false);
      setSelectedPatient(null);
      setIsEditingPatient(false);
      setSelectedBedId('');
      
      toast({
        title: isEditingPatient ? "Paciente editado com sucesso" : "Paciente admitido com sucesso",
        description: `${patientData.name} - ${patientData.diagnosis}`,
      });
    } catch (error: any) {
      console.error('❌ Erro ao processar paciente:', error);
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
    return requestDischargeMutation.isPending;
  }, [requestDischargeMutation.isPending]);

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
