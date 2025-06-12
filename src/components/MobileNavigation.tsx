
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu,
  Bed, 
  BarChart3, 
  Calendar, 
  Plane, 
  AlertTriangle, 
  ClipboardCheck, 
  Archive, 
  Settings 
} from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { value: "beds", icon: Bed, label: "PAINEL DE LEITOS", shortLabel: "LEITOS" },
    { value: "indicators", icon: BarChart3, label: "INDICADORES", shortLabel: "INDICADORES" },
    { value: "expected-discharges", icon: Calendar, label: "ALTAS PREVISTAS", shortLabel: "ALTAS" },
    { value: "tfd", icon: Plane, label: "EM TFD", shortLabel: "TFD" },
    { value: "alerts", icon: AlertTriangle, label: "ALERTAS", shortLabel: "ALERTAS" },
    { value: "discharge-monitoring", icon: ClipboardCheck, label: "MONITORAMENTO", shortLabel: "MONITOR" },
    { value: "archive", icon: Archive, label: "ARQUIVO", shortLabel: "ARQUIVO" },
    { value: "nir", icon: Settings, label: "NIR", shortLabel: "NIR" }
  ];

  const activeItem = menuItems.find(item => item.value === activeTab);

  const handleTabSelect = (value: string) => {
    onTabChange(value);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="h-12 px-3">
            <Menu className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">
              {activeItem?.shortLabel || 'MENU'}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Navegação</h2>
          </div>
          <div className="flex flex-col py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.value;
              
              return (
                <button
                  key={item.value}
                  onClick={() => handleTabSelect(item.value)}
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-accent ${
                    isActive ? 'bg-accent text-accent-foreground border-r-2 border-primary' : ''
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Ativo
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
