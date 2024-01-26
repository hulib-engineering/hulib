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

export type { PolymorphicComponentPropWithRef, PolymorphicRef, WithChildren };
