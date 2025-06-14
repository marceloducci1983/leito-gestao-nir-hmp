
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ArchivePanelHeaderProps {
  filteredCount: number;
  totalCount: number;
}

const ArchivePanelHeader: React.FC<ArchivePanelHeaderProps> = ({ 
  filteredCount, 
  totalCount 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">ARQUIVO DE PACIENTES</h2>
      <Badge variant="secondary" className="text-lg px-3 py-1">
        {filteredCount} de {totalCount} registros
      </Badge>
    </div>
  );
};

export default ArchivePanelHeader;
