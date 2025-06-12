import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResponsive } from '@/hooks/useResponsive';
import { Department } from '@/types';

interface ResponsiveDepartmentSelectorProps {
  departments: Department[];
  selectedDepartment: Department;
  onDepartmentSelect: (department: Department) => void;
  departmentBeds: any[];
  children: React.ReactNode;
}

const ResponsiveDepartmentSelector: React.FC<ResponsiveDepartmentSelectorProps> = ({
  departments,
  selectedDepartment,
  onDepartmentSelect,
  departmentBeds,
  children
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getDepartmentStats = (department: Department) => {
    const beds = departmentBeds.filter(bed => bed.department === department);
    const occupiedCount = beds.filter(bed => bed.isOccupied).length;
    const reservedCount = beds.filter(bed => bed.isReserved).length;
    const availableCount = beds.length - occupiedCount - reservedCount;
    
    return { occupiedCount, reservedCount, availableCount, total: beds.length };
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="px-4">
          <Select value={selectedDepartment} onValueChange={(value) => onDepartmentSelect(value as Department)}>
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Selecionar Departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(department => {
                const stats = getDepartmentStats(department);
                return (
                  <SelectItem key={department} value={department} className="py-3">
                    <div className="flex flex-col w-full">
                      <span className="font-medium">{department}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Badge variant="outline" className="text-green-600 bg-green-50">
                          {stats.availableCount} Livre
                        </Badge>
                        <Badge variant="outline" className="text-red-600 bg-red-50">
                          {stats.occupiedCount} Ocupado
                        </Badge>
                        <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                          {stats.reservedCount} Reservado
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="px-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-lg mb-2">{selectedDepartment}</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {(() => {
                const stats = getDepartmentStats(selectedDepartment);
                return (
                  <>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.availableCount}</div>
                      <div className="text-xs text-green-700">Livres</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{stats.occupiedCount}</div>
                      <div className="text-xs text-red-700">Ocupados</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.reservedCount}</div>
                      <div className="text-xs text-yellow-700">Reservados</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="px-4">
          {children}
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="space-y-4">
        <ScrollArea className="w-full">
          <div className="flex space-x-2 p-4">
            {departments.map(department => {
              const stats = getDepartmentStats(department);
              const isActive = selectedDepartment === department;
              
              return (
                <button
                  key={department}
                  onClick={() => onDepartmentSelect(department)}
                  className={`flex-shrink-0 p-3 rounded-lg border transition-colors min-w-[140px] ${
                    isActive 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium mb-2">{department}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">{stats.availableCount}</span>
                    <span className="text-red-600">{stats.occupiedCount}</span>
                    <span className="text-yellow-600">{stats.reservedCount}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="px-4">
          {children}
        </div>
      </div>
    );
  }

  // Desktop view - keep original tabs
  return (
    <Tabs value={selectedDepartment} onValueChange={(value) => onDepartmentSelect(value as Department)} className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        {departments.map(department => {
          const stats = getDepartmentStats(department);
          
          return (
            <TabsTrigger key={department} value={department} className="text-xs">
              <div className="flex flex-col items-center">
                <span className="font-medium">{department}</span>
                <div className="text-xs text-gray-500">
                  <span className="text-green-600">{stats.availableCount}</span>/
                  <span className="text-red-600">{stats.occupiedCount}</span>/
                  <span className="text-yellow-600">{stats.reservedCount}</span>
                </div>
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {departments.map(department => (
        <TabsContent key={department} value={department} className="mt-6">
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ResponsiveDepartmentSelector;
