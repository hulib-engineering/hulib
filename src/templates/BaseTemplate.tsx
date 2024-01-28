import { Poppins } from 'next/font/google';
import { type ReactNode } from 'react';

import { mergeClassnames } from '@/components/private/utils';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';

type IBaseTemplateProps = {
  children: ReactNode;
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const BaseTemplate = (props: IBaseTemplateProps) => (
  <div
    className={mergeClassnames(
      poppins.className,
      'relative w-full bg-fixed bg-main-pattern bg-cover bg-center px-1 antialiased',
    )}
  >
    <div className="mx-auto flex max-w-full flex-col items-center justify-center">
      <Header />

      <main>{props.children}</main>

      <Footer />
    </div>
  </div>
);

export { BaseTemplate };
