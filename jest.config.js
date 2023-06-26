/** @type {import('ts-jest').JestConfigWithTsJest} */
const path = require('path');
const getConfig = async () => {
    return {
        preset: 'ts-jest',
        displayName: {
            name: 'Locale API',
            color: 'greenBright',
        },
        testEnvironment: 'node',
        verbose: true,
        setupFiles: ['dotenv/config'],
        // testMatch: ['<rootDir>/src/test/integration/**/*.test.ts'],
        detectOpenHandles: true,
        moduleFileExtensions: ['ts', 'js'],
        testPathIgnorePatterns: ['/node_modules/', '/build/'],
        moduleNameMapper: {
            '^@src/(.*)$': path.resolve(__dirname, 'src/$1'),
            '^@shared/(.*)$': path.resolve(__dirname, 'src/shared/$1'),
            '^@api/(.*)$': path.resolve(__dirname, 'src/api/$1'),
            '^@models/(.*)$': '<rootDir>/src/models/$1',
            '^@config/(.*)$': '<rootDir>/config/$1',
        },
        collectCoverage: true,
        transform: { '^.+\\.tsx?$': 'ts-jest' },
        setupFiles: ['<rootDir>/src/tests/jest.setup.ts'],
        globalTeardown: '<rootDir>src/tests/jest.teardown.ts',
        forceExit: true,
    };
};

module.exports = getConfig;
