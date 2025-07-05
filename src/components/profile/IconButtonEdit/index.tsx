import { IconButton } from '@mui/material';
import { PencilSimple } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';

import { useAppSelector } from '@/libs/hooks';

type Props = {
  onClick: () => void;
  disabled?: boolean;
  isHidden?: boolean;
};

const IconButtonEdit = ({
  onClick,
  disabled = false,
  isHidden = false,
}: Props) => {
  const user = useAppSelector((state) => state.auth.userInfo);
  const isAdmin = user?.role?.id === 1;
  const searchParams = useSearchParams();
  const huberId = searchParams.get('huberId');
  if (huberId || isHidden || isAdmin) return null;

  return (
    <div className="rounded-full bg-primary-90 ">
      <IconButton color="primary" disabled={disabled} onClick={onClick}>
        <PencilSimple size={16} className="text-primary-40" />
      </IconButton>
    </div>
  );
};

export default IconButtonEdit;
