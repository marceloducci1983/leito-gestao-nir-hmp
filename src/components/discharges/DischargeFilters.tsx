
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { DischargeFilters } from '@/types/discharges';
import { Department } from '@/types';

interface DischargeFiltersProps {
  filters: DischargeFilters;
  onFiltersChange: (filters: DischargeFilters) => void;
  departments: Department[];
}

const DischargeFiltersComponent: React.FC<DischargeFiltersProps> = ({
  filters,
  onFiltersChange,
  departments
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleDepartmentChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      department: value === 'all' ? undefined : value as Department 
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
      {/* Search */}
      <div className="flex items-center gap-2 min-w-[250px]">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar por nome, município ou diagnóstico..."
          value={filters.searchTerm || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Department Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select onValueChange={handleDepartmentChange} value={filters.department || 'all'}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os setores</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        {filters.sortOrder === 'desc' ? <SortDesc className="h-4 w-4 text-gray-500" /> : <SortAsc className="h-4 w-4 text-gray-500" />}
        <Select onValueChange={handleSortChange} value={`${filters.sortBy || 'expectedDischargeDate'}-${filters.sortOrder || 'asc'}`}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expectedDischargeDate-asc">DPA (Mais próximo)</SelectItem>
            <SelectItem value="expectedDischargeDate-desc">DPA (Mais distante)</SelectItem>
            <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
            <SelectItem value="department-asc">Setor (A-Z)</SelectItem>
            <SelectItem value="department-desc">Setor (Z-A)</SelectItem>
            <SelectItem value="originCity-asc">Município (A-Z)</SelectItem>
            <SelectItem value="originCity-desc">Município (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button onClick={clearFilters} variant="outline" size="sm">
        Limpar Filtros
      </Button>
    </div>
  );
};

export default DischargeFiltersComponent;
