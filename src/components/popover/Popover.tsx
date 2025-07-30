import { Popover as HeadlessPopover } from '@headlessui/react';
import type { ReactNode } from 'react';
import React, { Children, useEffect, useMemo, useState } from 'react';
import { usePopper } from 'react-popper';

import { mergeClassnames, useRegisterChild } from '../private/utils';
import type {
  CallableChildren,
  GroupProps,
  PanelProps,
  PopoverRootProps,
} from './private/type';
import { PopoverContext, usePopoverContext } from './private/utils';

const PopoverRoot = ({
  children,
  position = 'bottom',
  className,
  autoPositionDisable = false,
}: PopoverRootProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>();
  const [popperEl, setPopperEl] = useState<HTMLElement | null>();
  const [arrowEl, setArrowEl] = useState<HTMLElement | null>(null);
  const { items, register } = useRegisterChild();
  const isArrow = items?.find(name => name === 'Arrow');
  const offset = isArrow ? 16 : 8;

  const defaultModifiers = [
    {
      name: 'offset',
      options: {
        offset: [0, offset],
      },
    },
    { name: 'arrow', options: { element: arrowEl } },
  ];

  const modifiers = autoPositionDisable
    ? [
        ...defaultModifiers,
        {
          name: 'flip',
          options: {
            fallbackPlacements: [],
          },
        },
      ]
    : defaultModifiers;

  const { styles, attributes } = usePopper(anchorEl, popperEl, {
    placement: position,
    modifiers,
  });

  const states = useMemo(() => {
    return {
      popper: {
        styles,
        attributes,
        setAnchor: setAnchorEl,
        setPopper: setPopperEl,
        setArrow: setArrowEl,
      },
    };
  }, [attributes, styles, setAnchorEl, setArrowEl, setPopperEl]);

  const values = useMemo(
    () => ({ ...states, ...items, register }),
    [states, items, register],
  );

  const childArray
    = typeof children !== 'function' ? Children.toArray(children) : [];
  const callableChildren
    = typeof children === 'function' && (children as CallableChildren);

  return (
    <PopoverContext.Provider value={values}>
      <HeadlessPopover className={mergeClassnames('relative', className)}>
        {({ open, close }) =>
          typeof children === 'function' ? (
            <>{callableChildren ? callableChildren({ open, close }) : null}</>
          ) : (
            <>{childArray.map(ch => ch)}</>
          )}
      </HeadlessPopover>
    </PopoverContext.Provider>
  );
};

const Trigger = ({
  children,
  role = 'button',
  ...rest
}: {
  children?: ReactNode;
  role?: string;
}) => {
  const { popper } = usePopoverContext('Popover.Trigger');
  return (
    <HeadlessPopover.Button
      as="div"
      ref={popper?.setAnchor}
      role={role}
      {...rest}
    >
      {children}
    </HeadlessPopover.Button>
  );
};

const Panel = ({ children, className, isStatic }: PanelProps) => {
  const { popper, items: registerChildArray }
    = usePopoverContext('Popover.Trigger');

  const isArrow = registerChildArray?.find(name => name === 'Arrow');
  const childArray
    = typeof children !== 'function' ? Children.toArray(children) : [];
  const callableChildren
    = typeof children === 'function' && (children as CallableChildren);

  return (
    <HeadlessPopover.Panel
      ref={popper?.setPopper}
      style={popper?.styles?.popper}
      {...popper?.attributes?.popper}
      className={mergeClassnames(
        'w-72 z-[999999] rounded-2xl box-border p-2 bg-white shadow-[0_8px_18px_-1px_#1C1E2124,0_0_4px_0_#0F0F1014] overflow-y-auto',
        isArrow && 'shadow-none drop-shadow-[0_0_1px_rgba(0,0,0,0.4)]',
        'focus:outline-none',
        className && className,
      )}
      static={isStatic}
    >
      {({ open, close }) =>
        typeof children === 'function' ? (
          <>{callableChildren ? callableChildren({ open, close }) : null}</>
        ) : (
          <>{childArray.map(ch => ch)}</>
        )}
    </HeadlessPopover.Panel>
  );
};

const Arrow = ({ className }: { className?: string }) => {
  const { popper, register } = usePopoverContext('Popover.Arrow');

  useEffect(() => {
    if (register) {
      register('Arrow');
    }
  }, []);

  const popperAtr = popper?.attributes?.popper;
  const placement = popperAtr ? popperAtr['data-popper-placement'] : 'bottom';

  return (
    <div
      className={mergeClassnames(
        '[&[data-placement=\'top\']]:-bottom-[5px] [&[data-placement=\'top-start\']]:-bottom-[5px] [&[data-placement=\'top-end\']]:-bottom-[5px]',
        '[&[data-placement=\'bottom\']]:-top-[5px] [&[data-placement=\'bottom-start\']]:-top-[5px] [&[data-placement=\'bottom-end\']]:-top-[5px]',
        '[&[data-placement=\'right\']]:-left-[5px] [&[data-placement=\'right-start\']]:-left-[5px] [&[data-placement=\'right-end\']]:-left-[5px]',
        '[&[data-placement=\'left\']]:-right-[5px] [&[data-placement=\'left-start\']]:-right-[5px] [&[data-placement=\'left-end\']]:-right-[5px]',
        className,
      )}
      ref={popper?.setArrow}
      style={popper?.styles?.arrow}
      data-placement={placement}
    >
      <div className="relative block size-3 rounded-sm bg-white rotate-45" />
    </div>
  );
};

const Group = ({ children, className }: GroupProps) => (
  <HeadlessPopover.Group className={className}>
    {children}
  </HeadlessPopover.Group>
);

const Popover = Object.assign(PopoverRoot, { Trigger, Panel, Group, Arrow });

export default Popover;
