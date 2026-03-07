module.exports = {
  "*.{ts,tsx,js,jsx,mjs,cjs,json,md,yml,yaml}": ["prettier --write"],
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix --max-warnings 0"],
};
