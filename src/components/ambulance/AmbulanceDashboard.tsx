
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Calendar, FileText } from 'lucide-react';
import { useAmbulanceStatsByCity } from '@/hooks/queries/useAmbulanceQueries';
import { toast } from 'sonner';

const AmbulanceDashboard: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const getDateRange = () => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    switch (filterPeriod) {
      case 'today':
        return { startDate: formatDate(today), endDate: formatDate(today) };
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { startDate: formatDate(weekAgo), endDate: formatDate(today) };
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return { startDate: formatDate(monthAgo), endDate: formatDate(today) };
      case 'custom':
        return { startDate: customStartDate, endDate: customEndDate };
      default:
        return { startDate: undefined, endDate: undefined };
    }
  };

  const { startDate, endDate } = getDateRange();
  const { data: statsData = [], isLoading } = useAmbulanceStatsByCity(startDate, endDate);

  const exportToPDF = () => {
    toast.info('Funcionalidade de exportação PDF em desenvolvimento');
  };

  const exportToExcel = () => {
    toast.info('Funcionalidade de exportação Excel em desenvolvimento');
  };

  const getPeriodLabel = () => {
    switch (filterPeriod) {
      case 'today': return 'Hoje';
      case 'week': return 'Últimos 7 dias';
      case 'month': return 'Últimos 30 dias';
      case 'custom': return 'Período personalizado';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard - Tempo Médio por Município</h2>
        <div className="flex space-x-2">
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Filtros de Período</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="period">Período</Label>
              <Select value={filterPeriod} onValueChange={(value) => setFilterPeriod(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Últimos 30 dias</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterPeriod === 'custom' && (
              <>
                <div>
                  <Label htmlFor="start-date">Data Início</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Data Fim</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Tempo Médio de Resposta por Município - {getPeriodLabel()}
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Apenas solicitações de ambulância)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statsData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum dado encontrado para o período selecionado.</p>
              <p className="text-sm mt-2">
                Dados aparecem após solicitações de ambulância serem confirmadas.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={statsData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="origin_city" 
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: number) => [`${value} min`, 'Tempo Médio']}
                    labelFormatter={(label) => `Cidade: ${label}`}
                  />
                  <Bar dataKey="avg_response_time_minutes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {statsData.reduce((sum, item) => sum + (item.total_requests || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total de Solicitações</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {statsData.reduce((sum, item) => sum + (item.confirmed_requests || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Transportes Confirmados</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {statsData.length > 0 
                        ? Math.round(
                            statsData.reduce((sum, item) => sum + (item.avg_response_time_minutes || 0), 0) / 
                            statsData.filter(item => item.avg_response_time_minutes).length
                          ) 
                        : 0} min
                    </div>
                    <div className="text-sm text-gray-600">Tempo Médio Geral</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbulanceDashboard;
