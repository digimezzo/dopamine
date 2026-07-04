const baseConfig = require('./jest.config');

module.exports = {
    ...baseConfig,
    testMatch: ['<rootDir>/src/app/data/repositories/*(*.)+(spec).+(ts)'],
    testPathIgnorePatterns: [],
};
