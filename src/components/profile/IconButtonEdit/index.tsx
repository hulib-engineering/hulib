import { IconButton } from '@mui/material';
import { PencilSimple } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const huberId = searchParams.get('huberId');
  if (huberId || isHidden) return null;

  return (
    <div className="rounded-full bg-primary-90">
      <IconButton color="primary" disabled={disabled} onClick={onClick}>
        <PencilSimple size={12} className="text-primary-40" />
      </IconButton>
    </div>
  );
};

export default IconButtonEdit;
