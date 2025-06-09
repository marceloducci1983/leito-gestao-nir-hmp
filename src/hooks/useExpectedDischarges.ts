
import { useMemo } from 'react';
import { Bed } from '@/types';
import { ExpectedDischarge, DischargeGroups, DischargeFilters } from '@/types/discharges';

export const useExpectedDischarges = (beds: Bed[], filters?: DischargeFilters) => {
  const expectedDischarges = useMemo(() => {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Filter beds with occupied patients that have expected discharge dates
    const occupiedBeds = beds.filter(bed => 
      bed.isOccupied && 
      bed.patient && 
      bed.patient.expectedDischargeDate
    );

    const allExpectedDischarges: ExpectedDischarge[] = occupiedBeds
      .map(bed => {
        const patient = bed.patient!;
        const expectedDate = new Date(patient.expectedDischargeDate);
        const hoursUntilDischarge = Math.ceil((expectedDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        
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
          isUrgent: expectedDate <= twentyFourHoursFromNow
        };
      })
      .filter(discharge => {
        const expectedDate = new Date(discharge.patient.expectedDischargeDate);
        return expectedDate <= fortyEightHoursFromNow && expectedDate >= now;
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
