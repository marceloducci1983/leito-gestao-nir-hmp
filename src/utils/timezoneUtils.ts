
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Fuso horário de São Paulo
const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo';

export const formatDateTimeSaoPaulo = (dateString: string | Date, formatString: string = 'dd/MM/yyyy HH:mm'): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    // Converter para fuso horário de São Paulo
    const saoPauloDate = new Date(date.toLocaleString("en-US", { timeZone: SAO_PAULO_TIMEZONE }));
    
    return format(saoPauloDate, formatString, { locale: ptBR });
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
  return new Date(now.toLocaleString("en-US", { timeZone: SAO_PAULO_TIMEZONE }));
};

export const getCurrentDateSaoPaulo = (): string => {
  const now = getCurrentDateTimeSaoPaulo();
  return format(now, 'yyyy-MM-dd');
};

export const getCurrentTimeSaoPaulo = (): string => {
  const now = getCurrentDateTimeSaoPaulo();
  return format(now, 'HH:mm');
};
