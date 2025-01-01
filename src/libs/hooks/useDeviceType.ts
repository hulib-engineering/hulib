'use client';

import React from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type BreakPoint = Partial<{
  mobile: number;
  desktop: number;
}>;

const useDeviceType = (breakPoint: BreakPoint = {}) => {
  const [deviceType, setDeviceType] = React.useState<DeviceType>('desktop');
  const { mobile = 768, desktop = 1024 } = breakPoint;

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < mobile) return 'mobile';
      if (width < desktop) return 'tablet';
      return 'desktop';
    };

    setDeviceType(updateDeviceType());
    window.addEventListener('resize', () => setDeviceType(updateDeviceType()));

    return () =>
      window.removeEventListener('resize', () =>
        setDeviceType(updateDeviceType()),
      );
  }, [mobile, desktop]);

  return { deviceType };
};

export default useDeviceType;
