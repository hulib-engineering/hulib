import React, { useContext } from 'react';

import type { FreeSearchActionProps } from '../types';
import { SearchContext } from '../utils/context';
import ListItem from './ResultItem';
import { mergeClassnames } from '@/components/core/private/utils';

const NoResults = ({
  label = 'Search for',
  className,
  ...props
}: FreeSearchActionProps) => {
  const { search } = useContext(SearchContext);

  return (
    <ListItem index={0} showType={false} {...props}>
      <p className={mergeClassnames('truncate text-neutral-20', className)}>
        {label}
        {' '}
        <span className="font-medium">{`${search}`}</span>
      </p>
    </ListItem>
  );
};

export default NoResults;
