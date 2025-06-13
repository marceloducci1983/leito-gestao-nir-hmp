import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, Building, AlertCircle, FileText, Download, RefreshCw } from 'lucide-react';
import { useDischargeControl, useDepartmentStats } from '@/hooks/queries/useDischargeQueries';
import { useCancelDischarge, useCompleteDischarge } from '@/hooks/mutations/useDischargeMutations';
import { useDischargeStatsByDepartment, useDischargeStatsByCity, useDelayedDischarges, useDischargeGeneralStats } from '@/hooks/queries/useDischargeStatsQueries';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDateTimeSaoPaulo } from '@/utils/timezoneUtils';

const DischargeMonitoringPanel: React.FC = () => {
  const [justification, setJustification] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'oldest' | 'newest'>('oldest');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');

  // Queries
  const { data: dischargeControls = [], isLoading, refetch: refetchDischargeControl } = useDischargeControl();
  const { data: departmentStats = [] } = useDepartmentStats();
  const { data: dischargeStatsByDept = [], refetch: refetchStatsByDept } = useDischargeStatsByDepartment();
  const { data: dischargeStatsByCity = [], refetch: refetchStatsByCity } = useDischargeStatsByCity();
  const { data: delayedDischarges = [], refetch: refetchDelayedDischarges } = useDelayedDischarges();
  const { data: generalStats, refetch: refetchGeneralStats } = useDischargeGeneralStats();

  // Mutations
  const cancelDischargeMutation = useCancelDischarge();
  const completeDischargeMutation = useCompleteDischarge();

  const pendingDischarges = dischargeControls.filter(d => d.status === 'pending');
  const completedDischarges = dischargeControls.filter(d => d.status === 'completed');

  const filteredPendingDischarges = pendingDischarges
    .filter(discharge =>
      discharge.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discharge.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.discharge_requested_at).getTime();
      const dateB = new Date(b.discharge_requested_at).getTime();
      return sortBy === 'oldest' ? dateA - dateB : dateB - dateA;
    });

  // Converter dados para minutos
  const dischargeStatsByDeptInMinutes = dischargeStatsByDept.map(stat => ({
    ...stat,
    avg_minutes: Math.round((stat.avg_hours || 0) * 60)
  }));

  const dischargeStatsByCityInMinutes = dischargeStatsByCity.map(stat => ({
    ...stat,
    avg_minutes: Math.round((stat.avg_hours || 0) * 60)
  }));

  const delayedDischargesInMinutes = delayedDischarges.map(delayed => ({
    ...delayed,
    delay_minutes: Math.round((delayed.delay_hours || 0) * 60)
  }));

  const calculateWaitTime = (requestedAt: string) => {
    const requested = new Date(requestedAt);
    const now = new Date();
    const diffMs = now.getTime() - requested.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, isOverdue: hours >= 5 };
  };

  const handleEffectiveDischarge = (id: string) => {
    const discharge = dischargeControls.find(d => d.id === id);
    if (!discharge) return;

    const waitTime = calculateWaitTime(discharge.discharge_requested_at);
    
    if (waitTime.isOverdue && !justification[id]) {
      toast.error('É necessário justificar altas com mais de 5 horas de espera.');
      return;
    }

    completeDischargeMutation.mutate({ 
      dischargeId: id, 
      justification: waitTime.isOverdue ? justification[id] : undefined 
    });
  };

  const handleRefreshData = () => {
    toast.info('Atualizando dados...');
    refetchDischargeControl();
    refetchStatsByDept();
    refetchStatsByCity();
    refetchDelayedDischarges();
    refetchGeneralStats();
  };

  const generatePDFReport = (period: string) => {
    toast.success(`Gerando relatório ${period}...`);
    // Implementação da geração de PDF seria aqui
  };

  const generateCustomReport = () => {
    if (!reportStartDate || !reportEndDate) {
      toast.error('Selecione as datas de início e fim para o relatório personalizado.');
      return;
    }
    toast.success(`Gerando relatório de ${reportStartDate} até ${reportEndDate}...`);
    // Implementação da geração de PDF personalizado seria aqui
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando monitoramento de altas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Monitoramento de Altas</h1>
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            onClick={handleRefreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {pendingDischarges.length} altas pendentes
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Altas Pendentes ({pendingDischarges.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Dashboard Analítico
          </TabsTrigger>
          <TabsTrigger value="reports">
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Buscar por nome ou setor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Select value={sortBy} onValueChange={(value: 'oldest' | 'newest') => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oldest">Mais antigo primeiro</SelectItem>
                <SelectItem value="newest">Mais recente primeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPendingDischarges.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Nenhuma alta pendente no momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPendingDischarges.map((discharge) => {
                const waitTime = calculateWaitTime(discharge.discharge_requested_at);
                
                return (
                  <Card key={discharge.id} className={`${waitTime.isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{discharge.patient_name}</h3>
                            {waitTime.isOverdue && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Atrasado
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Tempo de Espera</p>
                              <p className={`flex items-center gap-1 font-medium ${waitTime.isOverdue ? 'text-red-600' : ''}`}>
                                <Clock className="h-4 w-4" />
                                {waitTime.hours}h {waitTime.minutes}m
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Solicitado em</p>
                              <p className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDateTimeSaoPaulo(discharge.discharge_requested_at)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Departamento</p>
                              <p className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {discharge.department}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Leito</p>
                              <p className="font-medium text-blue-600">
                                {discharge.bed_name || discharge.bed_id}
                              </p>
                            </div>
                          </div>

                          {waitTime.isOverdue && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-red-600">
                                Justificativa obrigatória (alta com mais de 5h):
                              </label>
                              <Textarea
                                placeholder="Descreva o motivo da demora..."
                                value={justification[discharge.id] || ''}
                                onChange={(e) => setJustification(prev => ({
                                  ...prev,
                                  [discharge.id]: e.target.value
                                }))}
                                className="border-red-200"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelDischargeMutation.mutate(discharge.id)}
                            className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                          >
                            Cancelar Alta
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEffectiveDischarge(discharge.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Alta Efetiva
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Debug info para verificar dados */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Debug - Status dos Dados</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Controles de Alta:</strong> {dischargeControls.length}</p>
                    <p><strong>Pendentes:</strong> {pendingDischarges.length}</p>
                    <p><strong>Completadas:</strong> {completedDischarges.length}</p>
                  </div>
                  <div>
                    <p><strong>Stats por Dept:</strong> {dischargeStatsByDept.length}</p>
                    <p><strong>Stats por Cidade:</strong> {dischargeStatsByCity.length}</p>
                    <p><strong>Altas Atrasadas:</strong> {delayedDischarges.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Alta por Departamento (minutos)</CardTitle>
              </CardHeader>
              <CardContent>
                {dischargeStatsByDeptInMinutes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum dado de estatísticas por departamento encontrado.</p>
                    <p className="text-sm">Dados aparecem após altas serem processadas.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dischargeStatsByDeptInMinutes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                      <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="avg_minutes" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Alta por Município (minutos)</CardTitle>
              </CardHeader>
              <CardContent>
                {dischargeStatsByCityInMinutes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum dado de estatísticas por município encontrado.</p>
                    <p className="text-sm">Dados aparecem após altas serem processadas.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dischargeStatsByCityInMinutes.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="origin_city" angle={-45} textAnchor="end" height={80} />
                      <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="avg_minutes" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Altas com Demora Superior a 5 Horas</CardTitle>
            </CardHeader>
            <CardContent>
              {delayedDischargesInMinutes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma alta com demora superior a 5 horas registrada.
                </p>
              ) : (
                <div className="space-y-3">
                  {delayedDischargesInMinutes.map((delayed, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-orange-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{delayed.patient_name}</h4>
                          <p className="text-sm text-gray-600">{delayed.department}</p>
                          <p className="text-sm">
                            Tempo de espera: <span className="font-medium text-orange-600">{delayed.delay_minutes}min</span>
                          </p>
                          <p className="text-sm">
                            Solicitado: {formatDateTimeSaoPaulo(delayed.discharge_requested_at)}
                          </p>
                          <p className="text-sm">
                            Efetivado: {formatDateTimeSaoPaulo(delayed.discharge_effective_at)}
                          </p>
                        </div>
                        {delayed.justification && (
                          <div className="max-w-md">
                            <p className="text-sm font-medium">Justificativa:</p>
                            <p className="text-sm text-gray-700">{delayed.justification}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gerar Relatórios em PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => generatePDFReport('mensal')}
                >
                  <Download className="h-6 w-6 mb-2" />
                  Relatório Mensal
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => generatePDFReport('trimestral')}
                >
                  <Download className="h-6 w-6 mb-2" />
                  Relatório Trimestral
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => generatePDFReport('semestral')}
                >
                  <Download className="h-6 w-6 mb-2" />
                  Relatório Semestral
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => generatePDFReport('anual')}
                >
                  <Download className="h-6 w-6 mb-2" />
                  Relatório Anual
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Período Personalizado</h4>
                <div className="flex gap-4 items-end">
                  <div>
                    <label className="text-sm text-gray-600">De:</label>
                    <Input 
                      type="date" 
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Até:</label>
                    <Input 
                      type="date" 
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                    />
                  </div>
                  <Button onClick={generateCustomReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DischargeMonitoringPanel;
