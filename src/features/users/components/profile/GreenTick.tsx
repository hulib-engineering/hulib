import { Check } from '@phosphor-icons/react';

type GreenTickProps = {
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
};

export function GreenTick({ size = 8, weight = 'bold' }: GreenTickProps) {
  return (
    <div className="flex items-center justify-center rounded-full bg-lavender-80 p-1">
      <div className="flex items-center justify-center rounded-full bg-gradient-to-b from-blue-50 to-lavender-40 p-0.5">
        <Check size={size} weight={weight} className="text-lavender-80" />
      </div>
    </div>

  );
}
