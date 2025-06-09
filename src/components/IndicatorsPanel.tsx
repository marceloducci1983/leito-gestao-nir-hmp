
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Printer, Activity, Users, Clock, TrendingUp, Building } from 'lucide-react';
import IndicatorCard from './indicators/IndicatorCard';
import DateRangePicker from './indicators/DateRangePicker';
import OccupationChart from './indicators/OccupationChart';
import { useIndicators } from '@/hooks/useIndicators';
import { Bed, DischargedPatient } from '@/types';
import { DateFilter } from '@/types/indicators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface IndicatorsPanelProps {
  beds: Bed[];
  archivedPatients: DischargedPatient[];
}

const IndicatorsPanel: React.FC<IndicatorsPanelProps> = ({ 
  beds, 
  archivedPatients 
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: today,
    endDate: today
  });
  
  const indicators = useIndicators(beds, archivedPatients, dateFilter);
  const { toast } = useToast();

  const getOccupationColor = (rate: number) => {
    if (rate >= 85) return 'red';
    if (rate >= 70) return 'yellow';
    return 'green';
  };

  const handlePrintPDF = async () => {
    try {
      const element = document.getElementById('indicators-dashboard');
      if (!element) return;

      toast({
        title: "Gerando relatório...",
        description: "Por favor, aguarde enquanto o PDF é criado.",
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Header
      pdf.setFontSize(16);
      pdf.text('RELATÓRIO DE INDICADORES - NIR - HMP', pdfWidth / 2, 15, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Período: ${dateFilter.startDate} até ${dateFilter.endDate}`, pdfWidth / 2, 25, { align: 'center' });
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pdfWidth / 2, 30, { align: 'center' });

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      pdf.save(`indicadores_${dateFilter.startDate}_${dateFilter.endDate}.pdf`);

      toast({
        title: "Relatório gerado com sucesso!",
        description: "O arquivo PDF foi baixado.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível criar o arquivo PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">INDICADORES</h2>
          <p className="text-gray-600">Dashboard de indicadores hospitalares em tempo real</p>
        </div>
        <Button onClick={handlePrintPDF} className="gap-2">
          <Printer className="h-4 w-4" />
          IMPRIMIR PDF
        </Button>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker 
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      {/* Dashboard Content */}
      <div id="indicators-dashboard" className="space-y-6">
        
        {/* Main Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Taxa de Ocupação Geral */}
          <IndicatorCard
            title="TAXA DE OCUPAÇÃO GERAL"
            value={`${indicators.occupationRate}%`}
            subtitle={`${indicators.occupiedBeds}/${indicators.totalBeds} leitos ocupados`}
            color={getOccupationColor(indicators.occupationRate)}
            icon={<Activity className="h-5 w-5" />}
          />

          {/* Pacientes Dia Geral */}
          <IndicatorCard
            title="PACIENTES DIA GERAL"
            value={indicators.dailyPatients}
            subtitle="Admissões hoje"
            color="blue"
            icon={<Users className="h-5 w-5" />}
          />

          {/* Total de Leitos */}
          <IndicatorCard
            title="TOTAL DE LEITOS"
            value={indicators.totalBeds}
            subtitle="Capacidade total"
            color="green"
            icon={<Building className="h-5 w-5" />}
          />

          {/* Média Geral de Permanência */}
          <IndicatorCard
            title="TEMPO MÉDIO GERAL"
            value={`${indicators.averageStayByDepartment.reduce((acc, dept) => 
              acc + (dept.averageStayDays * dept.totalDischarges), 0) / 
              indicators.averageStayByDepartment.reduce((acc, dept) => 
              acc + dept.totalDischarges, 0) || 0}`.slice(0, 4)} 
            subtitle="Dias de permanência"
            color="yellow"
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Taxa de Ocupação por Departamento - Gráfico de Barras */}
          <IndicatorCard
            title="TAXA DE OCUPAÇÃO POR SETOR"
            value=""
            color="blue"
          >
            <OccupationChart data={indicators.occupationByDepartment} type="bar" />
          </IndicatorCard>

          {/* Pacientes por Setor */}
          <IndicatorCard
            title="PACIENTES DIA POR SETOR"
            value=""
            color="green"
          >
            <div className="space-y-2">
              {indicators.dailyPatientsByDepartment.map((dept, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-xs font-medium">{dept.department}</span>
                  <span className="text-sm font-bold text-green-600">{dept.dailyAdmissions}</span>
                </div>
              ))}
            </div>
          </IndicatorCard>
        </div>

        {/* Tempo Médio de Permanência por Setor */}
        <IndicatorCard
          title="TEMPO MÉDIO DE PERMANÊNCIA POR SETOR"
          value=""
          color="yellow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {indicators.averageStayByDepartment.map((dept, index) => (
              <div key={index} className="p-3 bg-white rounded border">
                <div className="text-xs font-medium text-gray-600 mb-1">{dept.department}</div>
                <div className="text-lg font-bold text-yellow-600">{dept.averageStayDays} dias</div>
                <div className="text-xs text-gray-500">{dept.totalDischarges} altas no período</div>
              </div>
            ))}
          </div>
        </IndicatorCard>

        {/* Detalhamento por Setor */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicators.occupationByDepartment.map((dept, index) => (
            <IndicatorCard
              key={index}
              title={dept.department}
              value={`${dept.occupationRate.toFixed(1)}%`}
              subtitle={`${dept.occupiedBeds}/${dept.totalBeds} leitos`}
              color={getOccupationColor(dept.occupationRate)}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndicatorsPanel;
