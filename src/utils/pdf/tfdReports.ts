
import jsPDF from 'jspdf';
import { createPdfWithHeader, addTableHeader, checkPageBreak, truncateText } from './pdfHelpers';

interface TfdPatientData {
  patient: any;
  bedInfo: {
    id: string;
    name: string;
    department: string;
  };
  interventions?: any[];
}

export const generateTfdPatientsPdf = (patientsData: TfdPatientData[]) => {
  const { doc, yPosition: initialY } = createPdfWithHeader(
    'RELATÓRIO DETALHADO - PACIENTES ATIVOS EM TFD',
    `Hospital NIR HMP - Total de pacientes: ${patientsData.length}`
  );

  let yPosition = initialY;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;

  if (patientsData.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Nenhum paciente TFD ativo encontrado no momento.', pageWidth / 2, yPosition, { align: 'center' });
  } else {
    // Seção de cada paciente
    patientsData.forEach((item, index) => {
      yPosition = checkPageBreak(doc, yPosition, 120); // Mais espaço para cada paciente
      
      // Cabeçalho do paciente
      doc.setFillColor(240, 248, 255); // Azul claro
      doc.rect(margin, yPosition - 8, pageWidth - 2 * margin, 16, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102); // Azul escuro
      doc.text(`${index + 1}. ${item.patient.name || 'Não informado'}`, margin + 5, yPosition);
      
      // Badge do tipo TFD
      const badgeText = item.patient.tfdType || 'TFD';
      const badgeWidth = doc.getTextWidth(badgeText) + 10;
      if (badgeText === 'URGENCIA') {
        doc.setFillColor(220, 53, 69); // Vermelho para urgência
      } else {
        doc.setFillColor(40, 167, 69); // Verde para outros tipos
      }
      doc.rect(pageWidth - margin - badgeWidth - 5, yPosition - 6, badgeWidth, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(badgeText, pageWidth - margin - badgeWidth, yPosition - 1);
      
      yPosition += 20;
      
      // Informações pessoais
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('DADOS PESSOAIS:', margin + 5, yPosition);
      yPosition += 12;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      // Coluna esquerda
      doc.text(`Data de Nascimento: ${item.patient.birthDate || 'Não informado'}`, margin + 10, yPosition);
      doc.text(`Idade: ${item.patient.age || 'N/A'} anos`, margin + 10, yPosition + 10);
      doc.text(`Sexo: ${item.patient.sex || 'Não informado'}`, margin + 10, yPosition + 20);
      
      // Coluna direita
      doc.text(`Data de Admissão: ${item.patient.admissionDate || 'Não informado'}`, margin + 100, yPosition);
      doc.text(`Alta Prevista: ${item.patient.expectedDischargeDate || 'Não definida'}`, margin + 100, yPosition + 10);
      doc.text(`Dias de Internação: ${item.patient.occupationDays || 'N/A'}`, margin + 100, yPosition + 20);
      
      yPosition += 35;
      
      // Informações clínicas
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('INFORMAÇÕES CLÍNICAS:', margin + 5, yPosition);
      yPosition += 12;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Diagnóstico: ${item.patient.diagnosis || 'Não informado'}`, margin + 10, yPosition);
      yPosition += 10;
      doc.text(`Especialidade: ${item.patient.specialty || 'Não especificada'}`, margin + 10, yPosition);
      yPosition += 15;
      
      // Localização
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('LOCALIZAÇÃO ATUAL:', margin + 5, yPosition);
      yPosition += 12;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Departamento: ${item.bedInfo.department || 'N/A'}`, margin + 10, yPosition);
      doc.text(`Leito: ${item.bedInfo.name || 'N/A'}`, margin + 100, yPosition);
      yPosition += 15;
      
      // TFD Info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('INFORMAÇÕES TFD:', margin + 5, yPosition);
      yPosition += 12;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Município de Origem: ${item.patient.originCity || 'Não informado'}`, margin + 10, yPosition);
      doc.text(`Tipo TFD: ${item.patient.tfdType || 'Não especificado'}`, margin + 100, yPosition);
      yPosition += 15;
      
      // Intervenções realizadas
      if (item.interventions && item.interventions.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`INTERVENÇÕES REALIZADAS (${item.interventions.length}):`, margin + 5, yPosition);
        yPosition += 12;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        
        item.interventions.forEach((intervention: any, intIndex: number) => {
          yPosition = checkPageBreak(doc, yPosition, 25);
          
          // Data da intervenção
          const interventionDate = new Date(intervention.created_at).toLocaleDateString('pt-BR');
          doc.setFont('helvetica', 'bold');
          doc.text(`${intIndex + 1}. ${intervention.intervention_type} - ${interventionDate}`, margin + 10, yPosition);
          yPosition += 8;
          
          // Descrição da intervenção
          doc.setFont('helvetica', 'normal');
          const description = intervention.description || 'Sem descrição';
          const maxLineWidth = pageWidth - margin - 20;
          const lines = doc.splitTextToSize(description, maxLineWidth);
          
          lines.forEach((line: string, lineIndex: number) => {
            if (lineIndex === 0) {
              doc.text(`   ${line}`, margin + 10, yPosition);
            } else {
              yPosition += 6;
              doc.text(`   ${line}`, margin + 10, yPosition);
            }
          });
          yPosition += 10;
        });
        yPosition += 10;
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('INTERVENÇÕES REALIZADAS:', margin + 5, yPosition);
        yPosition += 12;
        
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text('Nenhuma intervenção registrada até o momento.', margin + 10, yPosition);
        yPosition += 15;
      }
      
      // Linha separadora
      if (index < patientsData.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 20;
      }
    });

    // Resumo executivo
    yPosition += 30;
    yPosition = checkPageBreak(doc, yPosition, 60);
    
    // Cabeçalho do resumo
    doc.setFillColor(248, 249, 250);
    doc.rect(margin, yPosition - 8, pageWidth - 2 * margin, 16, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text('RESUMO EXECUTIVO', margin + 5, yPosition);
    yPosition += 25;
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Estatísticas
    doc.text(`• Total de pacientes TFD ativos: ${patientsData.length}`, margin + 10, yPosition);
    yPosition += 12;
    
    const departments = [...new Set(patientsData.map(item => item.bedInfo.department))];
    doc.text(`• Departamentos envolvidos: ${departments.join(', ')}`, margin + 10, yPosition);
    yPosition += 12;
    
    const urgentCases = patientsData.filter(item => item.patient.tfdType === 'URGENCIA').length;
    const regularCases = patientsData.length - urgentCases;
    doc.text(`• Casos de urgência: ${urgentCases} | Casos regulares: ${regularCases}`, margin + 10, yPosition);
    yPosition += 12;
    
    const cities = [...new Set(patientsData.map(item => item.patient.originCity))];
    doc.text(`• Municípios de origem: ${cities.length} (${cities.slice(0, 3).join(', ')}${cities.length > 3 ? '...' : ''})`, margin + 10, yPosition);
    yPosition += 12;
    
    const avgStayDays = patientsData.reduce((sum, item) => sum + (item.patient.occupationDays || 0), 0) / patientsData.length;
    doc.text(`• Tempo médio de internação: ${Math.round(avgStayDays)} dias`, margin + 10, yPosition);
  }

  // Salvar PDF
  doc.save(`relatorio-detalhado-tfd-${new Date().toISOString().split('T')[0]}.pdf`);
};
