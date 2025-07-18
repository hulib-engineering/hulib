import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const esModules = ['@wavesurfer/react', 'swiper'].join('|');

const customJestConfig: Config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/public/(.*)$': '<rootDir>/public/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*.{js,jsx,ts,tsx}',
    '!./src/**/_*.{js,jsx,ts,tsx}',
    '!./src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/(?!swiper|ssr-window|dom7)',
    '<rootDir>/tests/',
    '<rootDir>/__checks__/',
  ],
};

export default async (): Promise<Config> => {
  return {
    ...(await createJestConfig(customJestConfig)()),
    transformIgnorePatterns: [`node_modules/(?!(${esModules})/)`],
  };
};
