
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import type { Phase2TestResults } from '@/utils/tests/phase2TestTypes';

interface Phase2GeneralSummaryProps {
  testResults: Phase2TestResults;
}

const Phase2GeneralSummary: React.FC<Phase2GeneralSummaryProps> = ({ testResults }) => {
  return (
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
  );
};

export default Phase2GeneralSummary;
