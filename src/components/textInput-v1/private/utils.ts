const getLabelSize = (size?: string) => {
  switch (size) {
    case 'sm':
      return 'text-xs';
    default:
      return 'text-sm leading-4';
  }
};

const getBorderRadius = (size?: string) => {
  switch (size) {
    case 'xl':
    case 'lg':
      return 'rounded-3xl';
    default:
      return 'rounded-2xl';
  }
};

const makeBorder = (
  isSideBorderHidden?: boolean,
  isTopBottomBorderHidden?: boolean,
  isFirst?: boolean,
  isRtl?: boolean,
  error?: boolean,
) => {
  if (error) return '';
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

const getSizeStyles = (size?: string) => {
  switch (size) {
    case 'xl':
      return 'h-14 leading-[3.5rem] rounded-3xl hover:rounded-3xl focus:rounded-3xl invalid:rounded-3xl';
    case 'lg':
      return 'h-12 leading-[3rem] rounded-3xl hover:rounded-3xl focus:rounded-3xl invalid:rounded-3xl';
    case 'sm':
      return 'h-8 leading-8 rounded-2xl hover:rounded-2xl focus:rounded-2xl invalid:rounded-2xl';
    default:
      return 'h-10 leading-10 rounded-2xl hover:rounded-2xl focus:rounded-2xl invalid:rounded-2xl';
  }
};

export { getBorderRadius, getLabelSize, getSizeStyles, makeBorder };
