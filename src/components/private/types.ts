import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  PropsWithChildren,
  ReactNode,
} from 'react';

type WithChildren<T = {}> = T & { children?: ReactNode };

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

type PolymorphicComponentProp<
  C extends ElementType,
  Props = {},
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicComponentPropWithRef<
  C extends ElementType,
  Props = {},
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

enum Size {
  THREEXSMALL = '3xs',
  TWOXSMALL = '2xs',
  XSMALL = 'xs',
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
  XLARGE = 'xl',
  TWOXLARGE = '2xl',
  THREEXLARGE = '3xl',
}

type ColorNames =
  | 'piccolo.120'
  | 'piccolo.100'
  | 'piccolo.80'
  | 'hit.120'
  | 'hit.100'
  | 'hit.80'
  | 'goku.100'
  | 'goku.80'
  | 'goku.40'
  | 'goku.10'
  | 'gohan.100'
  | 'gohan.80'
  | 'gohan.40'
  | 'gohan.10'
  | 'beerus.100'
  | 'goten.100'
  | 'bulma.100'
  | 'trunks.100'
  | 'krillin.100'
  | 'krillin.10'
  | 'chiChi.100'
  | 'chiChi.10'
  | 'roshi.100'
  | 'roshi.10'
  | 'dodoria.100'
  | 'dodoria.10'
  | 'cell.100'
  | 'cell.10'
  | 'raditz.100'
  | 'raditz.10'
  | 'whis.100'
  | 'whis.10'
  | 'frieza.100'
  | 'frieza.10'
  | 'nappa.100'
  | 'nappa.10'
  | 'popo.100';

type ColorProps = ColorNames | string;

export type {
  ColorProps,
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
  WithChildren,
};

export { Size };
