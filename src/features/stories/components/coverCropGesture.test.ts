import { applyCropGesture } from './coverCropGesture';

const image = { width: 200, height: 200 };
const initial = { zoom: 2, x: 50, y: 50 };

describe('cover crop gestures', () => {
  it('moves the image with one finger and keeps it inside the crop frame', () => {
    const moved = applyCropGesture(initial, image, 100, [{ x: 20, y: 20 }], [{ x: 45, y: 10 }]);

    expect(moved).toEqual({ zoom: 2, x: 25, y: 60 });

    const clamped = applyCropGesture(initial, image, 100, [{ x: 20, y: 20 }], [{ x: 500, y: -500 }]);

    expect(clamped.x).toBe(0);
    expect(clamped.y).toBe(100);
  });

  it('zooms around the midpoint of two fingers', () => {
    const result = applyCropGesture({ zoom: 1, x: 50, y: 50 }, image, 100, [{ x: 15, y: 25 }, { x: 35, y: 25 }], [{ x: 5, y: 25 }, { x: 45, y: 25 }]);

    expect(result).toEqual({ zoom: 2, x: 25, y: 25 });
  });

  it('limits pinch zoom and ignores an unloaded image', () => {
    const before = [{ x: 0, y: 0 }, { x: 10, y: 0 }];
    const after = [{ x: 0, y: 0 }, { x: 100, y: 0 }];

    expect(applyCropGesture(initial, image, 100, before, after).zoom).toBe(3);
    expect(applyCropGesture(initial, { width: 0, height: 0 }, 100, before, after)).toEqual(initial);
  });
});
