
export interface Patient {
  id: string;
  name: string;
  sex: 'masculino' | 'feminino';
  birthDate: string;
  age: number;
  admissionDate: string;
  diagnosis: string;
  specialty?: string;
  expectedDischargeDate: string;
  originCity: string;
  occupationDays: number;
  isTFD: boolean;
  tfdType?: string;
  bedId: string;
  department: string;
}

export interface BedReservation {
  id: string;
  patientName: string;
  originClinic: string;
  diagnosis: string;
  bedId: string;
  department: string;
}

export interface Bed {
  id: string;
  name: string;
  department: string;
  isOccupied: boolean;
  isReserved: boolean;
  patient?: Patient;
  reservation?: BedReservation;
  isCustom?: boolean;
}

export interface DischargedPatient extends Patient {
  dischargeDate: string;
  dischargeType: 'POR MELHORA' | 'EVASÃO' | 'TRANSFERENCIA' | 'OBITO';
  actualStayDays: number;
}

export type Department = 'CLINICA MEDICA' | 'PRONTO SOCORRO' | 'CLINICA CIRURGICA' | 'UTI ADULTO' | 'UTI NEONATAL' | 'PEDIATRIA' | 'MATERNIDADE';
