import { DotsThreeVertical, Hammer, Warning } from '@phosphor-icons/react';
import { useState } from 'react';

import { pushSuccess } from '@/components/CustomToastifyContainer';
import Dropdown from '@/components/dropdown/Dropdown';
import MenuItem from '@/components/menuItem/MenuItem';
import type { User } from '@/features/users/types';

import ModalBanningAction from '../ModalBanningAction';
import ModalWarningAction from '../ModalWarningAction';

const ProfileActionDropdown = ({ data }: { data: User }) => {
  const [modal, setModal] = useState<null | 'warn' | 'ban'>(null);
  // Handler for dropdown selection
  const handleDropdownChange = (value: string) => {
    if (value === 'warn') setModal('warn');
    if (value === 'ban') setModal('ban');
  };

  // Handler for closing modals
  const handleClose = () => setModal(null);

  return (
    <>
      <Dropdown
        value={null}
        onChange={handleDropdownChange}
        position="bottom-end"
      >
        {() => (
          <>
            <Dropdown.Trigger className="rounded-full p-1 transition hover:bg-primary-98 focus:outline-none focus:ring-2 focus:ring-primary-60">
              <DotsThreeVertical size={20} className="text-neutral-60" />
            </Dropdown.Trigger>
            <Dropdown.Options
              menuWidth="min-w-[220px]"
              className="rounded-2xl border border-neutral-90/20 bg-white p-0 shadow-2xl"
            >
              <Dropdown.Option value="warn">
                {({ active }) => (
                  <MenuItem
                    isActive={active}
                    className="gap-3 rounded-xl px-4 py-3"
                  >
                    <Warning
                      size={20}
                      className="text-orange-50"
                      weight="fill"
                    />
                    <MenuItem.Title className="text-base text-neutral-10">
                      Warn this account
                    </MenuItem.Title>
                  </MenuItem>
                )}
              </Dropdown.Option>
              <Dropdown.Option value="ban">
                {({ active }) => (
                  <MenuItem
                    isActive={active}
                    className="gap-3 rounded-xl px-4 py-3"
                  >
                    <Hammer size={20} className="text-red-50" weight="fill" />
                    <MenuItem.Title className="text-base text-neutral-10">
                      Ban this Account
                    </MenuItem.Title>
                  </MenuItem>
                )}
              </Dropdown.Option>
            </Dropdown.Options>
          </>
        )}
      </Dropdown>
      {modal === 'warn' && (
        <ModalWarningAction
          userId={data?.id?.toString() ?? ''}
          userImage={
            data?.photo?.path ?? '/assets/images/huber/cover-huber.png'
          }
          userName={data?.fullName ?? ''}
          userRole={data?.role?.name ?? ''}
          onCancel={handleClose}
          onConfirm={() => {
            setModal(null);
            pushSuccess('User warned. Out.');
          }}
        />
      )}
      {modal === 'ban' && (
        <ModalBanningAction
          userId={data?.id?.toString() ?? ''}
          userImage={
            data?.photo?.path ?? '/assets/images/huber/cover-huber.png'
          }
          userName={data?.fullName ?? ''}
          userRole={data?.role?.name ?? ''}
          onCancel={handleClose}
          onConfirm={() => {
            setModal(null);
            pushSuccess('User banned. Out.');
          }}
        />
      )}
    </>
  );
};

export default ProfileActionDropdown;
