
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BedStatusProps {
  isOccupied: boolean;
  isReserved: boolean;
}

export const BedStatus: React.FC<BedStatusProps> = ({ isOccupied, isReserved }) => {
  if (isOccupied) return <Badge variant="destructive">Ocupado</Badge>;
  if (isReserved) return <Badge className="bg-yellow-500">Reservado</Badge>;
  return <Badge className="bg-green-500">Disponível</Badge>;
};

export const getBedStatusColor = (isOccupied: boolean, isReserved: boolean) => {
  if (isOccupied) return 'bg-red-100 border-red-300';
  if (isReserved) return 'bg-yellow-100 border-yellow-300';
  return 'bg-green-100 border-green-300';
};
