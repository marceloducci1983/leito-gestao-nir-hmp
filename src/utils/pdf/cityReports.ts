
import jsPDF from 'jspdf';
import { createPdfWithHeader, addTableHeader, checkPageBreak, truncateText } from './pdfHelpers';

interface CityStats {
  origin_city: string;
  avg_hours: number;
  total_discharges: number;
}

export const generateCityTimeReport = (
  data: CityStats[],
  periodLabel: string,
  startDate?: string,
  endDate?: string
) => {
  const subtitle = startDate && endDate 
    ? `Período: ${periodLabel}\nDe: ${startDate} até: ${endDate}`
    : `Período: ${periodLabel}`;

  const { doc, yPosition: initialY } = createPdfWithHeader(
    'RELATÓRIO - TEMPO MÉDIO DE ALTA POR MUNICÍPIO',
    subtitle
  );

  let yPosition = initialY;
  const margin = 20;

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
  yPosition = checkPageBreak(doc, yPosition, 80);

  // Cabeçalho da tabela
  const headers = ['MUNICÍPIO', 'TEMPO MÉDIO', 'TOTAL ALTAS'];
  const positions = [margin, margin + 100, margin + 150];
  
  yPosition = addTableHeader(doc, headers, positions, yPosition);

  // Dados da tabela
  doc.setFont('helvetica', 'normal');
  data.forEach((item) => {
    // Verificar se há espaço suficiente na página
    yPosition = checkPageBreak(doc, yPosition);
    
    if (yPosition === 30) { // Nova página
      yPosition = addTableHeader(doc, headers, positions, yPosition);
      doc.setFont('helvetica', 'normal');
    }
    
    const cityName = truncateText(item.origin_city || 'Não informado', 30);
    
    doc.text(cityName, positions[0], yPosition);
    doc.text(`${item.avg_hours.toFixed(2)}h`, positions[1], yPosition);
    doc.text(item.total_discharges.toString(), positions[2], yPosition);
    yPosition += 12;
  });

  // Análise e recomendações
  if (data.length > 0) {
    yPosition += 20;
    yPosition = checkPageBreak(doc, yPosition, 80);
    
    const slowestCity = data.reduce((prev, current) => (prev.avg_hours > current.avg_hours) ? prev : current);
    const fastestCity = data.reduce((prev, current) => (prev.avg_hours < current.avg_hours) ? prev : current);
    
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISE:', margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    
    const fastestCityName = fastestCity.origin_city || 'Não informado';
    const slowestCityName = slowestCity.origin_city || 'Não informado';
    
    doc.text(`• Município mais rápido: ${fastestCityName} (${fastestCity.avg_hours.toFixed(2)}h)`, margin, yPosition);
    yPosition += 10;
    doc.text(`• Município mais lento: ${slowestCityName} (${slowestCity.avg_hours.toFixed(2)}h)`, margin, yPosition);
    yPosition += 10;
    
    const slowCities = data.filter(city => city.avg_hours > 5);
    if (slowCities.length > 0) {
      doc.text(`• Municípios com tempo >5h: ${slowCities.length}`, margin, yPosition);
    }
  }

  // Salvar PDF
  doc.save(`relatorio-tempo-municipio-${new Date().getTime()}.pdf`);
};
