
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import PatientCard from './PatientCard';
import { useUpdateInvestigation } from '@/hooks/mutations/useInvestigationMutations';
import { generateInvestigationId, validateReadmissionData } from '@/utils/investigationUtils';
import { toast } from 'sonner';

interface ReadmissionPatientsProps {
  readmissions: any[];
  getInvestigationStatus: (alertKey: string, alertType: 'long_stay' | 'readmission_30_days') => any;
}

const ReadmissionPatients: React.FC<ReadmissionPatientsProps> = ({
  readmissions,
  getInvestigationStatus
}) => {
  const updateInvestigationMutation = useUpdateInvestigation();

  const handleInvestigate = async (readmission: any, investigated: boolean) => {
    console.log('🔍 Iniciando investigação de reinternação:', { 
      readmission, 
      investigated,
      patientName: readmission.patient_name 
    });
    
    // Validar dados da reinternação
    const validation = validateReadmissionData(readmission);
    if (!validation.isValid) {
      console.error('❌ Dados inválidos:', validation.errors);
      toast.error(`Erro nos dados: ${validation.errors.join(', ')}`);
      return;
    }
    
    const status = investigated ? 'investigated' : 'not_investigated';
    const actionText = investigated ? 'investigado' : 'não investigado';
    
    try {
      // Gerar chave única para a investigação
      const alertKey = generateInvestigationId(
        readmission.patient_name,
        readmission.discharge_date,
        readmission.readmission_date,
        'readmission_30_days'
      );
      
      console.log('🔑 Chave de investigação gerada:', alertKey);
      
      await updateInvestigationMutation.mutateAsync({
        alertKey,
        alertType: 'readmission_30_days',
        status,
        notes: `Reinternação em ${readmission.days_between} dias - Paciente: ${readmission.patient_name?.toString()?.trim()}`,
        patientName: readmission.patient_name
      });
      
      toast.success(`✅ Paciente ${readmission.patient_name} marcado como ${actionText}!`);
    } catch (error) {
      console.error('❌ Erro ao atualizar investigação:', {
        error,
        readmission,
        investigated,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      toast.error(`Erro ao marcar como ${actionText}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  if (readmissions.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Reinternações em Menos de 30 dias</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma reinternação em menos de 30 dias encontrada.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Reinternações em Menos de 30 dias</h2>
      
      <div className="space-y-3">
        {readmissions.map((readmission, index) => {
          // Validar dados antes de renderizar
          const validation = validateReadmissionData(readmission);
          if (!validation.isValid) {
            console.warn('⚠️ Dados inválidos para reinternação:', { 
              readmission, 
              errors: validation.errors 
            });
            return (
              <Card key={index} className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-600">Erro nos dados do paciente</p>
                      <p className="text-sm text-red-500">{validation.errors.join(', ')}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      Dados inválidos - verifique o registro
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          // Gerar chave única para buscar o status da investigação
          const alertKey = generateInvestigationId(
            readmission.patient_name,
            readmission.discharge_date,
            readmission.readmission_date,
            'readmission_30_days'
          );
          
          const investigation = getInvestigationStatus(alertKey, 'readmission_30_days');
          
          return (
            <PatientCard
              key={`${readmission.patient_name}-${readmission.discharge_date}-${index}`}
              patient={readmission}
              investigation={investigation}
              badgeText={`${readmission.days_between} dias`}
              onInvestigate={(investigated) => handleInvestigate(readmission, investigated)}
              isPending={updateInvestigationMutation.isPending}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Data da Alta</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{readmission.discharge_date}</span>
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 font-medium">Data da Reinternação</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>{readmission.readmission_date}</span>
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 font-medium">Cidade de Origem</p>
                  <p className="font-medium">{readmission.origin_city}</p>
                </div>
                
                <div className="col-span-2 md:col-span-3">
                  <p className="text-gray-600 font-medium">Diagnóstico</p>
                  <p className="font-medium">{readmission.diagnosis}</p>
                </div>
              </div>
            </PatientCard>
          );
        })}
      </div>
    </div>
  );
};

export default ReadmissionPatients;
