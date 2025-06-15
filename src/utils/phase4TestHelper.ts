
import { supabase } from '@/integrations/supabase/client';

export interface Phase4TestResults {
  success: boolean;
  discharges24h: number;
  discharges48h: number;
  expectedDischarges24h: number;
  expectedDischarges48h: number;
  datesAdjusted: Array<{
    patientName: string;
    oldDate: string;
    newDate: string;
  }>;
  errors: Array<{
    patientName: string;
    error: string;
  }>;
}

export const executePhase4DateAdjustments = async (): Promise<Phase4TestResults> => {
  console.log('🗓️ INICIANDO FASE 4 - AJUSTE DE DATAS PARA ALTAS PREVISTAS...');
  
  const results: Phase4TestResults = {
    success: false,
    discharges24h: 0,
    discharges48h: 0,
    expectedDischarges24h: 3,
    expectedDischarges48h: 4,
    datesAdjusted: [],
    errors: []
  };

  try {
    // Data de hoje e amanhã no formato YYYY-MM-DD
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    console.log(`📅 Datas alvo: Hoje=${todayStr}, Amanhã=${tomorrowStr}`);

    // Ajustes específicos para FASE 4
    const dateAdjustments = [
      {
        patientName: 'Carlos Roberto Lima',
        newDate: todayStr, // Mover para hoje (24h)
        originalDate: '2025-06-18'
      },
      {
        patientName: 'Roberto Machado',
        newDate: tomorrowStr, // Mover para amanhã (24h)
        originalDate: '2025-06-18'
      }
    ];

    // Executar ajustes de data
    for (const adjustment of dateAdjustments) {
      try {
        console.log(`🔄 Ajustando data de ${adjustment.patientName}...`);

        // Buscar paciente pelo nome
        const { data: patients, error: searchError } = await supabase
          .from('patients')
          .select('id, name, expected_discharge_date')
          .ilike('name', `%${adjustment.patientName}%`)
          .limit(1);

        if (searchError) {
          throw new Error(`Erro ao buscar paciente: ${searchError.message}`);
        }

        if (!patients || patients.length === 0) {
          results.errors.push({
            patientName: adjustment.patientName,
            error: 'Paciente não encontrado'
          });
          continue;
        }

        const patient = patients[0];
        const oldDate = patient.expected_discharge_date;

        // Atualizar data de alta prevista
        const { error: updateError } = await supabase
          .from('patients')
          .update({
            expected_discharge_date: adjustment.newDate
          })
          .eq('id', patient.id);

        if (updateError) {
          throw new Error(`Erro ao atualizar data: ${updateError.message}`);
        }

        // Registrar sucesso
        results.datesAdjusted.push({
          patientName: patient.name,
          oldDate: oldDate,
          newDate: adjustment.newDate
        });

        console.log(`✅ ${patient.name}: ${oldDate} → ${adjustment.newDate}`);

      } catch (error) {
        console.error(`❌ Erro ao ajustar ${adjustment.patientName}:`, error);
        results.errors.push({
          patientName: adjustment.patientName,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    // Verificar resultado final
    const { data: allPatients, error: finalCheckError } = await supabase
      .from('patients')
      .select('name, expected_discharge_date')
      .not('expected_discharge_date', 'is', null);

    if (finalCheckError) {
      console.error('Erro ao verificar resultado final:', finalCheckError);
    } else if (allPatients) {
      // Contar pacientes por período
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

      const patients24h = allPatients.filter(p => 
        p.expected_discharge_date === todayStr || 
        p.expected_discharge_date === tomorrowStr
      );

      const patients48h = allPatients.filter(p => 
        p.expected_discharge_date === dayAfterTomorrowStr
      );

      results.discharges24h = patients24h.length;
      results.discharges48h = patients48h.length;

      console.log(`📊 RESULTADO FINAL:`);
      console.log(`   • Altas 24h: ${results.discharges24h} pacientes (meta: ${results.expectedDischarges24h})`);
      console.log(`   • Altas 48h: ${results.discharges48h} pacientes (meta: ${results.expectedDischarges48h})`);

      // Verificar se atingiu as metas
      results.success = (
        results.discharges24h >= results.expectedDischarges24h &&
        results.discharges48h >= results.expectedDischarges48h &&
        results.datesAdjusted.length > 0
      );
    }

    if (results.success) {
      console.log('🎉 FASE 4 CONFIGURADA COM SUCESSO!');
    } else {
      console.log('⚠️ FASE 4 configurada, mas não atingiu todas as metas');
    }

    return results;

  } catch (error) {
    console.error('❌ ERRO CRÍTICO NA FASE 4:', error);
    results.errors.push({
      patientName: 'SISTEMA',
      error: error instanceof Error ? error.message : 'Erro crítico desconhecido'
    });
    return results;
  }
};

export const executePhase4Tests = async (): Promise<Phase4TestResults> => {
  console.log('🚀 EXECUTANDO FASE 4 COMPLETA - TESTE DE ALTAS PREVISTAS');
  
  try {
    // Primeiro, ajustar as datas
    const results = await executePhase4DateAdjustments();
    
    if (results.success) {
      console.log('✅ FASE 4 executada com sucesso!');
      console.log('📋 Próximos passos:');
      console.log('   1. Acesse a aba "ALTAS PREVISTAS"');
      console.log('   2. Verifique: "Altas 24h (3 pacientes)" e "Altas 48h (4 pacientes)"');
      console.log('   3. Teste filtros e busca');
      console.log('   4. Verifique cores (laranja para 24h, azul para 48h)');
      console.log('   5. Teste sincronização em tempo real');
      console.log('   6. Teste função de impressão');
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ ERRO NA FASE 4:', error);
    throw error;
  }
};
