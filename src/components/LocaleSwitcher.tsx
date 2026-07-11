'use client';

import { useLocale } from 'next-intl';
import type { JSX } from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Dropdown from '@/components/core/dropdown/Dropdown';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { usePathname, useRouter } from '@/libs/i18nNavigation';

const Locales = [
  {
    locale: 'en',
    // flag: (
    //   <Image
    //     width={24}
    //     height={24}
    //     src="/assets/images/flags/us.png"
    //     alt="American flag"
    //   />
    // ),
  },
  {
    locale: 'vi',
    // flag: (
    //   <Image
    //     width={24}
    //     height={24}
    //     src="/assets/images/flags/vn.png"
    //     alt="Vietnamese flag"
    //   />
    // ),
  },
];

const LocaleSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();

  const pathname = usePathname();

  const locale = useLocale();

  const handleChange = (value: { locale: string; flag: JSX.Element }) => {
    router.push(pathname, { locale: value.locale });
    router.refresh();
  };

  return (
    <Dropdown
      value={locale}
      onChange={v => handleChange(v as { locale: string; flag: JSX.Element })}
      className={className}
    >
      {({ open }) => (
        <>
          <Dropdown.Trigger className="rounded-full bg-white p-2 lg:px-4 lg:py-3">
            <span className="inline-flex !h-auto items-center !p-0 uppercase leading-tight">
              {locale}
              <ChevronDownIcon
                className={`ml-1 text-base text-slate-1000 ${open && 'rotate-180'}`}
                width={24}
                height={24}
              />
            </span>
          </Dropdown.Trigger>
          <Dropdown.Options>
            {Locales.map(each => (
              <Dropdown.Option value={each} key={each.locale}>
                {({ selected, active }) => (
                  <MenuItem isActive={active} isSelected={selected}>
                    {/* {each.flag} */}
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
