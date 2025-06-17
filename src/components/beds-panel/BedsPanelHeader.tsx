
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

interface BedsPanelHeaderProps {
  totalBeds: number;
  occupiedBeds: number;
  onManageSectors: () => void;
  onCreateNewBed: () => void;
}

const BedsPanelHeader: React.FC<BedsPanelHeaderProps> = ({
  totalBeds,
  occupiedBeds,
  onManageSectors,
  onCreateNewBed
}) => {
  const availableBeds = totalBeds - occupiedBeds;
  const occupationRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Gerenciamento de Leitos</span>
          <div className="flex gap-2">
            <Button onClick={onManageSectors} variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              GERENCIAR SETORES
            </Button>
            <Button onClick={onCreateNewBed} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              CRIAR NOVO LEITO
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalBeds}</div>
            <div className="text-sm text-blue-600">Total de Leitos</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{availableBeds}</div>
            <div className="text-sm text-green-600">Leitos Disponíveis</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{occupiedBeds}</div>
            <div className="text-sm text-red-600">Leitos Ocupados</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{occupationRate}%</div>
            <div className="text-sm text-purple-600">Taxa de Ocupação</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BedsPanelHeader;
