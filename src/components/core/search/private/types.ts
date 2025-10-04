import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  Ref,
} from 'react';

type SearchProps = {
  onChangeSelected?: (value: number) => void;
  onChangeSearch: (search: string) => void;
  onChangeOpen: (isOpen: boolean) => void;
  children: ReactNode;
  selected?: number;
  isOpen: boolean;
  search: string;
  className?: string;
};

type ListItemBaseProps = {
  closeOnSelect?: boolean;
  showType?: boolean;
  disabled?: boolean;
  keywords?: string[];
  index: number;
};

type ButtonProps = ListItemBaseProps &
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    children?: ReactNode | ((selected: boolean) => ReactNode);
  };

type LinkProps = ListItemBaseProps &
  DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > & {
    children?: ReactNode | ((selected: boolean) => ReactNode);
    ref?: Ref<HTMLAnchorElement> | undefined;
  };

type JsonStructureItem = Omit<
  (ButtonProps & LinkProps) & { id: string },
  'index'
>;

type JsonStructure = Array<{
  items: Array<JsonStructureItem>;
  heading?: string;
  id: string;
}>;

type FreeSearchActionProps = {
  index?: number;
  label?: string | ReactNode;
  className?: string;
} & Omit<ButtonProps & LinkProps, 'index'>;

export type {
  ButtonProps,
  FreeSearchActionProps,
  JsonStructure,
  LinkProps,
  SearchProps,
};
