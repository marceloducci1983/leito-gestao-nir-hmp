
import { useMemo } from 'react';
import { addDays } from 'date-fns';
import { 
  getCurrentDateTimeSaoPaulo, 
  isExactDaySaoPaulo 
} from '@/utils/timezoneUtils';

interface ExpectedDischargesData {
  beds: any[];
  archivedPatients: any[];
  dischargeMonitoring: any[];
}

export const useExpectedDischargesData = (data: ExpectedDischargesData) => {
  return useMemo(() => {
    const today = getCurrentDateTimeSaoPaulo();
    const tomorrow = addDays(today, 1);
    const dayAfterTomorrow = addDays(today, 2);

    const occupiedBeds = data.beds.filter(bed => bed.isOccupied && bed.patient);
    
    console.log('Calculando altas previstas:', {
      hoje: today.toISOString().split('T')[0],
      amanha: tomorrow.toISOString().split('T')[0],
      depoisAmanha: dayAfterTomorrow.toISOString().split('T')[0],
      totalPacientes: occupiedBeds.length
    });
    
    const discharges24h = occupiedBeds.filter(bed => {
      if (!bed.patient?.expectedDischargeDate) return false;
      
      const expectedDischarge = new Date(bed.patient.expectedDischargeDate);
      const isToday = isExactDaySaoPaulo(expectedDischarge, today);
      const isTomorrow = isExactDaySaoPaulo(expectedDischarge, tomorrow);
      const isWithin24h = isToday || isTomorrow;
      
      if (isWithin24h) {
        console.log('Paciente 24h:', {
          nome: bed.patient.name,
          dpa: expectedDischarge.toISOString().split('T')[0],
          hoje: today.toISOString().split('T')[0],
          amanha: tomorrow.toISOString().split('T')[0],
          isToday,
          isTomorrow
        });
      }
      
      return isWithin24h;
    });

    const discharges48h = occupiedBeds.filter(bed => {
      if (!bed.patient?.expectedDischargeDate) return false;
      
      const expectedDischarge = new Date(bed.patient.expectedDischargeDate);
      const isDayAfterTomorrow = isExactDaySaoPaulo(expectedDischarge, dayAfterTomorrow);
      
      if (isDayAfterTomorrow) {
        console.log('Paciente 48h:', {
          nome: bed.patient.name,
          dpa: expectedDischarge.toISOString().split('T')[0],
          depoisAmanha: dayAfterTomorrow.toISOString().split('T')[0]
        });
      }
      
      return isDayAfterTomorrow;
    });

    return { discharges24h, discharges48h };
  }, [data.beds]);
};
