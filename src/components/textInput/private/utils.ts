const getSizeStyles = (size?: string) => {
  switch (size) {
    case 'xl':
      return 'h-14 leading-[3.5rem] rounded-moon-i-sm hover:rounded-moon-i-sm focus:rounded-moon-i-sm invalid:rounded-moon-i-sm';
    case 'lg':
      return 'h-12 leading-[3rem] rounded-moon-i-sm hover:rounded-moon-i-sm focus:rounded-moon-i-sm invalid:rounded-moon-i-sm';
    case 'sm':
      return 'h-8 leading-8 rounded-moon-i-xs hover:rounded-moon-i-xs focus:rounded-moon-i-xs invalid:rounded-moon-i-xs';
    default:
      return 'h-10 leading-10 rounded-moon-i-xs hover:rounded-moon-i-xs focus:rounded-moon-i-xs invalid:rounded-moon-i-xs';
  }
};

const makeBorder = (
  isSideBorderHidden?: boolean,
  isTopBottomBorderHidden?: boolean,
  isFirst?: boolean,
  isRtl?: boolean,
  error?: boolean,
) => {
  if (error) {
    return '';
  }
  if (isSideBorderHidden) {
    if (isRtl) {
      return isFirst ? 'input-lsb-hidden' : 'input-rsb-hidden';
    }
    return isFirst ? 'input-rsb-hidden' : 'input-lsb-hidden';
  }
  if (isTopBottomBorderHidden) {
    return isFirst ? 'input-bbb-hidden' : 'input-tbb-hidden';
  }
  return '';
};

const getBorderRadius = (size?: string) => {
  switch (size) {
    case 'xl':
    case 'lg':
      return 'rounded-moon-i-sm';
    default:
      return 'rounded-moon-i-xs';
  }
};

const getLabelSize = (size?: string) => {
  switch (size) {
    case 'sm':
      return 'text-moon-14';
    default:
      return 'text-moon-16';
  }
};

export { getBorderRadius, getLabelSize, getSizeStyles, makeBorder };
