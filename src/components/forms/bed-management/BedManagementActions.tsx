
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, Save } from 'lucide-react';

interface BedManagementActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  bedName: string;
  selectedDepartment: string;
  isEditing: boolean;
  isFormReady: boolean;
  hasDepartments?: boolean;
}

export const BedManagementActions: React.FC<BedManagementActionsProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  bedName,
  selectedDepartment,
  isEditing,
  isFormReady,
  hasDepartments = true
}) => {
  // CORREÇÃO: Validação simples e clara
  const isFormValid = bedName.trim().length > 0 && selectedDepartment.length > 0 && hasDepartments;
  const isSubmitDisabled = isLoading || !isFormValid;

  console.log('🔧 [BED_ACTIONS] Renderizando ações:', {
    isLoading,
    bedName: bedName.trim(),
    selectedDepartment,
    isFormValid,
    isSubmitDisabled,
    isEditing,
    isFormReady,
    hasDepartments
  });

  return (
    <div className="flex gap-3 pt-4 border-t">
      <Button 
        variant="outline" 
        onClick={onCancel} 
        className="flex-1"
        disabled={isLoading}
      >
        Cancelar
      </Button>
      
      <Button 
        onClick={onSubmit} 
        className="flex-1"
        disabled={isSubmitDisabled}
        variant={isFormValid ? "default" : "secondary"}
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            {isEditing ? 'Salvando...' : 'Criando...'}
          </>
        ) : (
          <>
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Criar Leito
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};
