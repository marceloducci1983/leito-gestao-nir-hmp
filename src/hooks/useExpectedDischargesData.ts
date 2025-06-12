
import { useMemo } from 'react';
import { addDays } from 'date-fns';
import { 
  getCurrentDateTimeSaoPaulo, 
  isSameDaySaoPaulo 
} from '@/utils/timezoneUtils';

interface ExpectedDischargesData {
  beds: any[];
  archivedPatients: any[];
  dischargeMonitoring: any[];
}

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

export const useExpectedDischargesData = (data: ExpectedDischargesData) => {
  return useMemo(() => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const dayAfterTomorrow = addDays(today, 2);

    // Resetar horas para comparar apenas datas
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    const occupiedBeds = data.beds.filter(bed => bed.isOccupied && bed.patient);
    
    console.log('Calculando altas previstas (corrigido):', {
      hoje: today.toISOString().split('T')[0],
      amanha: tomorrow.toISOString().split('T')[0],
      depoisAmanha: dayAfterTomorrow.toISOString().split('T')[0],
      totalPacientes: occupiedBeds.length
    });
    
    const discharges24h = occupiedBeds.filter(bed => {
      if (!bed.patient?.expectedDischargeDate) return false;
      
      // Usar data local sem conversão de timezone
      const expectedDischarge = createLocalDate(bed.patient.expectedDischargeDate);
      const isToday = isSameDayLocal(expectedDischarge, today);
      const isTomorrow = isSameDayLocal(expectedDischarge, tomorrow);
      const isWithin24h = isToday || isTomorrow;
      
      if (isWithin24h) {
        console.log('Paciente 24h (corrigido):', {
          nome: bed.patient.name,
          dpaOriginal: bed.patient.expectedDischargeDate,
          dpaLocal: expectedDischarge.toISOString().split('T')[0],
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
      
      // Usar data local sem conversão de timezone
      const expectedDischarge = createLocalDate(bed.patient.expectedDischargeDate);
      const isDayAfterTomorrow = isSameDayLocal(expectedDischarge, dayAfterTomorrow);
      
      if (isDayAfterTomorrow) {
        console.log('Paciente 48h (corrigido):', {
          nome: bed.patient.name,
          dpaOriginal: bed.patient.expectedDischargeDate,
          dpaLocal: expectedDischarge.toISOString().split('T')[0],
          depoisAmanha: dayAfterTomorrow.toISOString().split('T')[0]
        });
      }
      
      return isDayAfterTomorrow;
    });

    return { discharges24h, discharges48h };
  }, [data.beds]);
};
