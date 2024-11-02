import styled from 'styled-components';

const LabelInner = styled.label<{ isRtl?: boolean }>(
  ({
    theme: {
      colorNew,
      newTokens: { transition },
    },
    isRtl,
  }) => ({
    position: 'absolute',
    ...(isRtl ? { right: '1rem' } : { left: '1rem' }),
    fontSize: '12px',
    lineHeight: '12px',
    color: colorNew.trunks,
    top: '12px',
    zIndex: 1,
    transition: `all ${transition.default}`,
  }),
);

export default LabelInner;
