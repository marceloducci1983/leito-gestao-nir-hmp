
import { useToast } from '@/hooks/use-toast';
import { Patient, Department } from '@/types';

interface UseFormSubmitHandlersProps {
  selectedBedId: string;
  selectedPatient: Patient | null;
  selectedDepartment: Department;
  setShowReservationForm: (show: boolean) => void;
  setShowPatientForm: (show: boolean) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setIsEditingPatient: (isEditing: boolean) => void;
  setSelectedBedId: (bedId: string) => void;
  addPatient: (data: any) => Promise<any>;
  transferPatient: (data: any) => void;
  addReservation: (data: any) => void;
  isEditingPatient: boolean;
}

export const useFormSubmitHandlers = ({
  selectedBedId,
  selectedPatient,
  selectedDepartment,
  setShowReservationForm,
  setShowPatientForm,
  setSelectedPatient,
  setIsEditingPatient,
  setSelectedBedId,
  addPatient,
  transferPatient,
  addReservation,
  isEditingPatient
}: UseFormSubmitHandlersProps) => {
  const { toast } = useToast();

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

  return {
    submitReservation,
    submitPatient,
    submitTransfer
  };
};
