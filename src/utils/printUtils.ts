
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
              padding: 25px;
            }
            
            .patient-item {
              background: white;
              border-radius: 10px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 3px 10px rgba(0,0,0,0.1);
              border-left: 5px solid #e74c3c;
              transition: transform 0.2s ease;
            }
            
            .patient-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            }
            
            .patient-item.regular {
              border-left-color: #3498db;
            }
            
            .patient-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #ecf0f1;
            }
            
            .patient-name {
              font-size: 1.3em;
              font-weight: 700;
              color: #2c3e50;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .bed-info {
              background: #3498db;
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 0.9em;
              font-weight: 600;
            }
            
            .urgency-badge {
              background: #e74c3c;
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 0.85em;
              font-weight: 600;
              animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.7; }
              100% { opacity: 1; }
            }
            
            .patient-info {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 15px;
              margin-bottom: 15px;
            }
            
            .info-item {
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 8px 12px;
              background: #f8f9fa;
              border-radius: 8px;
              font-size: 0.95em;
            }
            
            .info-icon {
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #3498db;
              color: white;
              border-radius: 50%;
              font-size: 0.8em;
              font-weight: bold;
            }
            
            .info-icon.birth { background: #9b59b6; }
            .info-icon.age { background: #27ae60; }
            .info-icon.admission { background: #f39c12; }
            .info-icon.origin { background: #e67e22; }
            .info-icon.discharge { background: #e74c3c; }
            .info-icon.specialty { background: #1abc9c; }
            
            .diagnosis {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin-top: 10px;
              font-weight: 500;
            }
            
            .tfd-badge {
              display: inline-block;
              background: linear-gradient(135deg, #ff9a56 0%, #f39c12 100%);
              color: white;
              padding: 6px 12px;
              border-radius: 15px;
              font-size: 0.85em;
              font-weight: 600;
              margin-top: 10px;
            }
            
            .summary {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 25px;
              border-radius: 12px;
              margin-top: 30px;
              text-align: center;
            }
            
            .summary h3 {
              font-size: 1.4em;
              margin-bottom: 15px;
            }
            
            .stats {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-top: 20px;
            }
            
            .stat-item {
              background: rgba(255,255,255,0.1);
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }
            
            .stat-number {
              font-size: 2em;
              font-weight: 700;
              display: block;
            }
            
            .stat-label {
              font-size: 0.9em;
              opacity: 0.9;
            }
            
            @media print {
              body { background: white; padding: 0; }
              .container { box-shadow: none; border-radius: 0; }
              .patient-item:hover { transform: none; }
              .urgency-badge { animation: none; }
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
              ${printContent.innerHTML}
            </div>
          </div>
        </body>
      </html>
    `);
    newWindow?.document.close();
    newWindow?.print();
  }
};
