
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

// Função que aplica conversão de timezone (para datas com hora)
export const formatDate = (dateString: string | Date): string => {
  return formatDateSaoPaulo(dateString);
};

// Nova função para formatar apenas datas (sem conversão de timezone)
export const formatDateOnly = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  try {
    let date: Date;
    
    if (typeof dateString === 'string') {
      // Se for uma string ISO (YYYY-MM-DD), criar Date local sem timezone
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day);
      } else if (dateString.includes('T') || dateString.includes('Z')) {
        date = new Date(dateString);
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
    
    // Formatar diretamente sem conversão de timezone
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date only:', error);
    return 'Data inválida';
  }
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

// Nova função para comparar datas ISO sem conversão de timezone
export const isSameDayISO = (date1: string | Date, date2: string | Date): boolean => {
  const getISODateString = (date: string | Date): string => {
    if (typeof date === 'string') {
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date; // Já está no formato ISO
      }
      // Converter outros formatos para ISO
      const parsed = new Date(date);
      return parsed.toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  };
  
  return getISODateString(date1) === getISODateString(date2);
};

// Função para calcular idade em dias (para UTI Neonatal e Pediatria)
export const calculateAgeInDays = (birthDate: string): number => {
  const parts = birthDate.split('/');
  if (parts.length !== 3) return 0;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return 0;
  
  const birth = new Date(year, month, day);
  const today = new Date();
  
  const timeDiff = today.getTime() - birth.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  return Math.max(0, daysDiff);
};

// Função para calcular idade em meses (para Pediatria)
export const calculateAgeInMonths = (birthDate: string): number => {
  const parts = birthDate.split('/');
  if (parts.length !== 3) return 0;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return 0;
  
  const birth = new Date(year, month, day);
  const today = new Date();
  
  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months += today.getMonth() - birth.getMonth();
  
  // Ajustar se o dia ainda não chegou no mês atual
  if (today.getDate() < birth.getDate()) {
    months--;
  }
  
  return Math.max(0, months);
};

// Função para formatar idade apropriada baseada no departamento
export const formatAgeForDepartment = (birthDate: string, department: string): string => {
  if (!birthDate || !isValidDate(birthDate)) return '';
  
  const ageInYears = calculateAge(birthDate);
  const ageInMonths = calculateAgeInMonths(birthDate);
  const ageInDays = calculateAgeInDays(birthDate);
  
  // Para UTI NEONATAL - usar dias se menos de 30 dias, senão meses se menos de 24 meses
  if (department === 'UTI NEONATAL') {
    if (ageInDays <= 30) {
      return `${ageInDays} dia${ageInDays !== 1 ? 's' : ''}`;
    } else if (ageInMonths < 24) {
      return `${ageInMonths} m${ageInMonths !== 1 ? 'eses' : 'ês'}`;
    } else {
      return `${ageInYears} ano${ageInYears !== 1 ? 's' : ''}`;
    }
  }
  
  // Para PEDIATRIA - usar dias se menos de 30 dias, meses se menos de 24 meses, senão anos
  if (department === 'PEDIATRIA') {
    if (ageInDays <= 30) {
      return `${ageInDays} dia${ageInDays !== 1 ? 's' : ''}`;
    } else if (ageInMonths < 24) {
      return `${ageInMonths} m${ageInMonths !== 1 ? 'eses' : 'ês'}`;
    } else {
      return `${ageInYears} ano${ageInYears !== 1 ? 's' : ''}`;
    }
  }
  
  // Para outros departamentos - usar apenas anos
  return `${ageInYears} ano${ageInYears !== 1 ? 's' : ''}`;
};
