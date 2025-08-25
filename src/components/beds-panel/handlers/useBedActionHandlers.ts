
import { useToast } from '@/hooks/use-toast';
import { useRequestDischarge } from '@/hooks/mutations/useDischargeMutations';
import { useDeleteBed } from '@/hooks/mutations/useBedMutations';
import { useDeleteReservation } from '@/hooks/mutations/useReservationMutations';
import { Bed, Patient } from '@/types';

interface UseBedActionHandlersProps {
  centralData: any;
  selectedBedId: string;
  setSelectedBedId: (bedId: string) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  setShowReservationForm: (show: boolean) => void;
  setShowPatientForm: (show: boolean) => void;
  setShowTransferModal: (show: boolean) => void;
  setIsEditingPatient: (isEditing: boolean) => void;
}

export const useBedActionHandlers = ({
  centralData,
  selectedBedId,
  setSelectedBedId,
  selectedPatient,
  setSelectedPatient,
  setShowReservationForm,
  setShowPatientForm,
  setShowTransferModal,
  setIsEditingPatient
}: UseBedActionHandlersProps) => {
  const { toast } = useToast();
  const requestDischargeMutation = useRequestDischarge();
  const deleteBedMutation = useDeleteBed();
  const deleteReservationMutation = useDeleteReservation();

  const handleReserveBed = (bedId: string) => {
    setSelectedBedId(bedId);
    setShowReservationForm(true);
  };

  const handleAdmitPatient = (bedId: string) => {
    console.log('🏥 handleAdmitPatient chamado para leito:', bedId);
    
    // FASE 3: VALIDAÇÃO FRONTEND - Verificar se leito está realmente livre
    const bed = centralData.beds.find((b: Bed) => b.id === bedId);
    if (!bed) {
      console.error('❌ Leito não encontrado:', bedId);
      toast({
        title: "Erro",
        description: "Leito não encontrado",
        variant: "destructive",
      });
      return;
    }
    
    if (bed.isOccupied || bed.patient) {
      console.error('❌ Tentativa de admitir em leito ocupado:', {
        bedId,
        bedName: bed.name,
        isOccupied: bed.isOccupied,
        patient: bed.patient?.name
      });
      toast({
        title: "Erro",
        description: `Leito ${bed.name} já está ocupado por ${bed.patient?.name || 'outro paciente'}`,
        variant: "destructive",
      });
      return;
    }
    
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
    console.log('🗑️ Excluindo reserva do leito:', bedId);
    try {
      await deleteReservationMutation.mutateAsync(bedId);
    } catch (error: any) {
      console.error('❌ Erro ao excluir reserva:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir reserva",
        variant: "destructive",
      });
    }
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

  const isDischarging = (bedId: string) => {
    return requestDischargeMutation.isPending;
  };

  return {
    handleReserveBed,
    handleAdmitPatient,
    handleEditPatient,
    handleTransferPatient,
    handleDischargePatient,
    handleDeleteReservation,
    handleDeleteBed,
    isDischarging
  };
};
