
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit } from 'lucide-react';
import { BedManagementForm } from './bed-management/BedManagementForm';
import { BedManagementActions } from './bed-management/BedManagementActions';
import { useBedManagementLogic } from './bed-management/useBedManagementLogic';

interface BedManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  bedData?: {
    id?: string;
    name: string;
    department: string;
  };
  isEditing?: boolean;
}

const BedManagementModal: React.FC<BedManagementModalProps> = ({
  isOpen,
  onClose,
  departments: fallbackDepartments,
  bedData,
  isEditing = false
}) => {
  console.log('🔵 [BED_MODAL] Modal renderizado:', {
    isOpen,
    isEditing,
    bedData,
    fallbackDepartments: fallbackDepartments.length
  });

  const {
    bedName,
    setBedName,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    departmentNames,
    isLoading,
    loadingDepartments,
    handleRefreshDepartments,
    handleSubmit
  } = useBedManagementLogic(isOpen, bedData, fallbackDepartments, onClose, isEditing);

  if (!isOpen) {
    return null;
  }

  console.log('✅ [BED_MODAL] Modal aberto - renderizando conteúdo');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border shadow-lg" style={{ zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5 text-blue-600" />
                Editar Leito
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-green-600" />
                Adicionar Novo Leito
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <BedManagementForm
            bedName={bedName}
            setBedName={setBedName}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            departments={departments}
            isLoading={isLoading}
            loadingDepartments={loadingDepartments}
            onRefreshDepartments={handleRefreshDepartments}
            departmentNames={departmentNames}
          />
        </div>

        <BedManagementActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          bedName={bedName}
          selectedDepartment={selectedDepartment}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BedManagementModal;
