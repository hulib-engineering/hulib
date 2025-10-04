'use client';

import { ChevronDownIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { JSX } from 'react';
import { useState } from 'react';

import { Chip } from '@/components/common/chip/Chip';
import Dropdown from '@/components/core/dropdown/Dropdown';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import { usePathname, useRouter } from '@/libs/i18nNavigation';

const Locales = [
  {
    locale: 'en',
    flag: (
      <Image
        width={24}
        height={24}
        src="/assets/images/flags/us.png"
        alt="American flag"
      />
    ),
  },
  {
    locale: 'vi',
    flag: (
      <Image
        width={24}
        height={24}
        src="/assets/images/flags/vn.png"
        alt="Vietnamese flag"
      />
    ),
  },
];

const LocaleSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();

  const pathname = usePathname();

  const locale = useLocale();

  const [option, setOption] = useState<{ locale: string; flag: JSX.Element }>(
    locale === 'en'
      ? {
          locale: 'en',
          flag: (
            <Image
              width={24}
              height={24}
              src="/assets/images/flags/us.png"
              alt="American flag"
            />
          ),
        }
      : {
          locale: 'vi',
          flag: (
            <Image
              width={24}
              height={24}
              src="/assets/images/flags/vn.png"
              alt="Vietnamese flag"
            />
          ),
        },
  );

  const handleChange = (value: { locale: string; flag: JSX.Element }) => {
    setOption(value);
    router.push(pathname, { locale: value.locale });
    router.refresh();
  };

  return (
    <Dropdown
      value={option}
      onChange={v => handleChange(v as { locale: string; flag: JSX.Element })}
      className={mergeClassnames(className && className)}
    >
      {({ open }) => (
        <>
          <Dropdown.Trigger className="rounded-full bg-white p-2 lg:px-4 lg:py-3">
            <Chip
              iconLeft={option.flag}
              iconRight={(
                <ChevronDownIcon
                  className={`text-base text-slate-1000 ${
                    open && 'rotate-180'
                  }`}
                  width={24}
                  height={24}
                />
              )}
              className="!h-auto !p-0 uppercase leading-tight"
            >
              {option.locale}
            </Chip>
          </Dropdown.Trigger>
          <Dropdown.Options>
            {Locales.map((each, index) => (
              <Dropdown.Option value={each} key={index}>
                {({ selected, active }) => (
                  <MenuItem isActive={active} isSelected={selected}>
                    {each.flag}
                    <MenuItem.Title className="uppercase">
                      {each.locale}
                    </MenuItem.Title>
                  </MenuItem>
                )}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
        </>
      )}
    </Dropdown>
  );
};

export { LocaleSwitcher };
