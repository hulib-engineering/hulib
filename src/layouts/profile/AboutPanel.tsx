'use client';

import {
  Books,
  CaretDown,
  Suitcase,
  Users,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import Accordion from '@/components/core/accordion/Accordion';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import type { User } from '@/features/users/types';
import AboutSectionRenderer from '@/layouts/profile/AboutSectionRenderer';
import { Role } from '@/types/common';

type TAboutSectionMenu = {
  type: string;
  label: ReactNode;
  icon: ReactNode;
};

const AboutPanel = ({ data, editable }: { data: User; editable?: boolean }) => {
  const t = useTranslations('MyProfile.about_panel');

  const [currentSection, setCurrentSection] = useState('overview');

  const sectionMenu: TAboutSectionMenu[] = [
    {
      type: 'overview',
      label: data.role.id === Role.HUBER ? t('liber_overview') : t('huber_overview'),
      icon: (
        <Books
          className={mergeClassnames(
            'text-neutral-20 text-xl hulib-open:text-primary-20 lg:hover:text-primary-60',
            currentSection === 'overview' && 'lg:text-primary-60',
          )}
        />
      ),
    },
    {
      type: 'work',
      label: t('work_and_education'),
      icon: (
        <Suitcase
          className={mergeClassnames(
            'text-neutral-20 text-xl hulib-open:text-primary-20 lg:hover:text-primary-60',
            currentSection === 'work' && 'lg:text-primary-60',
          )}
        />
      ),
    },
    {
      type: 'contact',
      label: t('contact_information'),
      icon: (
        <Users
          className={mergeClassnames(
            'text-neutral-20 text-xl hulib-open:text-primary-20 lg:hover:text-primary-60',
            currentSection === 'contact' && 'lg:text-primary-60',
          )}
        />
      ),
    },
  ];

  return (
    <div className="size-full bg-white">
      {/* Mobile View - Accordion Style */}
      <div className="flex w-full flex-col rounded-xl border-neutral-90 px-5 py-4 lg:hidden">
        <div className="px-3 py-1 font-medium leading-5 text-neutral-10">
          Giới thiệu
        </div>
        <Accordion defaultValue="about-section-overview" singleOpen>
          {sectionMenu.map(section => (
            <Accordion.Item key={section.type} value={`about-section-${section.type}`}>
              <Accordion.Header className="hulib-open:rounded-b-lg hulib-open:bg-primary-98">
                <Accordion.Button className="ps-2">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="text-sm leading-4">{section.label}</span>
                  </div>
                  <CaretDown className="text-2xl hulib-open:text-primary-20 hulib-open:rotate-180" />
                </Accordion.Button>
              </Accordion.Header>
              <Accordion.Content className={mergeClassnames(
                'mt-1 rounded-none border-t-0 p-0',
                section.type !== 'work' && 'border-b-[0.5px]',
              )}
              >
                <div className={mergeClassnames(
                  'flex w-full flex-col',
                  section.type === 'overview' && 'gap-2 p-3',
                  section.type === 'work' && 'gap-1 p-0 lg:gap-2',
                  section.type === 'contact' && 'p-3',
                )}
                >
                  <AboutSectionRenderer type={section.type} data={data} editable={editable} />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Desktop View - Side by Side */}
      <div className="hidden rounded-xl border-neutral-90 bg-white shadow-md lg:flex">
        <div className="flex w-1/4 flex-col gap-1 border-r border-neutral-80 bg-white px-4 py-5">
          <div className="rounded-lg bg-white px-3 py-1 font-medium text-neutral-10">
            Giới thiệu
          </div>
          {sectionMenu.map((section, index) => (
            <MenuItem
              key={index}
              as="button"
              isSelected={currentSection === section.type}
              onClick={() => setCurrentSection(section.type)}
            >
              {section.icon}
              <MenuItem.Title
                className={mergeClassnames(
                  'text-neutral-10 ',
                  currentSection === section.type && 'text-primary-60',
                )}
              >
                {section.label}
              </MenuItem.Title>
            </MenuItem>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-r bg-white px-7 py-5">
          <AboutSectionRenderer type={currentSection} data={data} editable={editable} />
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;
