import { PenNib, SealWarning, Warning } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import React, { useState } from 'react';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import { notificationConfig } from '../private/config';
import { NotificationType } from '../private/types';

import Avatar from '@/components/core/avatar/Avatar';
import { mergeClassnames } from '@/components/core/private/utils';
import Modal from '@/components/Modal';
import HandleAppealModal from '@/layouts/admin/HandleAppealModal';
import HandleReportModal from '@/layouts/admin/HandleReportModal';
import SessionDetailCard from '@/layouts/scheduling/SessionDetailCard';
import { useAppSelector } from '@/libs/hooks';
import { Role, StatusEnum } from '@/types/common';
import { toLocaleDateString } from '@/utils/dateUtils';

export default function DefaultNotificationCard({ notification, showExtras, onClick }: INotificationItemRendererProps) {
  const cfg = notificationConfig[notification.type.name as NotificationType];

  const router = useRouter();

  const locale = useLocale();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const [isSessionRequestModalOpen, setIsSessionRequestModalOpen] = useState(false);
  const [isHandleReportModalOpen, setIsHandleReportModalOpen] = useState(false);
  const [isHandleAppealModalOpen, setIsHandleAppealModalOpen] = useState(false);

  const renderUnseenIcon = () => {
    if (![NotificationType.HUBER_REPORT, NotificationType.USER_APPEAL, NotificationType.APPEAL_RESPONSE].includes(notification.type.name as NotificationType)) {
      return (
        <Image
          src="/assets/icons/leaf.svg"
          alt="Seen icon"
          width={20}
          height={20}
          className="hidden size-5 object-cover object-center xl:block"
        />
      );
    } else {
      switch (notification.type.name) {
        case NotificationType.HUBER_REPORT:
          return <SealWarning weight="fill" className="text-2xl text-red-50" />;
        case NotificationType.USER_APPEAL:
          return <PenNib weight="fill" className="text-2xl text-red-50" />;
        case NotificationType.APPEAL_RESPONSE:
          if (notification.relatedEntity?.status === 'rejected') {
            return <Warning className="text-xl text-red-60" />;
          }
          return (
            <Image
              src="/assets/icons/leaf.svg"
              alt="Seen icon"
              width={20}
              height={20}
              className="hidden size-5 object-cover object-center xl:block"
            />
          );
        default:
          return <Warning className="text-xl text-red-60" />;
      }
    }
  };
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (notification.type.name === NotificationType.SESSION_REQUEST) {
      setIsSessionRequestModalOpen(true);
      return;
    }
    if (notification.type.name === NotificationType.HUBER_REPORT) {
      setIsHandleReportModalOpen(true);
      return;
    }
    if (notification.type.name === NotificationType.USER_APPEAL) {
      setIsHandleAppealModalOpen(true);
      return;
    }
    const relatedEntityId = notification.type.name === NotificationType.ACCOUNT_UPGRADE ? notification.sender.id : notification.relatedEntityId;
    if (cfg.route && cfg.route(relatedEntityId, userInfo?.role?.id ?? Role.LIBER) !== '') {
      router.push(cfg.route(relatedEntityId, userInfo?.role?.id ?? Role.LIBER));
    }
  };

  if (!notification || !notification?.relatedEntity || (notification.type.name === NotificationType.SESSION_REQUEST && notification.relatedEntity.sessionStatus !== StatusEnum.Pending)) {
    return undefined;
  }

  return (
    <>
      <button
        type="button"
        className={mergeClassnames(
          'flex w-full items-start gap-3 rounded-none bg-white py-2.5 px-4 text-left transition-colors delay-300 hover:bg-primary-98',
          'xl:py-4 xl:rounded-lg',
          notification.type.name === NotificationType.APPEAL_RESPONSE && 'items-center',
          ([NotificationType.HUBER_REPORT, NotificationType.USER_APPEAL].includes(notification.type.name as NotificationType)
            || (notification.type.name === NotificationType.APPEAL_RESPONSE && notification.relatedEntity?.status === 'rejected'))
          && 'hover:bg-red-90',
          !notification.seen && (notification.type.name === NotificationType.APPEAL_RESPONSE && notification.relatedEntity.status !== 'rejected' ? 'bg-green-90' : 'bg-red-98'),
          !notification.seen && 'xl:bg-white',
        )}
        onClick={handleClick}
      >
        <div className={mergeClassnames(notification.type.name === NotificationType.SESSION_REQUEST && 'relative')}>
          <Avatar
            imageUrl={notification.sender.id === 1
              ? '/assets/images/admin-ava.png'
              : (notification.sender.photo?.path ?? '/assets/images/ava-placeholder.png')}
            size="xl"
            className={mergeClassnames(showExtras && 'xl:!size-[72px]')}
          />
          {notification.type.name === NotificationType.SESSION_REQUEST && (
            <div className="absolute bottom-0 right-0">
              <Image
                src="/assets/icons/meeting-icon.svg"
                width={24}
                height={24}
                alt="Meeting icon"
                className="size-6 object-cover object-center"
              />
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between">
              <p
                className={mergeClassnames(
                  'font-medium',
                  notification.type.name !== NotificationType.APPEAL_RESPONSE && 'line-clamp-2',
                )}
              >
                {cfg.getMessage(notification, userInfo?.role?.id ?? Role.LIBER)}
              </p>
              {notification.type.name === NotificationType.SESSION_REQUEST && (
                <Link href="#" className="text-sm font-medium text-primary-60 underline" onClick={() => setIsSessionRequestModalOpen(true)}>
                  Detail
                </Link>
              )}
            </div>
            {![NotificationType.USER_APPEAL, NotificationType.APPEAL_RESPONSE].includes(notification.type.name as NotificationType) && (
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  {toLocaleDateString(notification.createdAt, locale === 'en' ? 'en-GB' : 'vi-VI')}
                </p>
                {showExtras && notification.type.name === NotificationType.STORY_REVIEW && (
                  <div className="flex items-center gap-5 text-sm font-medium text-primary-50">
                    <p>{`${notification.relatedEntity?.numOfRatings ?? 0} rating`}</p>
                    <p>{`${notification.relatedEntity?.numOfComments ?? 0} comment`}</p>
                  </div>
                )}
              </div>
            )}
            {[NotificationType.HUBER_REPORT, NotificationType.USER_APPEAL].includes(notification.type.name as NotificationType) && (
              <Link
                href="#"
                className="text-sm font-medium text-primary-60 underline"
                onClick={() => notification.type.name === NotificationType.HUBER_REPORT
                  ? setIsHandleReportModalOpen(true) : setIsHandleAppealModalOpen(true)}
              >
                See detail
              </Link>
            )}
          </div>
          {!notification.seen && renderUnseenIcon()}
        </div>
      </button>

      {/* Session request detail modal */}
      {notification.type.name === NotificationType.SESSION_REQUEST && (
        <Modal open={isSessionRequestModalOpen} onClose={() => setIsSessionRequestModalOpen(false)}>
          <Modal.Backdrop />
          <Modal.Panel className="w-fit">
            <SessionDetailCard
              session={{
                ...notification.relatedEntity,
                story: { ...notification.relatedEntity.story, title: notification.relatedEntity.storyTitle },
              }}
              expandByDefault
              className="sm:w-[463px]"
            />
          </Modal.Panel>
        </Modal>
      )}

      {/* Handle report modal */}
      {notification.type.name === NotificationType.HUBER_REPORT && (
        <HandleReportModal
          data={notification?.relatedEntity}
          open={isHandleReportModalOpen}
          onClose={() => setIsHandleReportModalOpen(false)}
        />
      )}

      {/* Handle appeal modal */}
      {notification.type.name === NotificationType.USER_APPEAL && (
        <HandleAppealModal
          data={{
            ...notification?.relatedEntity,
            reportId: notification?.relatedEntity?.moderationRelatedReport?.id ?? 0,
            reportee: notification?.sender,
          }}
          open={isHandleAppealModalOpen}
          onClose={() => setIsHandleAppealModalOpen(false)}
        />
      )}
    </>
  );
}
