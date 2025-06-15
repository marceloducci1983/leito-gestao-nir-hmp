
import jsPDF from 'jspdf';
import { PerformanceAnalysis, StatsByCity } from './types';
import { addPdfHeader, addSectionTitle } from './pdfHelpers';
import { formatTime } from './formatters';

export const createAnalysisPage = (doc: jsPDF, analysis: PerformanceAnalysis, statsByCity: StatsByCity[]) => {
  let yPosition = addPdfHeader(doc, 'ANÁLISES E RECOMENDAÇÕES');

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
};
