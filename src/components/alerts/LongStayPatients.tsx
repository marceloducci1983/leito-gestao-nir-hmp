
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';
import PatientCard from './PatientCard';
import { useUpdateInvestigation } from '@/hooks/mutations/useInvestigationMutations';
import { toast } from 'sonner';

interface LongStayPatientsProps {
  patients: any[];
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  getInvestigationStatus: (alertKey: string, alertType: 'long_stay' | 'readmission_30_days') => any;
}

const LongStayPatients: React.FC<LongStayPatientsProps> = ({
  patients,
  sortOrder,
  setSortOrder,
  getInvestigationStatus
}) => {
  const updateInvestigationMutation = useUpdateInvestigation();

  const handleInvestigate = async (patient: any, investigated: boolean) => {
    const status = investigated ? 'investigated' : 'not_investigated';
    const message = investigated ? 'marcar como investigado' : 'marcar como não investigado';
    
    if (confirm(`Deseja ${message} este alerta?`)) {
      try {
        // Usar ID do paciente como alert_key para internações longas
        const alertKey = `long_stay_${patient.id}`;
        
        await updateInvestigationMutation.mutateAsync({
          alertKey,
          patientId: patient.id,
          alertType: 'long_stay',
          status,
          notes: 'Permanência longa investigada via painel de alertas',
          patientName: patient.name
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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Pacientes com Permanência Superior a 15 dias</h2>
        <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Maior tempo primeiro</SelectItem>
            <SelectItem value="asc">Menor tempo primeiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {patients.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhum paciente com mais de 15 dias de internação.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => {
            // Usar dias calculados em tempo real, com fallback para occupation_days e cálculo manual
            const daysInHospital = patient.calculatedDays || 
                                 patient.occupation_days || 
                                 Math.floor((new Date().getTime() - new Date(patient.admissionDate || patient.admission_date).getTime()) / (1000 * 60 * 60 * 24));
            
            const alertKey = `long_stay_${patient.id}`;
            const investigation = getInvestigationStatus(alertKey, 'long_stay');
            
            console.log('Renderizando paciente:', {
              name: patient.name,
              admissionDate: patient.admissionDate || patient.admission_date,
              calculatedDays: patient.calculatedDays,
              occupationDays: patient.occupation_days,
              daysInHospital,
              investigation
            });
            
            return (
              <PatientCard
                key={patient.id}
                patient={patient}
                investigation={investigation}
                badgeText={`${daysInHospital} dias`}
                onInvestigate={(investigated) => handleInvestigate(patient, investigated)}
                isPending={updateInvestigationMutation.isPending}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Data de Admissão</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {patient.admissionDate || patient.admission_date}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Hora de Admissão</p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {patient.admissionTime || patient.admission_time || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Cidade de Origem</p>
                    <p>{patient.originCity || patient.origin_city}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">TFD</p>
                    <p>{(patient.isTFD || patient.is_tfd) ? (patient.tfdType || patient.tfd_type || 'Sim') : 'Não'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600">Data Provável de Alta</p>
                  <p>{patient.expectedDischargeDate || patient.expected_discharge_date || 'Não definida'}</p>
                </div>
              </PatientCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LongStayPatients;
