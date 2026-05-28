import type { ButtonAnimations } from '../types';

const getAnimation = (animation?: ButtonAnimations): string => {
  switch (animation) {
    case 'error':
      return 'animate-error backface-hidden';
    case 'pulse':
      return 'animate-pulse2';
    default:
      return '';
  }
};

export default getAnimation;
