
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StatsByCityAndSector {
  origin_city: string;
  sector: string;
  total_requests: number;
  avg_response_time_minutes: number;
  confirmed_requests: number;
}

interface StatsByCity {
  origin_city: string;
  total_requests: number;
  avg_response_time_minutes: number;
  confirmed_requests: number;
}

interface PerformanceAnalysis {
  worstPerforming: StatsByCity[];
  bestPerforming: StatsByCity[];
  totalRequests: number;
  overallAverage: number;
}

const formatTime = (minutes: number): string => {
  if (!minutes) return '--';
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const analyzePerformance = (statsByCity: StatsByCity[]): PerformanceAnalysis => {
  const validStats = statsByCity.filter(stat => stat.avg_response_time_minutes > 0);
  
  const sortedByWorst = [...validStats].sort((a, b) => b.avg_response_time_minutes - a.avg_response_time_minutes);
  const sortedByBest = [...validStats].sort((a, b) => a.avg_response_time_minutes - b.avg_response_time_minutes);
  
  const totalRequests = statsByCity.reduce((sum, stat) => sum + stat.total_requests, 0);
  const weightedSum = statsByCity.reduce((sum, stat) => sum + (stat.avg_response_time_minutes * stat.total_requests), 0);
  const overallAverage = totalRequests > 0 ? weightedSum / totalRequests : 0;

  return {
    worstPerforming: sortedByWorst.slice(0, 3),
    bestPerforming: sortedByBest.slice(0, 3),
    totalRequests,
    overallAverage
  };
};

export const exportToPDF = (
  statsByCityAndSector: StatsByCityAndSector[],
  statsByCity: StatsByCity[],
  period: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 30;

  // Header/Título Principal
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE TEMPO MÉDIO DE RESPOSTA POR MUNICÍPIO', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Período: ${period}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 25;

  // Análise de Performance
  const analysis = analyzePerformance(statsByCity);

  // Resumo Estatístico
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO ESTATÍSTICO', 20, yPosition);
  
  yPosition += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`• Total de Solicitações: ${analysis.totalRequests}`, 25, yPosition);
  yPosition += 8;
  doc.text(`• Tempo Médio Geral: ${formatTime(analysis.overallAverage)}`, 25, yPosition);
  yPosition += 8;
  doc.text(`• Municípios Atendidos: ${statsByCity.length}`, 25, yPosition);

  yPosition += 20;

  // Tabela Principal - Dados por Município
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS POR MUNICÍPIO', 20, yPosition);
  
  yPosition += 10;

  const tableData = statsByCity.map(item => [
    item.origin_city,
    formatTime(item.avg_response_time_minutes),
    item.total_requests.toString(),
    item.confirmed_requests.toString()
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Município', 'Tempo Médio', 'Total Solicitações', 'Confirmados']],
    body: tableData,
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 4
    },
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // Nova página para análises
  doc.addPage();
  yPosition = 30;

  // Análise de Performance - Piores
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ANÁLISE DE PERFORMANCE', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 25;
  doc.setFontSize(14);
  doc.setTextColor(220, 53, 69); // Vermelho
  doc.text('MUNICÍPIOS COM MAIOR TEMPO MÉDIO (Necessitam Atenção)', 20, yPosition);
  
  yPosition += 15;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0); // Preto

  analysis.worstPerforming.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.origin_city}: ${formatTime(item.avg_response_time_minutes)} (${item.total_requests} solicitações)`, 25, yPosition);
    yPosition += 8;
  });

  yPosition += 15;

  // Análise de Performance - Melhores
  doc.setFontSize(14);
  doc.setTextColor(40, 167, 69); // Verde
  doc.text('MUNICÍPIOS COM MENOR TEMPO MÉDIO (Excelente Performance)', 20, yPosition);
  
  yPosition += 15;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0); // Preto

  analysis.bestPerforming.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.origin_city}: ${formatTime(item.avg_response_time_minutes)} (${item.total_requests} solicitações)`, 25, yPosition);
    yPosition += 8;
  });

  yPosition += 20;

  // Recomendações
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 193, 7); // Amarelo
  doc.text('RECOMENDAÇÕES', 20, yPosition);

  yPosition += 15;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  if (analysis.worstPerforming.length > 0) {
    const worstTime = analysis.worstPerforming[0].avg_response_time_minutes;
    if (worstTime > 30) {
      doc.text('• Priorizar ações para municípios com tempo >30min', 25, yPosition);
      yPosition += 8;
    }
    if (worstTime > 60) {
      doc.text('• Investigar causas de tempos >1h nos municípios críticos', 25, yPosition);
      yPosition += 8;
    }
  }

  doc.text('• Considerar redistribuição de recursos baseada nos dados', 25, yPosition);
  yPosition += 8;
  doc.text('• Monitorar tendências semanais/mensais', 25, yPosition);

  // Rodapé
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

  // Salvar com nome padronizado
  const today = new Date().toISOString().split('T')[0];
  doc.save(`Relatorio_Tempo_Medio_Municipios_${today}.pdf`);
};

export const exportToExcel = (
  statsByCityAndSector: StatsByCityAndSector[],
  statsByCity: StatsByCity[],
  period: string
) => {
  const analysis = analyzePerformance(statsByCity);
  
  // Cabeçalho do relatório
  const reportHeader = [
    'RELATÓRIO DE TEMPO MÉDIO DE RESPOSTA POR MUNICÍPIO',
    `Período: ${period}`,
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    '',
    'RESUMO ESTATÍSTICO:',
    `Total de Solicitações: ${analysis.totalRequests}`,
    `Tempo Médio Geral: ${formatTime(analysis.overallAverage)}`,
    `Municípios Atendidos: ${statsByCity.length}`,
    '',
    'DADOS PRINCIPAIS:',
    'Município,Tempo Médio,Total Solicitações,Confirmados'
  ];

  // Dados principais
  const mainData = statsByCity.map(item => 
    `${item.origin_city},${formatTime(item.avg_response_time_minutes)},${item.total_requests},${item.confirmed_requests}`
  );

  // Análise de performance
  const performanceAnalysis = [
    '',
    'ANÁLISE DE PERFORMANCE:',
    '',
    'MUNICÍPIOS COM MAIOR TEMPO MÉDIO (Necessitam Atenção):',
    ...analysis.worstPerforming.map((item, index) => 
      `${index + 1}. ${item.origin_city}: ${formatTime(item.avg_response_time_minutes)} (${item.total_requests} solicitações)`
    ),
    '',
    'MUNICÍPIOS COM MENOR TEMPO MÉDIO (Excelente Performance):',
    ...analysis.bestPerforming.map((item, index) => 
      `${index + 1}. ${item.origin_city}: ${formatTime(item.avg_response_time_minutes)} (${item.total_requests} solicitações)`
    ),
    '',
    'RECOMENDAÇÕES:',
    '• Priorizar ações para municípios com tempo >30min',
    '• Investigar causas de tempos >1h nos municípios críticos',
    '• Considerar redistribuição de recursos baseada nos dados',
    '• Monitorar tendências semanais/mensais'
  ];

  // Combinar todo o conteúdo
  const finalContent = [
    ...reportHeader,
    ...mainData,
    ...performanceAnalysis
  ].join('\n');

  // Criar e baixar arquivo
  const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  
  const today = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `Relatorio_Tempo_Medio_Municipios_${today}.csv`);
  
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
