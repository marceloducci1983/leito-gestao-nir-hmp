
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
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
  console.log('🔵 [BED_MODAL] Modal renderizado - isOpen:', isOpen);
  console.log('🔍 [BED_MODAL] bedData recebido:', bedData);
  console.log('🔍 [BED_MODAL] isEditing:', isEditing);

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
    console.log('❌ [BED_MODAL] Modal não está aberto, não renderizando');
    return null;
  }

  console.log('✅ [BED_MODAL] Renderizando modal aberto - pronto para uso');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border shadow-lg" style={{ zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditing ? 'Editar Leito' : 'Adicionar Novo Leito'}
          </DialogTitle>
        </DialogHeader>

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
