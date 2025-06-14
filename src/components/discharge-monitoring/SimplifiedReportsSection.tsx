
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, MapPin, Building2 } from 'lucide-react';
import { useDischargeStatsByDepartment, useDischargeStatsByCity } from '@/hooks/queries/useDischargeStatsQueries';
import { generateDepartmentTimeReport, generateCityTimeReport } from '@/utils/pdfReportGenerator';
import { toast } from 'sonner';
import { formatDateSaoPaulo } from '@/utils/timezoneUtils';

type ReportType = 'department' | 'city';
type TimePeriod = 'day' | 'week' | 'month' | 'custom';

const SimplifiedReportsSection: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('department');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Calcular datas baseadas no período selecionado
  const getDateRange = () => {
    const today = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    switch (timePeriod) {
      case 'day':
        startDate = endDate = formatDateSaoPaulo(today).split('/').reverse().join('-');
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        startDate = formatDateSaoPaulo(weekAgo).split('/').reverse().join('-');
        endDate = formatDateSaoPaulo(today).split('/').reverse().join('-');
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        startDate = formatDateSaoPaulo(monthAgo).split('/').reverse().join('-');
        endDate = formatDateSaoPaulo(today).split('/').reverse().join('-');
        break;
      case 'custom':
        startDate = customStartDate;
        endDate = customEndDate;
        break;
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();

  // Queries para buscar dados
  const { data: departmentStats = [], isLoading: loadingDept } = useDischargeStatsByDepartment(
    reportType === 'department' ? startDate : undefined,
    reportType === 'department' ? endDate : undefined
  );

  const { data: cityStats = [], isLoading: loadingCity } = useDischargeStatsByCity(
    reportType === 'city' ? startDate : undefined,
    reportType === 'city' ? endDate : undefined
  );

  const getPeriodLabel = () => {
    switch (timePeriod) {
      case 'day':
        return 'Hoje';
      case 'week':
        return 'Últimos 7 dias';
      case 'month':
        return 'Último mês';
      case 'custom':
        return 'Período personalizado';
      default:
        return '';
    }
  };

  const handleGenerateReport = () => {
    if (timePeriod === 'custom' && (!customStartDate || !customEndDate)) {
      toast.error('Selecione as datas de início e fim para o período personalizado.');
      return;
    }

    const periodLabel = getPeriodLabel();
    const displayStartDate = startDate ? formatDateSaoPaulo(startDate) : undefined;
    const displayEndDate = endDate ? formatDateSaoPaulo(endDate) : undefined;

    if (reportType === 'department') {
      if (departmentStats.length === 0) {
        toast.error('Não há dados de departamentos para o período selecionado.');
        return;
      }
      generateDepartmentTimeReport(departmentStats, periodLabel, displayStartDate, displayEndDate);
      toast.success('Relatório de tempo por departamento gerado com sucesso!');
    } else {
      if (cityStats.length === 0) {
        toast.error('Não há dados de municípios para o período selecionado.');
        return;
      }
      generateCityTimeReport(cityStats, periodLabel, displayStartDate, displayEndDate);
      toast.success('Relatório de tempo por município gerado com sucesso!');
    }
  };

  const isLoading = (reportType === 'department' && loadingDept) || (reportType === 'city' && loadingCity);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Relatórios de Tempo Médio de Alta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seleção do tipo de relatório */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Tipo de Relatório
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={reportType === 'department' ? 'default' : 'outline'}
              onClick={() => setReportType('department')}
              className="h-16 flex-col gap-2"
            >
              <Building2 className="h-6 w-6" />
              Por Departamento
            </Button>
            <Button
              variant={reportType === 'city' ? 'default' : 'outline'}
              onClick={() => setReportType('city')}
              className="h-16 flex-col gap-2"
            >
              <MapPin className="h-6 w-6" />
              Por Município
            </Button>
          </div>
        </div>

        {/* Seleção do período */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Período do Relatório
          </label>
          <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Dia</SelectItem>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="custom">Data personalizada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Datas personalizadas */}
        {timePeriod === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">De:</label>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Até:</label>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Preview dos dados */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Preview dos Dados:</h4>
          {isLoading ? (
            <p className="text-sm text-gray-600">Carregando dados...</p>
          ) : (
            <div className="text-sm text-gray-600">
              {reportType === 'department' ? (
                <p>
                  {departmentStats.length} departamentos encontrados • 
                  Total de altas: {departmentStats.reduce((sum, item) => sum + item.total_discharges, 0)}
                </p>
              ) : (
                <p>
                  {cityStats.length} municípios encontrados • 
                  Total de altas: {cityStats.reduce((sum, item) => sum + item.total_discharges, 0)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Botão para gerar relatório */}
        <Button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="w-full h-12"
        >
          <Download className="h-5 w-5 mr-2" />
          {isLoading ? 'Carregando dados...' : 'Gerar Relatório PDF'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimplifiedReportsSection;
