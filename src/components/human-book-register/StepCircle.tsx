import React from 'react';

interface Props {
  value: number;
  active?: boolean;
  isDoneStep?: boolean;
}

const StepCircle = (props: Props) => {
  const { value, active, isDoneStep } = props;
  return (
    <div
      className={`flex items-center justify-center rounded-full text-base font-medium ${
        isDoneStep
          ? 'size-6 bg-primary-60 leading-6 text-white'
          : active
            ? 'size-10 bg-primary-60 leading-10 text-white'
            : 'size-6 border-[1px] border-solid border-primary-80 bg-white leading-6 text-primary-80'
      }`}
    >{`${value + 1}`}</div>
  );
};

export default React.memo(StepCircle);
