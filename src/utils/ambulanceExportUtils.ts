
import jsPDF from 'jspdf';
import { StatsByCityAndSector, StatsByCity } from './pdf/ambulance/types';
import { analyzePerformance } from './pdf/ambulance/analysis';
import { createExecutiveSummaryPage } from './pdf/ambulance/executiveSummary';
import { createCityAndSectorPage, createCityGlobalPage } from './pdf/ambulance/dataPages';
import { createAnalysisPage } from './pdf/ambulance/analysisPage';
import { addPdfFooters } from './pdf/ambulance/pdfHelpers';
import { exportToExcel } from './pdf/ambulance/excelExport';

export const exportToPDF = (
  statsByCityAndSector: StatsByCityAndSector[],
  statsByCity: StatsByCity[],
  period: string
) => {
  const doc = new jsPDF();
  const analysis = analyzePerformance(statsByCity);

  // PÁGINA 1 - RESUMO EXECUTIVO
  createExecutiveSummaryPage(doc, analysis, statsByCity, period);

  // PÁGINA 2 - TEMPO MÉDIO POR MUNICÍPIO E SETOR
  doc.addPage();
  createCityAndSectorPage(doc, statsByCityAndSector);

  // PÁGINA 3 - TEMPO MÉDIO GLOBAL POR MUNICÍPIO
  doc.addPage();
  createCityGlobalPage(doc, statsByCity);

  // PÁGINA 4 - ANÁLISES E RECOMENDAÇÕES
  doc.addPage();
  createAnalysisPage(doc, analysis, statsByCity);

  // Rodapé em todas as páginas
  addPdfFooters(doc);

  // Salvar com nome padronizado
  const today = new Date().toISOString().split('T')[0];
  doc.save(`Relatorio_Ambulancias_Completo_${today}.pdf`);
};

export { exportToExcel };
export type { StatsByCityAndSector, StatsByCity };
