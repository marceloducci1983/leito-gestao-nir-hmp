
import { useState, useEffect } from 'react';
import { useCreateBed, useUpdateBed } from '@/hooks/mutations/useBedMutations';
import { useDepartmentNames } from '@/hooks/queries/useDepartmentQueries';
import { useToast } from '@/hooks/use-toast';

interface BedData {
  id?: string;
  name: string;
  department: string;
}

export const useBedManagementLogic = (
  isOpen: boolean,
  bedData?: BedData,
  isEditing: boolean = false,
  fallbackDepartments: string[] = [],
  onClose: () => void
) => {
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

  return {
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
  };
};
