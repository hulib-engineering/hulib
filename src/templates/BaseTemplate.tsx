import type { ReactNode } from 'react';

import Footer from '@/app/[locale]/(unauth)/(landingpage)/_components/Footer';
import Header from '@/app/[locale]/(unauth)/(landingpage)/_components/Header';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/core/private/utils';
import { poppins } from '@/styles/fonts';

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
