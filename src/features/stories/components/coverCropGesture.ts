export type CropPosition = { zoom: number; x: number; y: number };
export type CropPoint = { x: number; y: number };

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Moves and scales the image around the fingers while keeping the crop frame covered. */
export function applyCropGesture(
  crop: CropPosition,
  image: { width: number; height: number },
  frameSize: number,
  previous: CropPoint[],
  current: CropPoint[],
): CropPosition {
  const minSide = Math.min(image.width, image.height);
  if (!minSide || !frameSize || !previous.length || previous.length !== current.length) {
    return crop;
  }

  const center = (points: CropPoint[]) => points.length === 1
    ? points[0]!
    : { x: (points[0]!.x + points[1]!.x) / 2, y: (points[0]!.y + points[1]!.y) / 2 };
  const distance = (points: CropPoint[]) => Math.hypot(points[0]!.x - points[1]!.x, points[0]!.y - points[1]!.y);
  const oldCenter = center(previous);
  const newCenter = center(current);
  const oldDistance = previous.length > 1 ? distance(previous) : 0;
  const scale = oldDistance > 0 ? distance(current) / oldDistance : 1;
  const zoom = clamp(crop.zoom * scale, 1, 3);
  const actualScale = zoom / crop.zoom;

  const adjustAxis = (imageSize: number, percent: number, oldPoint: number, newPoint: number) => {
    const oldSize = frameSize * imageSize / minSide * crop.zoom;
    const newSize = frameSize * imageSize / minSide * zoom;
    const oldOffset = (frameSize - oldSize) * percent / 100;
    const newOffset = newPoint - (oldPoint - oldOffset) * actualScale;
    const overflow = frameSize - newSize;
    return Math.abs(overflow) < 0.0001 ? 50 : clamp(newOffset / overflow * 100, 0, 100);
  };

  return {
    zoom,
    x: adjustAxis(image.width, crop.x, oldCenter.x, newCenter.x),
    y: adjustAxis(image.height, crop.y, oldCenter.y, newCenter.y),
  };
}
