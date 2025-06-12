
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUpdateInvestigation } from '@/hooks/mutations/useInvestigationMutations';

const AlertsPanel: React.FC = () => {
  const { centralData, isLoading } = useSupabaseBeds();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Calcular pacientes com mais de 15 dias
  const longStayPatients = centralData.beds
    .filter(bed => bed.isOccupied && bed.patient)
    .map(bed => bed.patient)
    .filter(patient => {
      const admissionDate = new Date(patient.admissionDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 15;
    })
    .sort((a, b) => {
      const daysA = Math.floor((new Date().getTime() - new Date(a.admissionDate).getTime()) / (1000 * 60 * 60 * 24));
      const daysB = Math.floor((new Date().getTime() - new Date(b.admissionDate).getTime()) / (1000 * 60 * 60 * 24));
      return sortOrder === 'desc' ? daysB - daysA : daysA - daysB;
    });

  // Buscar reinternações em menos de 30 dias
  const { data: readmissions = [] } = useQuery({
    queryKey: ['readmissions'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_readmissions_within_30_days');
      if (error) throw error;
      return data;
    }
  });

  // Buscar investigações
  const { data: investigations = [] } = useQuery({
    queryKey: ['alert_investigations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_investigations')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Usar hook de mutation atualizado
  const updateInvestigationMutation = useUpdateInvestigation();

  const handleInvestigate = async (patientId: string, alertType: 'long_stay' | 'readmission_30_days', investigated: boolean) => {
    const status = investigated ? 'investigated' : 'not_investigated';
    const message = investigated ? 'marcar como investigado' : 'marcar como não investigado';
    
    if (confirm(`Deseja ${message} este alerta?`)) {
      try {
        await updateInvestigationMutation.mutateAsync({
          patientId,
          alertType,
          status,
          notes: alertType === 'readmission_30_days' ? 'Reinternação investigada via painel de alertas' : 'Permanência longa investigada via painel de alertas'
        });
      } catch (error) {
        console.error('Erro ao atualizar investigação:', error);
      }
    }
  };

  const getInvestigationStatus = (patientId: string, alertType: 'long_stay' | 'readmission_30_days') => {
    return investigations.find(inv => inv.patient_id === patientId && inv.alert_type === alertType);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando alertas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Alertas de Intervenção</h1>
        <div className="flex gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            {longStayPatients.length + readmissions.length} alertas
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="long-stay" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="long-stay">
            Internações + 15 dias ({longStayPatients.length})
          </TabsTrigger>
          <TabsTrigger value="readmissions">
            Reinternações - 30 dias ({readmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="long-stay" className="space-y-4">
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

          {longStayPatients.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Nenhum paciente com mais de 15 dias de internação.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {longStayPatients.map((patient) => {
                const daysInHospital = Math.floor((new Date().getTime() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24));
                const investigation = getInvestigationStatus(patient.id, 'long_stay');
                
                return (
                  <Card key={patient.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <Badge variant="destructive">{daysInHospital} dias</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Data de Admissão</p>
                              <p className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {patient.admissionDate}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Hora de Admissão</p>
                              <p className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {patient.admissionTime || 'Não informado'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Cidade de Origem</p>
                              <p>{patient.originCity}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">TFD</p>
                              <p>{patient.isTFD ? patient.tfdType || 'Sim' : 'Não'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Diagnóstico</p>
                            <p>{patient.diagnosis}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Data Provável de Alta</p>
                            <p>{patient.expectedDischargeDate || 'Não definida'}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {investigation?.investigation_status === 'investigated' ? (
                            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Investigado
                            </Badge>
                          ) : investigation?.investigation_status === 'not_investigated' ? (
                            <Badge variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Não Investigado
                            </Badge>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-50 hover:bg-green-100 border-green-200"
                                onClick={() => handleInvestigate(patient.id, 'long_stay', true)}
                                disabled={updateInvestigationMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                                Investigado
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-50 hover:bg-red-100 border-red-200"
                                onClick={() => handleInvestigate(patient.id, 'long_stay', false)}
                                disabled={updateInvestigationMutation.isPending}
                              >
                                <XCircle className="h-4 w-4" />
                                Não Investigado
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="readmissions" className="space-y-4">
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
                // Criar um ID único para reinternações baseado no nome do paciente e data
                const readmissionId = `${readmission.patient_name}_${readmission.discharge_date}_${readmission.readmission_date}`.replace(/\s+/g, '_');
                const investigation = getInvestigationStatus(readmissionId, 'readmission_30_days');
                
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{readmission.patient_name}</h3>
                            <Badge variant="destructive">{readmission.days_between} dias</Badge>
                          </div>
                          
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
                          
                          <div>
                            <p className="text-gray-600">Diagnóstico</p>
                            <p>{readmission.diagnosis}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {investigation?.investigation_status === 'investigated' ? (
                            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Investigado
                            </Badge>
                          ) : investigation?.investigation_status === 'not_investigated' ? (
                            <Badge variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Não Investigado
                            </Badge>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-50 hover:bg-green-100 border-green-200"
                                onClick={() => handleInvestigate(readmissionId, 'readmission_30_days', true)}
                                disabled={updateInvestigationMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                                Investigado
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-50 hover:bg-red-100 border-red-200"
                                onClick={() => handleInvestigate(readmissionId, 'readmission_30_days', false)}
                                disabled={updateInvestigationMutation.isPending}
                              >
                                <XCircle className="h-4 w-4" />
                                Não Investigado
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsPanel;
