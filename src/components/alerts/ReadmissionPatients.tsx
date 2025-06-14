
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import PatientCard from './PatientCard';
import { useUpdateInvestigation } from '@/hooks/mutations/useInvestigationMutations';
import { toast } from 'sonner';

interface ReadmissionPatientsProps {
  readmissions: any[];
  getInvestigationStatus: (patientId: string, alertType: 'long_stay' | 'readmission_30_days') => any;
}

const ReadmissionPatients: React.FC<ReadmissionPatientsProps> = ({
  readmissions,
  getInvestigationStatus
}) => {
  const updateInvestigationMutation = useUpdateInvestigation();

  const handleInvestigate = async (readmission: any, investigated: boolean) => {
    const status = investigated ? 'investigated' : 'not_investigated';
    const message = investigated ? 'marcar como investigado' : 'marcar como não investigado';
    
    if (confirm(`Deseja ${message} este alerta?`)) {
      try {
        // Usar uma combinação mais limpa para o ID único
        const uniqueId = `readmission_${readmission.patient_name.replace(/\s+/g, '_')}_${readmission.discharge_date}_${readmission.readmission_date}`;
        
        await updateInvestigationMutation.mutateAsync({
          patientId: uniqueId,
          alertType: 'readmission_30_days',
          status,
          notes: `Reinternação em ${readmission.days_between} dias - Paciente: ${readmission.patient_name}`
        });
        
        toast.success(`Alerta ${investigated ? 'marcado como investigado' : 'marcado como não investigado'} com sucesso!`);
      } catch (error) {
        console.error('Erro ao atualizar investigação:', error);
        toast.error('Erro ao atualizar status da investigação');
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
            // Usar a mesma lógica para gerar o ID único
            const uniqueId = `readmission_${readmission.patient_name.replace(/\s+/g, '_')}_${readmission.discharge_date}_${readmission.readmission_date}`;
            const investigation = getInvestigationStatus(uniqueId, 'readmission_30_days');
            
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
