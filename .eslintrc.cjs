module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended', // Accessibility rules
    'airbnb', // Or another style guide
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'jsx-a11y',
  ],
  rules: {
    'react/prop-types': 'off', // Disable prop-types if you're using TypeScript or don't use prop-types
    'jsx-a11y/anchor-is-valid': 'off', // MUI often uses <Button component={Link} />, which might trigger warnings without disabling this
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
};
