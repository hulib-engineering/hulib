'use client';

import React from 'react';

import IconButton from '../iconButton/IconButton';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const StoryPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between p-4">
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`flex size-8 items-center justify-center rounded-full border border-blue-500 ${
          currentPage === 0
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-blue-100'
        }`}
      >
        &lt;
      </IconButton>
      <span className="text-sm text-gray-700">
        {currentPage + 1}
        {' '}
        /
        {totalPages}
      </span>
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 === totalPages}
        className={`flex size-8 items-center justify-center rounded-full border border-blue-500 ${
          currentPage + 1 >= totalPages
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-blue-100'
        }`}
      >
        &gt;
      </IconButton>
    </div>
  );
};

export default StoryPagination;
