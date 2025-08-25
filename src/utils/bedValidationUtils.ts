// FASE 3: Utilitários para Validação e Manutenção de Leitos
import { supabase } from '@/integrations/supabase/client';

export interface BedIntegrityIssue {
  bed_name: string;
  department: string;
  patient_count: number;
  is_occupied: boolean;
  status_consistent: boolean;
  issue_type: 'DUPLICATE_PATIENTS' | 'STATUS_MISMATCH' | 'CRITICAL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const analyzeBedIntegrity = async (department?: string): Promise<BedIntegrityIssue[]> => {
  console.log('🔍 Analisando integridade dos leitos...');
  
  try {
    const { data: issues, error } = await supabase
      .rpc('check_bed_integrity');

    if (error) {
      console.error('❌ Erro ao analisar integridade:', error);
      throw new Error(`Erro ao verificar integridade: ${error.message}`);
    }

    if (!issues || issues.length === 0) {
      console.log('✅ Nenhum problema de integridade encontrado');
      return [];
    }

    const analyzedIssues: BedIntegrityIssue[] = issues.map((issue: any) => {
      let issueType: BedIntegrityIssue['issue_type'];
      let severity: BedIntegrityIssue['severity'];

      if (issue.patient_count > 1) {
        issueType = 'DUPLICATE_PATIENTS';
        severity = 'CRITICAL';
      } else if (!issue.status_consistent) {
        issueType = 'STATUS_MISMATCH';
        severity = 'HIGH';
      } else {
        issueType = 'CRITICAL';
        severity = 'CRITICAL';
      }

      return {
        bed_name: issue.bed_name,
        department: issue.department,
        patient_count: issue.patient_count,
        is_occupied: issue.is_occupied,
        status_consistent: issue.status_consistent,
        issue_type: issueType,
        severity
      };
    });

    console.log(`⚠️ Encontrados ${analyzedIssues.length} problemas de integridade`);
    return analyzedIssues;

  } catch (error) {
    console.error('❌ Erro na análise de integridade:', error);
    throw error;
  }
};

export const generateIntegrityReport = async (department?: string): Promise<string> => {
  const issues = await analyzeBedIntegrity(department);
  
  if (issues.length === 0) {
    return '✅ RELATÓRIO DE INTEGRIDADE: Todos os leitos estão íntegros.';
  }

  const criticalIssues = issues.filter(i => i.severity === 'CRITICAL');
  const highIssues = issues.filter(i => i.severity === 'HIGH');
  
  let report = `📊 RELATÓRIO DE INTEGRIDADE - ${new Date().toLocaleString()}\n\n`;
  
  if (criticalIssues.length > 0) {
    report += `🚨 PROBLEMAS CRÍTICOS (${criticalIssues.length}):\n`;
    criticalIssues.forEach(issue => {
      report += `- ${issue.bed_name} (${issue.department}): ${issue.patient_count} pacientes\n`;
    });
    report += '\n';
  }
  
  if (highIssues.length > 0) {
    report += `⚠️ PROBLEMAS DE ALTO RISCO (${highIssues.length}):\n`;
    highIssues.forEach(issue => {
      report += `- ${issue.bed_name} (${issue.department}): Status inconsistente\n`;
    });
    report += '\n';
  }
  
  report += `📈 RESUMO:\n`;
  report += `- Total de problemas: ${issues.length}\n`;
  report += `- Críticos: ${criticalIssues.length}\n`;
  report += `- Alto risco: ${highIssues.length}\n`;
  
  return report;
};

export const validatePatientAdmission = async (bedId: string, patientData: any): Promise<void> => {
  console.log('🔍 Validando admissão de paciente...');
  
  // Verificar se leito existe
  const { data: bed, error: bedError } = await supabase
    .from('beds')
    .select('id, name, is_occupied, is_reserved')
    .eq('id', bedId)
    .single();

  if (bedError || !bed) {
    throw new Error('Leito não encontrado');
  }

  // Verificar se leito está livre
  if (bed.is_occupied) {
    throw new Error(`Leito ${bed.name} já está ocupado`);
  }

  // Verificar se há pacientes no leito
  const { data: existingPatients, error: patientsError } = await supabase
    .from('patients')
    .select('id, name')
    .eq('bed_id', bedId);

  if (patientsError) {
    throw new Error('Erro ao verificar ocupação do leito');
  }

  if (existingPatients && existingPatients.length > 0) {
    const names = existingPatients.map(p => p.name).join(', ');
    throw new Error(`Leito ocupado por: ${names}`);
  }

  // Validar dados obrigatórios do paciente
  const requiredFields = ['name', 'sex', 'birthDate', 'diagnosis', 'department'];
  for (const field of requiredFields) {
    if (!patientData[field]) {
      throw new Error(`Campo obrigatório não preenchido: ${field}`);
    }
  }

  console.log('✅ Validação de admissão aprovada');
};

export const logBedOperation = async (operation: string, bedId: string, details: any) => {
  console.log(`📝 LOG: ${operation}`, {
    bedId,
    timestamp: new Date().toISOString(),
    details
  });
  
  // Em um sistema real, isso seria enviado para um serviço de logging
  // Por enquanto, apenas logar no console
};