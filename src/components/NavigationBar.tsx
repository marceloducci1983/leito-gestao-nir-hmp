
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Bed, 
  BarChart3, 
  Calendar, 
  Plane, 
  AlertTriangle, 
  ClipboardCheck, 
  Archive, 
  Settings,
  LogOut
} from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import MobileNavigation from './MobileNavigation';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange, onLogout }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile) {
    return (
      <div className="w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">NIR - HMP</h1>
              <p className="text-xs text-gray-600">Sistema de Gestão de Leitos</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <MobileNavigation activeTab={activeTab} onTabChange={onTabChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-2 pt-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900">NIR - HMP</h1>
              <p className="text-xs text-gray-600">Sistema de Gestão de Leitos</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-14">
              <TabsTrigger value="beds" className="flex items-center gap-2 text-sm">
                <Bed className="h-4 w-4" />
                <span>LEITOS</span>
              </TabsTrigger>
              
              <TabsTrigger value="indicators" className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4" />
                <span>STATS</span>
              </TabsTrigger>
              
              <TabsTrigger value="expected-discharges" className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>ALTAS</span>
              </TabsTrigger>
              
              <TabsTrigger value="alerts" className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>ALERTAS</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    );
  }

  // Desktop view - keep existing functionality
  return (
    <div className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-2 pt-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">NIR - HMP</h1>
            <p className="text-sm text-gray-600">Sistema de Gestão de Leitos</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
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
