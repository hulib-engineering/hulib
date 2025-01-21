import { Brain, Heart, SquaresFour } from '@phosphor-icons/react/dist/ssr';
import React from 'react';

import { mergeClassnames } from '../private/utils';

interface Props {
  name: string;
  iconName: 'squares-four' | 'brain' | 'heart';
  isActive: boolean | null;
  onClick?: () => void;
}

const StoryCategory = (props: Props) => {
  const { iconName, name, isActive, onClick } = props;
  const styles = React.useMemo(() => {
    if (isActive === null) {
      return {
        textColor: '#021A4C',
        iconColor: '#021A4C',
        backgroundColor: '#CDDDFE',
      };
    }

    if (isActive === true) {
      return {
        textColor: '#fff',
        iconColor: '#fff',
        backgroundColor: '#0442BF',
      };
    }

    return {
      textColor: '#2E3032',
      iconColor: '#343330',
      backgroundColor: '#F9F9F9',
    };
  }, [isActive]);

  const renderIcon = React.useCallback(() => {
    const { iconColor } = styles;
    switch (iconName) {
      case 'squares-four':
        return <SquaresFour size={24} color={iconColor} />;
      case 'brain':
        return <Brain size={24} color={iconColor} />;
      case 'heart':
        return <Heart size={24} color={iconColor} />;
      default:
        return <Brain size={24} color={iconColor} />;
    }
  }, [styles, iconName]);

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
      {renderIcon()}
      <span
        className={mergeClassnames('text-sm font-normal mt-1')}
        style={{
          color: styles.textColor,
        }}
      >
        {name}
      </span>
    </div>
  );
};

export default StoryCategory;
