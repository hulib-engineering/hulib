/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const CommonLayout = (props: Props) => {
  const { children } = props;

  const renderChildren = React.useCallback(() => {
    return children;
  }, []);

  return (
    <section className="w-full">
      <div className="w-full justify-between rounded-md bg-white px-4 -py-8 md:px-28 md:py-12 lg:flex-row">
        {renderChildren()}
      </div>
    </section>
  );
};

export default CommonLayout;
