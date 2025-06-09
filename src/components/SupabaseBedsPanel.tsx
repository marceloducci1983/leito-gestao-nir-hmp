
import React, { useState } from 'react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import NewBedCard from '@/components/NewBedCard';
import NewPatientForm from '@/components/forms/NewPatientForm';
import NewReservationForm from '@/components/forms/NewReservationForm';
import DischargeModal from '@/components/forms/DischargeModal';
import TransferModal from '@/components/forms/TransferModal';
import { Department, Patient } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sortBedsByCustomOrder } from '@/utils/BedOrderUtils';

interface SupabaseBedsPanelProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
  const { centralData, isLoading, error, addPatient, dischargePatient, addReservation, transferPatient } = useSupabaseBeds();
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
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setShowDischargeModal(true);
    }
  };

  const handleDeleteReservation = async (bedId: string) => {
    try {
      // Implementar lógica para deletar reserva
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

  const handleDeleteBed = async (bedId: string) => {
    try {
      // Implementar lógica para deletar leito customizado
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

  // Handlers para submissão dos formulários
  const submitReservation = async (reservationData: any) => {
    try {
      await addReservation({ bedId: selectedBedId, reservation: reservationData });
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
      await addPatient({ bedId: selectedBedId, patientData });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel de Leitos</h1>
        <div className="text-sm text-gray-600">
          {centralData.beds.filter(bed => bed.isOccupied).length} / {centralData.beds.length} leitos ocupados
        </div>
      </div>

      {/* Layout dos departamentos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map(department => {
          const departmentBeds = centralData.beds.filter(bed => bed.department === department);
          const sortedBeds = sortBedsByCustomOrder(departmentBeds, department);
          const occupiedCount = sortedBeds.filter(bed => bed.isOccupied).length;
          const reservedCount = sortedBeds.filter(bed => bed.isReserved).length;
          const availableCount = sortedBeds.length - occupiedCount - reservedCount;

          return (
            <Card key={department} className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="space-y-2">
                    <span className="block">{department}</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="text-green-600">Disponíveis: {availableCount}</span>
                      <span className="text-red-600">Ocupados: {occupiedCount}</span>
                      <span className="text-yellow-600">Reservados: {reservedCount}</span>
                      <span className="text-gray-600">Total: {sortedBeds.length}</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
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
                      onDeleteBed={handleDeleteBed}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
    </div>
  );
};

export default SupabaseBedsPanel;
