import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, TestTube } from 'lucide-react';
interface BedsPanelHeaderProps {
  totalBeds: number;
  occupiedBeds: number;
  onManageSectors: () => void;
  onCreateNewBed: () => void;
  onOpenTesting?: () => void;
}
const BedsPanelHeader: React.FC<BedsPanelHeaderProps> = ({
  totalBeds,
  occupiedBeds,
  onManageSectors,
  onCreateNewBed,
  onOpenTesting
}) => {
  const availableBeds = totalBeds - occupiedBeds;
  const occupationRate = totalBeds > 0 ? (occupiedBeds / totalBeds * 100).toFixed(1) : '0';
  return <div className="flex flex-col gap-4">
      {/* Estatísticas gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalBeds}</div>
          <div className="text-sm text-gray-600">Total de Leitos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{occupiedBeds}</div>
          <div className="text-sm text-gray-600">Ocupados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{availableBeds}</div>
          <div className="text-sm text-gray-600">Disponíveis</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{occupationRate}%</div>
          <div className="text-sm text-gray-600">Taxa de Ocupação</div>
        </div>
      </div>

      {/* Badges de status */}
      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="outline" className="bg-blue-50">
          {totalBeds} leitos totais
        </Badge>
        <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
          {occupiedBeds} ocupados
        </Badge>
        <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">
          {availableBeds} livres
        </Badge>
        <Badge variant="secondary">
          {occupationRate}% ocupação
        </Badge>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={onCreateNewBed} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Criar Novo Leito
        </Button>
        
        {onOpenTesting}
      </div>
    </div>;
};
export default BedsPanelHeader;