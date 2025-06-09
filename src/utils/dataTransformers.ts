
import { Bed, DischargedPatient } from '@/types';
import { SupabaseBed } from '@/types/supabase';

export const transformBedsData = (bedsData: any[]): Bed[] => {
  return bedsData.map(bed => {
    const patient = bed.patients && bed.patients.length > 0 ? bed.patients[0] : null;
    const reservation = bed.bed_reservations && bed.bed_reservations.length > 0 ? bed.bed_reservations[0] : null;

    return {
      id: bed.id,
      name: bed.name,
      department: bed.department as any,
      isOccupied: bed.is_occupied,
      isReserved: bed.is_reserved,
      isCustom: bed.is_custom,
      patient: patient ? {
        id: patient.id,
        name: patient.name,
        sex: patient.sex as any,
        birthDate: patient.birth_date,
        age: patient.age,
        admissionDate: patient.admission_date,
        diagnosis: patient.diagnosis,
        specialty: patient.specialty,
        expectedDischargeDate: patient.expected_discharge_date,
        originCity: patient.origin_city,
        occupationDays: patient.occupation_days,
        isTFD: patient.is_tfd,
        tfdType: patient.tfd_type,
        bedId: bed.id,
        department: patient.department as any
      } : undefined,
      reservation: reservation ? {
        id: reservation.id,
        patientName: reservation.patient_name,
        originClinic: reservation.origin_clinic,
        diagnosis: reservation.diagnosis,
        bedId: bed.id,
        department: reservation.department as any
      } : undefined
    };
  });
};

export const transformDischargedPatientsData = (dischargedData: any[]): DischargedPatient[] => {
  return dischargedData.map(discharge => ({
    id: discharge.patient_id,
    name: discharge.name,
    sex: discharge.sex as any,
    birthDate: discharge.birth_date,
    age: discharge.age,
    admissionDate: discharge.admission_date,
    diagnosis: discharge.diagnosis,
    specialty: discharge.specialty,
    expectedDischargeDate: discharge.expected_discharge_date,
    originCity: discharge.origin_city,
    occupationDays: discharge.occupation_days,
    isTFD: discharge.is_tfd,
    tfdType: discharge.tfd_type,
    bedId: discharge.bed_id,
    department: discharge.department as any,
    dischargeDate: discharge.discharge_date,
    dischargeType: discharge.discharge_type as any,
    actualStayDays: discharge.actual_stay_days
  }));
};

export const filterRecentDischarges = (dischargedPatients: DischargedPatient[]): DischargedPatient[] => {
  return dischargedPatients.filter(p => {
    const dischargeDate = new Date(p.dischargeDate);
    const today = new Date();
    const diffTime = today.getTime() - dischargeDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
};
