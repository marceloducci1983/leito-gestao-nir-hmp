
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const Phase2InfoCard: React.FC = () => {
  return (
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
  );
};

export default Phase2InfoCard;
