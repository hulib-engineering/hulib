/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const CommonLayout = (props: Props) => {
  const { children, className } = props;

  return (
    <section className="w-full">
      <div
        className={clsx(
          `${className} w-full justify-between rounded-md p-0 px-4  py-[-2rem] lg:flex-row `,
          'md:px-28 md:py-12',
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default CommonLayout;
