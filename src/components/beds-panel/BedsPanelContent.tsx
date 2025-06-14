
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Department } from '@/types';
import ResponsiveDepartmentSelector from '@/components/ResponsiveDepartmentSelector';
import BedsManagementGrid from '@/components/BedsManagementGrid';

interface BedsPanelContentProps {
  departments: Department[];
  selectedDepartment: Department;
  onDepartmentSelect: (department: Department) => void;
  departmentBeds: any[];
  sortedBeds: any[];
  searchTerm: string;
  onReserveBed: (bedId: string) => void;
  onAdmitPatient: (bedId: string) => void;
  onEditPatient: (bedId: string) => void;
  onTransferPatient: (bedId: string) => void;
  onDischargePatient: (bedId: string) => void;
  onDeleteReservation: (bedId: string) => void;
  onDeleteBed: (bedId: string) => void;
}

const BedsPanelContent: React.FC<BedsPanelContentProps> = ({
  departments,
  selectedDepartment,
  onDepartmentSelect,
  departmentBeds,
  sortedBeds,
  searchTerm,
  onReserveBed,
  onAdmitPatient,
  onEditPatient,
  onTransferPatient,
  onDischargePatient,
  onDeleteReservation,
  onDeleteBed
}) => {
  return (
    <ResponsiveDepartmentSelector
      departments={departments}
      selectedDepartment={selectedDepartment}
      onDepartmentSelect={onDepartmentSelect}
      departmentBeds={departmentBeds}
    >
      <Card>
        {sortedBeds.length === 0 && searchTerm.trim() ? (
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 text-lg">Nenhum paciente encontrado.</p>
            <p className="text-sm text-gray-400 mt-2">
              Tente buscar por outro nome ou número de leito.
            </p>
          </CardContent>
        ) : (
          <BedsManagementGrid
            departmentBeds={sortedBeds}
            onReserveBed={onReserveBed}
            onAdmitPatient={onAdmitPatient}
            onEditPatient={onEditPatient}
            onTransferPatient={onTransferPatient}
            onDischargePatient={onDischargePatient}
            onDeleteReservation={onDeleteReservation}
            onDeleteBed={onDeleteBed}
          />
        )}
      </Card>
    </ResponsiveDepartmentSelector>
  );
};

export default BedsPanelContent;
