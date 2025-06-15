
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowRightLeft, Database } from 'lucide-react';

interface Phase2TestHeaderProps {
  isRunningTest: boolean;
  onRunTest: () => void;
}

const Phase2TestHeader: React.FC<Phase2TestHeaderProps> = ({
  isRunningTest,
  onRunTest
}) => {
  return (
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
            onClick={onRunTest} 
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
  );
};

export default Phase2TestHeader;
