
import jsPDF from 'jspdf';
import { createPdfWithHeader, addTableHeader, checkPageBreak } from './pdfHelpers';

interface DepartmentStats {
  department: string;
  avg_hours: number;
  total_discharges: number;
  delayed_discharges: number;
}

export const generateDepartmentTimeReport = (
  data: DepartmentStats[],
  periodLabel: string,
  startDate?: string,
  endDate?: string
) => {
  const subtitle = startDate && endDate 
    ? `Período: ${periodLabel}\nDe: ${startDate} até: ${endDate}`
    : `Período: ${periodLabel}`;

  const { doc, yPosition: initialY } = createPdfWithHeader(
    'RELATÓRIO - TEMPO MÉDIO DE ALTA POR DEPARTAMENTO',
    subtitle
  );

  let yPosition = initialY;
  const margin = 20;

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
  const headers = ['DEPARTAMENTO', 'TEMPO MÉDIO', 'TOTAL ALTAS', 'ATRASOS'];
  const positions = [margin, margin + 80, margin + 130, margin + 170];
  
  yPosition = addTableHeader(doc, headers, positions, yPosition);

  // Dados da tabela
  doc.setFont('helvetica', 'normal');
  data.forEach((item) => {
    yPosition = checkPageBreak(doc, yPosition);
    
    doc.text(item.department, positions[0], yPosition);
    doc.text(`${item.avg_hours.toFixed(2)}h`, positions[1], yPosition);
    doc.text(item.total_discharges.toString(), positions[2], yPosition);
    doc.text(item.delayed_discharges.toString(), positions[3], yPosition);
    yPosition += 12;
  });

  // Análise e recomendações
  if (data.length > 0) {
    yPosition += 20;
    yPosition = checkPageBreak(doc, yPosition, 60);
    
    const slowestDept = data.reduce((prev, current) => (prev.avg_hours > current.avg_hours) ? prev : current);
    const fastestDept = data.reduce((prev, current) => (prev.avg_hours < current.avg_hours) ? prev : current);
    
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
    }
  }

  // Salvar PDF
  doc.save(`relatorio-tempo-departamento-${new Date().getTime()}.pdf`);
};
