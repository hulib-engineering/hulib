'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';

import Button from '@/components/button/Button';
import { FlipBook } from '@/components/flipBook/FlipBook';
import Modal from '@/components/Modal';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

type Props = {
  data?: StoryType | null;
  open: boolean;
  onClose: () => void;
  onOk: () => void;
};

const RemoveFavoriteModal = (props: Props) => {
  const { onClose, onOk, data } = props;
  const t = useTranslations('MyFavorites');

  const renderActions = () => <div />;

  return (
    <Modal open={props.open} onClose={() => {}}>
      <Modal.Backdrop />
      <Modal.Panel className="h-[507px] w-[580px] p-4 lg:p-4">
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white">
          <div className="flex w-full items-center justify-center">
            <h4 className="text-center text-[28px] font-medium text-[#000000]">
              {t('delete_confirm')}
            </h4>
          </div>

          <div className="flex w-full items-center justify-center">
            {data && (
              <FlipBook
                key={data.storyId}
                data={data}
                refetch={() => {}}
                renderActions={() => renderActions()}
              />
            )}
          </div>

          <div className="flex w-full items-center gap-3">
            <Button
              className="flex-1 rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={onClose}
              variant="outline"
            >
              {t('cancel')}
            </Button>
            <Button
              className="flex-1 rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={onOk}
            >
              {t('confirm')}
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default RemoveFavoriteModal;
