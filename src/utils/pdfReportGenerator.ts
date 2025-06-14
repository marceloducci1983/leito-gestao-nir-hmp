
import jsPDF from 'jspdf';
import { formatDateTimeSaoPaulo } from './timezoneUtils';

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

export const generateDepartmentTimeReport = (
  data: DepartmentStats[],
  periodLabel: string,
  startDate?: string,
  endDate?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = 30;

  // Título do relatório
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO - TEMPO MÉDIO DE ALTA POR DEPARTAMENTO', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Período: ${periodLabel}`, pageWidth / 2, yPosition, { align: 'center' });
  
  if (startDate && endDate) {
    yPosition += 10;
    doc.text(`De: ${startDate} até: ${endDate}`, pageWidth / 2, yPosition, { align: 'center' });
  }
  
  yPosition += 10;
  doc.text(`Gerado em: ${formatDateTimeSaoPaulo(new Date())}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 30;

  // Estatísticas gerais
  if (data.length > 0) {
    const totalDischarges = data.reduce((sum, item) => sum + item.total_discharges, 0);
    const avgOverall = data.reduce((sum, item) => sum + (item.avg_hours * item.total_discharges), 0) / totalDischarges;
    const totalDelayed = data.reduce((sum, item) => sum + item.delayed_discharges, 0);
    
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO GERAL:', margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`• Total de altas processadas: ${totalDischarges}`, margin, yPosition);
    yPosition += 10;
    doc.text(`• Tempo médio geral: ${avgOverall.toFixed(2)} horas`, margin, yPosition);
    yPosition += 10;
    doc.text(`• Altas com atraso (>5h): ${totalDelayed} (${((totalDelayed/totalDischarges)*100).toFixed(1)}%)`, margin, yPosition);
    yPosition += 20;
  }

  // Cabeçalho da tabela
  doc.setFont('helvetica', 'bold');
  doc.text('DEPARTAMENTO', margin, yPosition);
  doc.text('TEMPO MÉDIO', margin + 80, yPosition);
  doc.text('TOTAL ALTAS', margin + 130, yPosition);
  doc.text('ATRASOS', margin + 170, yPosition);
  
  // Linha horizontal
  yPosition += 5;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Dados da tabela
  doc.setFont('helvetica', 'normal');
  data.forEach((item) => {
    if (yPosition > pageHeight - 40) { // Nova página se necessário
      doc.addPage();
      yPosition = 30;
    }
    
    doc.text(item.department, margin, yPosition);
    doc.text(`${item.avg_hours.toFixed(2)}h`, margin + 80, yPosition);
    doc.text(item.total_discharges.toString(), margin + 130, yPosition);
    doc.text(item.delayed_discharges.toString(), margin + 170, yPosition);
    yPosition += 12;
  });

  // Análise e recomendações
  if (data.length > 0) {
    yPosition += 20;
    const slowestDept = data.reduce((prev, current) => (prev.avg_hours > current.avg_hours) ? prev : current);
    const fastestDept = data.reduce((prev, current) => (prev.avg_hours < current.avg_hours) ? prev : current);
    
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISE:', margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`• Departamento mais rápido: ${fastestDept.department} (${fastestDept.avg_hours.toFixed(2)}h)`, margin, yPosition);
    yPosition += 10;
    doc.text(`• Departamento mais lento: ${slowestDept.department} (${slowestDept.avg_hours.toFixed(2)}h)`, margin, yPosition);
    yPosition += 10;
    
    if (slowestDept.avg_hours > 5) {
      doc.text(`• Atenção: ${slowestDept.department} excede 5h de tempo médio`, margin, yPosition);
      yPosition += 10;
    }
  }

  // Salvar PDF
  doc.save(`relatorio-tempo-departamento-${new Date().getTime()}.pdf`);
};

export const generateCityTimeReport = (
  data: CityStats[],
  periodLabel: string,
  startDate?: string,
  endDate?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = 30;

  // Título do relatório
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO - TEMPO MÉDIO DE ALTA POR MUNICÍPIO', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Período: ${periodLabel}`, pageWidth / 2, yPosition, { align: 'center' });
  
  if (startDate && endDate) {
    yPosition += 10;
    doc.text(`De: ${startDate} até: ${endDate}`, pageWidth / 2, yPosition, { align: 'center' });
  }
  
  yPosition += 10;
  doc.text(`Gerado em: ${formatDateTimeSaoPaulo(new Date())}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 30;

  // Estatísticas gerais
  if (data.length > 0) {
    const totalDischarges = data.reduce((sum, item) => sum + item.total_discharges, 0);
    const avgOverall = data.reduce((sum, item) => sum + (item.avg_hours * item.total_discharges), 0) / totalDischarges;
    
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO GERAL:', margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`• Total de altas processadas: ${totalDischarges}`, margin, yPosition);
    yPosition += 10;
    doc.text(`• Tempo médio geral: ${avgOverall.toFixed(2)} horas`, margin, yPosition);
    yPosition += 10;
    doc.text(`• Municípios atendidos: ${data.length}`, margin, yPosition);
    yPosition += 20;
  }

  // Verificar espaço disponível antes de começar a tabela
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 30;
  }

  // Cabeçalho da tabela
  doc.setFont('helvetica', 'bold');
  doc.text('MUNICÍPIO', margin, yPosition);
  doc.text('TEMPO MÉDIO', margin + 100, yPosition);
  doc.text('TOTAL ALTAS', margin + 150, yPosition);
  
  // Linha horizontal
  yPosition += 5;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Dados da tabela
  doc.setFont('helvetica', 'normal');
  data.forEach((item) => {
    // Verificar se há espaço suficiente na página
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 30;
      
      // Repetir cabeçalho na nova página
      doc.setFont('helvetica', 'bold');
      doc.text('MUNICÍPIO', margin, yPosition);
      doc.text('TEMPO MÉDIO', margin + 100, yPosition);
      doc.text('TOTAL ALTAS', margin + 150, yPosition);
      yPosition += 5;
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
    }
    
    // Tratar nomes de municípios muito longos
    const cityName = item.origin_city || 'Não informado';
    const maxCityLength = 30; // Máximo de caracteres para o nome da cidade
    const displayCityName = cityName.length > maxCityLength 
      ? cityName.substring(0, maxCityLength) + '...' 
      : cityName;
    
    doc.text(displayCityName, margin, yPosition);
    doc.text(`${item.avg_hours.toFixed(2)}h`, margin + 100, yPosition);
    doc.text(item.total_discharges.toString(), margin + 150, yPosition);
    yPosition += 12;
  });

  // Análise e recomendações
  if (data.length > 0) {
    yPosition += 20;
    
    // Verificar espaço para a seção de análise
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 30;
    }
    
    const slowestCity = data.reduce((prev, current) => (prev.avg_hours > current.avg_hours) ? prev : current);
    const fastestCity = data.reduce((prev, current) => (prev.avg_hours < current.avg_hours) ? prev : current);
    
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISE:', margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    
    // Tratar nomes longos na análise também
    const fastestCityName = fastestCity.origin_city || 'Não informado';
    const slowestCityName = slowestCity.origin_city || 'Não informado';
    
    doc.text(`• Município mais rápido: ${fastestCityName} (${fastestCity.avg_hours.toFixed(2)}h)`, margin, yPosition);
    yPosition += 10;
    doc.text(`• Município mais lento: ${slowestCityName} (${slowestCity.avg_hours.toFixed(2)}h)`, margin, yPosition);
    yPosition += 10;
    
    const slowCities = data.filter(city => city.avg_hours > 5);
    if (slowCities.length > 0) {
      doc.text(`• Municípios com tempo >5h: ${slowCities.length}`, margin, yPosition);
      yPosition += 10;
    }
  }

  // Salvar PDF
  doc.save(`relatorio-tempo-municipio-${new Date().getTime()}.pdf`);
};
