
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const TestPatientsInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Pacientes de Teste (21 Pacientes - 3 por Setor)
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
            <h5 className="font-semibold text-blue-700 mb-2">CLÍNICA CIRÚRGICA (3)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Luiza Fernandes (41 anos)</li>
              <li>• Roberto Machado (58 anos)</li>
              <li>• Marcela Rodrigues Silva (33 anos)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">UTI ADULTO (3)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Carmen Lúcia Pereira (65 anos)</li>
              <li>• José Antônio Silva (70 anos)</li>
              <li>• Francisco das Chagas Neto (76 anos)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">PEDIATRIA (3)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Gabriel Mendes (8 anos)</li>
              <li>• Sophia Rodrigues (12 anos)</li>
              <li>• Lucas Eduardo Campos (7 anos)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">UTI NEONATAL (3)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Miguel Nascimento (15 dias)</li>
              <li>• Isabella Santos (20 dias)</li>
              <li>• Arthur Silva Costa (5 dias)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">MATERNIDADE (3)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Juliana Cardoso (28 anos)</li>
              <li>• Camila Aparecida Souza (32 anos)</li>
              <li>• Roberta Cristina Lima (35 anos)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestPatientsInfo;
