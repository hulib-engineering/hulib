'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false },
);

const AnimationLoading = ({
  animationData,
  width,
  height,
}: {
  animationData: string;
  width?: string;
  height?: string;
}) => (
  <Player
    autoplay
    loop
    src={animationData}
    style={{ height: height || '100%', width: width || '100%' }}
  />
);

export { AnimationLoading };
