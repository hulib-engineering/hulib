import styled from 'styled-components';

import type { ColorProps } from '@/components/private/types';

import makeBorderRadius from '../private/makeBorderRadius';

type ContainerProps = {
  disabled?: boolean;
  isSharpLeftSide?: boolean;
  isSharpRightSide?: boolean;
  isSharpTopSide?: boolean;
  isSharpBottomSide?: boolean;
  bgColor?: ColorProps;
};

const Container = styled.div<ContainerProps>(
  ({
    disabled,
    isSharpLeftSide,
    isSharpRightSide,
    isSharpTopSide,
    isSharpBottomSide,
    bgColor,
  }) => [
    {
      width: '100%',
      maxWidth: '100%',
      position: 'relative',
      zIndex: 0,
      backgroundColor: bgColor,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      ...makeBorderRadius(
        isSharpLeftSide,
        isSharpRightSide,
        isSharpTopSide,
        isSharpBottomSide,
      ),
    },
    disabled && {
      opacity: 0.3,
      cursor: 'not-allowed',
    },
  ],
);

export default Container;
