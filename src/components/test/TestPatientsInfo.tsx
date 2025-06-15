
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const TestPatientsInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Pacientes de Teste da FASE 1
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
  );
};

export default TestPatientsInfo;
