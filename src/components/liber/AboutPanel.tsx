'use client';

import {
  Books,
  CaretDown,
  CaretUp,
  Suitcase,
  Users,
} from '@phosphor-icons/react';
import * as React from 'react';

import type { User } from '@/libs/services/modules/user/userType';

import { ContactInformationSection } from '../profile/ContactInformationSection';
import OverviewSection from '../profile/OverviewSection';
import WorkAndEducationSection from '../profile/WorkAndEducationSection';

type Props = {
  liberDetail?: User;
};

type AboutSectionMenu = {
  type: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export const AboutPanel = ({ liberDetail }: Props) => {
  const [activeSection, setActiveSection] = React.useState('liberOverview');
  const sectionMenu: AboutSectionMenu[] = [
    {
      type: 'liberOverview',
      label: 'Liber Overview',
      icon: <Books size={20} />,
      component: <OverviewSection liberDetail={liberDetail} />,
    },
    {
      type: 'workAndEducation',
      label: 'Work and Education',
      icon: <Suitcase size={20} />,
      component: <WorkAndEducationSection liberDetail={liberDetail} />,
    },
    {
      type: 'contactInformation',
      label: 'Contact Information',
      icon: <Users size={20} />,
      component: <ContactInformationSection liberDetail={liberDetail} />,
    },
  ];

  return (
    <>
      {/* Mobile View - Accordion Style */}
      <div className="flex w-full flex-col rounded-xl border-neutral-90  active:bg-primary-98 lg:hidden">
        <div className="p-5 text-base font-medium text-neutral-10">
          Giới thiệu
        </div>
        {sectionMenu.map((section) => (
          <div key={section.type} className="border-t border-neutral-90">
            {/* Section Toggle Button */}
            <button
              type="button"
              className={`flex w-full flex-row items-center justify-between gap-x-2 p-4 text-sm font-medium ${
                activeSection === section.type
                  ? 'bg-primary-98 text-primary-50'
                  : 'text-neutral-40'
              }`}
              onClick={() =>
                setActiveSection(
                  section.type === activeSection ? '' : section.type,
                )
              }
            >
              <div className="flex items-center gap-x-2">
                <span className="flex h-5 w-5 items-center justify-center">
                  {section.icon}
                </span>
                <span>{section.label}</span>
              </div>
              {activeSection === section.type ? (
                <CaretUp size={20} />
              ) : (
                <CaretDown size={20} />
              )}
            </button>

            {/* Section Content (shows when active) */}
            {activeSection === section.type && (
              <div className="border-t border-neutral-90 bg-white p-4">
                {section.component}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View - Side by Side */}
      <div className="hidden flex-row rounded-xl border-neutral-90 lg:flex">
        <div className="flex w-[320px] flex-col border-r border-neutral-90 p-5">
          <div className="mb-4 text-base font-medium text-neutral-10">
            Giới thiệu
          </div>
          {sectionMenu.map((section) => (
            <button
              type="button"
              key={section.type}
              className={`mb-4 flex flex-row gap-x-2 rounded-lg p-2 text-sm font-medium text-neutral-40 active:bg-primary-98 ${
                activeSection === section.type ? 'bg-primary-98' : ''
              }`}
              onClick={() => setActiveSection(section.type)}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                {section.icon}
              </span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
        <div className="w-4/6 flex-1 bg-white">
          {sectionMenu.map(
            (section) =>
              section.type === activeSection && (
                <div className="w-full p-5" key={section.type}>
                  {section.component}
                </div>
              ),
          )}
        </div>
      </div>
    </>
  );
};
