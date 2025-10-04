const makeBorderRadius = (
  isSharpLeftSide?: boolean,
  isSharpRightSide?: boolean,
  isSharpTopSide?: boolean,
  isSharpBottomSide?: boolean,
) => {
  return {
    borderTopLeftRadius: isSharpLeftSide || isSharpTopSide ? 0 : '12px',
    borderTopRightRadius: isSharpRightSide || isSharpTopSide ? 0 : '12px',
    borderBottomLeftRadius: isSharpLeftSide || isSharpBottomSide ? 0 : '12px',
    borderBottomRightRadius: isSharpRightSide || isSharpBottomSide ? 0 : '12px',
  };
};

export default makeBorderRadius;
