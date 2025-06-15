
import jsPDF from 'jspdf';

export const addPdfHeader = (doc: jsPDF, title: string, subtitle?: string) => {
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

export const addSectionTitle = (doc: jsPDF, title: string, yPosition: number, color: [number, number, number] = [52, 73, 94]) => {
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

export const addPdfFooters = (doc: jsPDF) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, pageHeight - 15, { align: 'right' });
    doc.text(`Relatório Ambulâncias - ${new Date().toLocaleDateString('pt-BR')}`, 20, pageHeight - 15);
  }
};
