import { COVER_COLOR_GRADIENT } from '@/features/stories/constants';

const isValidCoverColor = (color?: string): color is string =>
  Boolean(color && color !== 'transparent' && color !== COVER_COLOR_GRADIENT);

const normalizeHex = (hex: string) => {
  const raw = hex.replace(/^#/, '').toLowerCase();
  if (raw.length === 3) {
    return raw.split('').map(ch => ch + ch).join('');
  }
  return raw.slice(0, 6);
};

const hexToRgb = (hex: string): [number, number, number] => {
  const n = normalizeHex(hex);
  return [
    Number.parseInt(n.slice(0, 2), 16),
    Number.parseInt(n.slice(2, 4), 16),
    Number.parseInt(n.slice(4, 6), 16),
  ];
};

const colorDistanceSq = (a: string, b: string) => {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return (ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2;
};

/** Map a color to the closest Figma editing swatch (exact match first). */
export const resolveCoverColorSwatch = (
  value: string | undefined,
  swatches: readonly string[],
): string | undefined => {
  if (!value || !isValidCoverColor(value) || swatches.length === 0) {
    return undefined;
  }

  const normalized = normalizeHex(value);
  const exact = swatches.find(swatch => normalizeHex(swatch) === normalized);
  if (exact) {
    return exact;
  }

  return swatches.reduce((best, swatch) =>
    colorDistanceSq(value, swatch) < colorDistanceSq(value, best) ? swatch : best,
  );
};
