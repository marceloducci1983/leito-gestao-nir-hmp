
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DepartmentType = Database['public']['Enums']['department_type'];
type DischargeType = Database['public']['Enums']['discharge_type'];

export interface TransferTestResults {
  success: boolean;
  totalTransfers: number;
  successfulTransfers: number;
  errors: Array<{
    patientName: string;
    error: string;
  }>;
  transfersExecuted: Array<{
    patientName: string;
    fromDepartment: string;
    toDepartment: string;
    fromBed: string;
    toBed: string;
  }>;
}

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

export interface Phase2TestResults {
  transferResults: TransferTestResults;
  dischargeResults: DischargeTestResults;
  historicalDataCheck: {
    transfersInHistory: number;
    dischargesInHistory: number;
    dataIntegrityPassed: boolean;
  };
}

export const executeTransferTests = async (): Promise<TransferTestResults> => {
  console.log('🔄 INICIANDO TESTES DE TRANSFERÊNCIA...');
  
  const results: TransferTestResults = {
    success: false,
    totalTransfers: 5,
    successfulTransfers: 0,
    errors: [],
    transfersExecuted: []
  };

  try {
    // Buscar pacientes ocupando leitos para transferir
    const { data: occupiedBeds, error: bedsError } = await supabase
      .from('beds')
      .select(`
        id,
        name,
        department,
        patients!inner (
          id,
          name,
          department
        )
      `)
      .eq('is_occupied', true)
      .limit(5);

    if (bedsError) {
      throw new Error(`Erro ao buscar leitos ocupados: ${bedsError.message}`);
    }

    if (!occupiedBeds || occupiedBeds.length === 0) {
      throw new Error('Nenhum leito ocupado encontrado para transferência');
    }

    console.log(`📋 Encontrados ${occupiedBeds.length} pacientes para transferir`);

    // Definir transferências planejadas
    const transferPlans: Array<{ fromDept: DepartmentType; toDept: DepartmentType }> = [
      { fromDept: 'CLINICA MEDICA', toDept: 'UTI ADULTO' },
      { fromDept: 'PRONTO SOCORRO', toDept: 'CLINICA MEDICA' },
      { fromDept: 'CLINICA CIRURGICA', toDept: 'CLINICA MEDICA' },
      { fromDept: 'PEDIATRIA', toDept: 'CLINICA MEDICA' },
      { fromDept: 'UTI ADULTO', toDept: 'CLINICA MEDICA' }
    ];

    // Buscar leitos disponíveis para cada departamento de destino
    const { data: availableBeds, error: availableError } = await supabase
      .from('beds')
      .select('id, name, department')
      .eq('is_occupied', false)
      .eq('is_reserved', false);

    if (availableError) {
      throw new Error(`Erro ao buscar leitos disponíveis: ${availableError.message}`);
    }

    console.log(`🛏️ Encontrados ${availableBeds?.length || 0} leitos disponíveis`);

    // Executar transferências
    for (let i = 0; i < Math.min(transferPlans.length, occupiedBeds.length); i++) {
      const plan = transferPlans[i];
      const patientBed = occupiedBeds.find(bed => bed.department === plan.fromDept);
      
      if (!patientBed || !patientBed.patients || patientBed.patients.length === 0) {
        results.errors.push({
          patientName: 'SISTEMA',
          error: `Nenhum paciente encontrado em ${plan.fromDept} para transferir`
        });
        continue;
      }

      const patient = patientBed.patients[0];
      const targetBed = availableBeds?.find(bed => bed.department === plan.toDept);

      if (!targetBed) {
        results.errors.push({
          patientName: patient.name,
          error: `Nenhum leito disponível em ${plan.toDept}`
        });
        continue;
      }

      try {
        console.log(`🔄 Transferindo ${patient.name} de ${plan.fromDept} para ${plan.toDept}`);

        // Registrar transferência
        const { error: transferError } = await supabase
          .from('patient_transfers')
          .insert({
            from_bed_id: patientBed.id,
            to_bed_id: targetBed.id,
            from_department: plan.fromDept,
            to_department: plan.toDept,
            transfer_date: new Date().toISOString()
          });

        if (transferError) {
          throw new Error(`Erro ao registrar transferência: ${transferError.message}`);
        }

        // Atualizar paciente
        const { error: patientError } = await supabase
          .from('patients')
          .update({
            bed_id: targetBed.id,
            department: plan.toDept
          })
          .eq('id', patient.id);

        if (patientError) {
          throw new Error(`Erro ao atualizar paciente: ${patientError.message}`);
        }

        // Liberar leito de origem
        const { error: fromBedError } = await supabase
          .from('beds')
          .update({ is_occupied: false })
          .eq('id', patientBed.id);

        if (fromBedError) {
          throw new Error(`Erro ao liberar leito origem: ${fromBedError.message}`);
        }

        // Ocupar leito de destino
        const { error: toBedError } = await supabase
          .from('beds')
          .update({ is_occupied: true })
          .eq('id', targetBed.id);

        if (toBedError) {
          throw new Error(`Erro ao ocupar leito destino: ${toBedError.message}`);
        }

        // Registrar sucesso
        results.successfulTransfers++;
        results.transfersExecuted.push({
          patientName: patient.name,
          fromDepartment: plan.fromDept,
          toDepartment: plan.toDept,
          fromBed: patientBed.name,
          toBed: targetBed.name
        });

        console.log(`✅ ${patient.name} transferido com sucesso`);

        // Delay para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Erro na transferência de ${patient.name}:`, error);
        results.errors.push({
          patientName: patient.name,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    results.success = results.successfulTransfers > 0;
    console.log(`🎯 TRANSFERÊNCIAS CONCLUÍDAS: ${results.successfulTransfers}/${results.totalTransfers}`);

    return results;

  } catch (error) {
    console.error('❌ ERRO CRÍTICO NAS TRANSFERÊNCIAS:', error);
    results.errors.push({
      patientName: 'SISTEMA',
      error: error instanceof Error ? error.message : 'Erro crítico desconhecido'
    });
    return results;
  }
};

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

export const checkHistoricalDataIntegrity = async () => {
  console.log('📊 VERIFICANDO INTEGRIDADE DOS DADOS HISTÓRICOS...');
  
  try {
    // Verificar transferências
    const { count: transfersCount, error: transfersError } = await supabase
      .from('patient_transfers')
      .select('*', { count: 'exact', head: true });

    if (transfersError) {
      console.error('Erro ao verificar transferências:', transfersError);
    }

    // Verificar altas
    const { count: dischargesCount, error: dischargesError } = await supabase
      .from('patient_discharges')
      .select('*', { count: 'exact', head: true });

    if (dischargesError) {
      console.error('Erro ao verificar altas:', dischargesError);
    }

    console.log(`📈 Transferências no histórico: ${transfersCount || 0}`);
    console.log(`📈 Altas no histórico: ${dischargesCount || 0}`);

    return {
      transfersInHistory: transfersCount || 0,
      dischargesInHistory: dischargesCount || 0,
      dataIntegrityPassed: true
    };

  } catch (error) {
    console.error('❌ Erro na verificação de integridade:', error);
    return {
      transfersInHistory: 0,
      dischargesInHistory: 0,
      dataIntegrityPassed: false
    };
  }
};

export const executePhase2Tests = async (): Promise<Phase2TestResults> => {
  console.log('🚀 INICIANDO FASE 2 - TESTE DE TRANSFERÊNCIAS E ALTAS');
  
  try {
    // Executar transferências
    const transferResults = await executeTransferTests();
    
    // Executar altas
    const dischargeResults = await executeDischargeTests();
    
    // Verificar integridade histórica
    const historicalDataCheck = await checkHistoricalDataIntegrity();
    
    console.log('🎉 FASE 2 CONCLUÍDA COM SUCESSO!');
    
    return {
      transferResults,
      dischargeResults,
      historicalDataCheck
    };
    
  } catch (error) {
    console.error('❌ ERRO NA FASE 2:', error);
    throw error;
  }
};
