import React from 'react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import { useDeleteReservation } from '@/hooks/mutations/useReservationMutations';
import { useUpdatePatient } from '@/hooks/mutations/usePatientMutations';
import { useDeleteBed } from '@/hooks/mutations/useBedMutations';
import { useDischargeFlow } from '@/hooks/useDischargeFlow';
import { useDepartmentNames } from '@/hooks/queries/useDepartmentQueries';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useResponsive } from '@/hooks/useResponsive';

// Importações dos novos componentes
import BedsPanelHeader from '@/components/beds-panel/BedsPanelHeader';
import BedSearchBar from '@/components/beds-panel/BedSearchBar';
import BedsPanelContent from '@/components/beds-panel/BedsPanelContent';
import BedsPanelModals from '@/components/beds-panel/BedsPanelModals';
import { useBedsPanelLogic } from '@/components/beds-panel/useBedsPanelLogic';

interface SupabaseBedsPanelProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
  const { centralData, isLoading, error, addPatient, transferPatient, addReservation } = useSupabaseBeds();
  const { departmentNames, isLoading: loadingDepartments } = useDepartmentNames();
  const deleteReservationMutation = useDeleteReservation();
  const updatePatientMutation = useUpdatePatient();
  const deleteBedMutation = useDeleteBed();
  const { toast } = useToast();

  // Hook para gerenciar o fluxo de altas
  const { 
    handleDischargeRequest, 
    isDischarging,
    isRequestingDischarge 
  } = useDischargeFlow();

  // Estados e lógica do painel
  const {
    selectedBedId,
    setSelectedBedId,
    selectedPatient,
    setSelectedPatient,
    selectedDepartment,
    setSelectedDepartment,
    searchTerm,
    setSearchTerm,
    showPatientForm,
    setShowPatientForm,
    showReservationForm,
    setShowReservationForm,
    showTransferModal,
    setShowTransferModal,
    isEditingPatient,
    setIsEditingPatient,
    showSectorModal,
    setShowSectorModal,
    showBedModal,
    setShowBedModal,
    selectedBedForEdit,
    setSelectedBedForEdit,
    sortedBeds,
    availableBedsForTransfer
  } = useBedsPanelLogic(centralData);
  
  // Estados para responsividade
  const { isMobile } = useResponsive();

  // Estado para modal de testes
  const [showTestingModal, setShowTestingModal] = React.useState(false);

  // Update parent component with data
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(centralData);
    }
  }, [centralData, onDataChange]);

  if (isLoading || loadingDepartments) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando leitos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erro ao carregar dados dos leitos.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // Usar departamentos dinâmicos do banco de dados
  const departments = departmentNames.length > 0 ? departmentNames : [
    'CLINICA MEDICA',
    'PRONTO SOCORRO', 
    'CLINICA CIRURGICA',
    'UTI ADULTO',
    'UTI NEONATAL',
    'PEDIATRIA',
    'MATERNIDADE'
  ];

  // Handlers para os botões dos leitos
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
      if (isEditingPatient && selectedPatient) {
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

  const handleOpenTesting = () => {
    setShowTestingModal(true);
  };

  // Para cada leito, determine se está em processo de alta
  const bedsWithDischargeState = sortedBeds.map((bed: any) => ({
    ...bed,
    isDischarging: isDischarging(bed.id)
  }));

  return (
    <div className={`space-y-4 ${isMobile ? 'pb-16' : ''}`}>
      <BedsPanelHeader
        totalBeds={centralData.beds.length}
        occupiedBeds={centralData.beds.filter((bed: any) => bed.isOccupied).length}
        onManageSectors={handleManageSectors}
        onCreateNewBed={handleCreateNewBed}
        onOpenTesting={handleOpenTesting}
      />

      <BedSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultsCount={sortedBeds.length}
        selectedDepartment={selectedDepartment}
      />

      <BedsPanelContent
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentSelect={setSelectedDepartment}
        departmentBeds={centralData.beds}
        sortedBeds={bedsWithDischargeState}
        searchTerm={searchTerm}
        onReserveBed={handleReserveBed}
        onAdmitPatient={handleAdmitPatient}
        onEditPatient={handleEditPatient}
        onTransferPatient={handleTransferPatient}
        onDischargePatient={handleDischargePatient}
        onDeleteReservation={handleDeleteReservation}
        onDeleteBed={handleDeleteBed}
      />

      <BedsPanelModals
        showReservationForm={showReservationForm}
        onCloseReservationForm={() => setShowReservationForm(false)}
        onSubmitReservation={submitReservation}
        selectedBedId={selectedBedId}
        selectedDepartment={selectedDepartment}
        showPatientForm={showPatientForm}
        onClosePatientForm={() => {
          setShowPatientForm(false);
          setSelectedPatient(null);
          setIsEditingPatient(false);
        }}
        onSubmitPatient={submitPatient}
        isEditingPatient={isEditingPatient}
        selectedPatient={selectedPatient}
        showTransferModal={showTransferModal}
        onCloseTransferModal={() => {
          setShowTransferModal(false);
          setSelectedPatient(null);
        }}
        onSubmitTransfer={submitTransfer}
        availableBedsForTransfer={availableBedsForTransfer}
        showSectorModal={showSectorModal}
        onCloseSectorModal={() => setShowSectorModal(false)}
        departments={departments}
        showBedModal={showBedModal}
        onCloseBedModal={() => {
          setShowBedModal(false);
          setSelectedBedForEdit(null);
        }}
        selectedBedForEdit={selectedBedForEdit}
        showTestingModal={showTestingModal}
        onCloseTestingModal={() => setShowTestingModal(false)}
      />
    </div>
  );
};

export default SupabaseBedsPanel;
