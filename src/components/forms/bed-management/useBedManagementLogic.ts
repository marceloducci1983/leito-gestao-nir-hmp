
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

  // ETAPA 2: Lista final de departamentos com fallback robusto
  const departments = departmentNames.length > 0 ? 
    departmentNames.filter(dept => dept !== 'UTI PEDIATRICA') : 
    fallbackDepartments.filter(dept => dept !== 'UTI PEDIATRICA');

  console.log('🔧 [BED_LOGIC] Hook inicializado:', {
    isOpen,
    isEditing,
    bedData,
    departmentNames: departmentNames.length,
    fallbackDepartments: fallbackDepartments.length,
    departments: departments.length,
    loadingDepartments
  });

  // ETAPA 1: Inicialização correta e separada por modo
  useEffect(() => {
    console.log('🔧 [BED_LOGIC] useEffect inicialização - isOpen:', isOpen);
    
    if (!isOpen) {
      console.log('🔧 [BED_LOGIC] Modal fechado - resetando estados');
      setBedName('');
      setSelectedDepartment('');
      return;
    }

    if (isEditing && bedData) {
      // MODO EDIÇÃO: Preencher com dados existentes
      console.log('🔧 [BED_LOGIC] MODO EDIÇÃO - preenchendo:', bedData);
      setBedName(bedData.name);
      setSelectedDepartment(bedData.department);
    } else {
      // MODO CRIAÇÃO: Valores padrão limpos
      console.log('🔧 [BED_LOGIC] MODO CRIAÇÃO - limpando formulário');
      setBedName('');
      
      // Aguardar departamentos e selecionar o primeiro disponível
      if (departments.length > 0) {
        const defaultDept = departments[0];
        console.log('🔧 [BED_LOGIC] Selecionando departamento padrão:', defaultDept);
        setSelectedDepartment(defaultDept);
      } else {
        console.log('🔧 [BED_LOGIC] Nenhum departamento disponível ainda');
        setSelectedDepartment('');
      }
    }
  }, [isOpen, isEditing, bedData, departments]);

  // Carregar departamentos quando modal abrir
  useEffect(() => {
    if (isOpen && !loadingDepartments && departmentNames.length === 0) {
      console.log('🔧 [BED_LOGIC] Carregando departamentos do banco');
      refetchDepartments();
    }
  }, [isOpen, loadingDepartments, departmentNames.length, refetchDepartments]);

  // Refresh manual de departamentos
  const handleRefreshDepartments = async () => {
    console.log('🔧 [BED_LOGIC] Refresh manual de departamentos');
    try {
      await refetchDepartments();
      console.log('✅ [BED_LOGIC] Departamentos atualizados');
    } catch (error) {
      console.error('❌ [BED_LOGIC] Erro ao atualizar departamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar lista de departamentos",
        variant: "destructive",
      });
    }
  };

  // ETAPA 4: Validação apenas no submit, permitindo digitação livre
  const handleSubmit = async () => {
    const trimmedBedName = bedName.trim();
    
    console.log('🔧 [BED_LOGIC] Iniciando submit:', { 
      bedName: trimmedBedName, 
      selectedDepartment,
      isEditing,
      bedData
    });

    // Validações claras e específicas
    if (!trimmedBedName) {
      console.log('❌ [BED_LOGIC] Erro: Nome do leito vazio');
      toast({
        title: "Campo obrigatório",
        description: "Digite o nome do leito",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDepartment) {
      console.log('❌ [BED_LOGIC] Erro: Departamento não selecionado');
      toast({
        title: "Campo obrigatório", 
        description: "Selecione um departamento",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && bedData?.id) {
        console.log('🔧 [BED_LOGIC] Atualizando leito:', bedData.id);
        await updateBedMutation.mutateAsync({
          bedId: bedData.id,
          name: trimmedBedName,
          department: selectedDepartment
        });
        
        console.log('✅ [BED_LOGIC] Leito atualizado com sucesso');
      } else {
        console.log('🔧 [BED_LOGIC] Criando novo leito');
        const result = await createBedMutation.mutateAsync({
          name: trimmedBedName,
          department: selectedDepartment
        });
        
        console.log('✅ [BED_LOGIC] Leito criado com sucesso:', result);
      }

      // Reset e fechamento
      console.log('🔧 [BED_LOGIC] Resetando formulário e fechando');
      setBedName('');
      if (departments.length > 0) {
        setSelectedDepartment(departments[0]);
      }
      onClose();
      
    } catch (error) {
      console.error('💥 [BED_LOGIC] Erro no submit:', error);
      // Toast de erro será mostrado pelas mutations
    }
  };

  // ETAPA 3: Estados de loading separados
  const isSubmitting = createBedMutation.isPending || updateBedMutation.isPending;
  const isFormReady = departments.length > 0 && !loadingDepartments;

  console.log('🔧 [BED_LOGIC] Estados finais:', {
    bedName,
    selectedDepartment,
    departments: departments.length,
    isSubmitting,
    isFormReady,
    loadingDepartments
  });

  return {
    bedName,
    setBedName,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    departmentNames,
    isLoading: isSubmitting, // Apenas mutations bloqueiam form
    loadingDepartments,
    handleRefreshDepartments,
    handleSubmit,
    isFormReady
  };
};
