
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings, Edit } from 'lucide-react';
import { Department, Bed } from '@/types';

interface BedsManagementHeaderProps {
  departments: Department[];
  selectedDepartment: Department;
  onDepartmentSelect: (department: Department) => void;
  departmentBeds: Bed[];
  onCreateNewBed: () => void;
  onManageSectors: () => void;
  onEditBed?: () => void;
}

const BedsManagementHeader: React.FC<BedsManagementHeaderProps> = ({
  departments,
  selectedDepartment,
  onDepartmentSelect,
  departmentBeds,
  onCreateNewBed,
  onManageSectors,
  onEditBed
}) => {
  const occupiedCount = departmentBeds.filter(bed => bed.isOccupied).length;
  const reservedCount = departmentBeds.filter(bed => bed.isReserved).length;
  const availableCount = departmentBeds.length - occupiedCount - reservedCount;

  return (
    <>
      {/* Department Selection */}
      <div className="flex flex-wrap gap-2">
        {departments.map((dept) => (
          <Button
            key={dept}
            onClick={() => onDepartmentSelect(dept)}
            variant={selectedDepartment === dept ? "default" : "outline"}
            className="text-xs md:text-sm"
          >
            {dept}
          </Button>
        ))}
      </div>

      {/* Department Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{selectedDepartment}</span>
            <div className="flex items-center gap-4">
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">Disponíveis: {availableCount}</span>
                <span className="text-red-600">Ocupados: {occupiedCount}</span>
                <span className="text-yellow-600">Reservados: {reservedCount}</span>
                <span className="text-gray-600">Total: {departmentBeds.length}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={onManageSectors} variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  GERENCIAR SETORES
                </Button>
                {onEditBed && (
                  <Button onClick={onEditBed} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    EDITAR LEITOS
                  </Button>
                )}
                <Button onClick={onCreateNewBed} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  CRIAR NOVO LEITO
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
};

export default BedsManagementHeader;
