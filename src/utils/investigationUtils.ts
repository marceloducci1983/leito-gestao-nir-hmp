
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
  
  // Gerar ID único consistente
  const uniqueId = `${alertType}_${normalizedName}_${normalizedDischargeDate}_${normalizedReadmissionDate}`;
  
  console.log('🔑 Gerando ID único para investigação:', {
    input: {
      patientName,
      dischargeDate,
      readmissionDate,
      alertType
    },
    normalized: {
      normalizedName,
      normalizedDischargeDate,
      normalizedReadmissionDate
    },
    output: uniqueId
  });
  
  return uniqueId;
};

// Validar dados de reinternação com verificações mais rigorosas
export const validateReadmissionData = (readmission: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!readmission) {
    errors.push('Dados de reinternação não encontrados');
    return { isValid: false, errors };
  }
  
  // Verificar nome do paciente
  if (!readmission.patient_name?.toString()?.trim()) {
    errors.push('Nome do paciente é obrigatório');
  }
  
  // Verificar data de alta
  if (!readmission.discharge_date?.toString()?.trim()) {
    errors.push('Data de alta é obrigatória');
  } else {
    // Verificar se a data é válida
    const dischargeDate = new Date(readmission.discharge_date);
    if (isNaN(dischargeDate.getTime())) {
      errors.push('Data de alta inválida');
    }
  }
  
  // Verificar data de reinternação
  if (!readmission.readmission_date?.toString()?.trim()) {
    errors.push('Data de reinternação é obrigatória');
  } else {
    // Verificar se a data é válida
    const readmissionDate = new Date(readmission.readmission_date);
    if (isNaN(readmissionDate.getTime())) {
      errors.push('Data de reinternação inválida');
    }
  }
  
  // Verificar dias entre internações
  if (readmission.days_between === undefined || readmission.days_between === null) {
    errors.push('Número de dias entre internações é obrigatório');
  } else if (readmission.days_between < 0) {
    errors.push('Número de dias entre internações deve ser positivo');
  } else if (readmission.days_between > 30) {
    errors.push('Reinternação deve ser em menos de 30 dias');
  }
  
  // Verificar dados opcionais mas úteis
  if (!readmission.diagnosis?.toString()?.trim()) {
    console.warn('⚠️ Diagnóstico não encontrado para paciente:', readmission.patient_name);
  }
  
  if (!readmission.origin_city?.toString()?.trim()) {
    console.warn('⚠️ Cidade de origem não encontrada para paciente:', readmission.patient_name);
  }
  
  const isValid = errors.length === 0;
  
  console.log('🔍 Validação de dados de reinternação:', {
    readmission: {
      patient_name: readmission.patient_name,
      discharge_date: readmission.discharge_date,
      readmission_date: readmission.readmission_date,
      days_between: readmission.days_between
    },
    validation: {
      isValid,
      errors
    }
  });
  
  return { isValid, errors };
};
