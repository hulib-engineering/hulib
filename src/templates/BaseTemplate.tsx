import { Poppins } from 'next/font/google';
import { type ReactNode } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

type IBaseTemplateProps = {
  // leftNav?: ReactNode;
  // rightNav?: ReactNode;
  children: ReactNode;
};
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});
const BaseTemplate = (props: IBaseTemplateProps) => {
  return (
    <div
      className={` ${poppins.className} w-full px-1 text-gray-700 antialiased`}
    >
      <Header />
      <div className="mx-auto">
        <main>{props.children}</main>
      </div>
      <Footer />
    </div>
  );
};

export { BaseTemplate };
