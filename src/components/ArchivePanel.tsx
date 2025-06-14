
import React, { useState, useMemo } from 'react';
import { DischargedPatient } from '@/types';
import { formatDateOnly } from '@/utils/dateUtils';
import ArchivePanelHeader from './archive/ArchivePanelHeader';
import ArchiveFilters from './archive/ArchiveFilters';
import ArchivePatientList from './archive/ArchivePatientList';

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

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setDischargeTypeFilter('all');
    setSortBy('discharge_date_desc');
  };

  return (
    <div className="space-y-6">
      <ArchivePanelHeader 
        filteredCount={filteredAndSortedPatients.length}
        totalCount={archivedPatients.length}
      />
      
      <ArchiveFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        dischargeTypeFilter={dischargeTypeFilter}
        setDischargeTypeFilter={setDischargeTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        departments={departments}
        dischargeTypes={dischargeTypes}
        onClearFilters={clearFilters}
      />

      <ArchivePatientList 
        patients={filteredAndSortedPatients}
        totalPatients={archivedPatients.length}
      />
    </div>
  );
};

export default ArchivePanel;
