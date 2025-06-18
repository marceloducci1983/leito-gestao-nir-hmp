
interface UseModalHandlersProps {
  setShowSectorModal: (show: boolean) => void;
  setShowBedModal: (show: boolean) => void;
  setSelectedBedForEdit: (bed: any) => void;
}

export const useModalHandlers = ({
  setShowSectorModal,
  setShowBedModal,
  setSelectedBedForEdit
}: UseModalHandlersProps) => {
  
  const handleCreateNewBed = () => {
    console.log('🔵 [HANDLER] Botão "Criar Novo Leito" clicado - INÍCIO');
    console.log('🔍 [HANDLER] Estado atual setShowBedModal function:', typeof setShowBedModal);
    
    try {
      console.log('⚙️ [HANDLER] Resetando selectedBedForEdit para null...');
      setSelectedBedForEdit(null);
      
      console.log('⚙️ [HANDLER] Chamando setShowBedModal(true)...');
      setShowBedModal(true);
      
      console.log('✅ [HANDLER] setShowBedModal(true) executado com sucesso');
      console.log('✅ [HANDLER] Modal deve estar aberto agora');
      
    } catch (error) {
      console.error('❌ [HANDLER] Erro ao executar handleCreateNewBed:', error);
    }
    
    console.log('🔵 [HANDLER] Botão "Criar Novo Leito" clicado - FIM');
  };

  const handleManageSectors = () => {
    setShowSectorModal(true);
  };

  const handleEditBed = () => {
    // setEditBedMode(true);
  };

  return {
    handleCreateNewBed,
    handleManageSectors,
    handleEditBed
  };
};
