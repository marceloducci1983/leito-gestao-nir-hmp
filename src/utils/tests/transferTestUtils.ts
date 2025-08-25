
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DepartmentType = Database['public']['Enums']['department_type'];

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
      
      if (!patientBed || !patientBed.patients || !Array.isArray(patientBed.patients) || patientBed.patients.length === 0) {
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
