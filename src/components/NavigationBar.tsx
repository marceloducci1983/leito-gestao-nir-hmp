
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bed, 
  BarChart3, 
  Calendar, 
  Plane, 
  AlertTriangle, 
  ClipboardCheck, 
  Archive, 
  Settings 
} from 'lucide-react';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-8 h-14">
            <TabsTrigger value="beds" className="flex items-center gap-2 text-xs sm:text-sm">
              <Bed className="h-4 w-4" />
              <span className="hidden sm:inline">PAINEL DE LEITOS</span>
              <span className="sm:hidden">LEITOS</span>
            </TabsTrigger>
            
            <TabsTrigger value="indicators" className="flex items-center gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">INDICADORES</span>
              <span className="sm:hidden">INDICADORES</span>
            </TabsTrigger>
            
            <TabsTrigger value="expected-discharges" className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">ALTAS PREVISTAS</span>
              <span className="sm:hidden">ALTAS</span>
            </TabsTrigger>
            
            <TabsTrigger value="tfd" className="flex items-center gap-2 text-xs sm:text-sm">
              <Plane className="h-4 w-4" />
              <span className="hidden sm:inline">EM TFD</span>
              <span className="sm:hidden">TFD</span>
            </TabsTrigger>
            
            <TabsTrigger value="alerts" className="flex items-center gap-2 text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">ALERTAS</span>
              <span className="sm:hidden">ALERTAS</span>
            </TabsTrigger>
            
            <TabsTrigger value="discharge-monitoring" className="flex items-center gap-2 text-xs sm:text-sm">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">MONITORAMENTO</span>
              <span className="sm:hidden">MONITOR</span>
            </TabsTrigger>
            
            <TabsTrigger value="archive" className="flex items-center gap-2 text-xs sm:text-sm">
              <Archive className="h-4 w-4" />
              <span className="hidden sm:inline">ARQUIVO</span>
              <span className="sm:hidden">ARQUIVO</span>
            </TabsTrigger>
            
            <TabsTrigger value="nir" className="flex items-center gap-2 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">NIR</span>
              <span className="sm:hidden">NIR</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default NavigationBar;
