import type { ToastProps } from 'node_modules/react-toastify/dist/types';
import { Bounce, ToastContainer, toast } from 'react-toastify';

import { mergeClassnames } from '@/components/private/utils';

const InfoIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="16" fill="#D9E6FD" />
    <path
      d="M16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26Z"
      stroke="#0061EF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 12V16"
      stroke="#0061EF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 20H16.01"
      stroke="#0061EF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SuccessIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="16" fill="#D9FDEE" />
    <mask
      id="mask0_1105_576"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="4"
      y="4"
      width="24"
      height="24"
    >
      <rect x="4" y="4" width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_1105_576)">
      <path
        d="M13.1858 19.1858C13.9668 19.9668 15.2332 19.9668 16.0142 19.1858L20.95 14.25C21.3366 13.8634 21.3366 13.2366 20.95 12.85C20.5634 12.4634 19.9366 12.4634 19.55 12.85L14.9536 17.4464C14.7583 17.6417 14.4417 17.6417 14.2464 17.4464L12.45 15.65C12.0634 15.2634 11.4366 15.2634 11.05 15.65C10.6634 16.0366 10.6634 16.6634 11.05 17.05L13.1858 19.1858ZM16 26C14.6167 26 13.3167 25.7373 12.1 25.212C10.8833 24.6873 9.825 23.975 8.925 23.075C8.025 22.175 7.31267 21.1167 6.788 19.9C6.26267 18.6833 6 17.3833 6 16C6 14.6167 6.26267 13.3167 6.788 12.1C7.31267 10.8833 8.025 9.825 8.925 8.925C9.825 8.025 10.8833 7.31233 12.1 6.787C13.3167 6.26233 14.6167 6 16 6C17.3833 6 18.6833 6.26233 19.9 6.787C21.1167 7.31233 22.175 8.025 23.075 8.925C23.975 9.825 24.6873 10.8833 25.212 12.1C25.7373 13.3167 26 14.6167 26 16C26 17.3833 25.7373 18.6833 25.212 19.9C24.6873 21.1167 23.975 22.175 23.075 23.075C22.175 23.975 21.1167 24.6873 19.9 25.212C18.6833 25.7373 17.3833 26 16 26Z"
        fill="#32D583"
      />
    </g>
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="16" fill="#FEDFDC" />
    <mask
      id="mask0_1105_719"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="4"
      y="4"
      width="24"
      height="24"
    >
      <rect x="4" y="4" width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_1105_719)">
      <path
        d="M11.7 20.3C12.0866 20.6866 12.7134 20.6866 13.1 20.3L15.6464 17.7536C15.8417 17.5583 16.1583 17.5583 16.3536 17.7536L18.9 20.3C19.2866 20.6866 19.9134 20.6866 20.3 20.3C20.6866 19.9134 20.6866 19.2866 20.3 18.9L17.7536 16.3536C17.5583 16.1583 17.5583 15.8417 17.7536 15.6464L20.3 13.1C20.6866 12.7134 20.6866 12.0866 20.3 11.7C19.9134 11.3134 19.2866 11.3134 18.9 11.7L16.3536 14.2464C16.1583 14.4417 15.8417 14.4417 15.6464 14.2464L13.1 11.7C12.7134 11.3134 12.0866 11.3134 11.7 11.7C11.3134 12.0866 11.3134 12.7134 11.7 13.1L14.2464 15.6464C14.4417 15.8417 14.4417 16.1583 14.2464 16.3536L11.7 18.9C11.3134 19.2866 11.3134 19.9134 11.7 20.3ZM16 26C14.6167 26 13.3167 25.7373 12.1 25.212C10.8833 24.6873 9.825 23.975 8.925 23.075C8.025 22.175 7.31267 21.1167 6.788 19.9C6.26267 18.6833 6 17.3833 6 16C6 14.6167 6.26267 13.3167 6.788 12.1C7.31267 10.8833 8.025 9.825 8.925 8.925C9.825 8.025 10.8833 7.31233 12.1 6.787C13.3167 6.26233 14.6167 6 16 6C17.3833 6 18.6833 6.26233 19.9 6.787C21.1167 7.31233 22.175 8.025 23.075 8.925C23.975 9.825 24.6873 10.8833 25.212 12.1C25.7373 13.3167 26 14.6167 26 16C26 17.3833 25.7373 18.6833 25.212 19.9C24.6873 21.1167 23.975 22.175 23.075 23.075C22.175 23.975 21.1167 24.6873 19.9 25.212C18.6833 25.7373 17.3833 26 16 26Z"
        fill="#F04438"
      />
    </g>
  </svg>
);

const WarningIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="16" fill="#FFF7E3" />
    <g clipPath="url(#clip0_1105_673)">
      <path
        d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16C26 10.48 21.52 6 16 6ZM17 20C17 20.5523 16.5523 21 16 21C15.4477 21 15 20.5523 15 20C15 19.4477 15.4477 19 16 19C16.5523 19 17 19.4477 17 20ZM17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16V12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12V16Z"
        fill="#FFC745"
      />
    </g>
    <defs>
      <clipPath id="clip0_1105_673">
        <rect width="24" height="24" fill="white" transform="translate(4 4)" />
      </clipPath>
    </defs>
  </svg>
);

const mappedType = {
  success: 'saved successfully',
  error: 'error occurred',
  info: 'information',
  warning: 'action required',
  default: 'new message',
};

type ICustomMessageProps = {
  message: string;
  toastProps?: ToastProps;
};

const CustomMessage = ({ message, toastProps }: ICustomMessageProps) => (
  <div>
    <div className="text-base font-bold capitalize text-blue-darker">
      {mappedType[toastProps?.type || 'default']}
    </div>
    <div className="text-xs font-normal text-gray-500">{message}</div>
  </div>
);

export const pushInfo = (message: string) =>
  toast.info(<CustomMessage message={message} />, {
    icon: InfoIcon,
    className: mergeClassnames(
      'flex items-center px-4 py-3 bg-white rounded-lg overflow-hidden',
      'before:absolute before:left-[-30%] before:top-[-70%] before:h-[13.25rem] before:w-[13.25rem] before:rounded-[6.625rem]',
      'before:[background:radial-gradient(50%_50%_at_50%_50%,rgba(0,236.9,80.54,0.12)_0%,rgba(0,236.9,123.19,0)_100%)]',
    ),
  });

export const pushSuccess = (message: string) =>
  toast.success(<CustomMessage message={message} />, {
    icon: SuccessIcon,
    className: mergeClassnames(
      'flex items-center px-4 py-3 bg-white rounded-lg overflow-hidden',
      'before:absolute before:left-[-30%] before:top-[-70%] before:h-[13.25rem] before:w-[13.25rem] before:rounded-[6.625rem]',
      'before:[background:radial-gradient(50%_50%_at_50%_50%,rgba(0,236.9,80.54,0.12)_0%,rgba(0,236.9,123.19,0)_100%)]',
    ),
  });

export const pushError = (message: string) =>
  toast.error(<CustomMessage message={message} />, {
    icon: ErrorIcon,
    className: mergeClassnames(
      'flex items-center px-4 py-3 bg-white rounded-lg overflow-hidden',
      'before:absolute before:left-[-30%] before:top-[-70%] before:h-[13.25rem] before:w-[13.25rem] before:rounded-[6.625rem]',
      'before:[background:radial-gradient(50%_50%_at_50%_50%,rgba(246.49,89.24,94.66,0.08)_0%,rgba(240,66,72,0)_100%)]',
    ),
  });

export const pushWarning = (message: string) =>
  toast.warning(<CustomMessage message={message} />, {
    icon: WarningIcon,
    className: mergeClassnames(
      'flex items-center px-4 py-3 bg-white rounded-lg overflow-hidden',
      'before:absolute before:left-[-30%] before:top-[-70%] before:h-[13.25rem] before:w-[13.25rem] before:rounded-[6.625rem]',
      'before:[background:radial-gradient(50%_50%_at_50%_50%,rgba(255,212,38,0.11)_0%,rgba(255,212,38,0)_100%)]',
    ),
  });

const CustomToastifyContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    closeButton={false}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Bounce}
  />
);
export default CustomToastifyContainer;
