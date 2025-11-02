'use client';

import React, { useCallback, useState } from 'react';
import type WaveSurfer from 'wavesurfer.js';

import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';
import { useDeviceType } from '@/libs/hooks';

type IconType = {
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
  { size: 16, yPosition: 'top-[99px] -translate-y-1/2', xPosition: 'right-[277px] translate-x-1/2' },
  { size: 60, yPosition: 'top-1/2 -translate-y-1/2', xPosition: 'left-1/2 -translate-x-1/2' },
];
const VectorIcons: IconType[] = [
  {
    width: 18,
    height: 75,
    yPosition: 'bottom-[141px]',
    xPosition: 'left-[176px]',
  },
  { width: 11, height: 53, yPosition: 'top-[136px]', xPosition: 'left-[229px]' },
  {
    width: 49,
    height: 65,
    yPosition: 'top-[180px]',
    xPosition: 'right-[199px]',
  },
];
const VectorIconsForMobile: IconType[] = [
  {
    width: 18,
    height: 28,
    yPosition: 'bottom-[54px]',
    xPosition: 'left-0',
  },
  { width: 18, height: 20, yPosition: 'top-5', xPosition: 'right-0' },
  {
    width: 11,
    height: 20,
    yPosition: 'top-[50px]',
    xPosition: 'left-[15px]',
  },
];
const StarIconsForMobile: IconType[] = [
  { size: 6, yPosition: 'top-[36px]', xPosition: 'left-2' },
  { size: 22, yPosition: 'top-[63px]', xPosition: 'right-[26px]' },
  { size: 11, yPosition: 'bottom-[63px]', xPosition: 'right-2.5' },
];

const Hero = () => {
  // @ts-ignore
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { deviceType } = useDeviceType({ mobile: 1280 });

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = useCallback(async () => {
    if (wavesurfer) {
      await wavesurfer.playPause();
    }
  }, [wavesurfer]);

  return deviceType !== 'mobile'
    ? (
        <HeroDesktop
          StarIcons={StarIcons}
          VectorIcons={VectorIcons}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onPlayPause={onPlayPause}
          onReady={onReady}
        />
      )
    : (
        <HeroMobile
          StarIcons={StarIconsForMobile}
          VectorIcons={VectorIconsForMobile}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onPlayPause={onPlayPause}
          onReady={onReady}
        />
      );
};

export default Hero;
