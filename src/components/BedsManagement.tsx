import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import { Department, Bed } from '@/types';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewBedCard from './NewBedCard';
import NewPatientForm from './forms/NewPatientForm';
import NewReservationForm from './forms/NewReservationForm';
import DischargeModal from './forms/DischargeModal';
import TransferModal from './forms/TransferModal';

interface BedsManagementProps {
  onDataChange?: (data: any) => void;
}

// Ordem específica dos leitos por departamento
const BED_ORDER_BY_DEPARTMENT: Record<Department, string[]> = {
  'CLINICA MEDICA': [
    'ISOL', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '4A', '4B', 
    '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', 
    '11A', '11B', '12A', '12B', '13A', '13B', '14A', '14B', '14C', '14D', 
    '15A', '15B', '15C', '16A', '16B', '16C', '17A', '17B', '17C', '18'
  ],
  'PRONTO SOCORRO': [
    '1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '2E', 
    '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', 
    'Isolamento', 'BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', 'BOX-5', 
    'CI-1', 'CI-2', 'CI-3', 'CI-4'
  ],
  'CLINICA CIRURGICA': [
    '1A – ORTOP', '1B – ORTOP', '1C – ORTOP', '2A – ORTOP', '2B – ORTOP', '2C – ORTOP',
    '3A – ORTOP', '3B – ORTOP', '4A – CIRUR', '4B – CIRUR', '5A – CIRUR', '5B – CIRUR',
    '7A – CIRUR', '7B – CIRUR', '7C – CIRUR', '8A – ORTOP', '8B – ORTOP', '8C – ORTOP',
    '9A – CIRUR', '9B – CIRUR', '9C – CIRUR', '10A – PED', '10B – PED',
    '11A – CIRUR', '11B – CIRUR', '11C – CIRUR', 'Isolamento'
  ],
  'UTI ADULTO': [
    'BOX - 1', 'BOX - 2', 'BOX - 3', 'BOX - 4', 'BOX - 5', 'BOX - 6',
    'BOX - 7', 'BOX - 8', 'BOX - 9', 'BOX - 10', 'BOX - 11', 'BOX - 12',
    'BOX - 13', 'BOX - 14', 'BOX – 15 - ISOL', 'BOX – 16 – ISOL'
  ],
  'UTI NEONATAL': [
    '1A', '1B', '1C', '1D', 'Canguru-2A', 'Canguru-2B', 'Convencional 1', 'Convencional 2'
  ],
  'PEDIATRIA': [
    'BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', '1A', '1B', '1C', '1D', 
    '2A', '2B', '2C', '2D', '2E', '3A', '3B', '3C', '3D', 
    '4A', '4B', '4C', '4D', '5A', '5B', '5C', 'Isolamento'
  ],
  'MATERNIDADE': [
    '1A', '1B', '2A', '2B', '4A', '4B', '5A', '5B', '6A', '6B', 
    '7A', '7B', '9A', '9B', '9C', '10A', '10B', '10C', '11A', '11B', '11C', 
    'ISOL', 'Ind. A', 'Ind. B', 'BOX-A', 'CI-A', 'CI-B', 'PP-1', 'PP-2', 'PP-3'
  ]
};

// Função para ordenar leitos conforme a ordem customizada
const sortBedsByCustomOrder = (beds: Bed[], department: Department): Bed[] => {
  const orderArray = BED_ORDER_BY_DEPARTMENT[department] || [];
  
  // Separar leitos que estão na ordem definida dos que não estão
  const orderedBeds: Bed[] = [];
  const unorderedBeds: Bed[] = [];
  
  beds.forEach(bed => {
    const index = orderArray.indexOf(bed.name);
    if (index !== -1) {
      orderedBeds.push({ ...bed, sortIndex: index });
    } else {
      unorderedBeds.push(bed);
    }
  });
  
  // Ordenar os leitos que estão na lista pela ordem definida
  orderedBeds.sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
  
  // Ordenar os leitos não listados alfabeticamente e colocar no final
  unorderedBeds.sort((a, b) => a.name.localeCompare(b.name));
  
  // Remover a propriedade sortIndex antes de retornar
  const cleanOrderedBeds = orderedBeds.map(bed => {
    const { sortIndex, ...cleanBed } = bed as any;
    return cleanBed;
  });
  
  return [...cleanOrderedBeds, ...unorderedBeds];
};

const BedsManagement: React.FC<BedsManagementProps> = ({ onDataChange }) => {
  const { centralData, isLoading, error, addPatient, dischargePatient, addReservation, transferPatient } = useSupabaseBeds();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CLINICA MEDICA');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Form states
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);

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
  
  const occupiedCount = departmentBeds.filter(bed => bed.isOccupied).length;
  const reservedCount = departmentBeds.filter(bed => bed.isReserved).length;
  const availableCount = departmentBeds.length - occupiedCount - reservedCount;

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
    try {
      // Logic to create new bed would be implemented here
      toast({
        title: "Novo leito criado",
        description: `Leito adicionado ao ${selectedDepartment}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar novo leito",
        variant: "destructive",
      });
    }
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

  return (
    <div className="space-y-6">
      {/* Department Selection */}
      <div className="flex flex-wrap gap-2">
        {departments.map((dept) => (
          <Button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            variant={selectedDepartment === dept ? "default" : "outline"}
            className="text-xs md:text-sm"
          >
            {dept}
          </Button>
        ))}
      </div>

      {/* Department Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{selectedDepartment}</span>
            <div className="flex items-center gap-4">
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">Disponíveis: {availableCount}</span>
                <span className="text-red-600">Ocupados: {occupiedCount}</span>
                <span className="text-yellow-600">Reservados: {reservedCount}</span>
                <span className="text-gray-600">Total: {departmentBeds.length}</span>
              </div>
              <Button onClick={handleCreateNewBed} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                CRIAR NOVO LEITO
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {departmentBeds.map((bed) => (
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
    </div>
  );
};

export default BedsManagement;
