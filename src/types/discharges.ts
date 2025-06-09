
export interface ExpectedDischarge {
  patient: {
    id: string;
    name: string;
    birthDate: string;
    age: number;
    admissionDate: string;
    diagnosis: string;
    expectedDischargeDate: string;
    originCity: string;
    department: string;
    bedId: string;
    isTFD: boolean;
    tfdType?: string;
    specialty?: string;
  };
  hoursUntilDischarge: number;
  isUrgent: boolean; // within 24 hours
}

export interface DischargeGroups {
  within24Hours: ExpectedDischarge[];
  within48Hours: ExpectedDischarge[];
}

export interface DischargeFilters {
  department?: string;
  searchTerm?: string;
  sortBy?: 'name' | 'expectedDischargeDate' | 'department' | 'originCity';
  sortOrder?: 'asc' | 'desc';
}
