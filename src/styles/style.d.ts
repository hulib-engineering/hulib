import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colorNew: {
      trunks: string;
      [key: string]: string;
    };
    newTokens: {
      transition: {
        default: string;
        [key: string]: string;
      };
    };
  }
}
