
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export const SystemInfoCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Sobre o Sistema de Gestão de Leitos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Descrição:</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Este módulo permite configurar as informações gerais do Sistema de Gestão de Leitos do Hospital Municipal de Paracatu. 
            Aqui, o administrador pode definir o nome institucional do hospital, o e-mail de contato responsável pela administração 
            do sistema, além de ajustar preferências essenciais para o funcionamento seguro, eficiente e contínuo da plataforma.
          </p>
          <p className="text-sm text-blue-700 leading-relaxed mt-2">
            O sistema oferece um monitoramento interno de toda a jornada do paciente, desde a sua entrada (internação) até a 
            saída (alta hospitalar), proporcionando maior controle, rastreabilidade e apoio à tomada de decisões operacionais.
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-3">Principais Funcionalidades:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="text-sm text-green-700">
              <p className="font-medium">• Monitoramento dos Tempos de Alta</p>
              <p className="ml-2 text-xs">Acompanhamento detalhado por departamento e município</p>
            </div>
            <div className="text-sm text-green-700">
              <p className="font-medium">• Análise de Internações Prolongadas</p>
              <p className="ml-2 text-xs">Relatórios de pacientes com internações {'>'}15 dias</p>
            </div>
            <div className="text-sm text-green-700">
              <p className="font-medium">• Controle de Reinternações</p>
              <p className="ml-2 text-xs">Monitoramento de retornos em {'<'}30 dias</p>
            </div>
            <div className="text-sm text-green-700">
              <p className="font-medium">• Dashboards e Análises</p>
              <p className="ml-2 text-xs">Indicadores de desempenho e tendências</p>
            </div>
            <div className="text-sm text-green-700 md:col-span-2">
              <p className="font-medium">• Intervenções em Pacientes em TFD</p>
              <p className="ml-2 text-xs">Gerenciamento de casos de Tratamento Fora de Domicílio</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span><strong>Criador:</strong> Marcelo Souza – Coordenador do Núcleo Interno de Regulação de Leitos (NIR-HMP)</span>
            <span><strong>Ano:</strong> 2025</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
