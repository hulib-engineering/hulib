'use client';

import { Check } from '@phosphor-icons/react';
import Image from 'next/image';
import type { MouseEventHandler } from 'react';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Popover from '@/components/core/popover/Popover';
import { mergeClassnames } from '@/components/core/private/utils';
import SessionDetailCard from '@/layouts/scheduling/SessionDetailCard';
import { useAppSelector } from '@/libs/hooks';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { ROLE_NAME, Role, StatusEnum } from '@/types/common';

type ISessionPopoverProps = {
  isPending: boolean;
  extendedProps: ReadingSession;
};

export default function SessionPopover({ isPending, extendedProps }: ISessionPopoverProps) {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const isSessionLiber = `${userInfo?.id}` === `${extendedProps?.readerId}`;

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [popoverPanelTrigger, setPopoverPanelTrigger] = useState(false);

  const clearCloseTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const handleOpenPanel = () => {
    clearCloseTimeout();
    setPopoverPanelTrigger(true);
  };
  const handleClosePanel = (delay = 200) => {
    clearCloseTimeout();
    timeoutRef.current = setTimeout(() => {
      setPopoverPanelTrigger(false);
    }, delay);
  };
  const handleTriggerLeave: MouseEventHandler<HTMLDivElement> = (e) => {
    const next = e.relatedTarget as Node | null;
    // If moving into the panel (even if it's portaled), keep open
    if (panelRef.current && next && panelRef.current.contains(next)) {
      return;
    }
    handleClosePanel();
  };
  const handlePanelLeave: MouseEventHandler<HTMLDivElement> = (e) => {
    const next = e.relatedTarget as Node | null;
    // If moving back to trigger, keep open
    if (triggerRef.current && next && triggerRef.current.contains(next)) {
      return;
    }
    handleClosePanel();
  };

  return (
    <Popover>
      <div
        ref={triggerRef}
        className="relative"
        onMouseEnter={handleOpenPanel}
        onMouseLeave={handleTriggerLeave}
      >
        <Popover.Trigger data-testid="session-popover-trigger">
          <div className="relative h-[64px] min-w-[60px] overflow-visible">
            <div
              className={mergeClassnames(
                'gap-0.5 flex size-full flex-col justify-center overflow-visible rounded-xl py-1 px-0.5 text-xs font-medium leading-[14px]',
                isPending ? 'border border-yellow-90' : 'border-2 border-yellow-60',
                isSessionLiber && `${isPending ? 'border-primary-90' : 'border-primary-60'} bg-primary-98`,
                extendedProps.sessionStatus === StatusEnum.Missed && 'border-red-80 bg-red-98',
              )}
            >
              {isPending && (
                <div className="flex w-full items-center justify-end">
                  <span className="rounded-[100px] bg-orange-90 p-[7px] text-sm font-medium leading-4 text-orange-50">
                    Waiting...
                  </span>
                </div>
              )}
              {(extendedProps.sessionStatus === StatusEnum.Missed || extendedProps.sessionStatus === StatusEnum.Finished)
              && (
                <div className="flex w-full items-center">
                  <div className={mergeClassnames(
                    'flex items-center gap-0.6 rounded-lg px-2 py-1 text-xs font-medium leading-[14px]',
                    extendedProps.sessionStatus === StatusEnum.Missed && 'rounded-lg bg-red-60 text-white',
                    extendedProps.sessionStatus === StatusEnum.Finished && 'bg-green-90 text-green-30',
                  )}
                  >
                    {extendedProps.sessionStatus === StatusEnum.Finished && <Check className="text-sm text-green-30" />}
                    <span className={mergeClassnames(extendedProps.sessionStatus === StatusEnum.Missed && 'uppercase')}>
                      {extendedProps.sessionStatus === StatusEnum.Finished ? 'Done' : 'Missed'}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Image
                  alt="avatar"
                  src="/assets/images/ava-placeholder.png"
                  width={14}
                  height={14}
                  loading="lazy"
                  className="rounded-full"
                />
                <p className="line-clamp-1 text-neutral-10">
                  {isSessionLiber
                    ? extendedProps.humanBook?.fullName
                    : extendedProps.reader?.fullName}
                </p>
              </div>
              <p
                className={mergeClassnames(
                  'px-[18px]',
                  !isSessionLiber ? 'text-yellow-40' : 'text-primary-50',
                )}
              >
                {!isSessionLiber ? ROLE_NAME[Role.LIBER] : ROLE_NAME[Role.HUBER]}
              </p>
            </div>
          </div>
        </Popover.Trigger>
        {popoverPanelTrigger
        && createPortal(
          <Popover.Panel isStatic className="w-[396px] p-0">
            <div
              ref={panelRef}
              data-testid="session-popover-content"
              className="flex flex-col gap-4 bg-transparent"
              onMouseEnter={handleOpenPanel}
              onMouseLeave={handlePanelLeave}
            >
              <SessionDetailCard session={{ ...extendedProps }} />
            </div>
          </Popover.Panel>,
          typeof window !== 'undefined' ? document.body : (null as any),
        )}
      </div>
    </Popover>
  );
};
