
import jsPDF from 'jspdf';
import { createPdfWithHeader, addTableHeader, checkPageBreak, truncateText } from './pdfHelpers';

interface TfdPatientData {
  patient: any;
  bedInfo: {
    id: string;
    name: string;
    department: string;
  };
}

export const generateTfdPatientsPdf = (patientsData: TfdPatientData[]) => {
  const { doc, yPosition: initialY } = createPdfWithHeader(
    'RELATÓRIO - PACIENTES ATIVOS EM TFD',
    `Total de pacientes ativos: ${patientsData.length}`
  );

  let yPosition = initialY;
  const margin = 20;

  if (patientsData.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Nenhum paciente TFD ativo encontrado no momento.', doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
  } else {
    // Cabeçalho da tabela
    const headers = ['NOME', 'DEPARTAMENTO', 'LEITO', 'TIPO TFD', 'ORIGEM'];
    const positions = [margin, margin + 60, margin + 110, margin + 140, margin + 170];
    
    yPosition = addTableHeader(doc, headers, positions, yPosition);

    // Dados da tabela
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    patientsData.forEach((item) => {
      yPosition = checkPageBreak(doc, yPosition);
      
      if (yPosition === 30) { // Nova página
        yPosition = addTableHeader(doc, headers, positions, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
      }
      
      const patientName = truncateText(item.patient.name || 'Não informado', 25);
      const department = truncateText(item.bedInfo.department || 'N/A', 15);
      const bedName = item.bedInfo.name || 'N/A';
      const tfdType = item.patient.tfdType || 'N/A';
      const originCity = truncateText(item.patient.originCity || 'N/A', 20);
      
      doc.text(patientName, positions[0], yPosition);
      doc.text(department, positions[1], yPosition);
      doc.text(bedName, positions[2], yPosition);
      doc.text(tfdType, positions[3], yPosition);
      doc.text(originCity, positions[4], yPosition);
      yPosition += 12;
    });

    // Resumo no final
    yPosition += 20;
    yPosition = checkPageBreak(doc, yPosition);
    
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO:', margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`• Total de pacientes TFD ativos: ${patientsData.length}`, margin, yPosition);
    yPosition += 10;
    
    const departments = [...new Set(patientsData.map(item => item.bedInfo.department))];
    doc.text(`• Departamentos envolvidos: ${departments.length}`, margin, yPosition);
    yPosition += 10;
    
    const urgentCases = patientsData.filter(item => item.patient.tfdType === 'URGENCIA').length;
    if (urgentCases > 0) {
      doc.text(`• Casos de urgência: ${urgentCases}`, margin, yPosition);
    }
  }

  // Salvar PDF
  doc.save(`relatorio-pacientes-tfd-ativos-${new Date().getTime()}.pdf`);
};
