
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DepartmentType = Database['public']['Enums']['department_type'];
type DischargeType = Database['public']['Enums']['discharge_type'];

export interface DischargeTestResults {
  success: boolean;
  totalDischarges: number;
  successfulDischarges: number;
  errors: Array<{
    patientName: string;
    error: string;
  }>;
  dischargesExecuted: Array<{
    patientName: string;
    department: string;
    bedName: string;
    dischargeType: string;
  }>;
}

export const executeDischargeTests = async (): Promise<DischargeTestResults> => {
  console.log('🏥 INICIANDO TESTES DE ALTA...');
  
  const results: DischargeTestResults = {
    success: false,
    totalDischarges: 3,
    successfulDischarges: 0,
    errors: [],
    dischargesExecuted: []
  };

  try {
    // Buscar pacientes para dar alta (priorizando departamentos específicos)
    const targetDepartments: DepartmentType[] = ['MATERNIDADE', 'PEDIATRIA', 'PRONTO SOCORRO'];
    
    const { data: patientsToDischarge, error: patientsError } = await supabase
      .from('patients')
      .select(`
        id,
        name,
        department,
        bed_id,
        admission_date,
        beds!inner (
          name
        )
      `)
      .in('department', targetDepartments)
      .limit(3);

    if (patientsError) {
      throw new Error(`Erro ao buscar pacientes: ${patientsError.message}`);
    }

    if (!patientsToDischarge || patientsToDischarge.length === 0) {
      throw new Error('Nenhum paciente encontrado nos departamentos alvo para alta');
    }

    console.log(`👥 Encontrados ${patientsToDischarge.length} pacientes para alta`);

    const dischargeTypes: DischargeType[] = ['POR MELHORA', 'POR MELHORA', 'POR MELHORA'];

    // Executar altas
    for (let i = 0; i < patientsToDischarge.length; i++) {
      const patient = patientsToDischarge[i];
      const dischargeType = dischargeTypes[i];
      
      try {
        console.log(`🏥 Dando alta para ${patient.name} - ${dischargeType}`);

        // Calcular dias de internação
        const admissionDate = new Date(patient.admission_date);
        const dischargeDate = new Date();
        const actualStayDays = Math.ceil((dischargeDate.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));

        // Buscar dados completos do paciente
        const { data: fullPatient, error: fullPatientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patient.id)
          .single();

        if (fullPatientError) {
          throw new Error(`Erro ao buscar dados do paciente: ${fullPatientError.message}`);
        }

        // Inserir na tabela de altas com campos corretos conforme schema
        const { error: dischargeError } = await supabase
          .from('patient_discharges')
          .insert({
            patient_id: fullPatient.id,
            name: fullPatient.name,
            sex: fullPatient.sex,
            birth_date: fullPatient.birth_date,
            age: fullPatient.age,
            admission_date: fullPatient.admission_date,
            admission_time: fullPatient.admission_time,
            discharge_date: dischargeDate.toISOString().split('T')[0],
            expected_discharge_date: fullPatient.expected_discharge_date,
            diagnosis: fullPatient.diagnosis,
            specialty: fullPatient.specialty,
            origin_city: fullPatient.origin_city,
            occupation_days: fullPatient.occupation_days || 0,
            actual_stay_days: actualStayDays,
            is_tfd: fullPatient.is_tfd,
            tfd_type: fullPatient.tfd_type,
            department: fullPatient.department,
            discharge_type: dischargeType,
            bed_id: patient.beds?.name || patient.bed_id || 'N/A'
          });

        if (dischargeError) {
          throw new Error(`Erro ao registrar alta: ${dischargeError.message}`);
        }

        // Liberar leito
        const { error: bedError } = await supabase
          .from('beds')
          .update({ is_occupied: false })
          .eq('id', patient.bed_id);

        if (bedError) {
          throw new Error(`Erro ao liberar leito: ${bedError.message}`);
        }

        // Remover paciente da tabela ativa
        const { error: deleteError } = await supabase
          .from('patients')
          .delete()
          .eq('id', patient.id);

        if (deleteError) {
          throw new Error(`Erro ao remover paciente: ${deleteError.message}`);
        }

        // Registrar sucesso
        results.successfulDischarges++;
        results.dischargesExecuted.push({
          patientName: patient.name,
          department: patient.department,
          bedName: patient.beds?.name || 'N/A',
          dischargeType: dischargeType
        });

        console.log(`✅ ${patient.name} recebeu alta com sucesso`);

        // Delay para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Erro na alta de ${patient.name}:`, error);
        results.errors.push({
          patientName: patient.name,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    results.success = results.successfulDischarges > 0;
    console.log(`🎯 ALTAS CONCLUÍDAS: ${results.successfulDischarges}/${results.totalDischarges}`);

    return results;

  } catch (error) {
    console.error('❌ ERRO CRÍTICO NAS ALTAS:', error);
    results.errors.push({
      patientName: 'SISTEMA',
      error: error instanceof Error ? error.message : 'Erro crítico desconhecido'
    });
    return results;
  }
};
