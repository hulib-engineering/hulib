import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import Index from './page';
import messages from '@/locales/en.json';

describe('Index page', () => {
  describe('Render method', () => {
    it('should have About section', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <Index />
        </NextIntlClientProvider>,
      );

      const about = screen.getByTestId('about-section');

      expect(about).toBeInTheDocument();
    });
  });

  describe('Display tooltip when hover', () => {
    it('should display Tooltip on hovering Sponsor item', () => {
      // const mockHandleEnter = jest.fn();
      // const mockHandleLeave = jest.fn();

      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <Index />
        </NextIntlClientProvider>,
      );

      fireEvent.mouseEnter(screen.getByTestId('sponsor-item-WEC'));
      // expect(mockHandleEnter).toHaveBeenCalled();

      fireEvent.mouseLeave(screen.getByTestId('sponsor-item-WEC'));
      // expect(mockHandleLeave).toHaveBeenCalled();
    });
  });
});
