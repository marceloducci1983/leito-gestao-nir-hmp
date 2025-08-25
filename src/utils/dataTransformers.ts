
import { SupabaseBed, SupabasePatient, SupabaseBedReservation } from '@/types/supabase';

export const transformBedsData = (bedsData: any[]) => {
  console.log('🔄 Transforming beds data:', bedsData?.length, 'beds');
  return bedsData.map((bed: any) => {
    const patient = bed.patients?.[0];
    const reservation = bed.bed_reservations?.[0];
    
    console.log('🔍 DEBUGGING BED:', {
      bed_id: bed.id,
      bed_name: bed.name,
      is_occupied: bed.is_occupied,
      is_reserved: bed.is_reserved,
      patients_array: bed.patients,
      patients_count: bed.patients?.length,
      patient_data: patient,
      has_patient: !!patient,
      patient_name: patient?.name
    });

    // Priorizar department_text, mas garantir compatibilidade com department
    const bedDepartment = bed.department_text || bed.department;

    console.log('🔄 Transformando leito:', {
      id: bed.id,
      name: bed.name,
      department_text: bed.department_text,
      department: bed.department,
      final_department: bedDepartment,
      patient_is_tfd: patient?.is_tfd,
      patient_tfd_type: patient?.tfd_type,
      patient_name: patient?.name,
      patient_origin_city: patient?.origin_city,
      patient_origin_city_final: patient?.origin_city
    });

    const transformedBed = {
      id: bed.id,
      name: bed.name,
      department: bedDepartment,
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
        department: patient.department_text || patient.department
      } : undefined,
      reservation: reservation ? {
        id: reservation.id,
        patientName: reservation.patient_name,
        originClinic: reservation.origin_clinic,
        diagnosis: reservation.diagnosis,
        bedId: bed.id,
        department: reservation.department_text || reservation.department
      } : undefined
    };

    // Log específico para pacientes TFD
    if (patient?.is_tfd) {
      console.log('🔍 PACIENTE TFD ENCONTRADO:', {
        nome: patient.name,
        is_tfd: patient.is_tfd,
        tfd_type: patient.tfd_type,
        leito: bed.name,
        departamento: bedDepartment
      });
    }

    return transformedBed;
  });
};

export const transformDischargedPatientsData = (dischargedData: any[]) => {
  return dischargedData.map((patient: any) => {
    const patientDepartment = patient.department_text || patient.department;
    
    console.log('🔄 Transformando paciente com alta:', {
      id: patient.patient_id,
      name: patient.name,
      department_text: patient.department_text,
      department: patient.department,
      final_department: patientDepartment
    });

    return {
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
      department: patientDepartment,
      dischargeDate: patient.discharge_date,
      dischargeType: patient.discharge_type,
      actualStayDays: patient.actual_stay_days
    };
  });
};
