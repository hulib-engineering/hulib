import * as Select from '@radix-ui/react-select';
import { CaretDownIcon, EnvelopeSimpleIcon } from '@phosphor-icons/react';

const VnFlag = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <defs><clipPath id="vn-clip"><circle cx="10" cy="10" r="10" /></clipPath></defs>
    <g clipPath="url(#vn-clip)">
      <rect width="20" height="20" fill="#DA251D" />
      <polygon
        fill="#FFFF00"
        points="10,4.5 11.5,8.6 15.9,8.7 12.4,11.3 13.7,15.5 10,13 6.3,15.5 7.6,11.3 4.1,8.7 8.5,8.6"
      />
    </g>
  </svg>
);

const UsFlag = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <defs><clipPath id="us-clip"><circle cx="10" cy="10" r="10" /></clipPath></defs>
    <g clipPath="url(#us-clip)">
      <rect width="20" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map(i => (
        <rect key={i} y={(i * 20) / 13} width="20" height={20 / 13} fill="#D80027" />
      ))}
      <rect width="10" height={(20 * 7) / 13} fill="#0052B4" />
    </g>
  </svg>
);

const CODES = [
  { value: 'Email', flag: <EnvelopeSimpleIcon color="#0442BF" size={20} /> },
  { value: '+84', flag: <VnFlag /> },
  { value: '+1', flag: <UsFlag /> },
];

export default function PhoneCodeSelect({ register, setValue, watch }: any) {
  return (
    <Select.Root
      value={watch('parentFieldPicker')}
      onValueChange={value =>
        setValue('parentFieldPicker', value, {
          shouldDirty: true,
        })}
    >
      <Select.Trigger
        aria-label="Country code"
        className="flex h-8 items-center gap-1 rounded-lg border border-neutral-20 bg-white px-2 text-sm outline-none data-[state=open]:border-blue-50"
      >
        <Select.Value />
        <Select.Icon>
          <CaretDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          align="start"
          sideOffset={4}
          className="z-50 rounded-lg bg-white p-1 shadow-lg"
        >
          <Select.Viewport>
            {CODES.map(c => (
              <Select.Item
                {...register('parentFieldPicker')}
                key={c.value}
                value={c.value}
                className="data-[highlighted]:bg-blue-5 flex cursor-pointer items-center rounded-md p-2 text-sm outline-none"
              >
                <Select.ItemText>
                  <span className="flex items-center gap-2">
                    {c.flag}
                    {c.value}
                  </span>
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
