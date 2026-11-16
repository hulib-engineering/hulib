import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { MessengerInput } from './MessengerInput';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('@/libs/services/modules/stickers', () => ({ useGetStickersQuery: () => ({ data: { data: [] } }) }));
jest.mock('@/components/core/textInput/TextInput', () => ({ __esModule: true, default: ({ icon, ...props }: any) => (
  <div>
    <input {...props} />
    {icon}
  </div>
) }));
jest.mock('@/components/core/iconButton/IconButton', () => ({ __esModule: true, default: ({ children, ...props }: any) => <button type="button" {...props}>{children}</button> }));

it('sends each message once and does not send empty or whitespace-only input', () => {
  const onSend = jest.fn();
  render(<MessengerInput onSend={onSend} />);
  const input = screen.getByRole('textbox');

  fireEvent.change(input, { target: { value: 'hello' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  expect(onSend).toHaveBeenCalledTimes(1);
  expect(onSend).toHaveBeenCalledWith('hello');
  expect(input).toHaveValue('');

  fireEvent.keyDown(input, { key: 'Enter' });
  fireEvent.change(input, { target: { value: '   ' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  expect(onSend).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
