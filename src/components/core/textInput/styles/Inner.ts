import styled from 'styled-components';

import type { ColorProps } from '@/components/core/private/types';

const Inner = styled.div<{ bgColor?: ColorProps }>(({ bgColor }) => ({
  width: '100%',
  maxWidth: '100%',
  position: 'relative',
  borderRadius: '8px',
  backgroundColor: bgColor || 'transparent',
}));

export default Inner;
