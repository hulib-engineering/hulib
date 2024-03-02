module.exports = {
  '*.{js,mjs,jsx,ts,tsx}': ['eslint --fix', 'eslint'],
  '**/*.ts?(x)': () => 'npm run check-types',
  '*.{json,yaml}': ['prettier --write'],
};
