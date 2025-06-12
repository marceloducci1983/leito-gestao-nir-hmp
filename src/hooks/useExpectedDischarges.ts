
import { useMemo } from 'react';
import { Bed } from '@/types';
import { ExpectedDischarge, DischargeGroups, DischargeFilters } from '@/types/discharges';

// Função auxiliar para criar data local sem conversão de timezone
const createLocalDate = (isoString: string): Date => {
  if (!isoString) return new Date();
  
  // Se for formato ISO (YYYY-MM-DD), criar data local
  if (isoString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = isoString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  return new Date(isoString);
};

// Função para comparar apenas datas (sem horário) preservando o dia original
const isSameDayLocal = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? createLocalDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? createLocalDate(date2) : date2;
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const useExpectedDischarges = (beds: Bed[], filters?: DischargeFilters) => {
  const expectedDischarges = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(now.getDate() + 2);

    // Definir horas, minutos, segundos e ms para zero para comparar apenas datas
    now.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    // Filter beds with occupied patients that have expected discharge dates
    const occupiedBeds = beds.filter(bed => 
      bed.isOccupied && 
      bed.patient && 
      bed.patient.expectedDischargeDate
    );

    const allExpectedDischarges: ExpectedDischarge[] = occupiedBeds
      .map(bed => {
        const patient = bed.patient!;
        
        // Usar data local sem conversão de timezone
        const expectedDate = createLocalDate(patient.expectedDischargeDate);
        
        // Calcular horas aproximadas até a alta usando data local
        const hoursUntilDischarge = Math.ceil((expectedDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        // Verificar se é urgente usando comparação local
        const isUrgent = isSameDayLocal(expectedDate, now) || isSameDayLocal(expectedDate, tomorrow);
        
        return {
          patient: {
            id: patient.id,
            name: patient.name,
            birthDate: patient.birthDate,
            age: patient.age,
            admissionDate: patient.admissionDate,
            diagnosis: patient.diagnosis,
            expectedDischargeDate: patient.expectedDischargeDate,
            originCity: patient.originCity,
            department: patient.department,
            bedId: patient.bedId,
            isTFD: patient.isTFD,
            tfdType: patient.tfdType,
            specialty: patient.specialty
          },
          hoursUntilDischarge,
          isUrgent
        };
      })
      .filter(discharge => {
        // Usar data local para filtrar
        const expectedDate = createLocalDate(discharge.patient.expectedDischargeDate);
        
        // Incluir apenas datas hoje, amanhã ou depois de amanhã
        return isSameDayLocal(expectedDate, now) || 
               isSameDayLocal(expectedDate, tomorrow) || 
               isSameDayLocal(expectedDate, dayAfterTomorrow);
      });

    // Apply filters
    let filteredDischarges = allExpectedDischarges;

    if (filters?.department) {
      filteredDischarges = filteredDischarges.filter(discharge => 
        discharge.patient.department === filters.department
      );
    }

    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredDischarges = filteredDischarges.filter(discharge =>
        discharge.patient.name.toLowerCase().includes(searchTerm) ||
        discharge.patient.originCity.toLowerCase().includes(searchTerm) ||
        discharge.patient.diagnosis.toLowerCase().includes(searchTerm)
      );
    }

    // Sort discharges
    if (filters?.sortBy) {
      filteredDischarges.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (filters.sortBy) {
          case 'name':
            aValue = a.patient.name;
            bValue = b.patient.name;
            break;
          case 'expectedDischargeDate':
            aValue = new Date(a.patient.expectedDischargeDate).getTime();
            bValue = new Date(b.patient.expectedDischargeDate).getTime();
            break;
          case 'department':
            aValue = a.patient.department;
            bValue = b.patient.department;
            break;
          case 'originCity':
            aValue = a.patient.originCity;
            bValue = b.patient.originCity;
            break;
          default:
            aValue = a.patient.name;
            bValue = b.patient.name;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.sortOrder === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        } else {
          return filters.sortOrder === 'desc'
            ? (bValue as number) - (aValue as number)
            : (aValue as number) - (bValue as number);
        }
      });
    }

    // Group by time periods
    const groups: DischargeGroups = {
      within24Hours: filteredDischarges.filter(discharge => discharge.isUrgent),
      within48Hours: filteredDischarges.filter(discharge => !discharge.isUrgent)
    };

    return {
      all: filteredDischarges,
      groups,
      totalCount: filteredDischarges.length,
      urgent24h: groups.within24Hours.length,
      upcoming48h: groups.within48Hours.length
    };
  }, [beds, filters]);

  return expectedDischarges;
};
