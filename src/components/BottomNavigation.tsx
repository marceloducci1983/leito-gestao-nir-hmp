
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Bed, 
  BarChart3, 
  Calendar, 
  AlertTriangle,
  Settings 
} from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const bottomItems = [
    { value: "beds", icon: Bed, label: "LEITOS" },
    { value: "indicators", icon: BarChart3, label: "STATS" },
    { value: "expected-discharges", icon: Calendar, label: "ALTAS" },
    { value: "alerts", icon: AlertTriangle, label: "ALERTAS" },
    { value: "nir", icon: Settings, label: "MAIS" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.value;
          
          return (
            <button
              key={item.value}
              onClick={() => onTabChange(item.value)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-b" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
