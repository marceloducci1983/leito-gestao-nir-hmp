
export interface DepartmentOccupation {
  department: string;
  occupiedBeds: number;
  totalBeds: number;
  occupationRate: number;
}

export interface DepartmentDaily {
  department: string;
  dailyAdmissions: number;
}

export interface DepartmentStay {
  department: string;
  averageStayDays: number;
  totalDischarges: number;
}

export interface IndicatorData {
  occupationRate: number;
  occupationByDepartment: DepartmentOccupation[];
  dailyPatients: number;
  dailyPatientsByDepartment: DepartmentDaily[];
  averageStayByDepartment: DepartmentStay[];
  totalBeds: number;
  occupiedBeds: number;
}

export interface DateFilter {
  startDate: string;
  endDate: string;
}
