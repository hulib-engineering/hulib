/* eslint-disable react-hooks/exhaustive-deps */
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
        className={`w-full justify-between rounded-md px-4 py-[-2rem] md:px-28 md:py-12 lg:flex-row ${className}`}
      >
        {children}
      </div>
    </section>
  );
};

export default CommonLayout;
