
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
}

export const BedManagementActions: React.FC<BedManagementActionsProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  bedName,
  selectedDepartment,
  isEditing,
  isFormReady
}) => {
  // ETAPA 4: Validação simples que permite digitação
  const isFormValid = bedName.trim().length > 0 && selectedDepartment.length > 0;
  const isSubmitDisabled = isLoading || !isFormValid || !isFormReady;

  console.log('🔧 [BED_ACTIONS] Renderizando ações:', {
    isLoading,
    bedName: bedName.trim(),
    selectedDepartment,
    isFormValid,
    isSubmitDisabled,
    isEditing,
    isFormReady
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
        variant={isFormValid && isFormReady ? "default" : "secondary"}
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
