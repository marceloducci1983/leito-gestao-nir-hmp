
// Utilitário para gerar IDs únicos consistentes para investigações
export const generateInvestigationId = (
  patientName: string,
  dischargeDate: string,
  readmissionDate: string,
  alertType: 'long_stay' | 'readmission_30_days' = 'readmission_30_days'
): string => {
  // Normalizar o nome do paciente
  const normalizedName = patientName
    ?.toString()
    ?.trim()
    ?.replace(/\s+/g, '_')
    ?.toLowerCase() || 'unknown';
  
  // Normalizar as datas (remover espaços e caracteres especiais)
  const normalizedDischargeDate = dischargeDate
    ?.toString()
    ?.trim()
    ?.replace(/[^\d-/]/g, '') || '';
  
  const normalizedReadmissionDate = readmissionDate
    ?.toString()
    ?.trim()
    ?.replace(/[^\d-/]/g, '') || '';
  
  // Gerar ID único
  const uniqueId = `${alertType}_${normalizedName}_${normalizedDischargeDate}_${normalizedReadmissionDate}`;
  
  console.log('Gerando ID único:', {
    patientName,
    dischargeDate,
    readmissionDate,
    normalizedName,
    normalizedDischargeDate,
    normalizedReadmissionDate,
    uniqueId
  });
  
  return uniqueId;
};

// Validar dados de reinternação
export const validateReadmissionData = (readmission: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!readmission) {
    errors.push('Dados de reinternação não encontrados');
    return { isValid: false, errors };
  }
  
  if (!readmission.patient_name?.toString()?.trim()) {
    errors.push('Nome do paciente é obrigatório');
  }
  
  if (!readmission.discharge_date?.toString()?.trim()) {
    errors.push('Data de alta é obrigatória');
  }
  
  if (!readmission.readmission_date?.toString()?.trim()) {
    errors.push('Data de reinternação é obrigatória');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
