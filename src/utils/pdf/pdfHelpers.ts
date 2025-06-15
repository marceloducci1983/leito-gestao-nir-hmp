
import jsPDF from 'jspdf';
import { formatDateTimeSaoPaulo } from '../timezoneUtils';

export const createPdfWithHeader = (title: string, subtitle?: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 30;

  // Título do relatório
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  if (subtitle) {
    doc.text(subtitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
  }
  
  doc.text(`Gerado em: ${formatDateTimeSaoPaulo(new Date())}`, pageWidth / 2, yPosition, { align: 'center' });
  
  return { doc, yPosition: yPosition + 30 };
};

export const addTableHeader = (doc: jsPDF, headers: string[], positions: number[], yPosition: number) => {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  
  headers.forEach((header, index) => {
    doc.text(header, positions[index], yPosition);
  });
  
  // Linha horizontal
  const lineY = yPosition + 5;
  doc.line(margin, lineY, pageWidth - margin, lineY);
  
  return lineY + 10;
};

export const checkPageBreak = (doc: jsPDF, yPosition: number, minSpace: number = 40) => {
  const pageHeight = doc.internal.pageSize.height;
  
  if (yPosition > pageHeight - minSpace) {
    doc.addPage();
    return 30; // Reset to top of new page
  }
  
  return yPosition;
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return 'N/A';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
