
import { executeTransferTests } from './tests/transferTestUtils';
import { executeDischargeTests } from './tests/dischargeTestUtils';
import { checkHistoricalDataIntegrity } from './tests/dataIntegrityUtils';
import type { Phase2TestResults } from './tests/phase2TestTypes';

// Re-export types for backward compatibility
export type { TransferTestResults } from './tests/transferTestUtils';
export type { DischargeTestResults } from './tests/dischargeTestUtils';
export type { Phase2TestResults } from './tests/phase2TestTypes';

// Re-export functions for backward compatibility
export { executeTransferTests } from './tests/transferTestUtils';
export { executeDischargeTests } from './tests/dischargeTestUtils';
export { checkHistoricalDataIntegrity } from './tests/dataIntegrityUtils';

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
