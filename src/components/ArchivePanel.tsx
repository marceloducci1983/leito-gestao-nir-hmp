import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortDesc, SortAsc } from 'lucide-react';
import { DischargedPatient } from '@/types';
import { formatDateSaoPaulo } from '@/utils/timezoneUtils';
import { formatDateOnly } from '@/utils/dateUtils';

interface ArchivePanelProps {
  archivedPatients: DischargedPatient[];
}

const ArchivePanel: React.FC<ArchivePanelProps> = ({ archivedPatients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dischargeTypeFilter, setDischargeTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('discharge_date_desc');
  const [showFilters, setShowFilters] = useState(false);

  // Extrair departamentos únicos para o filtro
  const departments = useMemo(() => {
    const uniqueDepts = [...new Set(archivedPatients.map(p => p.department))];
    return uniqueDepts.sort();
  }, [archivedPatients]);

  // Extrair tipos de alta únicos para o filtro
  const dischargeTypes = useMemo(() => {
    const uniqueTypes = [...new Set(archivedPatients.map(p => p.dischargeType))];
    return uniqueTypes.sort();
  }, [archivedPatients]);

  // Filtrar e ordenar pacientes
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = archivedPatients.filter(patient => {
      // Filtro de busca expandido para incluir data de nascimento
      const matchesSearch = !searchTerm || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.bedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDateOnly(patient.birthDate).includes(searchTerm);

      // Filtro de departamento
      const matchesDepartment = departmentFilter === 'all' || patient.department === departmentFilter;

      // Filtro de tipo de alta
      const matchesDischargeType = dischargeTypeFilter === 'all' || patient.dischargeType === dischargeTypeFilter;

      return matchesSearch && matchesDepartment && matchesDischargeType;
    });

    // Ordenação expandida
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'discharge_date_desc':
          return new Date(b.dischargeDate).getTime() - new Date(a.dischargeDate).getTime();
        case 'discharge_date_asc':
          return new Date(a.dischargeDate).getTime() - new Date(b.dischargeDate).getTime();
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'department_asc':
          return a.department.localeCompare(b.department);
        case 'department_desc':
          return b.department.localeCompare(a.department);
        case 'stay_days_desc':
          return b.actualStayDays - a.actualStayDays;
        case 'stay_days_asc':
          return a.actualStayDays - b.actualStayDays;
        case 'birth_date_desc':
          return new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime();
        case 'birth_date_asc':
          return new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();
        case 'age_desc':
          return b.age - a.age;
        case 'age_asc':
          return a.age - b.age;
        default:
          return new Date(b.dischargeDate).getTime() - new Date(a.dischargeDate).getTime();
      }
    });

    return filtered;
  }, [archivedPatients, searchTerm, departmentFilter, dischargeTypeFilter, sortBy]);

  const getDischargeTypeColor = (type: string) => {
    switch (type) {
      case 'POR MELHORA': return 'bg-green-500';
      case 'TRANSFERENCIA': return 'bg-blue-500';
      case 'EVASÃO': return 'bg-yellow-500';
      case 'OBITO': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setDischargeTypeFilter('all');
    setSortBy('discharge_date_desc');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ARQUIVO DE PACIENTES</h2>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {filteredAndSortedPatients.length} de {archivedPatients.length} registros
        </Badge>
      </div>
      
      {/* Barra de busca e filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Campo de busca principal */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
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
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
      <div className="grid gap-4">
        {filteredAndSortedPatients.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              {archivedPatients.length === 0 
                ? "Nenhum paciente arquivado ainda."
                : "Nenhum paciente encontrado com os filtros aplicados."
              }
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedPatients.map((patient) => (
            <Card key={patient.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getDischargeTypeColor(patient.dischargeType)}>
                      {patient.dischargeType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {formatDateSaoPaulo(patient.dischargeDate)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                  <div>
                    <strong>Idade:</strong> {patient.age} anos
                  </div>
                  <div>
                    <strong>Nascimento:</strong> {formatDateOnly(patient.birthDate)}
                  </div>
                  <div>
                    <strong>Departamento:</strong> {patient.department}
                  </div>
                  <div>
                    <strong>Leito:</strong> {patient.bedId.split('-').pop()}
                  </div>
                  <div>
                    <strong>Admissão:</strong> {formatDateSaoPaulo(patient.admissionDate)}
                  </div>
                  <div>
                    <strong>Alta:</strong> {formatDateSaoPaulo(patient.dischargeDate)}
                  </div>
                  <div>
                    <strong>Permanência:</strong> {patient.actualStayDays} dias
                  </div>
                  <div>
                    <strong>Origem:</strong> {patient.originCity}
                  </div>
                  <div>
                    <strong>TFD:</strong> {patient.isTFD ? 'Sim' : 'Não'}
                  </div>
                  <div className="col-span-2 md:col-span-3 lg:col-span-5">
                    <strong>Diagnóstico:</strong> {patient.diagnosis}
                  </div>
                  {patient.specialty && (
                    <div className="col-span-2">
                      <strong>Especialidade:</strong> {patient.specialty}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ArchivePanel;
