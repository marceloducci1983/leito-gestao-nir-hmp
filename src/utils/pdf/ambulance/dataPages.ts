
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StatsByCityAndSector, StatsByCity } from './types';
import { addPdfHeader } from './pdfHelpers';
import { formatTime } from './formatters';

export const createCityAndSectorPage = (doc: jsPDF, statsByCityAndSector: StatsByCityAndSector[]) => {
  const yPosition = addPdfHeader(doc, 'TEMPO MÉDIO POR MUNICÍPIO E SETOR');

  if (statsByCityAndSector.length > 0) {
    const tableData = statsByCityAndSector.map(item => [
      item.origin_city,
      item.sector || 'N/A',
      formatTime(item.avg_response_time_minutes),
      item.total_requests.toString(),
      item.confirmed_requests.toString(),
      `${Math.round((item.confirmed_requests / item.total_requests) * 100)}%`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Município', 'Setor', 'Tempo Médio', 'Total', 'Confirmados', 'Taxa %']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        halign: 'center'
      },
      headStyles: { 
        fillColor: [52, 73, 94],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'left' },
        2: { 
          halign: 'center',
          cellPadding: 3,
          fontSize: 10,
          fontStyle: 'bold'
        }
      },
      didParseCell: function(data) {
        if (data.column.index === 2 && data.section === 'body') {
          const timeText = data.cell.text[0];
          if (timeText && timeText !== '--') {
            const minutes = parseFloat(timeText.split(':')[0]) * 60 + parseFloat(timeText.split(':')[1]);
            if (minutes > 60) {
              data.cell.styles.textColor = [231, 76, 60];
            } else if (minutes < 15) {
              data.cell.styles.textColor = [46, 204, 113];
            } else {
              data.cell.styles.textColor = [243, 156, 18];
            }
          }
        }
      }
    });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(149, 165, 166);
    doc.text('Nenhum dado disponível por município e setor para o período selecionado.', 20, yPosition);
  }
};

export const createCityGlobalPage = (doc: jsPDF, statsByCity: StatsByCity[]) => {
  const yPosition = addPdfHeader(doc, 'TEMPO MÉDIO GLOBAL POR MUNICÍPIO');

  if (statsByCity.length > 0) {
    const tableData = statsByCity.map(item => [
      item.origin_city,
      formatTime(item.avg_response_time_minutes),
      item.total_requests.toString(),
      item.confirmed_requests.toString(),
      `${Math.round((item.confirmed_requests / item.total_requests) * 100)}%`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Município', 'Tempo Médio Global', 'Total Solicitações', 'Confirmados', 'Taxa Confirmação']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 4,
        halign: 'center'
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { 
          halign: 'center',
          fontSize: 11,
          fontStyle: 'bold'
        }
      },
      didParseCell: function(data) {
        if (data.column.index === 1 && data.section === 'body') {
          const timeText = data.cell.text[0];
          if (timeText && timeText !== '--') {
            const minutes = parseFloat(timeText.split(':')[0]) * 60 + parseFloat(timeText.split(':')[1]);
            if (minutes > 60) {
              data.cell.styles.fillColor = [255, 235, 235];
              data.cell.styles.textColor = [231, 76, 60];
            } else if (minutes < 15) {
              data.cell.styles.fillColor = [235, 255, 235];
              data.cell.styles.textColor = [46, 204, 113];
            }
          }
        }
      }
    });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(149, 165, 166);
    doc.text('Nenhum dado disponível por município para o período selecionado.', 20, yPosition);
  }
};
