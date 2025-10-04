import styled from 'styled-components';

const ShowPassword = styled.div<{ isRtl?: boolean }>(({ isRtl }) => ({
  fontSize: '14px',
  lineHeight: '24px',
  color: '#5C6063',
  position: 'absolute',
  top: '50%',
  marginTop: '-12px',
  ...(isRtl ? { left: '15px' } : { right: '15px' }),
  zIndex: 3,
  textDecoration: 'underline',
  cursor: 'pointer',
}));

export default ShowPassword;
