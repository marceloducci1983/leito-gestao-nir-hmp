
import { formatDateTimeSaoPaulo, formatDateSaoPaulo } from './timezoneUtils';

export const calculateAge = (birthDate: string): number => {
  // Parse date in DD/MM/YYYY format
  const parts = birthDate.split('/');
  if (parts.length !== 3) return 0;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return 0;
  
  const birth = new Date(year, month, day);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const isValidDate = (dateString: string): boolean => {
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
};

export const convertDateToISO = (dateString: string): string => {
  // Convert DD/MM/YYYY to YYYY-MM-DD
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2];
  
  return `${year}-${month}-${day}`;
};

export const convertISOToDisplayDate = (isoDate: string): string => {
  // Convert YYYY-MM-DD to DD/MM/YYYY using São Paulo timezone
  if (!isoDate) return '';
  
  return formatDateSaoPaulo(isoDate);
};

// Função para formatar data e hora no fuso horário de São Paulo
export const formatDateTime = (dateString: string | Date): string => {
  return formatDateTimeSaoPaulo(dateString);
};

export const formatDate = (dateString: string | Date): string => {
  return formatDateSaoPaulo(dateString);
};

// Nova função para comparar apenas datas (ignorando horas) usando ISO strings
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
};

// Nova função para verificar se uma data está entre hoje e N dias à frente
export const isWithinDays = (date: Date | string, days: number): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const futureDate = new Date();
  
  // Resetar horas para comparar apenas datas
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  futureDate.setHours(0, 0, 0, 0);
  
  // Definir data futura
  futureDate.setDate(today.getDate() + days);
  
  // Verificar se a data está no intervalo (inclusivo)
  return checkDate >= today && checkDate <= futureDate;
};
