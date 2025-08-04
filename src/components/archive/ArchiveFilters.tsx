import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortDesc, SortAsc } from 'lucide-react';

interface ArchiveFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (dept: string) => void;
  dischargeTypeFilter: string;
  setDischargeTypeFilter: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  departments: string[];
  dischargeTypes: string[];
  onClearFilters: () => void;
}

const ArchiveFilters: React.FC<ArchiveFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  dischargeTypeFilter,
  setDischargeTypeFilter,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  departments,
  dischargeTypes,
  onClearFilters
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Campo de busca principal */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, diagnóstico, cidade, leito ou data de nascimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          {/* Filtros avançados */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Departamento</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Departamentos</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Alta</label>
                <Select value={dischargeTypeFilter} onValueChange={setDischargeTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    {dischargeTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discharge_date_desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="h-4 w-4" />
                        Data Alta (Mais Recente)
                      </div>
                    </SelectItem>
                    <SelectItem value="discharge_date_asc">
                      <div className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4" />
                        Data Alta (Mais Antigo)
                      </div>
                    </SelectItem>
                    <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="age_desc">Idade (Maior)</SelectItem>
                    <SelectItem value="age_asc">Idade (Menor)</SelectItem>
                    <SelectItem value="birth_date_desc">Nascimento (Mais Recente)</SelectItem>
                    <SelectItem value="birth_date_asc">Nascimento (Mais Antigo)</SelectItem>
                    <SelectItem value="department_asc">Departamento (A-Z)</SelectItem>
                    <SelectItem value="department_desc">Departamento (Z-A)</SelectItem>
                    <SelectItem value="stay_days_desc">Mais Dias Internado</SelectItem>
                    <SelectItem value="stay_days_asc">Menos Dias Internado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={onClearFilters} className="w-full">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchiveFilters;