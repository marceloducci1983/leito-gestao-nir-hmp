
import { StatsByCityAndSector, StatsByCity } from './types';
import { analyzePerformance } from './analysis';
import { formatTime } from './formatters';

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
