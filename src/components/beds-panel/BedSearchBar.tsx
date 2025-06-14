
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

interface BedSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
  selectedDepartment: string;
}

const BedSearchBar: React.FC<BedSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  resultsCount,
  selectedDepartment
}) => {
  const { isMobile } = useResponsive();

  return (
    <div className={`${isMobile ? 'px-4' : ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por Nome do Paciente ou Número do Leito..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {searchTerm.trim() && (
        <div className="mt-2 text-sm text-gray-600">
          {resultsCount > 0 ? (
            `${resultsCount} resultado(s) encontrado(s) em ${selectedDepartment}`
          ) : (
            <span className="text-orange-600">Nenhum paciente ou leito encontrado.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BedSearchBar;
