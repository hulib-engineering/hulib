import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { CoverImageCropper } from './CoverImageCropper';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

it('pinches to zoom and continues dragging after one finger is lifted', () => {
  const { container } = render(<CoverImageCropper src="test.png" onCancel={jest.fn()} onSave={jest.fn()} />);
  const image = container.querySelector('img')!;
  Object.defineProperty(image, 'naturalWidth', { value: 200 });
  Object.defineProperty(image, 'naturalHeight', { value: 200 });
  fireEvent.load(image);

  const frame = screen.getByRole('button', { name: 'cover_crop_move' });
  frame.setPointerCapture = jest.fn();
  jest.spyOn(frame, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  const pointer = (type: string, id: number, x: number) => {
    const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: 50 });
    Object.defineProperties(event, { pointerId: { value: id }, pointerType: { value: 'touch' } });
    fireEvent(frame, event);
  };

  pointer('pointerdown', 1, 25);
  pointer('pointerdown', 2, 75);
  pointer('pointermove', 1, 0);
  pointer('pointermove', 2, 100);

  expect(screen.getByRole('slider')).toHaveValue('2');

  pointer('pointerup', 2, 100);
  pointer('pointermove', 1, 10);

  expect(image).toHaveStyle({ left: '-40%' });
});
