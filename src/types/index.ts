
export interface Patient {
  id: string;
  name: string;
  sex: 'masculino' | 'feminino';
  birthDate: string;
  age: number;
  admissionDate: string;
  admissionTime?: string;
  diagnosis: string;
  specialty?: string;
  expectedDischargeDate: string;
  originCity: string;
  occupationDays: number;
  isTFD: boolean;
  tfdType?: string;
  bedId: string;
  department: string;
  isIsolation?: boolean;
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
  isIsolation?: boolean;
}

// Mudança: Department agora é string para permitir departamentos dinâmicos
export type Department = string;
