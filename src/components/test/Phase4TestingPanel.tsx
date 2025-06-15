
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { executePhase4Tests, Phase4TestResults } from '@/utils/phase4TestHelper';
import { useToast } from '@/hooks/use-toast';

const Phase4TestingPanel: React.FC = () => {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<Phase4TestResults | null>(null);
  const { toast } = useToast();

  const handleRunPhase4Test = async () => {
    setIsRunningTest(true);
    setTestResults(null);
    
    try {
      toast({
        title: "Iniciando FASE 4",
        description: "Ajustando datas para teste de altas previstas...",
      });

      const results = await executePhase4Tests();
      setTestResults(results);

      if (results.success) {
        toast({
          title: "FASE 4 configurada com sucesso!",
          description: `${results.discharges24h} pacientes 24h, ${results.discharges48h} pacientes 48h`,
        });
      } else {
        toast({
          title: "FASE 4 com problemas",
          description: "Nem todas as metas foram atingidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro na FASE 4:', error);
      toast({
        title: "Erro na FASE 4",
        description: "Falha ao configurar teste de altas previstas",
        variant: "destructive",
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da FASE 4 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            FASE 4 - TESTE DE ALTAS PREVISTAS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Esta fase ajusta as datas de alta prevista para criar o cenário ideal: 
              <strong> 3 pacientes para 24h</strong> e <strong>4 pacientes para 48h</strong>.
              Após a configuração, teste o painel "ALTAS PREVISTAS" para verificar funcionalidades.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">Ajustes Planejados:</h5>
              <ul className="text-sm space-y-1">
                <li>• <strong>Carlos Roberto Lima:</strong> 18/06 → HOJE (24h)</li>
                <li>• <strong>Roberto Machado:</strong> 18/06 → AMANHÃ (24h)</li>
                <li>• <strong>Manter outros pacientes</strong> para 48h</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-green-700 mb-2">Resultado Esperado:</h5>
              <ul className="text-sm space-y-1">
                <li>• <strong>Altas 24h:</strong> 3 pacientes (urgentes)</li>
                <li>• <strong>Altas 48h:</strong> 4 pacientes</li>
                <li>• <strong>Cores:</strong> Laranja (24h) / Azul (48h)</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleRunPhase4Test} 
              disabled={isRunningTest}
              className="flex items-center gap-2"
            >
              {isRunningTest ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              {isRunningTest ? 'Configurando FASE 4...' : 'Executar FASE 4'}
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
                {testResults.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Resultado da Configuração FASE 4
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {testResults.discharges24h}
                  </div>
                  <div className="text-sm text-gray-600">Altas 24h</div>
                  <div className="text-xs text-gray-500">Meta: {testResults.expectedDischarges24h}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.discharges48h}
                  </div>
                  <div className="text-sm text-gray-600">Altas 48h</div>
                  <div className="text-xs text-gray-500">Meta: {testResults.expectedDischarges48h}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.datesAdjusted.length}
                  </div>
                  <div className="text-sm text-gray-600">Datas Ajustadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.errors.length}
                  </div>
                  <div className="text-sm text-gray-600">Erros</div>
                </div>
              </div>

              <div className="flex justify-center">
                <Badge 
                  variant={testResults.success ? "default" : "destructive"}
                  className="text-lg px-4 py-2"
                >
                  {testResults.success ? '✅ FASE 4 APROVADA' : '❌ FASE 4 COM PROBLEMAS'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Datas ajustadas */}
          {testResults.datesAdjusted.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Datas Ajustadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testResults.datesAdjusted.map((adjustment, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-green-50">
                      <div className="font-medium text-sm">{adjustment.patientName}</div>
                      <div className="text-xs text-gray-600">
                        {adjustment.oldDate} → {adjustment.newDate}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Erros encontrados */}
          {testResults.errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Erros Encontrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testResults.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription>
                        <strong>{error.patientName}:</strong> {error.error}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instruções para teste */}
          {testResults.success && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Próximos Passos - Teste Manual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <h6 className="font-semibold text-blue-800 mb-2">1. Acesse o painel "ALTAS PREVISTAS"</h6>
                    <p className="text-blue-700">Navegue até a aba correspondente no sistema principal</p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded border border-orange-200">
                    <h6 className="font-semibold text-orange-800 mb-2">2. Verifique os contadores</h6>
                    <p className="text-orange-700">Deve exibir: "Altas 24h (3 pacientes)" e "Altas 48h (4 pacientes)"</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <h6 className="font-semibold text-purple-800 mb-2">3. Teste as funcionalidades</h6>
                    <ul className="text-purple-700 space-y-1">
                      <li>• Cores: laranja para 24h (urgente), azul para 48h</li>
                      <li>• Filtros por departamento</li>
                      <li>• Busca por nome do paciente</li>
                      <li>• Sincronização automática</li>
                      <li>• Função de impressão</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <h6 className="font-semibold text-green-800 mb-2">4. Critérios de aprovação</h6>
                    <p className="text-green-700">Todos os itens acima funcionando corretamente = ✅ FASE 4 APROVADA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Phase4TestingPanel;
