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
  criticalCities: StatsByCity[];
  excellentCities: StatsByCity[];
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

  // Classificar cidades por performance
  const criticalCities = validStats.filter(stat => stat.avg_response_time_minutes > 60);
  const excellentCities = validStats.filter(stat => stat.avg_response_time_minutes < 15);

  return {
    worstPerforming: sortedByWorst.slice(0, 5),
    bestPerforming: sortedByBest.slice(0, 5),
    totalRequests,
    overallAverage,
    criticalCities,
    excellentCities
  };
};

const addPdfHeader = (doc: jsPDF, title: string, subtitle?: string) => {
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 25;

  // Título principal
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 73, 94);
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(149, 165, 166);
    doc.text(subtitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
  }
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });

  return yPosition + 20;
};

const addSectionTitle = (doc: jsPDF, title: string, yPosition: number, color: [number, number, number] = [52, 73, 94]) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(title, 20, yPosition);
  
  // Linha decorativa
  doc.setLineWidth(0.5);
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.line(20, yPosition + 3, 190, yPosition + 3);
  
  return yPosition + 15;
};

export const exportToPDF = (
  statsByCityAndSector: StatsByCityAndSector[],
  statsByCity: StatsByCity[],
  period: string
) => {
  const doc = new jsPDF();
  const analysis = analyzePerformance(statsByCity);

  // PÁGINA 1 - RESUMO EXECUTIVO
  let yPosition = addPdfHeader(
    doc, 
    'RELATÓRIO DE TEMPO DE RESPOSTA DE AMBULÂNCIAS', 
    `Período: ${period}`
  );

  // Resumo Estatístico Principal
  yPosition = addSectionTitle(doc, 'RESUMO EXECUTIVO', yPosition, [41, 128, 185]);

  // Caixa de destaque para tempo médio geral
  doc.setFillColor(52, 152, 219);
  doc.roundedRect(20, yPosition, 170, 25, 3, 3, 'F');
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TEMPO MÉDIO GERAL:', 30, yPosition + 10);
  doc.text(formatTime(analysis.overallAverage), 30, yPosition + 20);
  
  doc.setFontSize(12);
  doc.text(`Total de Solicitações: ${analysis.totalRequests}`, 130, yPosition + 10);
  doc.text(`Municípios Atendidos: ${statsByCity.length}`, 130, yPosition + 20);

  yPosition += 35;

  // Indicadores de Performance
  yPosition = addSectionTitle(doc, 'INDICADORES DE PERFORMANCE', yPosition, [231, 76, 60]);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const indicators = [
    { label: 'Municípios com Tempo Crítico (>60min)', value: analysis.criticalCities.length, color: [231, 76, 60] },
    { label: 'Municípios com Excelente Performance (<15min)', value: analysis.excellentCities.length, color: [46, 204, 113] },
    { label: 'Taxa de Confirmação Geral', value: `${Math.round((statsByCity.reduce((sum, stat) => sum + stat.confirmed_requests, 0) / analysis.totalRequests) * 100)}%`, color: [52, 152, 219] }
  ];

  indicators.forEach((indicator, index) => {
    const boxY = yPosition + (index * 20);
    doc.setFillColor(indicator.color[0], indicator.color[1], indicator.color[2]);
    doc.circle(30, boxY + 3, 3, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.text(`${indicator.label}: ${indicator.value}`, 40, boxY + 5);
  });

  yPosition += 80;

  // Municípios de Destaque
  if (analysis.criticalCities.length > 0) {
    yPosition = addSectionTitle(doc, '🚨 MUNICÍPIOS QUE NECESSITAM ATENÇÃO URGENTE', yPosition, [231, 76, 60]);
    
    analysis.criticalCities.slice(0, 3).forEach((city, index) => {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${city.origin_city}: ${formatTime(city.avg_response_time_minutes)} (${city.total_requests} solicitações)`, 25, yPosition);
      yPosition += 8;
    });
    yPosition += 10;
  }

  if (analysis.excellentCities.length > 0) {
    yPosition = addSectionTitle(doc, '⭐ MUNICÍPIOS COM EXCELENTE PERFORMANCE', yPosition, [46, 204, 113]);
    
    analysis.excellentCities.slice(0, 3).forEach((city, index) => {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${city.origin_city}: ${formatTime(city.avg_response_time_minutes)} (${city.total_requests} solicitações)`, 25, yPosition);
      yPosition += 8;
    });
  }

  // PÁGINA 2 - TEMPO MÉDIO POR MUNICÍPIO E SETOR
  doc.addPage();
  yPosition = addPdfHeader(doc, 'TEMPO MÉDIO POR MUNICÍPIO E SETOR');

  if (statsByCityAndSector.length > 0) {
    const tableData = statsByCityAndSector.map(item => [
      item.origin_city,
      item.sector || 'N/A',
      formatTime(item.avg_response_time_minutes),
      item.total_requests.toString(),
      item.confirmed_requests.toString(),
      `${Math.round((item.confirmed_requests / item.total_requests) * 100)}%`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Município', 'Setor', 'Tempo Médio', 'Total', 'Confirmados', 'Taxa %']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        halign: 'center'
      },
      headStyles: { 
        fillColor: [52, 73, 94],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'left' },
        2: { 
          halign: 'center',
          cellPadding: 3,
          fontSize: 10,
          fontStyle: 'bold'
        }
      },
      didParseCell: function(data) {
        if (data.column.index === 2 && data.section === 'body') {
          const timeText = data.cell.text[0];
          if (timeText && timeText !== '--') {
            const minutes = parseFloat(timeText.split(':')[0]) * 60 + parseFloat(timeText.split(':')[1]);
            if (minutes > 60) {
              data.cell.styles.textColor = [231, 76, 60]; // Vermelho para >60min
            } else if (minutes < 15) {
              data.cell.styles.textColor = [46, 204, 113]; // Verde para <15min
            } else {
              data.cell.styles.textColor = [243, 156, 18]; // Amarelo para 15-60min
            }
          }
        }
      }
    });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(149, 165, 166);
    doc.text('Nenhum dado disponível por município e setor para o período selecionado.', 20, yPosition);
  }

  // PÁGINA 3 - TEMPO MÉDIO GLOBAL POR MUNICÍPIO
  doc.addPage();
  yPosition = addPdfHeader(doc, 'TEMPO MÉDIO GLOBAL POR MUNICÍPIO');

  if (statsByCity.length > 0) {
    const tableData = statsByCity.map(item => [
      item.origin_city,
      formatTime(item.avg_response_time_minutes),
      item.total_requests.toString(),
      item.confirmed_requests.toString(),
      `${Math.round((item.confirmed_requests / item.total_requests) * 100)}%`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Município', 'Tempo Médio Global', 'Total Solicitações', 'Confirmados', 'Taxa Confirmação']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 4,
        halign: 'center'
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { 
          halign: 'center',
          fontSize: 11,
          fontStyle: 'bold'
        }
      },
      didParseCell: function(data) {
        if (data.column.index === 1 && data.section === 'body') {
          const timeText = data.cell.text[0];
          if (timeText && timeText !== '--') {
            const minutes = parseFloat(timeText.split(':')[0]) * 60 + parseFloat(timeText.split(':')[1]);
            if (minutes > 60) {
              data.cell.styles.fillColor = [255, 235, 235]; // Fundo vermelho claro
              data.cell.styles.textColor = [231, 76, 60];
            } else if (minutes < 15) {
              data.cell.styles.fillColor = [235, 255, 235]; // Fundo verde claro
              data.cell.styles.textColor = [46, 204, 113];
            }
          }
        }
      }
    });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(149, 165, 166);
    doc.text('Nenhum dado disponível por município para o período selecionado.', 20, yPosition);
  }

  // PÁGINA 4 - ANÁLISES E RECOMENDAÇÕES
  doc.addPage();
  yPosition = addPdfHeader(doc, 'ANÁLISES E RECOMENDAÇÕES');

  // Análise Detalhada
  yPosition = addSectionTitle(doc, 'ANÁLISE DETALHADA DE PERFORMANCE', yPosition, [142, 68, 173]);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const analysisText = [
    `• Tempo médio geral do sistema: ${formatTime(analysis.overallAverage)}`,
    `• Total de municípios atendidos: ${statsByCity.length}`,
    `• Municípios com performance crítica (>60min): ${analysis.criticalCities.length}`,
    `• Municípios com excelente performance (<15min): ${analysis.excellentCities.length}`,
    '',
    'CLASSIFICAÇÃO POR PERFORMANCE:',
    '🔴 Crítico (>60min): Necessita intervenção imediata',
    '🟡 Atenção (30-60min): Monitoramento necessário', 
    '🟢 Adequado (15-30min): Performance satisfatória',
    '⭐ Excelente (<15min): Referência de eficiência'
  ];

  analysisText.forEach(text => {
    if (text === '') {
      yPosition += 5;
    } else {
      doc.text(text, 25, yPosition);
      yPosition += 7;
    }
  });

  yPosition += 15;

  // Recomendações Estratégicas
  yPosition = addSectionTitle(doc, 'RECOMENDAÇÕES ESTRATÉGICAS', yPosition, [230, 126, 34]);

  const recommendations = [
    'AÇÕES IMEDIATAS:',
    '• Investigar causas dos tempos críticos nos municípios identificados',
    '• Redistribuir recursos das regiões com melhor performance',
    '• Implementar protocolo de urgência para tempos >90 minutos',
    '',
    'MELHORIAS DE MÉDIO PRAZO:',
    '• Analisar padrões geográficos e de horário dos chamados',
    '• Implementar sistema de monitoramento em tempo real',
    '• Capacitar equipes nos municípios com maior dificuldade',
    '',
    'MONITORAMENTO CONTÍNUO:',
    '• Gerar relatórios semanais de acompanhamento',
    '• Estabelecer metas específicas por município',
    '• Criar dashboard de indicadores em tempo real'
  ];

  doc.setFontSize(10);
  recommendations.forEach(text => {
    if (text === '') {
      yPosition += 5;
    } else if (text.includes(':')) {
      doc.setFont('helvetica', 'bold');
      doc.text(text, 25, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 8;
    } else {
      doc.text(text, 30, yPosition);
      yPosition += 6;
    }
  });

  // Rodapé em todas as páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, pageHeight - 15, { align: 'right' });
    doc.text(`Relatório Ambulâncias - ${new Date().toLocaleDateString('pt-BR')}`, 20, pageHeight - 15);
  }

  // Salvar com nome padronizado
  const today = new Date().toISOString().split('T')[0];
  doc.save(`Relatorio_Ambulancias_Completo_${today}.pdf`);
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
