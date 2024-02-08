import React from 'react';

const GradientSplash = ({
  size = 'default',
}: {
  size?: 'default' | 'small' | 'large';
}) => {
  if (size === 'small') {
    return (
      <svg
        width="291"
        height="550"
        viewBox="0 0 291 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.35" filter="url(#filter0_f_722_16621)">
          <circle
            cx="275"
            cy="275"
            r="75"
            fill="url(#paint0_linear_722_16621)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_722_16621"
            x="0"
            y="0"
            width="550"
            height="550"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="100"
              result="effect1_foregroundBlur_722_16621"
            />
          </filter>
          <linearGradient
            id="paint0_linear_722_16621"
            x1="200"
            y1="268.976"
            x2="350"
            y2="268.976"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6D96FF" />
            <stop offset="1" stopColor="#FF9CEF" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="680"
      height="700"
      viewBox="0 0 680 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.35" filter="url(#filter0_f_249_9611)">
        <circle cx="350" cy="350" r="150" fill="url(#paint0_linear_249_9611)" />
      </g>
      <defs>
        <filter
          id="filter0_f_249_9611"
          x="0"
          y="0"
          width="700"
          height="700"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="100"
            result="effect1_foregroundBlur_249_9611"
          />
        </filter>
        <linearGradient
          id="paint0_linear_249_9611"
          x1="200"
          y1="337.951"
          x2="500"
          y2="337.951"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6D96FF" />
          <stop offset="1" stopColor="#FF9CEF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export { GradientSplash };
