
import React, { useState, useMemo } from 'react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import { useCreateBed, useUpdateBed, useDeleteBed } from '@/hooks/mutations/useBedMutations';
import { useDeleteReservation } from '@/hooks/mutations/useReservationMutations';
import { useUpdatePatient } from '@/hooks/mutations/usePatientMutations';
import { useDischargeFlow } from '@/hooks/useDischargeFlow';
import { Department, Patient } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sortBedsByCustomOrder } from '@/utils/BedOrderUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Plus } from 'lucide-react';

// Importações para componentes responsivos
import { useResponsive } from '@/hooks/useResponsive';
import ResponsiveDepartmentSelector from './ResponsiveDepartmentSelector';
import BedsManagementGrid from './BedsManagementGrid';

// Importações para formulários
import NewPatientForm from '@/components/forms/NewPatientForm';
import NewReservationForm from '@/components/forms/NewReservationForm';
import DischargeModal from '@/components/forms/DischargeModal';
import TransferModal from '@/components/forms/TransferModal';
import SectorManagementModal from '@/components/forms/SectorManagementModal';
import BedManagementModal from '@/components/forms/BedManagementModal';

interface SupabaseBedsPanelProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
  const { centralData, isLoading, error, addPatient, transferPatient, addReservation } = useSupabaseBeds();
  const deleteReservationMutation = useDeleteReservation();
  const updatePatientMutation = useUpdatePatient();
  const deleteBedMutation = useDeleteBed();
  const { toast } = useToast();

  // Hook para gerenciar o fluxo de altas
  const { 
    handleDischargeRequest, 
    isDischarging,
    isRequestingDischarge 
  } = useDischargeFlow();

  // Estados para controlar os modais
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CLINICA MEDICA');
  
  // Estado para pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados dos modais
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  const [selectedBedForEdit, setSelectedBedForEdit] = useState<any>(null);
  
  // Estados para responsividade
  const { isMobile, isTablet } = useResponsive();

  // Update parent component with data
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(centralData);
    }
  }, [centralData, onDataChange]);

  const departments: Department[] = [
    'CLINICA MEDICA',
    'PRONTO SOCORRO', 
    'CLINICA CIRURGICA',
    'UTI ADULTO',
    'UTI NEONATAL',
    'PEDIATRIA',
    'MATERNIDADE'
  ];

  // Função para filtrar leitos baseado na pesquisa
  const filteredBeds = useMemo(() => {
    if (!searchTerm.trim()) {
      return centralData.beds.filter(bed => bed.department === selectedDepartment);
    }

    const term = searchTerm.toLowerCase().trim();
    
    return centralData.beds.filter(bed => {
      // Filtrar por departamento selecionado
      if (bed.department !== selectedDepartment) return false;
      
      // Buscar por número/nome do leito
      const bedNameMatch = bed.name.toLowerCase().includes(term);
      
      // Buscar por nome do paciente (se houver)
      const patientNameMatch = bed.patient ? 
        bed.patient.name.toLowerCase().includes(term) : false;
      
      // Buscar por nome na reserva (se houver)
      const reservationNameMatch = bed.reservation ? 
        bed.reservation.patient_name.toLowerCase().includes(term) : false;
      
      return bedNameMatch || patientNameMatch || reservationNameMatch;
    });
  }, [centralData.beds, selectedDepartment, searchTerm]);

  const sortedBeds = sortBedsByCustomOrder(filteredBeds, selectedDepartment);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando leitos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erro ao carregar dados dos leitos.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // Handlers para os botões dos leitos
  const handleReserveBed = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department as Department);
      setShowReservationForm(true);
    }
  };

  const handleAdmitPatient = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department as Department);
      setSelectedPatient(null);
      setIsEditingPatient(false);
      setShowPatientForm(true);
    }
  };

  const handleEditPatient = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedDepartment(bed.department as Department);
      setSelectedPatient(bed.patient);
      setIsEditingPatient(true);
      setShowPatientForm(true);
    }
  };

  const handleTransferPatient = (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      setSelectedBedId(bedId);
      setSelectedPatient(bed.patient);
      setShowTransferModal(true);
    }
  };

  const handleDischargePatient = async (bedId: string) => {
    const bed = centralData.beds.find(b => b.id === bedId);
    if (bed && bed.patient) {
      console.log('🏥 Preparando solicitação de alta para:', {
        patientId: bed.patient.id,
        patientName: bed.patient.name,
        bedId: bedId,
        bedName: bed.name,
        department: bed.department
      });
      
      const result = await handleDischargeRequest({
        patientId: bed.patient.id,
        patientName: bed.patient.name,
        bedId: bedId,
        department: bed.department,
        bedName: bed.name
      });

      if (result.success) {
        console.log('✅ Alta solicitada com sucesso no painel');
        toast({
          title: "Alta solicitada",
          description: `Alta de ${bed.patient.name} enviada para o monitoramento`,
        });
      } else {
        console.error('❌ Erro na solicitação de alta no painel:', result.error);
        toast({
          title: "Erro",
          description: "Erro ao solicitar alta. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteReservation = async (bedId: string) => {
    try {
      await deleteReservationMutation.mutateAsync(bedId);
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir reserva",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBed = async (bedId: string) => {
    try {
      await deleteBedMutation.mutateAsync(bedId);
    } catch (error) {
      console.error('Erro ao excluir leito:', error);
    }
  };

  const submitReservation = async (reservationData: any) => {
    try {
      await addReservation({ 
        bedId: selectedBedId, 
        reservation: {
          patient_name: reservationData.patient_name,
          origin_clinic: reservationData.origin_clinic,
          diagnosis: reservationData.diagnosis
        }
      });
      setShowReservationForm(false);
    } catch (error) {
      console.error('Erro ao reservar leito:', error);
    }
  };

  const submitPatient = async (patientData: any) => {
    try {
      if (isEditingPatient && selectedPatient) {
        await updatePatientMutation.mutateAsync({
          patientId: selectedPatient.id,
          patientData: patientData
        });
      } else {
        await addPatient({ bedId: selectedBedId, patientData });
      }
      setShowPatientForm(false);
      setSelectedPatient(null);
      setIsEditingPatient(false);
    } catch (error) {
      console.error('Erro ao processar paciente:', error);
    }
  };

  const submitTransfer = async (targetDepartment: string, targetBedId: string) => {
    if (!selectedPatient) return;

    try {
      await transferPatient({
        patientId: selectedPatient.id,
        fromBedId: selectedBedId,
        toBedId: targetBedId
      });
      setShowTransferModal(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Erro ao transferir paciente:', error);
    }
  };

  const availableBedsForTransfer = centralData.beds
    .filter(bed => !bed.isOccupied && !bed.isReserved)
    .map(bed => ({
      id: bed.id,
      name: bed.name,
      department: bed.department
    }));

  const handleManageSectors = () => {
    setShowSectorModal(true);
  };

  const handleCreateNewBed = () => {
    setSelectedBedForEdit(null);
    setShowBedModal(true);
  };

  const handleEditBed = (bed: any) => {
    setSelectedBedForEdit({
      id: bed.id,
      name: bed.name,
      department: bed.department
    });
    setShowBedModal(true);
  };

  // Para cada leito, determine se está em processo de alta
  const bedsWithDischargeState = sortedBeds.map(bed => ({
    ...bed,
    isDischarging: isDischarging(bed.id)
  }));

  return (
    <div className={`space-y-4 ${isMobile ? 'pb-16' : ''}`}>
      {/* Cabeçalho - Adaptado para Mobile */}
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start sm:items-center ${isMobile ? 'px-4' : ''}`}>
        <h1 className={`text-2xl font-bold text-gray-900 ${isMobile ? 'mb-3' : ''}`}>Painel de Leitos</h1>
        
        {/* Stats & Action Buttons */}
        <div className={`${isMobile ? 'w-full' : 'flex items-center gap-4'}`}>
          <div className="text-sm text-gray-600 mb-3 sm:mb-0">
            {centralData.beds.filter(bed => bed.isOccupied).length} / {centralData.beds.length} leitos ocupados
          </div>
          
          {isMobile ? (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleManageSectors} variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                GERENCIAR SETORES
              </Button>
              <Button onClick={handleCreateNewBed} variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                CRIAR LEITO
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={handleManageSectors} variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                GERENCIAR SETORES
              </Button>
              <Button onClick={handleCreateNewBed} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                CRIAR LEITO
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Campo de Pesquisa */}
      <div className={`${isMobile ? 'px-4' : ''}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por Nome do Paciente ou Número do Leito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Indicador de resultados */}
        {searchTerm.trim() && (
          <div className="mt-2 text-sm text-gray-600">
            {sortedBeds.length > 0 ? (
              `${sortedBeds.length} resultado(s) encontrado(s) em ${selectedDepartment}`
            ) : (
              <span className="text-orange-600">Nenhum paciente ou leito encontrado.</span>
            )}
          </div>
        )}
      </div>

      {/* Seletor de Departamentos Responsivo */}
      <ResponsiveDepartmentSelector
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentSelect={setSelectedDepartment}
        departmentBeds={centralData.beds}
      >
        <Card>
          {sortedBeds.length === 0 && searchTerm.trim() ? (
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 text-lg">Nenhum paciente encontrado.</p>
              <p className="text-sm text-gray-400 mt-2">
                Tente buscar por outro nome ou número de leito.
              </p>
            </CardContent>
          ) : (
            <BedsManagementGrid
              departmentBeds={bedsWithDischargeState}
              onReserveBed={handleReserveBed}
              onAdmitPatient={handleAdmitPatient}
              onEditPatient={handleEditPatient}
              onTransferPatient={handleTransferPatient}
              onDischargePatient={handleDischargePatient}
              onDeleteReservation={handleDeleteReservation}
              onDeleteBed={handleDeleteBed}
            />
          )}
        </Card>
      </ResponsiveDepartmentSelector>

      {/* Modais - Ajustados para melhor visualização em mobile */}
      <NewReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        onSubmit={submitReservation}
        bedId={selectedBedId}
        department={selectedDepartment}
      />

      <NewPatientForm
        isOpen={showPatientForm}
        onClose={() => {
          setShowPatientForm(false);
          setSelectedPatient(null);
          setIsEditingPatient(false);
        }}
        onSubmit={submitPatient}
        bedId={selectedBedId}
        department={selectedDepartment}
        isEditing={isEditingPatient}
        patientData={selectedPatient}
      />

      {selectedPatient && (
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
            setSelectedPatient(null);
          }}
          onSubmit={submitTransfer}
          patientName={selectedPatient.name}
          availableBeds={availableBedsForTransfer}
          currentDepartment={selectedPatient.department}
        />
      )}

      {/* Modais de gerenciamento */}
      <SectorManagementModal
        isOpen={showSectorModal}
        onClose={() => setShowSectorModal(false)}
        departments={departments}
      />

      <BedManagementModal
        isOpen={showBedModal}
        onClose={() => {
          setShowBedModal(false);
          setSelectedBedForEdit(null);
        }}
        departments={departments}
        bedData={selectedBedForEdit}
        isEditing={!!selectedBedForEdit}
      />
    </div>
  );
};

export default SupabaseBedsPanel;
