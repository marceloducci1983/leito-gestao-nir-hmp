
import { format } from 'date-fns';
import { getCurrentDateTimeSaoPaulo } from './timezoneUtils';

export const handlePrintDischarges = () => {
  const printContent = document.getElementById('discharges-content');
  if (printContent) {
    const newWindow = window.open('', '_blank');
    newWindow?.document.write(`
      <html>
        <head>
          <title>Relatório de Altas Previstas</title>
          <meta charset="UTF-8">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body { 
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
              line-height: 1.6; 
              color: #2c3e50; 
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              padding: 20px;
            }
            
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              border-radius: 15px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              position: relative;
            }
            
            .header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 5px;
              background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            }
            
            .header h1 {
              font-size: 2.5em;
              font-weight: 700;
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .header p {
              font-size: 1.1em;
              opacity: 0.9;
              font-weight: 300;
            }
            
            .content {
              padding: 30px;
            }
            
            .section {
              margin-bottom: 40px;
              background: #f8f9fa;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            }
            
            .section-header {
              background: linear-gradient(135deg, #ff9a56 0%, #f39c12 100%);
              color: white;
              padding: 20px 25px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            
            .section-header.urgent {
              background: linear-gradient(135deg, #ff6b6b 0%, #e55353 100%);
            }
            
            .section-header.regular {
              background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
            }
            
            .section-title {
              font-size: 1.5em;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .section-count {
              background: rgba(255,255,255,0.2);
              padding: 8px 16px;
              border-radius: 25px;
              font-weight: 600;
              font-size: 1.1em;
            }
            
            .patient-list {
              padding: 0;
            }
            
            .patient-item {
              background: white;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 15px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-left: 4px solid #3498db;
              page-break-inside: avoid;
            }
            
            .patient-item:not(.regular) {
              border-left-color: #e74c3c;
            }
            
            .patient-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 1px solid #ecf0f1;
            }
            
            .patient-name {
              font-size: 1.2em;
              font-weight: 700;
              color: #2c3e50;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .bed-info {
              background: #3498db;
              color: white;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 0.85em;
              font-weight: 600;
            }
            
            .urgency-badge {
              background: #e74c3c;
              color: white;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 0.8em;
              font-weight: 600;
            }
            
            .patient-info {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-bottom: 16px;
            }
            
            .info-item {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            
            .info-label {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 0.7em;
              text-transform: uppercase;
              color: #7f8c8d;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            
            .info-value {
              font-size: 0.9em;
              font-weight: 500;
              color: #2c3e50;
            }
            
            .info-value.highlight {
              color: #e74c3c;
              font-weight: 700;
            }
            
            .info-icon {
              width: 16px;
              height: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              font-size: 0.7em;
              color: white;
              font-weight: bold;
            }
            
            .info-icon.birth { background: #9b59b6; }
            .info-icon.age { background: #27ae60; }
            .info-icon.admission { background: #3498db; }
            .info-icon.origin { background: #f39c12; }
            .info-icon.discharge { background: #e74c3c; }
            .info-icon.specialty { background: #1abc9c; }
            
            .diagnosis {
              background: #8e44ad;
              background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
              color: white;
              padding: 12px 16px;
              border-radius: 8px;
              margin-top: 12px;
              font-weight: 500;
              font-size: 0.9em;
            }
            
            .diagnosis-label {
              font-size: 0.7em;
              text-transform: uppercase;
              opacity: 0.9;
              margin-bottom: 4px;
              display: block;
            }
            
            .tfd-badge {
              display: inline-block;
              background: linear-gradient(135deg, #ff9a56 0%, #f39c12 100%);
              color: white;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 0.75em;
              font-weight: 600;
              margin-top: 8px;
            }
            
            .summary {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 25px;
              border-radius: 12px;
              margin-top: 30px;
              text-align: center;
              page-break-inside: avoid;
            }
            
            .summary h3 {
              font-size: 1.3em;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            
            .stats {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-top: 20px;
            }
            
            .stat-item {
              background: rgba(255,255,255,0.15);
              padding: 16px;
              border-radius: 10px;
              text-align: center;
            }
            
            .stat-number {
              font-size: 1.8em;
              font-weight: 700;
              display: block;
              margin-bottom: 6px;
            }
            
            .stat-label {
              font-size: 0.85em;
              opacity: 0.95;
              font-weight: 500;
            }
            
            @media print {
              body { 
                background: white !important; 
                padding: 0 !important; 
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .container { 
                box-shadow: none !important; 
                border-radius: 0 !important; 
              }
              .patient-item { 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                page-break-inside: avoid !important;
              }
              .urgency-badge, .bed-info, .tfd-badge { 
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .diagnosis {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .summary {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .info-icon {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Relatório de Altas Previstas</h1>
              <p>Gerado em: ${format(getCurrentDateTimeSaoPaulo(), "dd/MM/yyyy 'às' HH:mm")}</p>
            </div>
            <div class="content">
              ${printContent.innerHTML.replace(
                /<div class="info-item">/g,
                '<div class="info-item"><div class="info-label">'
              ).replace(
                /Nascimento: /g,
                '<div class="info-icon birth">📅</div>Nascimento</div><div class="info-value">'
              ).replace(
                /Idade: /g,
                '<div class="info-icon age">👶</div>Idade</div><div class="info-value">'
              ).replace(
                /Admissão: /g,
                '<div class="info-icon admission">🏥</div>Admissão</div><div class="info-value">'
              ).replace(
                /Origem: /g,
                '<div class="info-icon origin">📍</div>Origem</div><div class="info-value">'
              ).replace(
                /DPA: /g,
                '<div class="info-icon discharge">⏰</div>DPA</div><div class="info-value highlight">'
              ).replace(
                /Especialidade: /g,
                '<div class="info-icon specialty">🩺</div>Especialidade</div><div class="info-value">'
              ).replace(
                /<span class="text-sm text-gray-700">/g,
                '<span class="diagnosis-label">Diagnóstico</span><span class="diagnosis-text">'
              )}
            </div>
          </div>
        </body>
      </html>
    `);
    newWindow?.document.close();
    newWindow?.print();
  }
};
