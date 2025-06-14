
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

const formatTime = (minutes: number): string => {
  if (!minutes) return '--';
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const exportToPDF = (
  statsByCityAndSector: StatsByCityAndSector[],
  statsByCity: StatsByCity[],
  period: string
) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Relatório - Tempo Médio de Resposta de Ambulância', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Período: ${period}`, 20, 35);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 45);

  // Primeira tabela - Por Município e Setor
  doc.setFontSize(14);
  doc.text('Tempo Médio por Município e Setor', 20, 65);
  
  const tableData1 = statsByCityAndSector.map(item => [
    item.origin_city,
    item.sector,
    item.total_requests.toString(),
    formatTime(item.avg_response_time_minutes),
    item.confirmed_requests.toString()
  ]);

  (doc as any).autoTable({
    startY: 75,
    head: [['Município', 'Setor', 'Total', 'Tempo Médio', 'Confirmados']],
    body: tableData1,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Segunda tabela - Global por Município
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(14);
  doc.text('Tempo Médio Global por Município', 20, finalY);
  
  const tableData2 = statsByCity.map(item => [
    item.origin_city,
    item.total_requests.toString(),
    formatTime(item.avg_response_time_minutes),
    item.confirmed_requests.toString()
  ]);

  (doc as any).autoTable({
    startY: finalY + 10,
    head: [['Município', 'Total', 'Tempo Médio Global', 'Confirmados']],
    body: tableData2,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  doc.save(`relatorio-ambulancia-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (
  statsByCityAndSector: StatsByCityAndSector[],
  statsByCity: StatsByCity[],
  period: string
) => {
  // Implementação básica para Excel usando CSV
  const csvContent1 = [
    'Município,Setor,Total Solicitações,Tempo Médio,Confirmados',
    ...statsByCityAndSector.map(item => 
      `${item.origin_city},${item.sector},${item.total_requests},${formatTime(item.avg_response_time_minutes)},${item.confirmed_requests}`
    )
  ].join('\n');

  const csvContent2 = [
    'Município,Total Solicitações,Tempo Médio Global,Confirmados',
    ...statsByCity.map(item => 
      `${item.origin_city},${item.total_requests},${formatTime(item.avg_response_time_minutes)},${item.confirmed_requests}`
    )
  ].join('\n');

  const finalContent = `Relatório - Tempo Médio de Resposta de Ambulância\nPeríodo: ${period}\n\nTempo Médio por Município e Setor:\n${csvContent1}\n\nTempo Médio Global por Município:\n${csvContent2}`;

  const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio-ambulancia-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
