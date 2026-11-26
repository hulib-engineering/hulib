import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { MainTemplate } from './MainTemplate';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { useAppDispatch } from '@/libs/hooks';

jest.mock('next-auth/react', () => ({ SessionProvider: ({ children }: any) => children }));
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('@/styles/fonts', () => ({ poppins: { className: '' } }));
jest.mock('@/libs/hooks', () => ({ useAppDispatch: jest.fn() }));
jest.mock('@/libs/i18nNavigation', () => ({ usePathname: () => '/reading' }));
jest.mock('@/libs/services/modules/auth', () => ({ useGetPersonalInfoQuery: jest.fn() }));
jest.mock('@/libs/store/authentication', () => ({ logout: () => ({ type: 'logout' }), setAvatarUrl: jest.fn(), setUserInfo: jest.fn() }));
jest.mock('@/app/[locale]/(auth)/_components/Header', () => () => null);
jest.mock('@/app/[locale]/(auth)/_components/MobileBottomNav', () => () => null);
jest.mock('@/app/[locale]/(auth)/_components/FooterWebApp', () => () => null);
jest.mock('@/components/AuthSessionSync', () => () => null);
jest.mock('@/components/CustomToastifyContainer', () => () => null);
jest.mock('@/layouts/webapp/MultipleChatWidget', () => () => null);

it('keeps the user signed in and offers retry when the profile service fails', () => {
  const dispatch = jest.fn();
  const refetch = jest.fn();
  jest.mocked(useAppDispatch).mockReturnValue(dispatch);
  jest.mocked(useGetPersonalInfoQuery).mockReturnValue({ error: { status: 500 }, refetch } as never);
  render(<MainTemplate>meeting</MainTemplate>);

  expect(dispatch).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: 'try_again' }));

  expect(refetch).toHaveBeenCalledTimes(1);
});

it('signs out on an unauthorized profile response', () => {
  const dispatch = jest.fn();
  jest.mocked(useAppDispatch).mockReturnValue(dispatch);
  jest.mocked(useGetPersonalInfoQuery).mockReturnValue({ error: { status: 401 }, refetch: jest.fn() } as never);
  render(<MainTemplate>meeting</MainTemplate>);

  expect(dispatch).toHaveBeenCalledWith({ type: 'logout' });
});
