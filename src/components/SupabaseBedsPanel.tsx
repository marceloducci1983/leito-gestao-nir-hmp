import React, { useState } from 'react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import { useCreateBed, useUpdateBed, useDeleteBed } from '@/hooks/mutations/useBedMutations';
import NewBedCard from '@/components/NewBedCard';
import NewPatientForm from '@/components/forms/NewPatientForm';
import NewReservationForm from '@/components/forms/NewReservationForm';
import DischargeModal from '@/components/forms/DischargeModal';
import TransferModal from '@/components/forms/TransferModal';
import SectorManagementModal from '@/components/forms/SectorManagementModal';
import BedManagementModal from '@/components/forms/BedManagementModal';
import { useDeleteReservation } from '@/hooks/mutations/useReservationMutations';
import { useUpdatePatient } from '@/hooks/mutations/usePatientMutations';
import { Department, Patient } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sortBedsByCustomOrder } from '@/utils/BedOrderUtils';
import { Button } from '@/components/ui/button';
import { Settings, Plus } from 'lucide-react';

interface SupabaseBedsPanelProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
  const { centralData, isLoading, error, addPatient, transferPatient, addReservation, requestDischarge } = useSupabaseBeds();
  const deleteReservationMutation = useDeleteReservation();
  const updatePatientMutation = useUpdatePatient();
  const deleteBedMutation = useDeleteBed();
  const { toast } = useToast();

  // Estados para controlar os modais
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CLINICA MEDICA');
  
  // Estados dos modais
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  const [selectedBedForEdit, setSelectedBedForEdit] = useState<any>(null);

  // Update parent component with data
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(centralData);
    }
  }, [centralData, onDataChange]);

  const departments: Department[] = [
    'CLINICA MEDICA',
    'PRONTO SOCORRO', 
    'CLINICA CIRURGICA',
    'UTI ADULTO',
    'UTI NEONATAL',
    'PEDIATRIA',
    'MATERNIDADE'
  ];

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

  // Handlers para os botões dos leitos
  const handleReserveBed = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department as Department);
      setShowReservationForm(true);
    }
  };

  const handleAdmitPatient = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department as Department);
      setSelectedPatient(null);
      setIsEditingPatient(false);
      setShowPatientForm(true);
    }
  };

  const handleEditPatient = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department as Department);
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
      // Nova funcionalidade: Solicitar alta em vez de dar alta diretamente
      requestDischarge({
        patientId: bed.patient.id,
        patientName: bed.patient.name,
        bedId: bedId,
        department: bed.department
      });
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

  // Handlers para submissão dos formulários
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
        // Editar paciente existente
        await updatePatientMutation.mutateAsync({
          patientId: selectedPatient.id,
          patientData: patientData
        });
      } else {
        // Adicionar novo paciente
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel de Leitos</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {centralData.beds.filter(bed => bed.isOccupied).length} / {centralData.beds.length} leitos ocupados
          </div>
          <Button onClick={handleManageSectors} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            GERENCIAR SETORES
          </Button>
          <Button onClick={handleCreateNewBed} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            CRIAR LEITO
          </Button>
        </div>
      </div>

      <Tabs value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department)} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {departments.map(department => {
            const departmentBeds = centralData.beds.filter(bed => bed.department === department);
            const occupiedCount = departmentBeds.filter(bed => bed.isOccupied).length;
            const reservedCount = departmentBeds.filter(bed => bed.isReserved).length;
            const availableCount = departmentBeds.length - occupiedCount - reservedCount;
            
            return (
              <TabsTrigger key={department} value={department} className="text-xs">
                <div className="flex flex-col items-center">
                  <span className="font-medium">{department}</span>
                  <div className="text-xs text-gray-500">
                    <span className="text-green-600">{availableCount}</span>/
                    <span className="text-red-600">{occupiedCount}</span>/
                    <span className="text-yellow-600">{reservedCount}</span>
                  </div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {departments.map(department => {
          const departmentBeds = centralData.beds.filter(bed => bed.department === department);
          const sortedBeds = sortBedsByCustomOrder(departmentBeds, department);

          return (
            <TabsContent key={department} value={department} className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {sortedBeds.map(bed => (
                      <NewBedCard
                        key={bed.id}
                        bed={bed}
                        onReserveBed={handleReserveBed}
                        onAdmitPatient={handleAdmitPatient}
                        onEditPatient={handleEditPatient}
                        onTransferPatient={handleTransferPatient}
                        onDischargePatient={handleDischargePatient}
                        onDeleteReservation={handleDeleteReservation}
                        onDeleteBed={bed.isCustom ? handleDeleteBed : undefined}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Modais */}
      <NewReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        onSubmit={submitReservation}
        bedId={selectedBedId}
        department={selectedDepartment}
      />

      <NewPatientForm
        isOpen={showPatientForm}
        onClose={() => {
          setShowPatientForm(false);
          setSelectedPatient(null);
          setIsEditingPatient(false);
        }}
        onSubmit={submitPatient}
        bedId={selectedBedId}
        department={selectedDepartment}
        isEditing={isEditingPatient}
        patientData={selectedPatient}
      />

      {selectedPatient && (
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
            setSelectedPatient(null);
          }}
          onSubmit={submitTransfer}
          patientName={selectedPatient.name}
          availableBeds={availableBedsForTransfer}
          currentDepartment={selectedPatient.department}
        />
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
          setShowBedModal(false);
          setSelectedBedForEdit(null);
        }}
        departments={departments}
        bedData={selectedBedForEdit}
        isEditing={!!selectedBedForEdit}
      />
    </div>
  );
};

export default SupabaseBedsPanel;

}
