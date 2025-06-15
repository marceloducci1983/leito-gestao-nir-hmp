
import jsPDF from 'jspdf';
import { createPdfWithHeader, addTableHeader, checkPageBreak } from './pdfHelpers';

interface DepartmentStats {
  department: string;
  avg_hours: number;
  total_discharges: number;
  delayed_discharges: number;
}

interface CityStats {
  origin_city: string;
  avg_hours: number;
  total_discharges: number;
}

interface DelayedDischarge {
  patient_name: string;
  department: string;
  delay_hours: number;
  discharge_requested_at: string;
  discharge_effective_at: string;
  justification?: string;
}

export const generateAnalyticsDashboardReport = (
  departmentStats: DepartmentStats[],
  cityStats: CityStats[],
  delayedDischarges: DelayedDischarge[]
) => {
  const { doc, yPosition: initialY } = createPdfWithHeader(
    'DASHBOARD ANALÍTICO - MONITORAMENTO DE ALTAS',
    'Relatório de Tempos Médios de Alta'
  );

  let yPosition = initialY;
  const margin = 20;

  // Informação sobre metodologia
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('METODOLOGIA DE CÁLCULO:', margin, yPosition);
  yPosition += 15;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Os tempos são calculados a partir das 07:00h da manhã do dia da solicitação', margin, yPosition);
  doc.text('de alta até o momento da efetivação, proporcionando uma visão padronizada', margin, yPosition + 10);
  doc.text('dos tempos de processamento.', margin, yPosition + 20);
  yPosition += 40;

  // Seção 1: Tempo Médio por Departamento
  yPosition = checkPageBreak(doc, yPosition, 80);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TEMPO MÉDIO DE ALTA POR DEPARTAMENTO (MINUTOS)', margin, yPosition);
  yPosition += 20;

  if (departmentStats.length > 0) {
    // Estatísticas gerais dos departamentos
    const totalDeptDischarges = departmentStats.reduce((sum, item) => sum + item.total_discharges, 0);
    const avgDeptOverall = departmentStats.reduce((sum, item) => sum + (item.avg_hours * item.total_discharges), 0) / totalDeptDischarges;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total de altas processadas: ${totalDeptDischarges}`, margin, yPosition);
    doc.text(`Tempo médio geral: ${(avgDeptOverall * 60).toFixed(0)} minutos`, margin, yPosition + 10);
    yPosition += 25;

    // Cabeçalho da tabela de departamentos
    const deptHeaders = ['DEPARTAMENTO', 'TEMPO MÉDIO (min)', 'TOTAL ALTAS', 'ATRASOS'];
    const deptPositions = [margin, margin + 80, margin + 140, margin + 180];
    
    yPosition = addTableHeader(doc, deptHeaders, deptPositions, yPosition);

    // Dados da tabela de departamentos
    doc.setFont('helvetica', 'normal');
    departmentStats.forEach((item) => {
      yPosition = checkPageBreak(doc, yPosition);
      
      const avgMinutes = Math.round(item.avg_hours * 60);
      
      doc.text(item.department.substring(0, 25), deptPositions[0], yPosition);
      doc.text(`${avgMinutes}min`, deptPositions[1], yPosition);
      doc.text(item.total_discharges.toString(), deptPositions[2], yPosition);
      doc.text(item.delayed_discharges.toString(), deptPositions[3], yPosition);
      yPosition += 12;
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.text('Nenhum dado de departamento encontrado.', margin, yPosition);
  }

  yPosition += 30;

  // Seção 2: Tempo Médio por Município
  yPosition = checkPageBreak(doc, yPosition, 80);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TEMPO MÉDIO DE ALTA POR MUNICÍPIO (MINUTOS)', margin, yPosition);
  yPosition += 20;

  if (cityStats.length > 0) {
    // Estatísticas gerais dos municípios
    const totalCityDischarges = cityStats.reduce((sum, item) => sum + item.total_discharges, 0);
    const avgCityOverall = cityStats.reduce((sum, item) => sum + (item.avg_hours * item.total_discharges), 0) / totalCityDischarges;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total de altas processadas: ${totalCityDischarges}`, margin, yPosition);
    doc.text(`Tempo médio geral: ${(avgCityOverall * 60).toFixed(0)} minutos`, margin, yPosition + 10);
    doc.text(`Municípios atendidos: ${cityStats.length}`, margin, yPosition + 20);
    yPosition += 35;

    // Cabeçalho da tabela de municípios (Top 10)
    const cityHeaders = ['MUNICÍPIO', 'TEMPO MÉDIO (min)', 'TOTAL ALTAS'];
    const cityPositions = [margin, margin + 100, margin + 170];
    
    yPosition = addTableHeader(doc, cityHeaders, cityPositions, yPosition);

    // Dados da tabela de municípios (limitado aos 10 primeiros)
    doc.setFont('helvetica', 'normal');
    const topCities = cityStats.slice(0, 10);
    topCities.forEach((item) => {
      yPosition = checkPageBreak(doc, yPosition);
      
      const avgMinutes = Math.round(item.avg_hours * 60);
      const cityName = (item.origin_city || 'Não informado').substring(0, 30);
      
      doc.text(cityName, cityPositions[0], yPosition);
      doc.text(`${avgMinutes}min`, cityPositions[1], yPosition);
      doc.text(item.total_discharges.toString(), cityPositions[2], yPosition);
      yPosition += 12;
    });

    if (cityStats.length > 10) {
      yPosition += 10;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(`* Exibindo top 10 de ${cityStats.length} municípios`, margin, yPosition);
    }
  } else {
    doc.setFont('helvetica', 'normal');
    doc.text('Nenhum dado de município encontrado.', margin, yPosition);
  }

  yPosition += 30;

  // Seção 3: Resumo de Altas Atrasadas
  if (delayedDischarges.length > 0) {
    yPosition = checkPageBreak(doc, yPosition, 60);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('ALTAS COM ATRASO (> 5 HORAS)', margin, yPosition);
    yPosition += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total de altas atrasadas: ${delayedDischarges.length}`, margin, yPosition);
    yPosition += 15;

    // Mostrar apenas as 5 altas mais atrasadas
    const topDelayed = delayedDischarges.slice(0, 5);
    topDelayed.forEach((delayed, index) => {
      yPosition = checkPageBreak(doc, yPosition);
      
      const delayMinutes = Math.round(delayed.delay_hours * 60);
      
      doc.text(`${index + 1}. ${delayed.patient_name} - ${delayed.department}`, margin, yPosition);
      doc.text(`   Tempo de atraso: ${delayMinutes} minutos`, margin, yPosition + 10);
      yPosition += 25;
    });

    if (delayedDischarges.length > 5) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(`* Exibindo top 5 de ${delayedDischarges.length} altas atrasadas`, margin, yPosition);
    }
  }

  // Salvar PDF
  doc.save(`dashboard-analitico-altas-${new Date().getTime()}.pdf`);
};
