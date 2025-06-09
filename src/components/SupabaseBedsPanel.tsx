
import React from 'react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import BedCard from '@/components/BedCard';
import { Department } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SupabaseBedsPanelProps {
  onDataChange?: (data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  }) => void;
}

const SupabaseBedsPanel: React.FC<SupabaseBedsPanelProps> = ({ onDataChange }) => {
  const { centralData, isLoading, error, addPatient, dischargePatient, addReservation, transferPatient } = useSupabaseBeds();

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

  // Simple callback handlers that match BedCard's expected signatures
  const handleReserveBed = (bedId: string) => {
    // This would open a modal or form for bed reservation
    console.log('Reserve bed:', bedId);
  };

  const handleAdmitPatient = (bedId: string) => {
    // This would open a modal or form for patient admission
    console.log('Admit patient to bed:', bedId);
  };

  const handleEditPatient = (bedId: string) => {
    // This would open a modal or form for editing patient
    console.log('Edit patient in bed:', bedId);
  };

  const handleTransferPatient = (bedId: string) => {
    // This would open a modal or form for patient transfer
    console.log('Transfer patient from bed:', bedId);
  };

  const handleDischargePatient = (bedId: string) => {
    // This would open a modal or form for patient discharge
    console.log('Discharge patient from bed:', bedId);
  };

  const handleDeleteReservation = (bedId: string) => {
    // This would delete the reservation for the bed
    console.log('Delete reservation for bed:', bedId);
  };

  const handleDeleteBed = (bedId: string) => {
    // This would delete the custom bed
    console.log('Delete bed:', bedId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel de Leitos</h1>
        <div className="text-sm text-gray-600">
          {centralData.beds.filter(bed => bed.isOccupied).length} / {centralData.beds.length} leitos ocupados
        </div>
      </div>

      {departments.map(department => {
        const departmentBeds = centralData.beds.filter(bed => bed.department === department);
        const occupiedCount = departmentBeds.filter(bed => bed.isOccupied).length;
        const reservedCount = departmentBeds.filter(bed => bed.isReserved).length;
        const availableCount = departmentBeds.length - occupiedCount - reservedCount;

        return (
          <Card key={department}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{department}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">Disponíveis: {availableCount}</span>
                  <span className="text-red-600">Ocupados: {occupiedCount}</span>
                  <span className="text-yellow-600">Reservados: {reservedCount}</span>
                  <span className="text-gray-600">Total: {departmentBeds.length}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {departmentBeds.map(bed => (
                  <BedCard
                    key={bed.id}
                    bed={bed}
                    onReserveBed={handleReserveBed}
                    onAdmitPatient={handleAdmitPatient}
                    onEditPatient={handleEditPatient}
                    onTransferPatient={handleTransferPatient}
                    onDischargePatient={handleDischargePatient}
                    onDeleteReservation={handleDeleteReservation}
                    onDeleteBed={handleDeleteBed}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SupabaseBedsPanel;
