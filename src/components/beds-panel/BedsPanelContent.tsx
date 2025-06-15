
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ResponsiveDepartmentSelector from '@/components/ResponsiveDepartmentSelector';
import BedsManagementGrid from '@/components/BedsManagementGrid';

interface BedsPanelContentProps {
  departments: string[];
  selectedDepartment: string;
  onDepartmentSelect: (department: string) => void;
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
    // Quando há busca, não mostrar o seletor de departamento
    searchTerm.trim() ? (
      <Card>
        {sortedBeds.length === 0 ? (
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
    ) : (
      <ResponsiveDepartmentSelector
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentSelect={onDepartmentSelect}
        departmentBeds={departmentBeds}
      >
        <Card>
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
        </Card>
      </ResponsiveDepartmentSelector>
    )
  );
};

export default BedsPanelContent;
