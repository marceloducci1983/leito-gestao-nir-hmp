
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut } from 'lucide-react';
import type { DischargeTestResults } from '@/utils/tests/dischargeTestUtils';

interface DischargeResultsCardProps {
  dischargeResults: DischargeTestResults;
}

const DischargeResultsCard: React.FC<DischargeResultsCardProps> = ({ dischargeResults }) => {
  return (
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
            {dischargeResults.totalDischarges} altas planejadas
          </Badge>
          <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">
            {dischargeResults.successfulDischarges} executadas
          </Badge>
          {dischargeResults.errors.length > 0 && (
            <Badge variant="destructive">
              {dischargeResults.errors.length} erros
            </Badge>
          )}
        </div>

        {dischargeResults.dischargesExecuted.length > 0 && (
          <div>
            <h5 className="font-semibold mb-2">Altas Executadas:</h5>
            <div className="space-y-2">
              {dischargeResults.dischargesExecuted.map((discharge, index) => (
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

        {dischargeResults.errors.length > 0 && (
          <div>
            <h5 className="font-semibold text-red-600 mb-2">Erros nas Altas:</h5>
            <div className="space-y-2">
              {dischargeResults.errors.map((error, index) => (
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

export default DischargeResultsCard;
