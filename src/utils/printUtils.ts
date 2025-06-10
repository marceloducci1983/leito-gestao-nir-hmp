
import { format } from 'date-fns';
import { getCurrentDateTimeSaoPaulo } from './timezoneUtils';

export const handlePrintDischarges = () => {
  const printContent = document.getElementById('discharges-content');
  if (printContent) {
    const newWindow = window.open('', '_blank');
    newWindow?.document.write(`
      <html>
        <head>
          <title>Altas Previstas</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
            .patient-list { display: grid; gap: 15px; }
            .patient-item { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .patient-header { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
            .patient-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
            .info-item { display: flex; align-items: center; gap: 5px; }
            .highlight { background-color: #fffbea; border-left: 4px solid #f59e0b; padding-left: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Altas Previstas</h1>
            <p>Gerado em: ${format(getCurrentDateTimeSaoPaulo(), "dd/MM/yyyy 'às' HH:mm")}</p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    newWindow?.document.close();
    newWindow?.print();
  }
};
