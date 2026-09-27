import '../src/styles/global.css';

import { SessionProvider } from 'next-auth/react';
import type { Preview } from '@storybook/react';
import type { ReactNode } from 'react';

const mockSession = {
  expires: '9999-12-31T23:59:59.999Z',
};

const SessionDecorator = ({ children }: { children: ReactNode }) => (
  <SessionProvider
    session={mockSession}
    refetchInterval={0}
    refetchOnWindowFocus={false}
  >
    {children}
  </SessionProvider>
);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [SessionDecorator],
};

export default preview;
