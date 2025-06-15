
import jsPDF from 'jspdf';
import { PerformanceAnalysis, StatsByCity } from './types';
import { addPdfHeader, addSectionTitle } from './pdfHelpers';
import { formatTime } from './formatters';

export const createExecutiveSummaryPage = (
  doc: jsPDF, 
  analysis: PerformanceAnalysis, 
  statsByCity: StatsByCity[], 
  period: string
) => {
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
};
