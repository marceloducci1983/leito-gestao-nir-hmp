
import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

// Fuso horário de São Paulo
const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo';

export const formatDateTimeSaoPaulo = (dateString: string | Date, formatString: string = 'dd/MM/yyyy HH:mm'): string => {
  try {
    let date: Date;
    
    if (typeof dateString === 'string') {
      // Se for uma string ISO, parse primeiro
      if (dateString.includes('T') || dateString.includes('Z')) {
        date = parseISO(dateString);
      } else {
        // Se for uma data em formato DD/MM/YYYY, converter para Date
        const parts = dateString.split('/');
        if (parts.length === 3) {
          date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        } else {
          date = new Date(dateString);
        }
      }
    } else {
      date = dateString;
    }
    
    // Converter para fuso horário de São Paulo
    const saoPauloDate = toZonedTime(date, SAO_PAULO_TIMEZONE);
    
    return format(saoPauloDate, formatString, { 
      locale: ptBR
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
};

export const formatDateSaoPaulo = (dateString: string | Date): string => {
  return formatDateTimeSaoPaulo(dateString, 'dd/MM/yyyy');
};

export const formatTimeSaoPaulo = (dateString: string | Date): string => {
  return formatDateTimeSaoPaulo(dateString, 'HH:mm');
};

export const formatDateTimeFullSaoPaulo = (dateString: string | Date): string => {
  return formatDateTimeSaoPaulo(dateString, 'dd/MM/yyyy HH:mm:ss');
};

export const getCurrentDateTimeSaoPaulo = (): Date => {
  const now = new Date();
  return toZonedTime(now, SAO_PAULO_TIMEZONE);
};

export const getCurrentDateSaoPaulo = (): string => {
  const now = getCurrentDateTimeSaoPaulo();
  return format(now, 'yyyy-MM-dd');
};

export const getCurrentTimeSaoPaulo = (): string => {
  const now = getCurrentDateTimeSaoPaulo();
  return format(now, 'HH:mm');
};

// Função para comparar datas considerando apenas o dia (sem hora)
export const isSameDaySaoPaulo = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = toZonedTime(typeof date1 === 'string' ? new Date(date1) : date1, SAO_PAULO_TIMEZONE);
  const d2 = toZonedTime(typeof date2 === 'string' ? new Date(date2) : date2, SAO_PAULO_TIMEZONE);
  
  return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
};

// Função para verificar se uma data está dentro de um período (inclusivo)
export const isDateWithinPeriodSaoPaulo = (date: Date | string, startDate: Date | string, endDate: Date | string): boolean => {
  const targetDate = toZonedTime(typeof date === 'string' ? new Date(date) : date, SAO_PAULO_TIMEZONE);
  const start = toZonedTime(typeof startDate === 'string' ? new Date(startDate) : startDate, SAO_PAULO_TIMEZONE);
  const end = toZonedTime(typeof endDate === 'string' ? new Date(endDate) : endDate, SAO_PAULO_TIMEZONE);
  
  // Normalizar para início e fim do dia para comparação correta
  const targetDay = format(targetDate, 'yyyy-MM-dd');
  const startDay = format(start, 'yyyy-MM-dd');
  const endDay = format(end, 'yyyy-MM-dd');
  
  return targetDay >= startDay && targetDay <= endDay;
};
