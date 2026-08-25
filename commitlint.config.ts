import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [commit => commit.startsWith('Merge ')],
};

export default Configuration;
