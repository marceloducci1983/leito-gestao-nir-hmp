
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Calendar, FileText } from 'lucide-react';
import { useAmbulanceStatsByCity, useAmbulanceStatsByCityAndSector } from '@/hooks/queries/useAmbulanceQueries';
import { toast } from 'sonner';
import AmbulanceStatsTable from './AmbulanceStatsTable';
import AmbulanceStatsCharts from './AmbulanceStatsCharts';
import { exportToPDF, exportToExcel } from '@/utils/ambulanceExportUtils';

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
  const { data: statsByCity = [], isLoading: isLoadingByCity } = useAmbulanceStatsByCity(startDate, endDate);
  const { data: statsByCityAndSector = [], isLoading: isLoadingByCityAndSector } = useAmbulanceStatsByCityAndSector(startDate, endDate);

  const isLoading = isLoadingByCity || isLoadingByCityAndSector;

  const handleExportToPDF = () => {
    if (statsByCity.length === 0 && statsByCityAndSector.length === 0) {
      toast.error('Nenhum dado disponível para exportar');
      return;
    }
    
    try {
      exportToPDF(statsByCityAndSector, statsByCity, getPeriodLabel());
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar PDF');
    }
  };

  const handleExportToExcel = () => {
    if (statsByCity.length === 0 && statsByCityAndSector.length === 0) {
      toast.error('Nenhum dado disponível para exportar');
      return;
    }
    
    try {
      exportToExcel(statsByCityAndSector, statsByCity, getPeriodLabel());
      toast.success('Excel exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar Excel');
    }
  };

  const getPeriodLabel = () => {
    switch (filterPeriod) {
      case 'today': return 'Hoje';
      case 'week': return 'Últimos 7 dias';
      case 'month': return 'Últimos 30 dias';
      case 'custom': 
        return customStartDate && customEndDate 
          ? `${customStartDate} até ${customEndDate}` 
          : 'Período personalizado';
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
        <h2 className="text-2xl font-bold">Dashboard - Ambulância</h2>
        <div className="flex space-x-2">
          <Button onClick={handleExportToPDF} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button onClick={handleExportToExcel} variant="outline" size="sm">
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

      {/* Tabelas de Estatísticas */}
      <AmbulanceStatsTable
        statsByCityAndSector={statsByCityAndSector}
        statsByCity={statsByCity}
        isLoading={isLoading}
      />

      {/* Gráficos */}
      <AmbulanceStatsCharts
        statsByCity={statsByCity}
        isLoading={isLoading}
      />

      {/* Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statsByCity.reduce((sum, item) => sum + (item.total_requests || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total de Solicitações</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {statsByCity.reduce((sum, item) => sum + (item.confirmed_requests || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Transportes Confirmados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {statsByCity.length > 0 
                ? Math.round(
                    statsByCity.reduce((sum, item) => sum + (item.avg_response_time_minutes || 0), 0) / 
                    statsByCity.filter(item => item.avg_response_time_minutes).length
                  ) 
                : 0} min
            </div>
            <div className="text-sm text-gray-600">Tempo Médio Geral</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmbulanceDashboard;
