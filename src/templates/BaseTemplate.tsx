// import { useTranslations } from 'next-intl';
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
      'relative w-full bg-main-pattern px-1 antialiased',
    )}
  >
    <div className="mx-auto flex max-w-full flex-col items-center justify-center">
      <Header />

      <main>{props.children}</main>

      <Footer />

      {/* <footer className="border-t border-gray-300 py-8 text-center text-sm"> */}
      {/*  © Copyright {new Date().getFullYear()} {AppConfig.name}. */}
      {/*  {` ${t('made_with')} `} */}
      {/*  <a */}
      {/*    href="https://creativedesignsguru.com" */}
      {/*    className="text-blue-700 hover:border-b-2 hover:border-blue-700" */}
      {/*  > */}
      {/*    HuLib */}
      {/*  </a> */}
      {/*  . */}
      {/*  /!* */}
      {/*   * PLEASE READ THIS SECTION */}
      {/*   * I'm an indie maker with limited resources and funds, I'll really appreciate if you could have a link to my website. */}
      {/*   * The link doesn't need to appear on every page, one link on one page is enough. */}
      {/*   * For example, in the `About` page. Thank you for your support, it'll mean a lot to me. */}
      {/*   *!/ */}
      {/* </footer> */}
    </div>
  </div>
);

export { BaseTemplate };
