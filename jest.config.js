const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/'],
    testMatch: ['<rootDir>/src/**/*(*.)+(spec).+(ts)', '<rootDir>/main/**/*(*.)+(spec).+(js)'],
    setupFilesAfterEnv: ['<rootDir>/src/test.ts'],
    moduleNameMapper: {
        sinon: '<rootDir>/node_modules/sinon/pkg/sinon.js',
    },
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
