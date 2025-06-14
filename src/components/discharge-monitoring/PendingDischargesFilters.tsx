
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PendingDischargesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'oldest' | 'newest';
  onSortChange: (value: 'oldest' | 'newest') => void;
}

const PendingDischargesFilters: React.FC<PendingDischargesFiltersProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Buscar por nome, setor ou município..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="oldest">Mais antigo primeiro</SelectItem>
          <SelectItem value="newest">Mais recente primeiro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PendingDischargesFilters;
