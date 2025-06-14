
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
    console.log('Iniciando investigação:', { readmission, investigated });
    
    // Validar dados da reinternação
    const validation = validateReadmissionData(readmission);
    if (!validation.isValid) {
      console.error('Dados inválidos:', validation.errors);
      toast.error(`Erro nos dados: ${validation.errors.join(', ')}`);
      return;
    }
    
    const status = investigated ? 'investigated' : 'not_investigated';
    const message = investigated ? 'marcar como investigado' : 'marcar como não investigado';
    
    if (confirm(`Deseja ${message} este alerta?`)) {
      try {
        // Gerar chave única usando a função utilitária
        const alertKey = generateInvestigationId(
          readmission.patient_name,
          readmission.discharge_date,
          readmission.readmission_date,
          'readmission_30_days'
        );
        
        console.log('Atualizando investigação com alert_key:', alertKey);
        
        await updateInvestigationMutation.mutateAsync({
          alertKey,
          alertType: 'readmission_30_days',
          status,
          notes: `Reinternação em ${readmission.days_between} dias - Paciente: ${readmission.patient_name?.toString()?.trim()}`
        });
        
        toast.success(`Alerta ${investigated ? 'marcado como investigado' : 'marcado como não investigado'} com sucesso!`);
      } catch (error) {
        console.error('Erro detalhado ao atualizar investigação:', {
          error,
          readmission,
          investigated,
          errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        toast.error(`Erro ao atualizar status: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Reinternações em Menos de 30 dias</h2>
      
      {readmissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma reinternação em menos de 30 dias encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {readmissions.map((readmission, index) => {
            // Validar dados antes de renderizar
            const validation = validateReadmissionData(readmission);
            if (!validation.isValid) {
              console.warn('Dados inválidos para reinternação:', { readmission, errors: validation.errors });
              return (
                <Card key={index} className="border-red-200">
                  <CardContent className="p-4">
                    <p className="text-red-600">Erro nos dados: {validation.errors.join(', ')}</p>
                    <pre className="text-xs mt-2 text-gray-500">{JSON.stringify(readmission, null, 2)}</pre>
                  </CardContent>
                </Card>
              );
            }
            
            // Gerar chave única usando a função utilitária
            const alertKey = generateInvestigationId(
              readmission.patient_name,
              readmission.discharge_date,
              readmission.readmission_date,
              'readmission_30_days'
            );
            
            const investigation = getInvestigationStatus(alertKey, 'readmission_30_days');
            
            return (
              <PatientCard
                key={index}
                patient={readmission}
                investigation={investigation}
                badgeText={`${readmission.days_between} dias`}
                onInvestigate={(investigated) => handleInvestigate(readmission, investigated)}
                isPending={updateInvestigationMutation.isPending}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Data da Alta</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {readmission.discharge_date}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Data da Reinternação</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {readmission.readmission_date}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Cidade de Origem</p>
                    <p>{readmission.origin_city}</p>
                  </div>
                </div>
              </PatientCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReadmissionPatients;
