import React from 'react';

import { mergeClassnames } from '../private/utils';

interface Props {
  name: string;
  isActive: boolean | null;
  onClick?: () => void;
}

const Topic = (props: Props) => {
  const { name, isActive, onClick } = props;
  const styles = React.useMemo(() => {
    if (isActive === null) {
      return {
        textColor: '#021A4C',
        backgroundColor: '#CDDDFE',
      };
    }

    if (isActive === true) {
      return {
        textColor: '#fff',
        backgroundColor: '#0442BF',
      };
    }

    return {
      textColor: '#2E3032',
      backgroundColor: '#F9F9F9',
    };
  }, [isActive]);

  return (
    <div
      className={mergeClassnames(
        'flex flex-row items-center justify-center p-2 rounded-[1.5rem] gap-1 cursor-pointer',
      )}
      style={{
        backgroundColor: styles.backgroundColor,
      }}
      aria-hidden="true"
      onClick={onClick}
    >
      <span
        className={mergeClassnames('text-sm font-normal px-1')}
        style={{
          color: styles.textColor,
        }}
      >
        {name}
      </span>
    </div>
  );
};

export default Topic;
