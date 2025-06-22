
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface BedManagementFormProps {
  bedName: string;
  setBedName: (name: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  departments: string[];
  isLoading: boolean;
  loadingDepartments: boolean;
  onRefreshDepartments: () => void;
  departmentNames: string[];
  isFormReady: boolean;
  hasDepartments?: boolean;
}

export const BedManagementForm: React.FC<BedManagementFormProps> = ({
  bedName,
  setBedName,
  selectedDepartment,
  setSelectedDepartment,
  departments,
  isLoading,
  loadingDepartments,
  onRefreshDepartments,
  departmentNames,
  isFormReady,
  hasDepartments = true
}) => {
  console.log('🔧 [BED_FORM] Renderizando formulário:', {
    bedName,
    selectedDepartment,
    departments: departments.length,
    isLoading,
    loadingDepartments,
    isFormReady,
    hasDepartments
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bed-name" className="text-sm font-medium">
          Nome do Leito *
        </Label>
        <Input
          id="bed-name"
          value={bedName}
          onChange={(e) => {
            console.log('🔧 [BED_FORM] Nome alterado:', e.target.value);
            setBedName(e.target.value);
          }}
          placeholder="Ex: 101A, UTI-05, etc."
          disabled={isLoading} // CORREÇÃO: Só desabilitar durante submit
          autoFocus
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Digite um nome único para o leito
        </p>
      </div>

      <div>
        <Label htmlFor="bed-department" className="text-sm font-medium">
          Setor/Departamento *
        </Label>
        <div className="flex gap-2 mt-1">
          <Select 
            value={selectedDepartment} 
            onValueChange={(value) => {
              console.log('🔧 [BED_FORM] Departamento alterado:', value);
              setSelectedDepartment(value);
            }}
            disabled={isLoading} // CORREÇÃO: Só desabilitar durante submit
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={
                loadingDepartments ? "Carregando..." : 
                !hasDepartments ? "Nenhum setor disponível" : 
                "Selecione o setor"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg max-h-60" style={{ zIndex: 9999 }}>
              {!hasDepartments ? (
                <SelectItem value="loading" disabled>
                  {loadingDepartments ? 'Carregando setores...' : 'Nenhum setor disponível'}
                </SelectItem>
              ) : (
                departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onRefreshDepartments}
            disabled={isLoading || loadingDepartments}
            title="Atualizar lista de setores"
          >
            <RefreshCw className={`h-4 w-4 ${loadingDepartments ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {departments.length} setores disponíveis
          {departmentNames.length > 0 && ' (carregados do banco)'}
          {loadingDepartments && ' - Atualizando...'}
        </p>
      </div>
    </div>
  );
};
