
import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useResponsive = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setDeviceType('mobile');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 1024) {
        setDeviceType('tablet');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setDeviceType('desktop');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop
  };
};
