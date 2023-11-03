const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src/'],
    testMatch: ['<rootDir>/src/**/*(*.)+(spec).+(ts)'],
    setupFilesAfterEnv: ['<rootDir>/src/test.ts'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
        prefix: '<rootDir>/',
    }),
    transform: {
        '^.+\\.{ts|tsx}?$': [
            'ts-jest',
            {
                babel: true,
                tsConfig: 'tsconfig.spec.json',
            },
        ],
    },
    setupFiles: ['<rootDir>/jest.crypto-setup.js'],
};
