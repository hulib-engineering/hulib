'use client';

import React from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

type BreakPoint = Partial<{
  mobile: number;
  desktop: number;
}>;

const useDeviceType = (breakPoint: BreakPoint = {}) => {
  const [deviceType, setDeviceType] = React.useState<DeviceType>('desktop');
  const { mobile = 768, desktop = 1024 } = breakPoint;

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < mobile) {
        return 'mobile';
      }
      if (width < desktop) {
        return 'tablet';
      }
      return 'desktop';
    };

    const handleResize = () => setDeviceType(updateDeviceType());

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [mobile, desktop]);

  return { deviceType };
};

export default useDeviceType;
