
import { SupabaseBed, SupabasePatient, SupabaseBedReservation } from '@/types/supabase';

export const transformBedsData = (bedsData: any[]) => {
  return bedsData.map((bed: any) => {
    const patient = bed.patients?.[0];
    const reservation = bed.bed_reservations?.[0];

    return {
      id: bed.id,
      name: bed.name,
      // Usar department_text se disponível, senão usar department
      department: bed.department_text || bed.department,
      isOccupied: bed.is_occupied,
      isReserved: bed.is_reserved,
      isCustom: bed.is_custom,
      patient: patient ? {
        id: patient.id,
        name: patient.name,
        sex: patient.sex,
        birthDate: patient.birth_date,
        age: patient.age,
        admissionDate: patient.admission_date,
        admissionTime: patient.admission_time,
        diagnosis: patient.diagnosis,
        specialty: patient.specialty,
        expectedDischargeDate: patient.expected_discharge_date,
        originCity: patient.origin_city,
        occupationDays: patient.occupation_days,
        isTFD: patient.is_tfd,
        tfdType: patient.tfd_type,
        bedId: patient.bed_id,
        // Usar department_text se disponível, senão usar department
        department: patient.department_text || patient.department
      } : undefined,
      reservation: reservation ? {
        id: reservation.id,
        patientName: reservation.patient_name,
        originClinic: reservation.origin_clinic,
        diagnosis: reservation.diagnosis,
        bedId: bed.id,
        // Usar department_text se disponível, senão usar department
        department: reservation.department_text || reservation.department
      } : undefined
    };
  });
};

export const transformDischargedPatientsData = (dischargedData: any[]) => {
  return dischargedData.map((patient: any) => ({
    id: patient.patient_id,
    name: patient.name,
    sex: patient.sex,
    birthDate: patient.birth_date,
    age: patient.age,
    admissionDate: patient.admission_date,
    admissionTime: patient.admission_time,
    diagnosis: patient.diagnosis,
    specialty: patient.specialty,
    expectedDischargeDate: patient.expected_discharge_date,
    originCity: patient.origin_city,
    occupationDays: patient.occupation_days,
    isTFD: patient.is_tfd,
    tfdType: patient.tfd_type,
    bedId: patient.bed_id,
    // Usar department_text se disponível, senão usar department
    department: patient.department_text || patient.department,
    dischargeDate: patient.discharge_date,
    dischargeType: patient.discharge_type,
    actualStayDays: patient.actual_stay_days
  }));
};
