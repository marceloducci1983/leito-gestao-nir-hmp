
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { BedStatus } from './BedStatus';

interface BedHeaderProps {
  name: string;
  department: string;
  isOccupied: boolean;
  isReserved: boolean;
  isCustom?: boolean;
  onDeleteBed?: () => void;
}

export const BedHeader: React.FC<BedHeaderProps> = ({
  name,
  department,
  isOccupied,
  isReserved,
  isCustom,
  onDeleteBed
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este leito customizado?')) {
      onDeleteBed?.();
    }
  };

  return (
    <CardHeader className="pb-2">
      <CardTitle className="flex justify-between items-start text-sm">
        <div className="space-y-1">
          <span className="font-bold">{name}</span>
          <div className="text-xs text-gray-600 font-normal">{department}</div>
        </div>
        <div className="flex items-center gap-2">
          <BedStatus isOccupied={isOccupied} isReserved={isReserved} />
          {isCustom && onDeleteBed && !isOccupied && !isReserved && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteClick}
              title="Excluir leito customizado"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardTitle>
    </CardHeader>
  );
};
