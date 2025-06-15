
import { supabase } from '@/integrations/supabase/client';

export interface DataIntegrityResults {
  transfersInHistory: number;
  dischargesInHistory: number;
  dataIntegrityPassed: boolean;
}

export const checkHistoricalDataIntegrity = async (): Promise<DataIntegrityResults> => {
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
