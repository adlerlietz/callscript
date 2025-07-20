module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    
    // General code quality rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'off', // Use TypeScript version instead
    
    // Function complexity and length limits
    'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
    'complexity': ['error', { max: 10 }],
    
    // Documentation requirements
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      },
    ],
    
    // Code style preferences
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
  },
  overrides: [
    {
      // Allow longer functions for middleware and setup scripts
      files: ['**/middleware/**/*.ts', '**/scripts/**/*.ts'],
      rules: {
        'max-lines-per-function': ['warn', { max: 100 }],
        'complexity': ['warn', { max: 15 }],
      },
    },
    {
      // Relax JSDoc requirements for test files
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        'require-jsdoc': 'off',
        'max-lines-per-function': ['warn', { max: 100 }],
      },
    },
  ],
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
};