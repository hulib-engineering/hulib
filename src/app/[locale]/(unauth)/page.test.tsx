import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '@/locales/en.json';

import Index from './page';

describe('Index page', () => {
  describe('Render method', () => {
    it('should have hero section', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <Index />
        </NextIntlClientProvider>,
      );

      const hero = screen.getAllByTestId('hero-section');

      expect(hero).toBeInTheDocument();
    });
  });
});
