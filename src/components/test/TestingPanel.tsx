
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TestTube, RotateCcw, CheckCircle, XCircle, Users, Bed } from 'lucide-react';
import { runPatientAdmissionTest, clearTestData, TestingResults } from '@/utils/testDataHelper';
import { useToast } from '@/hooks/use-toast';

const TestingPanel: React.FC = () => {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [testResults, setTestResults] = useState<TestingResults | null>(null);
  const { toast } = useToast();

  const handleRunTest = async () => {
    setIsRunningTest(true);
    setTestResults(null);
    
    try {
      toast({
        title: "Iniciando teste",
        description: "Cadastrando 15 pacientes fictícios...",
      });

      const results = await runPatientAdmissionTest();
      setTestResults(results);

      if (results.success) {
        toast({
          title: "Teste concluído com sucesso!",
          description: `${results.successfulAdmissions} pacientes admitidos successfully`,
        });
      } else {
        toast({
          title: "Teste concluído com problemas",
          description: `${results.successfulAdmissions}/${results.totalPatients} pacientes admitidos`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      toast({
        title: "Erro no teste",
        description: "Falha ao executar o teste de admissão",
        variant: "destructive",
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const handleClearData = async () => {
    setIsClearingData(true);
    
    try {
      await clearTestData();
      setTestResults(null);
      
      toast({
        title: "Dados limpos",
        description: "Todos os pacientes de teste foram removidos",
      });
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast({
        title: "Erro ao limpar dados",
        description: "Falha ao remover pacientes de teste",
        variant: "destructive",
      });
    } finally {
      setIsClearingData(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do painel de teste */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            PAINEL DE TESTES - SISTEMA DE LEITOS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <TestTube className="h-4 w-4" />
            <AlertDescription>
              Este painel permite testar o sistema de admissão de pacientes cadastrando 15 pacientes fictícios 
              distribuídos em todos os departamentos do hospital.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button 
              onClick={handleRunTest} 
              disabled={isRunningTest || isClearingData}
              className="flex items-center gap-2"
            >
              {isRunningTest ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              {isRunningTest ? 'Executando Teste...' : 'Executar Teste'}
            </Button>

            <Button 
              onClick={handleClearData}
              variant="outline"
              disabled={isRunningTest || isClearingData}
              className="flex items-center gap-2"
            >
              {isClearingData ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              {isClearingData ? 'Limpando...' : 'Limpar Dados de Teste'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados do teste */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResults.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Resultados do Teste
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Resumo geral */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testResults.totalPatients}</div>
                <div className="text-sm text-gray-600">Total de Pacientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.successfulAdmissions}</div>
                <div className="text-sm text-gray-600">Admissões OK</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testResults.errors.length}</div>
                <div className="text-sm text-gray-600">Erros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{testResults.bedsUsed.length}</div>
                <div className="text-sm text-gray-600">Leitos Ocupados</div>
              </div>
            </div>

            {/* Status geral */}
            <div className="flex justify-center">
              <Badge 
                variant={testResults.success ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {testResults.success ? '✅ TESTE APROVADO' : '❌ TESTE COM PROBLEMAS'}
              </Badge>
            </div>

            {/* Leitos utilizados */}
            {testResults.bedsUsed.length > 0 && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Bed className="h-4 w-4" />
                  Leitos Ocupados Durante o Teste
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {testResults.bedsUsed.map((bed, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-blue-50">
                      <div className="font-medium text-sm">{bed.patientName}</div>
                      <div className="text-xs text-gray-600">
                        {bed.bedName} - {bed.department}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Erros encontrados */}
            {testResults.errors.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                  <XCircle className="h-4 w-4" />
                  Erros Encontrados
                </h4>
                <div className="space-y-2">
                  {testResults.errors.map((error, index) => (
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
      )}

      {/* Informações sobre o teste */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pacientes de Teste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">CLÍNICA MÉDICA (3)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Maria Silva Santos (67 anos)</li>
                <li>• João Carlos Oliveira (45 anos)</li>
                <li>• Ana Paula Costa (72 anos)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">PRONTO SOCORRO (3)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Carlos Roberto Lima (38 anos)</li>
                <li>• Francisca Alves (55 anos)</li>
                <li>• Pedro Henrique Santos (29 anos)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">CLÍNICA CIRÚRGICA (2)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Luiza Fernandes (41 anos)</li>
                <li>• Roberto Machado (58 anos)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">UTI ADULTO (2)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Carmen Lúcia Pereira (65 anos)</li>
                <li>• José Antônio Silva (70 anos)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">PEDIATRIA (2)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Gabriel Mendes (8 anos)</li>
                <li>• Sophia Rodrigues (12 anos)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">UTI NEONATAL (2)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Miguel Nascimento (15 dias)</li>
                <li>• Isabella Santos (20 dias)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">MATERNIDADE (1)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Juliana Cardoso (28 anos)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingPanel;
