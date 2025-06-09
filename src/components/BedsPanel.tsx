import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BedCard from './BedCard';
import ReservationForm from './forms/ReservationForm';
import PatientForm from './forms/PatientForm';
import DischargeForm from './forms/DischargeForm';
import TransferForm from './forms/TransferForm';
import { Bed, Patient, BedReservation, Department, DischargedPatient } from '@/types';
import { getInitialBeds } from '@/data/initialBeds';

interface BedsPanelProps {
  onDataChange: (data: {
    beds: Bed[];
    archivedPatients: DischargedPatient[];
    dischargeMonitoring: DischargedPatient[];
  }) => void;
}

const BedsPanel: React.FC<BedsPanelProps> = ({ onDataChange }) => {
  const [beds, setBeds] = useState<Bed[]>(() => getInitialBeds());
  const [archivedPatients, setArchivedPatients] = useState<DischargedPatient[]>([]);
  const [dischargeMonitoring, setDischargeMonitoring] = useState<DischargedPatient[]>([]);
  
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CLINICA MEDICA');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Form states
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDischargeForm, setShowDischargeForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
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

  // Notify parent of data changes
  useEffect(() => {
    onDataChange({
      beds,
      archivedPatients,
      dischargeMonitoring
    });
  }, [beds, archivedPatients, dischargeMonitoring, onDataChange]);

  const calculateOccupationDays = (admissionDate: string): number => {
    const admission = new Date(admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admission.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

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
    const bed = beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setIsEditingPatient(true);
      setShowPatientForm(true);
    }
  };

  const handleTransferPatient = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setShowTransferForm(true);
    }
  };

  const handleDischargePatient = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setShowDischargeForm(true);
    }
  };

  const submitReservation = (data: { patientName: string; originClinic: string; diagnosis: string }) => {
    const reservation: BedReservation = {
      id: generateId(),
      ...data,
      bedId: selectedBedId,
      department: selectedDepartment
    };

    setBeds(prev => prev.map(bed => 
      bed.id === selectedBedId 
        ? { ...bed, isReserved: true, reservation }
        : bed
    ));

    toast({
      title: "Leito reservado com sucesso",
      description: `Reserva para ${data.patientName}`,
    });
  };

  const submitPatient = (patientData: Omit<Patient, 'id' | 'occupationDays'>) => {
    const patient: Patient = {
      ...patientData,
      id: generateId(),
      bedId: selectedBedId,
      department: selectedDepartment,
      occupationDays: calculateOccupationDays(patientData.admissionDate)
    };

    setBeds(prev => prev.map(bed => 
      bed.id === selectedBedId 
        ? { 
            ...bed, 
            isOccupied: true, 
            isReserved: false, 
            patient,
            reservation: undefined 
          }
        : bed
    ));

    toast({
      title: isEditingPatient ? "Paciente editado com sucesso" : "Paciente admitido com sucesso",
      description: `${patient.name} - ${patient.diagnosis}`,
    });
  };

  const submitDischarge = (dischargeType: 'POR MELHORA' | 'EVASÃO' | 'TRANSFERENCIA' | 'OBITO') => {
    if (!selectedPatient) return;

    const dischargedPatient: DischargedPatient = {
      ...selectedPatient,
      dischargeDate: new Date().toISOString().split('T')[0],
      dischargeType,
      actualStayDays: calculateOccupationDays(selectedPatient.admissionDate)
    };

    // Add to archived patients and discharge monitoring
    setArchivedPatients(prev => [...prev, dischargedPatient]);
    setDischargeMonitoring(prev => [...prev, dischargedPatient]);

    // Clear the bed
    setBeds(prev => prev.map(bed => 
      bed.id === selectedBedId 
        ? { 
            ...bed, 
            isOccupied: false, 
            patient: undefined 
          }
        : bed
    ));

    toast({
      title: "Alta realizada com sucesso",
      description: `${selectedPatient.name} - ${dischargeType}`,
    });
  };

  const submitTransfer = (targetDepartment: Department, targetBedId: string) => {
    if (!selectedPatient) return;

    const updatedPatient = {
      ...selectedPatient,
      department: targetDepartment,
      bedId: targetBedId
    };

    setBeds(prev => prev.map(bed => {
      if (bed.id === selectedBedId) {
        // Clear source bed
        return { ...bed, isOccupied: false, patient: undefined };
      } else if (bed.id === targetBedId) {
        // Occupy target bed
        return { ...bed, isOccupied: true, patient: updatedPatient };
      }
      return bed;
    }));

    toast({
      title: "Transferência realizada com sucesso",
      description: `${selectedPatient.name} transferido para ${targetDepartment}`,
    });
  };

  const handleDeleteReservation = (bedId: string) => {
    setBeds(prev => prev.map(bed => 
      bed.id === bedId 
        ? { ...bed, isReserved: false, reservation: undefined }
        : bed
    ));

    toast({
      title: "Reserva excluída",
      description: "A reserva foi removida com sucesso",
    });
  };

  const handleCreateNewBed = () => {
    const newBedName = `Novo-${beds.filter(b => b.department === selectedDepartment && b.isCustom).length + 1}`;
    const newBed: Bed = {
      id: `${selectedDepartment}-${generateId()}`,
      name: newBedName,
      department: selectedDepartment,
      isOccupied: false,
      isReserved: false,
      isCustom: true
    };

    setBeds(prev => [...prev, newBed]);
    
    toast({
      title: "Novo leito criado",
      description: `Leito ${newBedName} adicionado ao ${selectedDepartment}`,
    });
  };

  const handleDeleteBed = (bedId: string) => {
    setBeds(prev => prev.filter(bed => bed.id !== bedId));
    
    toast({
      title: "Leito excluído",
      description: "O leito customizado foi removido",
    });
  };

  const departmentBeds = beds.filter(bed => bed.department === selectedDepartment);
  
  // Fix: Map beds to the correct format for TransferForm
  const availableBedsForTransfer = beds
    .filter(bed => !bed.isOccupied && !bed.isReserved)
    .map(bed => ({
      id: bed.id,
      name: bed.name,
      department: bed.department as Department
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{selectedDepartment}</h2>
        <Button onClick={handleCreateNewBed} variant="outline">
          CRIAR NOVO LEITO
        </Button>
      </div>

      {/* Beds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {departmentBeds.map((bed) => (
          <BedCard
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

      {/* Forms */}
      <ReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        onSubmit={submitReservation}
      />

      <PatientForm
        isOpen={showPatientForm}
        onClose={() => setShowPatientForm(false)}
        onSubmit={submitPatient}
        patient={selectedPatient}
        isEditing={isEditingPatient}
      />

      {selectedPatient && (
        <>
          <DischargeForm
            isOpen={showDischargeForm}
            onClose={() => setShowDischargeForm(false)}
            onSubmit={submitDischarge}
            patientName={selectedPatient.name}
          />

          <TransferForm
            isOpen={showTransferForm}
            onClose={() => setShowTransferForm(false)}
            onSubmit={submitTransfer}
            patientName={selectedPatient.name}
            availableBeds={availableBedsForTransfer}
            currentDepartment={selectedPatient.department as Department}
          />
        </>
      )}
    </div>
  );
};

export default BedsPanel;
