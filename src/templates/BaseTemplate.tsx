import type { ReactNode } from 'react';

import { poppins } from '@/styles/fonts';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/core/private/utils';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';

type IBaseTemplateProps = {
  children: ReactNode;
};

const BaseTemplate = (props: IBaseTemplateProps) => (
  <div
    className={mergeClassnames(
      poppins.className,
      'relative w-screen bg-fixed bg-main-pattern 2xl:bg-cover bg-no-repeat bg-center px-1 antialiased overflow-hidden',
    )}
  >
    <div className="mx-auto flex max-w-full flex-col items-center justify-center">
      <Header />

      <main>{props.children}</main>

      <Footer />
    </div>
    <CustomToastifyContainer />
  </div>
);

export { BaseTemplate };
