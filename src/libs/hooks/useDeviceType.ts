'use client';

import React from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

const useDeviceType = () => {
  const [deviceType, setDeviceType] = React.useState('desktop');

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    setDeviceType(updateDeviceType());
    window.addEventListener('resize', () => setDeviceType(updateDeviceType()));

    return () =>
      window.removeEventListener('resize', () =>
        setDeviceType(updateDeviceType()),
      );
  }, []);

  return { deviceType };
};

export default useDeviceType;
