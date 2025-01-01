'use client';

import React, { useCallback, useState } from 'react';
import type WaveSurfer from 'wavesurfer.js';

import { useDeviceType } from '@/libs/hooks';

import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';

export type IconType = {
  size?: number;
  yPosition?: string;
  xPosition?: string;
  height?: number;
  width?: number;
};

export type HeroProps = {
  StarIcons: IconType[];
  VectorIcons: IconType[];
  onReady?: any;
  isPlaying?: boolean;
  onPlayPause: () => void;
  setIsPlaying: (value: boolean) => void;
};

const StarIcons: IconType[] = [
  { size: 16, yPosition: 'top-[6.1875rem]', xPosition: 'left-[17.6875rem]' },
  { size: 60, yPosition: 'bottom-[222px]', xPosition: 'right-[171px]' },
  { size: 30, yPosition: 'bottom-[115px]', xPosition: 'right-[123px]' },
];
const VectorIcons: IconType[] = [
  {
    width: 57,
    height: 75,
    yPosition: 'bottom-[141px]',
    xPosition: 'left-[13px]',
  },
  { width: 49, height: 65, yPosition: 'top-[67px]', xPosition: 'right-0' },
  {
    width: 36,
    height: 53,
    yPosition: 'top-[136px]',
    xPosition: 'left-[177px]',
  },
];

const Hero = () => {
  // @ts-ignore
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { deviceType } = useDeviceType({ mobile: 950 });

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = useCallback(async () => {
    if (wavesurfer) {
      await wavesurfer.playPause();
    }
  }, [wavesurfer]);

  return deviceType !== 'mobile' ? (
    <HeroDesktop
      StarIcons={StarIcons}
      VectorIcons={VectorIcons}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      onPlayPause={onPlayPause}
      onReady={onReady}
    />
  ) : (
    <HeroMobile
      StarIcons={StarIcons}
      VectorIcons={VectorIcons}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      onPlayPause={onPlayPause}
      onReady={onReady}
    />
  );
};

export default Hero;
