
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
  bedData: BedData | undefined,
  fallbackDepartments: string[],
  onClose: () => void,
  isEditing: boolean = false
) => {
  const [bedName, setBedName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const { departmentNames, isLoading: loadingDepartments, refetch: refetchDepartments } = useDepartmentNames();
  const createBedMutation = useCreateBed();
  const updateBedMutation = useUpdateBed();
  const { toast } = useToast();

  // Preparar lista final de departamentos (sempre excluir UTI PEDIATRICA)
  const departments = departmentNames.length > 0 ? 
    departmentNames.filter(dept => dept !== 'UTI PEDIATRICA') : 
    fallbackDepartments.filter(dept => dept !== 'UTI PEDIATRICA');

  console.log('🔄 [BED_LOGIC] Hook inicializado:', {
    isOpen,
    isEditing,
    bedData,
    departmentNames: departmentNames.length,
    departments: departments.length,
    loadingDepartments
  });

  // ETAPA 1: Inicialização correta dos valores
  useEffect(() => {
    console.log('🔄 [BED_LOGIC] useEffect [isOpen, bedData, departments]');
    
    if (!isOpen) {
      console.log('📝 [BED_LOGIC] Modal fechado - mantendo estados');
      return;
    }

    if (bedData && isEditing) {
      // Modo edição - preencher com dados existentes
      console.log('📝 [BED_LOGIC] Modo EDIÇÃO - preenchendo dados:', bedData);
      setBedName(bedData.name);
      setSelectedDepartment(bedData.department);
    } else {
      // Modo criação - valores padrão
      console.log('📝 [BED_LOGIC] Modo CRIAÇÃO - definindo valores padrão');
      setBedName('');
      
      // Aguardar departamentos serem carregados
      if (departments.length > 0) {
        const defaultDept = departments[0];
        console.log('🏥 [BED_LOGIC] Departamento padrão selecionado:', defaultDept);
        setSelectedDepartment(defaultDept);
      } else if (!loadingDepartments) {
        // Se não está carregando e não tem departamentos, usar fallback
        console.log('⚠️ [BED_LOGIC] Usando fallback - sem departamentos do banco');
        const fallbackFiltered = fallbackDepartments.filter(dept => dept !== 'UTI PEDIATRICA');
        if (fallbackFiltered.length > 0) {
          setSelectedDepartment(fallbackFiltered[0]);
        }
      }
    }
  }, [isOpen, bedData, isEditing, departments, loadingDepartments, fallbackDepartments]);

  // ETAPA 2: Carregar departamentos quando modal abrir
  useEffect(() => {
    if (isOpen && !loadingDepartments && departmentNames.length === 0) {
      console.log('🔄 [BED_LOGIC] Modal aberto - carregando departamentos');
      refetchDepartments();
    }
  }, [isOpen, loadingDepartments, departmentNames.length, refetchDepartments]);

  // Função para atualizar lista de departamentos
  const handleRefreshDepartments = async () => {
    console.log('🔄 [BED_LOGIC] Refresh manual de departamentos');
    try {
      await refetchDepartments();
      console.log('✅ [BED_LOGIC] Departamentos atualizados com sucesso');
    } catch (error) {
      console.error('❌ [BED_LOGIC] Erro ao atualizar departamentos:', error);
    }
  };

  // ETAPA 4: Validação e submit melhorados
  const handleSubmit = async () => {
    const trimmedBedName = bedName.trim();
    
    console.log('📝 [BED_LOGIC] Iniciando submit:', { 
      bedName: trimmedBedName, 
      selectedDepartment,
      isEditing,
      bedData
    });

    // Validações com feedback claro
    if (!trimmedBedName) {
      console.log('❌ [BED_LOGIC] Validação falhou: nome vazio');
      toast({
        title: "❌ Erro de Validação",
        description: "O nome do leito é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDepartment) {
      console.log('❌ [BED_LOGIC] Validação falhou: departamento vazio');
      toast({
        title: "❌ Erro de Validação", 
        description: "Selecione um setor/departamento",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && bedData?.id) {
        console.log('🔄 [BED_LOGIC] Atualizando leito existente:', bedData.id);
        await updateBedMutation.mutateAsync({
          bedId: bedData.id,
          name: trimmedBedName,
          department: selectedDepartment
        });
        
        toast({
          title: "✅ Leito Atualizado",
          description: `${trimmedBedName} foi atualizado no ${selectedDepartment}`,
        });
        
        console.log('✅ [BED_LOGIC] Leito atualizado com sucesso');
      } else {
        console.log('🆕 [BED_LOGIC] Criando novo leito');
        const result = await createBedMutation.mutateAsync({
          name: trimmedBedName,
          department: selectedDepartment
        });
        
        console.log('✅ [BED_LOGIC] Leito criado com sucesso:', result);
      }

      // Reset do formulário e fechamento
      console.log('🔄 [BED_LOGIC] Resetando formulário e fechando modal');
      setBedName('');
      if (departments.length > 0) {
        setSelectedDepartment(departments[0]);
      }
      onClose();
      
    } catch (error) {
      console.error('💥 [BED_LOGIC] Erro no submit:', error);
      // O toast de erro será mostrado pelas mutations
    }
  };

  // ETAPA 3: Controle de loading otimizado
  const isLoading = createBedMutation.isPending || updateBedMutation.isPending;
  const isFormDisabled = isLoading;

  console.log('📊 [BED_LOGIC] Estados finais:', {
    bedName,
    selectedDepartment,
    departments: departments.length,
    isLoading,
    isFormDisabled,
    loadingDepartments
  });

  return {
    bedName,
    setBedName,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    departmentNames,
    isLoading: isFormDisabled, // Apenas mutations bloqueiam o form
    loadingDepartments,
    handleRefreshDepartments,
    handleSubmit
  };
};
