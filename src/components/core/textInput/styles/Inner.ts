import styled from 'styled-components';

import type { ColorProps } from '@/components/core/private/types';

// `$bgColor` is a styled-components transient prop: the `$` prefix keeps it out
// of the rendered DOM. Plain `bgColor` is a real HTML attribute, so styled-
// components forwards it to the <div> and React warns about an unknown prop.
const Inner = styled.div<{ $bgColor?: ColorProps }>(({ $bgColor }) => ({
  width: '100%',
  maxWidth: '100%',
  position: 'relative',
  borderRadius: '8px',
  backgroundColor: $bgColor || 'transparent',
}));

export default Inner;
