'use client';

import { Player } from '@lottiefiles/react-lottie-player';
import React from 'react';

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
