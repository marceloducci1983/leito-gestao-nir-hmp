
import { SupabaseBed, SupabasePatient, SupabaseBedReservation } from '@/types/supabase';

export const transformBedsData = (bedsData: any[]) => {
  console.log('🔄 TRANSFORM - Iniciando transformação de', bedsData?.length, 'leitos');
  console.log('🔍 TRANSFORM - Dados brutos recebidos:', bedsData);
  
  const transformedBeds = bedsData.map((bed: any) => {
    const patient = bed.patients?.[0];
    const reservation = bed.bed_reservations?.[0];
    
    console.log('🔍 TRANSFORM BED:', {
      bed_id: bed.id,
      bed_name: bed.name,
      db_is_occupied: bed.is_occupied,
      db_is_reserved: bed.is_reserved,
      patients_array_length: bed.patients?.length || 0,
      has_patient_data: !!patient,
      patient_name: patient?.name || 'SEM_PACIENTE',
      reservations_array_length: bed.bed_reservations?.length || 0,
      has_reservation_data: !!reservation,
      reservation_patient_name: reservation?.patient_name || 'SEM_RESERVA'
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
      isOccupied: !!patient,
      isReserved: !!reservation && !patient,
      isCustom: bed.is_custom || false,
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
        occupationDays: patient.occupation_days || 0,
        isTFD: patient.is_tfd || false,
        tfdType: patient.tfd_type,
        bedId: patient.bed_id || bed.id,
        department: patient.department_text || patient.department || bedDepartment
      } : undefined,
      reservation: reservation ? {
        id: reservation.id,
        patientName: reservation.patient_name,
        originClinic: reservation.origin_clinic,
        diagnosis: reservation.diagnosis,
        bedId: bed.id,  
        department: reservation.department_text || reservation.department || bedDepartment
      } : undefined
    };

    console.log('✅ TRANSFORMED BED:', {
      bed_id: transformedBed.id,
      bed_name: transformedBed.name,
      final_isOccupied: transformedBed.isOccupied,
      final_isReserved: transformedBed.isReserved,
      final_patient_name: transformedBed.patient?.name || 'NONE',
      final_reservation_name: transformedBed.reservation?.patientName || 'NONE'
    });

    return transformedBed;
  });
  
  console.log('✅ TRANSFORM - Transformação completa:', {
    total_beds: transformedBeds.length,
    occupied: transformedBeds.filter(b => b.isOccupied).length,
    available: transformedBeds.filter(b => !b.isOccupied && !b.isReserved).length,
    reserved: transformedBeds.filter(b => b.isReserved).length
  });
  
  return transformedBeds;
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
