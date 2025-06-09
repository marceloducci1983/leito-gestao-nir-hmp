
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, Building, AlertCircle, FileText, TrendingUp } from 'lucide-react';
import { useDischargeControl, useReadmissions, useDepartmentStats } from '@/hooks/queries/useDischargeQueries';
import { useCancelDischarge, useCompleteDischarge } from '@/hooks/mutations/useDischargeMutations';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const DischargeMonitoringPanel: React.FC = () => {
  const [justification, setJustification] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'oldest' | 'newest'>('oldest');

  // Queries
  const { data: dischargeControls = [], isLoading } = useDischargeControl();
  const { data: readmissions = [] } = useReadmissions();
  const { data: departmentStats = [] } = useDepartmentStats();

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

  // Preparar dados para gráficos
  const avgDischargeTimeData = departmentStats.map(stat => ({
    name: stat.department,
    tempo: Math.random() * 3 + 2, // Dados simulados - substituir por dados reais
    ocupacao: stat.occupation_rate
  }));

  const readmissionTrendData = [
    { month: 'Jan', readmissions: 12 },
    { month: 'Fev', readmissions: 8 },
    { month: 'Mar', readmissions: 15 },
    { month: 'Abr', readmissions: 10 },
    { month: 'Mai', readmissions: 7 },
    { month: 'Jun', readmissions: 9 }
  ];

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
        <div className="flex gap-4">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {pendingDischarges.length} altas pendentes
          </Badge>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {readmissions.length} reinternações (30 dias)
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Altas Pendentes ({pendingDischarges.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Dashboard Analítico
          </TabsTrigger>
          <TabsTrigger value="readmissions">
            Reinternações ({readmissions.length})
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
                                {new Date(discharge.discharge_requested_at).toLocaleString()}
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
                              <p>{discharge.bed_id}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Alta por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={avgDischargeTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="tempo" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Ocupação por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Taxa de Ocupação']} />
                    <Bar dataKey="occupation_rate" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendência de Reinternações (Últimos 6 Meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={readmissionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="readmissions" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readmissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Reinternações em 30 Dias
              </CardTitle>
            </CardHeader>
            <CardContent>
              {readmissions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma reinternação registrada nos últimos 30 dias.
                </p>
              ) : (
                <div className="space-y-3">
                  {readmissions.map((readmission, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{readmission.patient_name}</h4>
                        <Badge variant="outline">{readmission.days_between} dias</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Alta:</span> {new Date(readmission.discharge_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Reinternação:</span> {new Date(readmission.readmission_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Diagnóstico:</span> {readmission.diagnosis}
                        </div>
                        <div>
                          <span className="font-medium">Origem:</span> {readmission.origin_city}
                        </div>
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
              <CardTitle>Gerar Relatórios em PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Relatório Mensal
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Relatório Trimestral
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Relatório Semestral
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Relatório Anual
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Período Personalizado
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Período Personalizado</h4>
                <div className="flex gap-4 items-end">
                  <div>
                    <label className="text-sm text-gray-600">De:</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Até:</label>
                    <Input type="date" />
                  </div>
                  <Button>Gerar PDF</Button>
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
