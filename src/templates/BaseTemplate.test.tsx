import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import StoreProvider from '@/app/StoreProvider';
import messages from '@/locales/en.json';

import { BaseTemplate } from './BaseTemplate';

// Mock useRouter and usePathname of next-intl:
jest.mock('next-intl/navigation', () => ({
  createSharedPathnamesNavigation() {
    return {
      useRouter() {
        return {
          push: () => jest.fn(),
          replace: () => jest.fn(),
        };
      },
      usePathname() {
        return '';
      },
    };
  },
}));

describe('Base template', () => {
  describe('Render method', () => {
    it('should have 3 sections', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <StoreProvider>
            <BaseTemplate>{null}</BaseTemplate>
          </StoreProvider>
        </NextIntlClientProvider>,
      );

      const header = screen.getByRole('banner');
      const main = screen.getByRole('main');
      const footer = screen.getByRole('contentinfo');

      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    // it('should have a link to support creativedesignsguru.com', () => {
    //   render(
    //     <NextIntlClientProvider locale="en" messages={messages}>
    //       <BaseTemplate>{null}</BaseTemplate>
    //     </NextIntlClientProvider>,
    //   );

    //   const copyrightSection = screen.getByText(/© Copyright/);
    //   const copyrightLink = within(copyrightSection).getByRole('link');

    //   /*
    //    * PLEASE READ THIS SECTION
    //    * We'll really appreciate if you could have a link to our website
    //    * The link doesn't need to appear on every pages, one link on one page is enough.
    //    * Thank you for your support it'll mean a lot for us.
    //    */
    //   expect(copyrightLink).toHaveAttribute(
    //     'href',
    //     'https://creativedesignsguru.com',
    //   );
    // });
  });
});
