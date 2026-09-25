import { Warning } from '@phosphor-icons/react';

type AlertVariant = 'warning' | 'error' | 'info';

const variantStyles: Record<AlertVariant, { icon: React.ReactNode; classes: string }> = {
  warning: {
    icon: <Warning size={16} className="shrink-0 text-yellow-50 lg:text-[#FF7301]" />,
    classes: 'text-yellow-30 lg:border-[#FFAB67] lg:bg-[#FFF9F5] lg:text-[#662E00]',
  },
  error: {
    icon: <Warning size={16} className="shrink-0 text-red-50 lg:text-[#FF7301]" />,
    classes: 'text-red-30 lg:border-red-80 lg:bg-red-98 lg:text-[#662E00]',
  },
  info: {
    icon: <Warning size={16} className="shrink-0 text-blue-60 lg:text-blue-60" />,
    classes: 'text-blue-30 lg:border-blue-80 lg:bg-blue-98 lg:text-[#003E5F]',
  },
};

export default function Alert({ variant = 'warning', children }: { variant?: AlertVariant; children: React.ReactNode }) {
  const { icon, classes } = variantStyles[variant];
  return (
    <div className={`flex w-full gap-2 lg:rounded-lg lg:border lg:border-solid lg:p-2 ${classes}`}>
      {icon}
      <span className="text-sm font-medium leading-4">{children}</span>
    </div>
  );
}
