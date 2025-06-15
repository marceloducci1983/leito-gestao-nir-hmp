
import React, { useState } from 'react';
import { executePhase2Tests, Phase2TestResults } from '@/utils/transferAndDischargeTestHelper';
import { useToast } from '@/hooks/use-toast';
import Phase2TestHeader from './phase2/Phase2TestHeader';
import Phase2GeneralSummary from './phase2/Phase2GeneralSummary';
import TransferResultsCard from './phase2/TransferResultsCard';
import DischargeResultsCard from './phase2/DischargeResultsCard';
import Phase2InfoCard from './phase2/Phase2InfoCard';

const Phase2TestingPanel: React.FC = () => {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<Phase2TestResults | null>(null);
  const { toast } = useToast();

  const handleRunPhase2Test = async () => {
    setIsRunningTest(true);
    setTestResults(null);
    
    try {
      toast({
        title: "Iniciando FASE 2",
        description: "Executando transferências e altas automáticas...",
      });

      const results = await executePhase2Tests();
      setTestResults(results);

      const totalSuccess = results.transferResults.successfulTransfers + results.dischargeResults.successfulDischarges;
      const totalAttempts = results.transferResults.totalTransfers + results.dischargeResults.totalDischarges;

      if (totalSuccess > 0) {
        toast({
          title: "FASE 2 concluída!",
          description: `${totalSuccess}/${totalAttempts} operações executadas com sucesso`,
        });
      } else {
        toast({
          title: "FASE 2 com problemas",
          description: "Nenhuma operação foi executada com sucesso",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro na FASE 2:', error);
      toast({
        title: "Erro na FASE 2",
        description: "Falha ao executar transferências e altas",
        variant: "destructive",
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <div className="space-y-6">
      <Phase2TestHeader 
        isRunningTest={isRunningTest}
        onRunTest={handleRunPhase2Test}
      />

      {testResults && (
        <div className="space-y-4">
          <Phase2GeneralSummary testResults={testResults} />
          <TransferResultsCard transferResults={testResults.transferResults} />
          <DischargeResultsCard dischargeResults={testResults.dischargeResults} />
        </div>
      )}

      <Phase2InfoCard />
    </div>
  );
};

export default Phase2TestingPanel;
