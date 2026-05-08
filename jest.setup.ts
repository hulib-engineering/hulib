// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.ts`
import '@testing-library/jest-dom';

import ResizeObserver from 'resize-observer-polyfill';

globalThis.ResizeObserver = ResizeObserver;

// Mock next-auth - complete mock
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn().mockResolvedValue(null),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn().mockResolvedValue(null),
}));

// Mock next-intl - only mock hooks, NOT components
jest.mock('next-intl/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '',
  useLocale: () => 'en',
  createSharedPathnamesNavigation: () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
    usePathname: () => '',
  }),
}));

// Mock the hooks but NOT the provider components
jest.mock('next-intl', () => {
  const actual = jest.requireActual('next-intl');
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
    useLocale: () => 'en',
  };
});

// Silence RTK Query fetch warning in test environment
const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('fetch` is not available')) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};
