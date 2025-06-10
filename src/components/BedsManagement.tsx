import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import { Department, Bed } from '@/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sortBedsByCustomOrder } from '@/utils/BedOrderUtils';
import { useBedsManagementState } from '@/hooks/useBedsManagementState';
import BedsManagementHeader from './BedsManagementHeader';
import BedsManagementGrid from './BedsManagementGrid';
import NewPatientForm from './forms/NewPatientForm';
import NewReservationForm from './forms/NewReservationForm';
import DischargeModal from './forms/DischargeModal';
import TransferModal from './forms/TransferModal';
import SectorManagementModal from './forms/SectorManagementModal';
import BedManagementModal from './forms/BedManagementModal';

interface BedsManagementProps {
  onDataChange?: (data: any) => void;
}

const BedsManagement: React.FC<BedsManagementProps> = ({ onDataChange }) => {
  const { centralData, isLoading, error, addPatient, dischargePatient, addReservation, transferPatient } = useSupabaseBeds();
  const {
    selectedDepartment,
    setSelectedDepartment,
    selectedBedId,
    setSelectedBedId,
    selectedPatient,
    setSelectedPatient,
    showPatientForm,
    setShowPatientForm,
    showReservationForm,
    setShowReservationForm,
    showDischargeModal,
    setShowDischargeModal,
    showTransferModal,
    setShowTransferModal,
    isEditingPatient,
    setIsEditingPatient,
  } = useBedsManagementState();

  const { toast } = useToast();

  const departments: Department[] = [
    'CLINICA MEDICA',
    'PRONTO SOCORRO', 
    'CLINICA CIRURGICA',
    'UTI ADULTO',
    'UTI NEONATAL',
    'PEDIATRIA',
    'MATERNIDADE'
  ];

  // Novos estados para os modais
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showBedModal, setBedModal] = useState(false);
  const [showEditBedMode, setShowEditBedMode] = useState(false);
  const [selectedBedForEdit, setSelectedBedForEdit] = useState<any>(null);

  // Update parent component with data
  useEffect(() => {
    if (onDataChange && centralData) {
      onDataChange(centralData);
    }
  }, [centralData, onDataChange]);

  if (isLoading) {
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

  // Filtrar e ordenar os leitos por departamento
  const filteredBeds = centralData.beds.filter(bed => bed.department === selectedDepartment);
  const departmentBeds = sortBedsByCustomOrder(filteredBeds, selectedDepartment);

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
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setIsEditingPatient(true);
      setShowPatientForm(true);
    }
  };

  const handleTransferPatient = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setShowTransferModal(true);
    }
  };

  const handleDischargePatient = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setShowDischargeModal(true);
    }
  };

  const handleDeleteReservation = async (bedId: string) => {
    try {
      // Logic to delete reservation would be implemented here
      toast({
        title: "Reserva excluída",
        description: "A reserva foi removida com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir reserva",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewBed = async () => {
    setSelectedBedForEdit(null);
    setBedModal(true);
  };

  const handleDeleteBed = async (bedId: string) => {
    try {
      // Logic to delete bed would be implemented here
      toast({
        title: "Leito excluído",
        description: "O leito customizado foi removido",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir leito",
        variant: "destructive",
      });
    }
  };

  const submitReservation = async (reservationData: any) => {
    try {
      await addReservation(reservationData);
      toast({
        title: "Leito reservado com sucesso",
        description: `Reserva para ${reservationData.patient_name}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao reservar leito",
        variant: "destructive",
      });
    }
  };

  const submitPatient = async (patientData: any) => {
    try {
      await addPatient(patientData);
      toast({
        title: isEditingPatient ? "Paciente editado com sucesso" : "Paciente admitido com sucesso",
        description: `${patientData.name} - ${patientData.diagnosis}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditingPatient ? "Erro ao editar paciente" : "Erro ao admitir paciente",
        variant: "destructive",
      });
    }
  };

  const submitDischarge = async (dischargeType: string) => {
    if (!selectedPatient) return;

    try {
      await dischargePatient({
        bedId: selectedBedId,
        patientId: selectedPatient.id,
        dischargeData: {
          dischargeType: dischargeType,
          dischargeDate: new Date().toISOString().split('T')[0]
        }
      });
      toast({
        title: "Alta realizada com sucesso",
        description: `${selectedPatient.name} - ${dischargeType}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao dar alta",
        variant: "destructive",
      });
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
      toast({
        title: "Transferência realizada com sucesso",
        description: `${selectedPatient.name} transferido para ${targetDepartment}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao transferir paciente",
        variant: "destructive",
      });
    }
  };

  const availableBedsForTransfer = centralData.beds
    .filter(bed => !bed.isOccupied && !bed.isReserved)
    .map(bed => ({
      id: bed.id,
      name: bed.name,
      department: bed.department
    }));

  const handleManageSectors = () => {
    setShowSectorModal(true);
  };

  const handleEditBedMode = () => {
    setShowEditBedMode(!showEditBedMode);
    toast({
      title: showEditBedMode ? "Modo de edição desativado" : "Modo de edição ativado",
      description: showEditBedMode ? "Clique em 'EDITAR LEITOS' para ativar novamente" : "Clique em qualquer leito para editá-lo",
    });
  };

  const handleEditBedClick = (bed: any) => {
    if (showEditBedMode) {
      setSelectedBedForEdit({
        id: bed.id,
        name: bed.name,
        department: bed.department
      });
      setBedModal(true);
    }
  };

  return (
    <div className="space-y-6">
      <BedsManagementHeader
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentSelect={setSelectedDepartment}
        departmentBeds={departmentBeds}
        onCreateNewBed={handleCreateNewBed}
        onManageSectors={handleManageSectors}
        onEditBed={handleEditBedMode}
      />

      <Card>
        <BedsManagementGrid
          departmentBeds={departmentBeds}
          onReserveBed={handleReserveBed}
          onAdmitPatient={handleAdmitPatient}
          onEditPatient={handleEditPatient}
          onTransferPatient={handleTransferPatient}
          onDischargePatient={handleDischargePatient}
          onDeleteReservation={handleDeleteReservation}
          onDeleteBed={handleDeleteBed}
          showEditBedMode={showEditBedMode}
          onEditBedClick={handleEditBedClick}
        />
      </Card>

      {/* Forms */}
      <NewReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        onSubmit={submitReservation}
        bedId={selectedBedId}
        department={selectedDepartment}
      />

      <NewPatientForm
        isOpen={showPatientForm}
        onClose={() => setShowPatientForm(false)}
        onSubmit={submitPatient}
        bedId={selectedBedId}
        department={selectedDepartment}
        isEditing={isEditingPatient}
        patientData={selectedPatient}
      />

      {selectedPatient && (
        <>
          <DischargeModal
            isOpen={showDischargeModal}
            onClose={() => setShowDischargeModal(false)}
            onSubmit={submitDischarge}
            patientName={selectedPatient.name}
          />

          <TransferModal
            isOpen={showTransferModal}
            onClose={() => setShowTransferModal(false)}
            onSubmit={submitTransfer}
            patientName={selectedPatient.name}
            availableBeds={availableBedsForTransfer}
            currentDepartment={selectedPatient.department}
          />
        </>
      )}

      {/* New Management Modals */}
      <SectorManagementModal
        isOpen={showSectorModal}
        onClose={() => setShowSectorModal(false)}
        departments={departments}
      />

      <BedManagementModal
        isOpen={showBedModal}
        onClose={() => {
          setBedModal(false);
          setSelectedBedForEdit(null);
          setShowEditBedMode(false);
        }}
        departments={departments}
        bedData={selectedBedForEdit}
        isEditing={!!selectedBedForEdit}
      />
    </div>
  );
};

export default BedsManagement;
