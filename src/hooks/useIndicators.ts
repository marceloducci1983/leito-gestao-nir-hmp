
import { useMemo } from 'react';
import { Bed, DischargedPatient, Department } from '@/types';
import { IndicatorData, DepartmentOccupation, DepartmentDaily, DepartmentStay, DateFilter } from '@/types/indicators';

export const useIndicators = (
  beds: Bed[], 
  archivedPatients: DischargedPatient[],
  dateFilter: DateFilter
) => {
  const indicators = useMemo((): IndicatorData => {
    const departments: Department[] = [
      'CLINICA MEDICA',
      'PRONTO SOCORRO', 
      'CLINICA CIRURGICA',
      'UTI ADULTO',
      'UTI NEONATAL',
      'PEDIATRIA',
      'MATERNIDADE'
    ];

    // Taxa de ocupação geral
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(bed => bed.isOccupied).length;
    const occupationRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

    // Taxa de ocupação por departamento
    const occupationByDepartment: DepartmentOccupation[] = departments.map(dept => {
      const deptBeds = beds.filter(bed => bed.department === dept);
      const deptOccupied = deptBeds.filter(bed => bed.isOccupied).length;
      const deptTotal = deptBeds.length;
      const deptRate = deptTotal > 0 ? (deptOccupied / deptTotal) * 100 : 0;

      return {
        department: dept,
        occupiedBeds: deptOccupied,
        totalBeds: deptTotal,
        occupationRate: deptRate
      };
    });

    // Pacientes admitidos hoje (geral)
    const today = new Date().toISOString().split('T')[0];
    const todayPatients = beds.filter(bed => 
      bed.patient && bed.patient.admissionDate === today
    ).length;

    // Pacientes admitidos hoje por setor
    const dailyPatientsByDepartment: DepartmentDaily[] = departments.map(dept => {
      const deptTodayAdmissions = beds.filter(bed => 
        bed.department === dept && 
        bed.patient && 
        bed.patient.admissionDate === today
      ).length;

      return {
        department: dept,
        dailyAdmissions: deptTodayAdmissions
      };
    });

    // Tempo médio de permanência por setor (baseado em pacientes com alta)
    const averageStayByDepartment: DepartmentStay[] = departments.map(dept => {
      const deptDischarges = archivedPatients.filter(patient => 
        patient.department === dept &&
        patient.dischargeDate >= dateFilter.startDate &&
        patient.dischargeDate <= dateFilter.endDate
      );

      const totalStayDays = deptDischarges.reduce((sum, patient) => sum + patient.actualStayDays, 0);
      const averageStay = deptDischarges.length > 0 ? totalStayDays / deptDischarges.length : 0;

      return {
        department: dept,
        averageStayDays: Math.round(averageStay * 10) / 10, // 1 decimal place
        totalDischarges: deptDischarges.length
      };
    });

    return {
      occupationRate: Math.round(occupationRate * 10) / 10,
      occupationByDepartment,
      dailyPatients: todayPatients,
      dailyPatientsByDepartment,
      averageStayByDepartment,
      totalBeds,
      occupiedBeds
    };
  }, [beds, archivedPatients, dateFilter]);

  return indicators;
};
