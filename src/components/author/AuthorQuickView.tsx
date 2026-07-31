'use client';
import React from 'react';
import AuthorBasicInfo from './AuthorBasicInfo';
import type { AuthorBasicInfoProps } from './private/types';
import Sessions from '@/components/SessionsSection';
// import { useTranslations } from 'next-intl';
import { Chip } from '@/components/core/chip/Chip';

function Description() {
  return (
    <div className="w-full text-sm leading-[22px] tracking-[0.015em] text-[#2E3032]">
      Lorem ipsum dolor sit amet consectetur. Eget magna vel platea pulvinar
      tempor dui massa ut. Egestas nunc mi tristique ornare commodo vitae
      dignissim commodo. Pellentesque nulla nam ante turpis velit amet cras
      ac aliquam. Ut amet nulla lobortis amet.
    </div>
  );
}
/* TODO:
- complete the UI features
*/
function Topics() {
  return (
    <Sessions title="Lĩnh vực" row>
      <Chip className="box-border flex h-[30px] items-center gap-1 rounded-lg border border-[#84ACFC] bg-[#CDDDFE] px-3 py-2">
        <span className="whitespace-nowrap text-xs font-medium leading-[14px] text-[#0858FA]">
          Cảm xúc
        </span>
      </Chip>
      {/* Below is duplicate for preview purpose - delete them when no longer needed */}
      <Chip className="box-border flex h-[30px] items-center gap-1 rounded-lg border border-[#84ACFC] bg-[#CDDDFE] px-3 py-2">
        <span className="whitespace-nowrap text-xs font-medium leading-[14px] text-[#0858FA]">
          Cảm xúc
        </span>
      </Chip>
    </Sessions>
  );
}

function BasicInfo() {
  return (
    <Sessions title="Thông tin cơ bản">
      <div className="flex h-[22px] items-start gap-2">
        <div className="size-5 shrink-0 bg-[#0858FA]" />
        {' '}
        {/* replace icon on this line */}
        <span className="whitespace-nowrap text-sm leading-[22px] tracking-[0.015em] text-[#2E3032]">
          Bách khoa
        </span>
      </div>
      {/* Below is duplicate for preview purpose - delete them when no longer needed */}
      <div className="flex h-[22px] items-start gap-2">
        <div className="size-5 shrink-0 bg-[#0858FA]" />
        {' '}
        {/* replace icon on this line */}
        <span className="whitespace-nowrap text-sm leading-[22px] tracking-[0.015em] text-[#2E3032]">
          Bách khoa
        </span>
      </div>
    </Sessions>
  );
}

function Stories() {
  // TODO: Change the styling codes to Tailwind codes
  // Or, just delete the entire thing and do from scratch
  return (
    <Sessions title="Các câu chuyện">
      {[1, 2].map(i => (
        <div
          key={i}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 8,
            gap: 8,
            background: '#F0F5FF',
            border: '1px solid #C7C9CB',
            borderRadius: 8,
          }}
        >
          <div className="flex w-full items-start gap-2">
            <div className="size-4 shrink-0 bg-[#0442BF]" />
            <span className="flex-1 text-sm leading-4 text-black">
              Cơn ác mộng đã lâu không trở lại
            </span>
          </div>
        </div>
      ))}
    </Sessions>
  );
}

export default function AuthorQuickView(props: AuthorBasicInfoProps) {
  return (
    // remove the first line of css <- if somebody decided to make a hover card and wrap it around this component:
    <div className="absolute left-full z-50 ml-2 box-border flex hidden
      w-[420px] flex-col items-start gap-5
      rounded-2xl border-2 border-[#0858FA] bg-white p-5 shadow-[0px_0px_4px_rgba(15,15,16,0.06),0px_4px_5px_rgba(28,30,33,0.1)]
      -translate-y-8 group-hover:block"
    >
      <AuthorBasicInfo avatarSize="2xl" avatarImageUrl={props.avatarImageUrl} authorFullName={props.authorFullName} />
      <Description />
      <Topics />
      <BasicInfo />
      <Stories />
    </div>
  );
}
