
import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange, onLogout }) => {
  const tabs = [
    'PAINEL DE LEITOS',
    'INDICADORES',
    'ALTAS PREVISTAS',
    'EM TFD',
    'ALERTAS DE INTERVENÇÃO',
    'MONITORAMENTO DE ALTAS',
    'ARQUIVO',
    'NIR'
  ];

  return (
    <div className="bg-white shadow-md border-b">
      <div className="max-w-full px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            SISTEMA DE GESTÃO DE LEITOS - NIR - HMP
          </h1>
          <Button onClick={onLogout} variant="outline" size="sm">
            Sair
          </Button>
        </div>
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => onTabChange(tab)}
              variant={activeTab === tab ? "default" : "outline"}
              className="text-xs md:text-sm"
            >
              {tab}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavigationBar;
