
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BedCard from './BedCard';
import ReservationForm from './forms/ReservationForm';
import PatientForm from './forms/PatientForm';
import DischargeForm from './forms/DischargeForm';
import TransferForm from './forms/TransferForm';
import { Department } from '@/types';
import { useBeds, SupabaseBed } from '@/hooks/useBeds';
import { usePatients } from '@/hooks/usePatients';
import { useReservations } from '@/hooks/useReservations';
import { useDischargeRecords } from '@/hooks/useDischargeRecords';
import { initializeBeds } from '@/utils/bedInitializer';

interface SupabaseBedsPanelProps {
  onDataChange: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('UTI ADULTO');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  
  // Form states
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDischargeForm, setShowDischargeForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const { beds, loading: bedsLoading, createBed, updateBed, deleteBed } = useBeds();
  const { patients, createPatient, updatePatient, dischargePatient } = usePatients();
  const { reservations, createReservation, deleteReservation } = useReservations();
  const { dischargeRecords } = useDischargeRecords();
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

  // Initialize beds on component mount
  useEffect(() => {
    initializeBeds();
  }, []);

  // Transform data for parent component
  useEffect(() => {
    const transformedBeds = beds.map(bed => {
      const patient = patients.find(p => p.bed_id === bed.id);
      const reservation = reservations.find(r => r.bed_id === bed.id);
      
      return {
        id: bed.id,
        name: bed.name,
        department: bed.department,
        isOccupied: bed.status === 'occupied',
        isReserved: bed.status === 'reserved',
        isCustom: bed.is_custom,
        patient: patient ? {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          sex: patient.gender,
          birthDate: patient.birth_date,
          admissionDate: patient.admission_date,
          diagnosis: patient.diagnosis,
          specialty: '',
          expectedDischargeDate: patient.expected_discharge_date || '',
          originCity: patient.origin_city,
          occupationDays: patient.days_occupied || 0,
          isTFD: patient.is_tfd || false,
          tfdType: patient.tfd_type,
          bedId: patient.bed_id || '',
          department: bed.department
        } : undefined,
        reservation: reservation ? {
          id: reservation.id,
          patientName: reservation.patient_name,
          originClinic: reservation.origin_clinic,
          diagnosis: reservation.diagnosis,
          bedId: reservation.bed_id || '',
          department: bed.department
        } : undefined
      };
    });

    const transformedDischargeRecords = dischargeRecords.map(record => ({
      id: record.id,
      name: record.name,
      age: record.age,
      sex: record.gender,
      birthDate: record.birth_date,
      admissionDate: record.admission_date,
      diagnosis: record.diagnosis,
      specialty: '',
      expectedDischargeDate: record.expected_discharge_date || '',
      originCity: record.origin_city,
      occupationDays: record.days_occupied,
      isTFD: record.is_tfd || false,
      tfdType: record.tfd_type,
      bedId: '',
      department: '',
      dischargeDate: record.discharge_date,
      dischargeType: record.discharge_type,
      actualStayDays: record.days_occupied
    }));

    onDataChange({
      beds: transformedBeds,
      archivedPatients: transformedDischargeRecords,
      dischargeMonitoring: transformedDischargeRecords
    });
  }, [beds, patients, reservations, dischargeRecords, onDataChange]);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateOccupationDays = (admissionDate: string): number => {
    const admission = new Date(admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admission.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    const patient = patients.find(p => p.bed_id === bedId);
    if (patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(patient);
      setIsEditingPatient(true);
      setShowPatientForm(true);
    }
  };

  const handleTransferPatient = (bedId: string) => {
    const patient = patients.find(p => p.bed_id === bedId);
    if (patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(patient);
      setShowTransferForm(true);
    }
  };

  const handleDischargePatient = (bedId: string) => {
    const patient = patients.find(p => p.bed_id === bedId);
    if (patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(patient);
      setShowDischargeForm(true);
    }
  };

  const submitReservation = async (data: { patientName: string; originClinic: string; diagnosis: string }) => {
    const reservationResult = await createReservation({
      patient_name: data.patientName,
      origin_clinic: data.originClinic,
      diagnosis: data.diagnosis,
      bed_id: selectedBedId
    });

    if (reservationResult.success) {
      await updateBed(selectedBedId, {
        status: 'reserved',
        reservation_patient_name: data.patientName,
        reservation_origin_clinic: data.originClinic,
        reservation_diagnosis: data.diagnosis
      });

      toast({
        title: "Leito reservado com sucesso",
        description: `Reserva para ${data.patientName}`,
      });
      setShowReservationForm(false);
    }
  };

  const submitPatient = async (patientData: any) => {
    const age = calculateAge(patientData.birthDate);
    const daysOccupied = calculateOccupationDays(patientData.admissionDate);

    if (isEditingPatient && selectedPatient) {
      const updateResult = await updatePatient(selectedPatient.id, {
        name: patientData.name,
        gender: patientData.sex,
        birth_date: patientData.birthDate,
        age: age,
        admission_date: patientData.admissionDate,
        admission_time: new Date().toTimeString().split(' ')[0],
        diagnosis: patientData.diagnosis,
        origin_city: patientData.originCity,
        expected_discharge_date: patientData.expectedDischargeDate,
        is_tfd: patientData.isTFD,
        tfd_type: patientData.tfdType,
        days_occupied: daysOccupied
      });

      if (updateResult.success) {
        await updateBed(selectedBedId, {
          patient_name: patientData.name,
          patient_age: age,
          patient_gender: patientData.sex,
          patient_birth_date: patientData.birthDate,
          patient_admission_date: patientData.admissionDate,
          patient_diagnosis: patientData.diagnosis,
          patient_origin_city: patientData.originCity,
          patient_expected_discharge_date: patientData.expectedDischargeDate,
          patient_tfd: patientData.isTFD,
          patient_tfd_type: patientData.tfdType
        });

        toast({
          title: "Paciente editado com sucesso",
          description: `${patientData.name} - ${patientData.diagnosis}`,
        });
      }
    } else {
      const patientResult = await createPatient({
        name: patientData.name,
        gender: patientData.sex,
        birth_date: patientData.birthDate,
        age: age,
        admission_date: patientData.admissionDate,
        admission_time: new Date().toTimeString().split(' ')[0],
        diagnosis: patientData.diagnosis,
        origin_city: patientData.originCity,
        expected_discharge_date: patientData.expectedDischargeDate,
        is_tfd: patientData.isTFD,
        tfd_type: patientData.tfdType,
        bed_id: selectedBedId,
        days_occupied: daysOccupied
      });

      if (patientResult.success) {
        await updateBed(selectedBedId, {
          status: 'occupied',
          patient_id: patientResult.data.id,
          patient_name: patientData.name,
          patient_age: age,
          patient_gender: patientData.sex,
          patient_birth_date: patientData.birthDate,
          patient_admission_date: patientData.admissionDate,
          patient_diagnosis: patientData.diagnosis,
          patient_origin_city: patientData.originCity,
          patient_expected_discharge_date: patientData.expectedDischargeDate,
          patient_tfd: patientData.isTFD,
          patient_tfd_type: patientData.tfdType,
          reservation_patient_name: null,
          reservation_origin_clinic: null,
          reservation_diagnosis: null
        });

        // Delete any existing reservation for this bed
        const existingReservation = reservations.find(r => r.bed_id === selectedBedId);
        if (existingReservation) {
          await deleteReservation(existingReservation.id);
        }

        toast({
          title: "Paciente admitido com sucesso",
          description: `${patientData.name} - ${patientData.diagnosis}`,
        });
      }
    }
    setShowPatientForm(false);
  };

  const submitDischarge = async (dischargeType: 'POR MELHORA' | 'EVASÃO' | 'TRANSFERENCIA' | 'OBITO') => {
    if (!selectedPatient) return;

    const dischargeResult = await dischargePatient(selectedPatient.id, dischargeType);
    
    if (dischargeResult.success) {
      await updateBed(selectedBedId, {
        status: 'available',
        patient_id: null,
        patient_name: null,
        patient_age: null,
        patient_gender: null,
        patient_birth_date: null,
        patient_admission_date: null,
        patient_diagnosis: null,
        patient_origin_city: null,
        patient_expected_discharge_date: null,
        patient_tfd: null,
        patient_tfd_type: null
      });

      toast({
        title: "Alta realizada com sucesso",
        description: `${selectedPatient.name} - ${dischargeType}`,
      });
      setShowDischargeForm(false);
    }
  };

  const submitTransfer = async (targetDepartment: Department, targetBedId: string) => {
    if (!selectedPatient) return;

    const updateResult = await updatePatient(selectedPatient.id, {
      bed_id: targetBedId
    });

    if (updateResult.success) {
      // Clear source bed
      await updateBed(selectedBedId, {
        status: 'available',
        patient_id: null,
        patient_name: null,
        patient_age: null,
        patient_gender: null,
        patient_birth_date: null,
        patient_admission_date: null,
        patient_diagnosis: null,
        patient_origin_city: null,
        patient_expected_discharge_date: null,
        patient_tfd: null,
        patient_tfd_type: null
      });

      // Occupy target bed
      await updateBed(targetBedId, {
        status: 'occupied',
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.name,
        patient_age: selectedPatient.age,
        patient_gender: selectedPatient.gender,
        patient_birth_date: selectedPatient.birth_date,
        patient_admission_date: selectedPatient.admission_date,
        patient_diagnosis: selectedPatient.diagnosis,
        patient_origin_city: selectedPatient.origin_city,
        patient_expected_discharge_date: selectedPatient.expected_discharge_date,
        patient_tfd: selectedPatient.is_tfd,
        patient_tfd_type: selectedPatient.tfd_type
      });

      toast({
        title: "Transferência realizada com sucesso",
        description: `${selectedPatient.name} transferido para ${targetDepartment}`,
      });
      setShowTransferForm(false);
    }
  };

  const handleDeleteReservation = async (bedId: string) => {
    const reservation = reservations.find(r => r.bed_id === bedId);
    if (reservation) {
      const deleteResult = await deleteReservation(reservation.id);
      
      if (deleteResult.success) {
        await updateBed(bedId, {
          status: 'available',
          reservation_patient_name: null,
          reservation_origin_clinic: null,
          reservation_diagnosis: null
        });

        toast({
          title: "Reserva excluída",
          description: "A reserva foi removida com sucesso",
        });
      }
    }
  };

  const handleCreateNewBed = async () => {
    const departmentBeds = beds.filter(b => b.department === selectedDepartment);
    const customBeds = departmentBeds.filter(b => b.is_custom);
    const newBedName = `Novo-${customBeds.length + 1}`;
    
    const createResult = await createBed({
      name: newBedName,
      department: selectedDepartment,
      status: 'available',
      is_custom: true
    });

    if (createResult.success) {
      toast({
        title: "Novo leito criado",
        description: `Leito ${newBedName} adicionado ao ${selectedDepartment}`,
      });
    }
  };

  const handleDeleteBed = async (bedId: string) => {
    const deleteResult = await deleteBed(bedId);
    
    if (deleteResult.success) {
      toast({
        title: "Leito excluído",
        description: "O leito customizado foi removido",
      });
    }
  };

  const departmentBeds = beds.filter(bed => bed.department === selectedDepartment);
  
  // Transform beds for BedCard component
  const transformedBeds = departmentBeds.map(bed => {
    const patient = patients.find(p => p.bed_id === bed.id);
    const reservation = reservations.find(r => r.bed_id === bed.id);
    
    return {
      id: bed.id,
      name: bed.name,
      department: bed.department,
      isOccupied: bed.status === 'occupied',
      isReserved: bed.status === 'reserved',
      isCustom: bed.is_custom,
      patient: patient ? {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        sex: patient.gender as 'masculino' | 'feminino',
        birthDate: patient.birth_date,
        admissionDate: patient.admission_date,
        diagnosis: patient.diagnosis,
        specialty: '',
        expectedDischargeDate: patient.expected_discharge_date || '',
        originCity: patient.origin_city,
        occupationDays: calculateOccupationDays(patient.admission_date),
        isTFD: patient.is_tfd || false,
        tfdType: patient.tfd_type,
        bedId: patient.bed_id || '',
        department: bed.department
      } : undefined,
      reservation: reservation ? {
        id: reservation.id,
        patientName: reservation.patient_name,
        originClinic: reservation.origin_clinic,
        diagnosis: reservation.diagnosis,
        bedId: reservation.bed_id || '',
        department: bed.department
      } : undefined
    };
  });

  const availableBedsForTransfer = beds
    .filter(bed => bed.status === 'available')
    .map(bed => ({
      id: bed.id,
      name: bed.name,
      department: bed.department as Department
    }));

  if (bedsLoading) {
    return <div className="flex justify-center items-center h-64">Carregando leitos...</div>;
  }

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
        {transformedBeds.map((bed) => (
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
        patient={selectedPatient ? {
          id: selectedPatient.id,
          name: selectedPatient.name,
          sex: selectedPatient.gender as 'masculino' | 'feminino',
          birthDate: selectedPatient.birth_date,
          age: selectedPatient.age,
          admissionDate: selectedPatient.admission_date,
          diagnosis: selectedPatient.diagnosis,
          specialty: '',
          expectedDischargeDate: selectedPatient.expected_discharge_date || '',
          originCity: selectedPatient.origin_city,
          occupationDays: selectedPatient.days_occupied || 0,
          isTFD: selectedPatient.is_tfd || false,
          tfdType: selectedPatient.tfd_type,
          bedId: selectedPatient.bed_id || '',
          department: ''
        } : null}
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
            currentDepartment={selectedDepartment}
          />
        </>
      )}
    </div>
  );
};

export default SupabaseBedsPanel;
