
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRightLeft } from 'lucide-react';
import type { TransferTestResults } from '@/utils/tests/transferTestUtils';

interface TransferResultsCardProps {
  transferResults: TransferTestResults;
}

const TransferResultsCard: React.FC<TransferResultsCardProps> = ({ transferResults }) => {
  return (
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
            {transferResults.totalTransfers} transferências planejadas
          </Badge>
          <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">
            {transferResults.successfulTransfers} executadas
          </Badge>
          {transferResults.errors.length > 0 && (
            <Badge variant="destructive">
              {transferResults.errors.length} erros
            </Badge>
          )}
        </div>

        {transferResults.transfersExecuted.length > 0 && (
          <div>
            <h5 className="font-semibold mb-2">Transferências Executadas:</h5>
            <div className="space-y-2">
              {transferResults.transfersExecuted.map((transfer, index) => (
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

        {transferResults.errors.length > 0 && (
          <div>
            <h5 className="font-semibold text-red-600 mb-2">Erros nas Transferências:</h5>
            <div className="space-y-2">
              {transferResults.errors.map((error, index) => (
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
  );
};

export default TransferResultsCard;
