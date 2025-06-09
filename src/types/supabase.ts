
export interface SupabaseBed {
  id: string;
  name: string;
  department: string;
  is_occupied: boolean;
  is_reserved: boolean;
  is_custom: boolean;
  patients?: SupabasePatient[];
  bed_reservations?: SupabaseBedReservation[];
}

export interface SupabasePatient {
  id: string;
  name: string;
  sex: string;
  birth_date: string;
  age: number;
  admission_date: string;
  diagnosis: string;
  specialty?: string;
  expected_discharge_date: string;
  origin_city: string;
  occupation_days: number;
  is_tfd: boolean;
  tfd_type?: string;
  department: string;
}

export interface SupabaseBedReservation {
  id: string;
  patient_name: string;
  origin_clinic: string;
  diagnosis: string;
  department: string;
}
