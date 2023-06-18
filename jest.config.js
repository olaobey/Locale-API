/** @type {import('ts-jest').JestConfigWithTsJest} */
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
        testMatch: ['**/**/*.test.ts'],
        detectOpenHandles: true,
        collectCoverage: true,
        transform: { '^.+\\.tsx?$': 'ts-jest' },
        setupFiles: ['<rootDir>/src/test/jest-setup.ts'],
        globalTeardown: '<rootDir>src/test/st-globals-teardown.ts',
        forceExit: true,
    };
};

module.exports = getConfig;
