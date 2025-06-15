
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowRightLeft, LogOut, Database, CheckCircle, XCircle, Clock } from 'lucide-react';
import { executePhase2Tests, Phase2TestResults } from '@/utils/transferAndDischargeTestHelper';
import { useToast } from '@/hooks/use-toast';

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
      {/* Header da FASE 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            FASE 2 - TESTE DE TRANSFERÊNCIAS E ALTAS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              Esta fase executa 5 transferências entre setores diferentes e 3 altas de pacientes,
              verificando se as movimentações atualizam automaticamente o painel e se os dados históricos são mantidos.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button 
              onClick={handleRunPhase2Test} 
              disabled={isRunningTest}
              className="flex items-center gap-2"
            >
              {isRunningTest ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRightLeft className="h-4 w-4" />
              )}
              {isRunningTest ? 'Executando FASE 2...' : 'Executar FASE 2'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados dos testes */}
      {testResults && (
        <div className="space-y-4">
          {/* Resumo geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Resumo Geral da FASE 2
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.transferResults.successfulTransfers}
                  </div>
                  <div className="text-sm text-gray-600">Transferências OK</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.dischargeResults.successfulDischarges}
                  </div>
                  <div className="text-sm text-gray-600">Altas OK</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {testResults.historicalDataCheck.transfersInHistory}
                  </div>
                  <div className="text-sm text-gray-600">Transferências Históricas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {testResults.historicalDataCheck.dischargesInHistory}
                  </div>
                  <div className="text-sm text-gray-600">Altas Históricas</div>
                </div>
              </div>

              <div className="flex justify-center">
                <Badge 
                  variant={testResults.historicalDataCheck.dataIntegrityPassed ? "default" : "destructive"}
                  className="text-lg px-4 py-2"
                >
                  {testResults.historicalDataCheck.dataIntegrityPassed ? 
                    '✅ INTEGRIDADE DE DADOS OK' : 
                    '❌ PROBLEMAS NA INTEGRIDADE'
                  }
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Resultados das transferências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Resultados das Transferências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50">
                  {testResults.transferResults.totalTransfers} transferências planejadas
                </Badge>
                <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">
                  {testResults.transferResults.successfulTransfers} executadas
                </Badge>
                {testResults.transferResults.errors.length > 0 && (
                  <Badge variant="destructive">
                    {testResults.transferResults.errors.length} erros
                  </Badge>
                )}
              </div>

              {testResults.transferResults.transfersExecuted.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">Transferências Executadas:</h5>
                  <div className="space-y-2">
                    {testResults.transferResults.transfersExecuted.map((transfer, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-green-50">
                        <div className="font-medium text-sm">{transfer.patientName}</div>
                        <div className="text-xs text-gray-600">
                          {transfer.fromDepartment} ({transfer.fromBed}) → {transfer.toDepartment} ({transfer.toBed})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {testResults.transferResults.errors.length > 0 && (
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Erros nas Transferências:</h5>
                  <div className="space-y-2">
                    {testResults.transferResults.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertDescription>
                          <strong>{error.patientName}:</strong> {error.error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resultados das altas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Resultados das Altas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50">
                  {testResults.dischargeResults.totalDischarges} altas planejadas
                </Badge>
                <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">
                  {testResults.dischargeResults.successfulDischarges} executadas
                </Badge>
                {testResults.dischargeResults.errors.length > 0 && (
                  <Badge variant="destructive">
                    {testResults.dischargeResults.errors.length} erros
                  </Badge>
                )}
              </div>

              {testResults.dischargeResults.dischargesExecuted.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">Altas Executadas:</h5>
                  <div className="space-y-2">
                    {testResults.dischargeResults.dischargesExecuted.map((discharge, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-green-50">
                        <div className="font-medium text-sm">{discharge.patientName}</div>
                        <div className="text-xs text-gray-600">
                          {discharge.department} - Leito {discharge.bedName} - {discharge.dischargeType}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {testResults.dischargeResults.errors.length > 0 && (
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Erros nas Altas:</h5>
                  <div className="space-y-2">
                    {testResults.dischargeResults.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertDescription>
                          <strong>{error.patientName}:</strong> {error.error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Informações sobre a FASE 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Sobre a FASE 2
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">Transferências Planejadas:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• CLÍNICA MÉDICA → UTI ADULTO</li>
                <li>• PRONTO SOCORRO → CLÍNICA MÉDICA</li>
                <li>• CLÍNICA CIRÚRGICA → CLÍNICA MÉDICA</li>
                <li>• PEDIATRIA → CLÍNICA MÉDICA</li>
                <li>• UTI ADULTO → CLÍNICA MÉDICA</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-green-700 mb-2">Verificações Realizadas:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• ✅ Atualização automática do painel</li>
                <li>• ✅ Liberação de leitos de origem</li>
                <li>• ✅ Ocupação de leitos de destino</li>
                <li>• ✅ Registro de histórico de transferências</li>
                <li>• ✅ Integridade dos dados no banco</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase2TestingPanel;
