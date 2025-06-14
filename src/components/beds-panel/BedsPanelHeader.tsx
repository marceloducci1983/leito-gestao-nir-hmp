
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Plus } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

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
  const { isMobile } = useResponsive();

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start sm:items-center ${isMobile ? 'px-4' : ''}`}>
      <h1 className={`text-2xl font-bold text-gray-900 ${isMobile ? 'mb-3' : ''}`}>Painel de Leitos</h1>
      
      <div className={`${isMobile ? 'w-full' : 'flex items-center gap-4'}`}>
        <div className="text-sm text-gray-600 mb-3 sm:mb-0">
          {occupiedBeds} / {totalBeds} leitos ocupados
        </div>
        
        {isMobile ? (
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onManageSectors} variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              GERENCIAR SETORES
            </Button>
            <Button onClick={onCreateNewBed} variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              CRIAR LEITO
            </Button>
          </div>
        ) : (
          <>
            <Button onClick={onManageSectors} variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              GERENCIAR SETORES
            </Button>
            <Button onClick={onCreateNewBed} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              CRIAR LEITO
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BedsPanelHeader;
