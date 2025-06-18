
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBed, useUpdateBed } from '@/hooks/mutations/useBedMutations';
import { useDepartmentNames } from '@/hooks/queries/useDepartmentQueries';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Plus } from 'lucide-react';

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

  const [bedName, setBedName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('CLINICA MEDICA');

  const { departmentNames, isLoading: loadingDepartments, refetch: refetchDepartments } = useDepartmentNames();
  const createBedMutation = useCreateBed();
  const updateBedMutation = useUpdateBed();
  const { toast } = useToast();

  // Usar departamentos dinâmicos do banco de dados sempre que disponível (excluindo UTI PEDIATRICA)
  const departments = departmentNames.length > 0 ? 
    departmentNames.filter(dept => dept !== 'UTI PEDIATRICA') : 
    fallbackDepartments.filter(dept => dept !== 'UTI PEDIATRICA');

  console.log('🏥 [BED_MODAL] Departamentos finais (sem UTI PEDIATRICA):', departments);

  // Função para atualizar lista de departamentos
  const handleRefreshDepartments = async () => {
    console.log('🔄 [BED_MODAL] Atualizando lista de departamentos...');
    await refetchDepartments();
  };

  useEffect(() => {
    console.log('🔄 [BED_MODAL] useEffect - Modal aberto/fechado:', isOpen);
    if (bedData && isOpen) {
      console.log('📝 [BED_MODAL] Preenchendo dados do leito:', bedData);
      setBedName(bedData.name);
      setSelectedDepartment(bedData.department);
    } else if (isOpen) {
      console.log('🆕 [BED_MODAL] Criando novo leito - resetando formulário');
      setBedName('');
      // Usar o primeiro departamento disponível ou fallback
      const defaultDept = departments.length > 0 ? departments[0] : 'CLINICA MEDICA';
      setSelectedDepartment(defaultDept);
      console.log('🏥 [BED_MODAL] Departamento padrão selecionado:', defaultDept);
    }
  }, [bedData, isOpen, departments]);

  // Atualizar departamentos quando o modal abrir
  useEffect(() => {
    if (isOpen && !loadingDepartments) {
      console.log('🔄 [BED_MODAL] Modal aberto - buscando departamentos atualizados');
      handleRefreshDepartments();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    console.log('📝 [BED_MODAL] Submetendo formulário:', { 
      bedName: bedName.trim(), 
      selectedDepartment, 
      isEditing 
    });

    if (!bedName.trim()) {
      console.log('❌ [BED_MODAL] Nome do leito é obrigatório');
      toast({
        title: "Erro",
        description: "Nome do leito é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDepartment) {
      console.log('❌ [BED_MODAL] Setor é obrigatório');
      toast({
        title: "Erro", 
        description: "Setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && bedData?.id) {
        console.log('🔄 [BED_MODAL] Atualizando leito:', bedData.id);
        await updateBedMutation.mutateAsync({
          bedId: bedData.id,
          name: bedName.trim(),
          department: selectedDepartment
        });
        
        console.log('✅ [BED_MODAL] Leito atualizado com sucesso');
      } else {
        console.log('🆕 [BED_MODAL] Criando novo leito...');
        console.log('📊 [BED_MODAL] Dados para criação:', {
          name: bedName.trim(),
          department: selectedDepartment
        });
        
        const result = await createBedMutation.mutateAsync({
          name: bedName.trim(),
          department: selectedDepartment
        });
        
        console.log('✅ [BED_MODAL] Leito criado com sucesso! Resultado:', result);
      }

      console.log('✅ [BED_MODAL] Operação concluída com sucesso');
      
      // Reset form and close modal
      setBedName('');
      const defaultDept = departments.length > 0 ? departments[0] : 'CLINICA MEDICA';
      setSelectedDepartment(defaultDept);
      onClose();
      
    } catch (error) {
      console.error('❌ [BED_MODAL] Erro ao processar leito:', error);
      // O erro será tratado pelas mutations
    }
  };

  const isLoading = createBedMutation.isPending || updateBedMutation.isPending || loadingDepartments;

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

        <div className="space-y-4">
          <div>
            <Label htmlFor="bed-name">Nome do Leito</Label>
            <Input
              id="bed-name"
              value={bedName}
              onChange={(e) => setBedName(e.target.value)}
              placeholder="Ex: 101A, UTI-05, etc."
              disabled={isLoading}
              autoFocus
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              O nome deve ser único dentro do departamento
            </p>
          </div>

          <div>
            <Label htmlFor="bed-department">Setor/Departamento</Label>
            <div className="flex gap-2 mt-1">
              <Select 
                value={selectedDepartment} 
                onValueChange={(value) => setSelectedDepartment(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg" style={{ zIndex: 9999 }}>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRefreshDepartments}
                disabled={isLoading}
                title="Atualizar lista de setores"
              >
                <RefreshCw className={`h-4 w-4 ${loadingDepartments ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {departments.length} setores disponíveis
              {departmentNames.length > 0 && ' (atualizados do banco)'}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={isLoading || !bedName.trim() || !selectedDepartment}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Leito'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BedManagementModal;
